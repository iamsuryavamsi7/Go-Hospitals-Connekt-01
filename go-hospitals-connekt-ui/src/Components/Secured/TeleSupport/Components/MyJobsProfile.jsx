import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../../../Style/secured/navbar/navbaruser.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { CgLoadbar } from 'react-icons/cg';
import { IoCloseCircle } from 'react-icons/io5';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const MyJobsProfile = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL; 

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    // State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const {id} = useParams();

    const [patientData, setPatientData] = useState({
        id: id,
        name: '',
        age: '',
        contact: '',
        address: '',
        gender: '',
        medicalHistory: '',
        reasonForVisit: '',
        appointmentOn: '',
        preferredDoctorName: '',
        appointmentCreatedOn: '',
        appointmentFinished: ''
    });

    const roles = {
        teleSupport: 'TELESUPPORT',
    }

    // Format the date and time (example: MM/DD/YYYY, HH:MM AM/PM)
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true // for AM/PM format
    };
      
    // Convert to Date object
    const appointmentDate = new Date(patientData.appointmentCreatedOn);
    
    const formattedDate = appointmentDate.toLocaleString('en-US', options);

    // Convert to Date object
    const appointmentCompletedDate = new Date(patientData.applicationCompletedTime);

    const appointmentCompletedFormattedDate = appointmentCompletedDate.toLocaleString('en-US', options);

    // Functions
    const handleError = (error) => {

        if ( error.response ){

            if ( error.response.status === 403 ){

                console.log(error.response);

            } else {

                console.error(error);

            }

        }

    }

    const fetchAppointmentData = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/tele-support/fetchApplicationById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const appointmentData = response.data;

                setPatientData(appointmentData);

                console.log(response.data);

            }

        }catch(error){

            console.error(error);

            setPatientData([]);

        }

    }

    const fetchUserObject = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/tele-support/fetchUserObject`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const userObject = response.data;

                setRole(userObject.role);

                setUserObject(userObject);

            }

        }catch(error){

            handleError(error);

        }

    }    

    const sendLinkFunction = () => {

        window.open(`https://wa.me/${patientData.contact}?text=Click%20on%20this%20link%20to%20go%20further%20with%20our%20surgery%20process%3A%20http%3A%2F%2Fgowork.gohospitals.in%3A7778%2Fpublic%2Ffill-the-surgery-form%2F${userObject.id}%2F${id}`, '_blank');

    }

    // Function to copy link
    const copyLinkFunction = () => {

        const teleSupportUserId = userObject.id;

        const applicationId = id;

        const textToCopy = `http://gowork.gohospitals.in:7778/public/fill-the-surgery-form/${teleSupportUserId}/${applicationId}`;

        // Check if `navigator.clipboard` is supported
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showToast("Copied to clipboard!");
                })
                .catch((error) => {
                    console.error("Failed to copy text:", error);
                    showToast("Failed to copy link. Please try again.", true);
                });
        } else {
            // Fallback for older browsers or insecure contexts
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed"; // Avoid scrolling to bottom
            textArea.style.opacity = 0; // Make it invisible
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999); // For mobile devices

            try {
                document.execCommand("copy");
                showToast("Copied to clipboard!");
            } catch (error) {
                console.error("Failed to copy text:", error);
                showToast("Failed to copy link. Please try again.", true);
            }

            // Remove the temporary text area
            document.body.removeChild(textArea);
        }
    };

    // Helper function for toast notifications
    const showToast = (message, isError = false) => {
        toast[isError ? 'error' : 'success'](message, {
            autoClose: 1000,
            style: {
                backgroundColor: '#1f2937',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                marginTop: '2.5rem'
            }
        });
    };

    const [fetchedImageVisible, setFetchedImageVisible] = useState(false);

    const [images, setImages] = useState([])

    const fetchImages = async () => {

        const imageSrc = patientData.surgeryDocumentsUrls;

        setFetchedImageVisible(true);
    
        const imagePromises = imageSrc.map(async (imgSrc) => {

            const imageSrc1 = imgSrc.surgeryDocumentsUrl;
    
            console.log("Started...");
    
            try {
                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/files/display/` + imageSrc1, {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
    
                if ( response.status === 200 ){

                    const value = response.data;
                    const mimeType = response.headers['content-type'];
                    const blobUrl = URL.createObjectURL(value);
        
                    console.log("Finished...");
        
                    return { blobUrl, mimeType };

                }
    
            } catch (error) {
                handleError(error);
            }
        });
    
        const blobs = await Promise.all(imagePromises);
    
        setImages(
            (prevImages) => [...prevImages, ...blobs.filter((blob) => blob !== null)]
        );
        
    };
    

    const downloadImage = async () => {

        const fileName = patientData.surgeryDocumentsUrls;

        fileName.map( async (file1) => {
            
            const fileName1 = file1.surgeryDocumentsUrl;

            console.log("Started");

            try{

                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/files/download/${fileName1}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                    responseType: 'blob'
                })

                if ( response.status === 200 ){

                    fetchAppointmentData();

                    const url = window.URL.createObjectURL(new Blob([response.data]));

                    const link = document.createElement('a');

                    link.href = url;

                    link.setAttribute('download', fileName1);
                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    console.log("Finished");

                }

            }catch(error){

                handleError(error);

                toast.error("Download Error", {
                    autoClose: 2000,
                    style: {
                        backgroundColor: '#1f2937', // Tailwind bg-gray-800
                        color: '#fff', // Tailwind text-white
                        fontWeight: '600', // Tailwind font-semibold
                        borderRadius: '0.5rem', // Tailwind rounded-lg
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                        marginTop: '2.5rem' // Tailwind mt-10,
                    },
                    position: 'top-center'
                });

            }

        });

    }

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

        } else {

            window.open(goHospitalsFRONTENDBASEURL, '_self');

        }

    }, [id]);

    const [surgeryCounsellorMessage, setSurgeryCounsellorMessage] = useState(``);

    const counsellingDone = async (e) => {

        e.preventDefault();

        if ( surgeryCounsellorMessage !== null && surgeryCounsellorMessage !== `` ){

            try{

                const formData = new FormData();
    
                formData.append(`surgeryCounsellorMessage`, surgeryCounsellorMessage);

                formData.append(`consultationType`, patientData.consultationType);
    
                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/tele-support/counsellingDone/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
    
                if ( response.status === 200 ){
    
                    const booleavValue = response.data;
    
                    if ( booleavValue ){
    
                        fetchAppointmentData();
    
                        if ( stompClient ){
    
                            const webSocketNotificationTypeModel = {
                                notificationType: `CounsellingDoneSurgeryCare`
                            }
    
                            stompClient.send(`/app/commonWebSocket`,{}, JSON.stringify(webSocketNotificationTypeModel));
    
                        }
    
                        setSurgeryCounsellorMessage(``);

                        setCounsellingDoneActivated(false);
    
                    }
    
                }
    
            }catch(error){
    
                console.error(error);
    
                setPatientData([]);
    
            }

        }

    }

    const dontAcceptUploads = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/tele-support/rejectSurgeryCareDocs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const booleavValue = response.data;

                if ( booleavValue ){

                    fetchAppointmentData();

                }

            }

        }catch(error){

            console.error(error);

            setPatientData([]);

        }

    }

    const acceptUploads = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/tele-support/acceptSurgeryCareDocs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const booleavValue = response.data;

                if ( booleavValue ){

                    fetchAppointmentData();

                }

            }

        }catch(error){

            console.error(error);

            setPatientData([]);

        }

    }
    
    // State to store stompClient
    const [stompClient, setStompClient] = useState(null);

    // Connect to websockets when the component mounts with useEffect hook
    useEffect(() => {

        const sock = new SockJS(`${goHospitalsAPIBaseURL}/go-hospitals-websocket`);
        const client = Stomp.over(() => sock);

        setStompClient(client);

        client.connect(
            {},
            () => {

                client.subscribe(`/common/commonFunction`, (message) => commonNotificationReceived(message))

            },
            () => {

                console.error(error);
        
            }
        );

        // Disconnect on page unmount
        return () => {

            if ( client ){

                client.disconnect();

            }

        }

    }, []);

    const [updatePaymentTypeActivated, setUpdatePaymentTypeActivated] = useState(false);

    const updatePaymentTypeSurgeryCareFunction = async (surgeryMethodTypeValue) => {

        if ( surgeryMethodTypeValue !== '' && surgeryMethodTypeValue !== null ){

            const formData = new FormData();
            
            formData.append('surgeryPaymentType', surgeryMethodTypeValue);

            try{

                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/tele-support/updatePaymentTypeSurgeryCareFunction/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
    
                if ( response.status === 200 ){
    
                    const booleanValue = response.data;
    
                    if ( booleanValue ){
    
                        fetchAppointmentData();
    
                    }
    
                }
    
            }catch(error){
    
                console.error(error);
    
            }

        }

    }

    const [counsellingDoneActivated, setCounsellingDoneActivated] = useState(false);

    return (

        <>

            <ToastContainer />

            {role === roles.teleSupport && (

                <>

                    {patientData &&  patientData.length === 0 ? (

                        <div className="relative h-[500px]">

                            <div className="absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center">

                                No Data Available

                            </div>

                        </div>

                    ): (

                        <>

                            <div 
                                className="mb-7"
                            >

                                <div className="ml-10 text-2xl flex items-center space-x-3 mb-10 justify-center">

                                    Patient Details    

                                </div>

                                <div className="ml-10 grid grid-cols-3 gap-x-5 gap-y-5">

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Name

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.name}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Patient ID

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.patientId}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Phone No

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.contact}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Age

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.age}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Gender

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.gender}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Reason for visit

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.reasonForVisit}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Bill No

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.billNo}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Preferred Doctor

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.preferredDoctorName}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Nurse

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.medicalSupportUserName}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Booked By

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.bookedBy}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Status

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.consultationType === 'NOTASSIGNED' && 'Waiting for Nurse'}
                                    
                                            {patientData.consultationType === 'WAITING' && 'Waiting for DMO'}

                                            {patientData.consultationType === 'DMOCARECOMPLETED' && 'Waiting for Consultation'}

                                            {patientData.consultationType === 'ONSITREVIEWPATIENTDRESSING' && 'Onsite - Review Patient Dressing'}

                                            {patientData.consultationType === 'ONSITEVASCULARINJECTIONS' && 'Onsite - Vascular Injection'}

                                            {patientData.consultationType === 'ONSITEQUICKTREATMENT' && 'Onsite - Quick Treatment'}

                                            {patientData.consultationType === 'ONSITECASCUALITYPATIENT' && 'Onsite - Casuality Patient'}

                                            {patientData.consultationType === 'MEDICATIONPLUSFOLLOWUP' && 'Medical Plus Follow UP'}

                                            {patientData.consultationType === 'SURGERYCARE' && 'Surgery Care'}

                                            {patientData.consultationType === 'CROSSCONSULTATION' && 'Cross Consultation'}
                                            
                                            {patientData.consultationType === 'FOLLOWUPCOMPLETED' && 'Follow-Up Scheduled'}

                                            {patientData.consultationType === 'CASECLOSED' && 'Case Closed'}    

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Treatment Status

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.treatmentDone ? (

                                                <span> Done </span>

                                            ) : (

                                                <span> Not Done </span>

                                            )}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Tele Counsellor

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.teleSupportUserName}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Surgery Docs Status

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.teleSupportSurgeryDocumentsAccept ? 'Accepting Surgery Docs' : 'Not Accepting'}

                                        </div>

                                    </div>

                                    {patientData.consultationType === 'COMPLETED' && (

                                        <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                            <div className="text-base text-gray-300">

                                                Application Completed On

                                            </div>

                                            <div className="text-lg">
                                                
                                                {appointmentCompletedFormattedDate}

                                            </div>

                                        </div>

                                    )}

                                    {patientData.consultationType === 'COMPLETED' && (

                                        <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                            <div className="text-base text-gray-300">

                                                Payment Status

                                            </div>

                                            <div className="text-lg">
                                                
                                                Done

                                            </div>

                                        </div>

                                    )}

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Counselling Status

                                        </div>

                                        <div className="text-lg">

                                            {patientData.teleSupportConsellingDone ? (

                                                <span>Done</span>

                                            ) : (

                                                <span>Not Done</span>

                                            )}

                                        </div>

                                    </div>

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Current Payment Type

                                        </div>

                                        <div className="text-lg">

                                            {patientData.surgeryPaymentType === 'CASH' ? 'Cash' : 'Insurance'}

                                        </div>

                                    </div>

                                </div> 

                            </div>

                            {/* {patientData.surgeryPaymentType !== 'CASH' && (

                                <>

                                    <div 
                                        className="inline-block items-start bg-green-800 px-3 py-2 rounded-lg hover:opacity-60 active:opacity-40 cursor-pointer mx-10"
                                        onClick={sendLinkFunction}
                                    >

                                        <div 
                                            className="text-base text-gray-300"
                                        >

                                            Send Link

                                        </div>

                                    </div>

                                    <div 
                                        className="inline-block items-start bg-green-800 px-3 py-2 rounded-lg hover:opacity-60 active:opacity-40 cursor-pointer"
                                        onClick={copyLinkFunction}    
                                    >

                                        <div 
                                            className="text-base text-gray-300"
                                        >

                                            Copy Link

                                        </div>

                                    </div>

                                   {patientData.teleSupportSurgeryDocumentsAccept ? (
                                    
                                        <div 
                                            className="inline-block items-start bg-red-500 ml-10 px-3 py-2 rounded-lg hover:opacity-60 active:opacity-40 cursor-pointer"
                                            onClick={dontAcceptUploads}
                                        >

                                            <div 
                                                className="text-base text-gray-300"
                                            >

                                                Dont Accept

                                            </div>

                                        </div>
                                        
                                    ) : (

                                        <div 
                                            className="inline-block items-start bg-green-800 ml-10 px-3 py-2 rounded-lg hover:opacity-60 active:opacity-40 cursor-pointer"
                                            onClick={acceptUploads}
                                        >

                                            <div 
                                                className="text-base text-gray-300"
                                            >

                                                Accept Uploads

                                            </div>

                                        </div>

                                    )}

                                </>

                            )} */}

                            <div className="mb-5">

                                <div 
                                    className='mx-10 inline-block cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                    onClick={() => {

                                        setUpdatePaymentTypeActivated(true);

                                    }}
                                >

                                    <div 
                                        className="text-base text-gray-300"
                                    >

                                        Update Payment Type

                                    </div>

                                </div>

                                {updatePaymentTypeActivated && (

                                    <div 
                                        className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center backdrop-blur-[2px]"
                                        onClick={() => setUpdatePaymentTypeActivated(false)}
                                    >

                                        <div className="bg-gray-900 rounded-2xl text-center text-lg cursor-pointer">

                                            <div 
                                                className="hover:bg-gray-800 active:bg-gray-700 px-10 py-5 rounded-t-2xl"
                                                onClick={() => {

                                                    const surgeryMethodTypeValue = 'CASH';

                                                    updatePaymentTypeSurgeryCareFunction(surgeryMethodTypeValue);

                                                }}
                                            >Cash</div>
                                            <div 
                                                className="hover:bg-gray-800 active:bg-gray-700 px-10 py-5 rounded-b-2xl"
                                                onClick={() => {

                                                    const surgeryMethodTypeValue = 'INSURANCE';

                                                    updatePaymentTypeSurgeryCareFunction(surgeryMethodTypeValue);

                                                }}
                                            >Insurance</div>

                                        </div>

                                    </div>

                                )}

                                <div 
                                    className='inline-block cursor-pointer bg-green-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                    onClick={() => {

                                        setCounsellingDoneActivated(true);

                                    }}
                                >

                                    <div 
                                        className="text-base text-gray-300"
                                    >

                                        Counselling Done

                                    </div>

                                </div>

                            </div>

                            {patientData.surgeryPaymentType !== 'CASH' && (

                                <>

                                    <div 
                                        className="inline-block items-start bg-green-800 px-3 py-2 rounded-lg hover:opacity-60 active:opacity-40 cursor-pointer mx-10"
                                        onClick={sendLinkFunction}
                                    >

                                        <div 
                                            className="text-base text-gray-300"
                                        >

                                            Send Link

                                        </div>

                                    </div>

                                    <div 
                                        className="inline-block items-start bg-green-800 px-3 py-2 rounded-lg hover:opacity-60 active:opacity-40 cursor-pointer"
                                        onClick={copyLinkFunction}    
                                    >

                                        <div 
                                            className="text-base text-gray-300"
                                        >

                                            Copy Link

                                        </div>

                                    </div>

                                   {patientData.teleSupportSurgeryDocumentsAccept ? (
                                    
                                        <div 
                                            className="inline-block items-start bg-red-500 ml-10 px-3 py-2 rounded-lg hover:opacity-60 active:opacity-40 cursor-pointer"
                                            onClick={dontAcceptUploads}
                                        >

                                            <div 
                                                className="text-base text-gray-300"
                                            >

                                                Dont Accept

                                            </div>

                                        </div>
                                        
                                    ) : (

                                        <div 
                                            className="inline-block items-start bg-green-800 ml-10 px-3 py-2 rounded-lg hover:opacity-60 active:opacity-40 cursor-pointer"
                                            onClick={acceptUploads}
                                        >

                                            <div 
                                                className="text-base text-gray-300"
                                            >

                                                Accept Uploads

                                            </div>

                                        </div>

                                    )}

                                </>

                            )}

                            { patientData.surgeryPaymentType !== 'CASH' && (

                                <>

                                    <div className="flex mt-5 mb-40">

                                        <div className="ml-10">

                                            <button
                                                onClick={fetchImages}
                                                className='cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                            >

                                                Show Documents

                                            </button>

                                        </div>

                                        <div className="mx-5">

                                            <button
                                                onClick={downloadImage}
                                                className='cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                            >

                                                Download Documents

                                            </button>

                                        </div>

                                        {/* <div 
                                            className='cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                            onClick={counsellingDone}
                                        >

                                            <div 
                                                className="text-base text-gray-300"
                                            >

                                                Counselling Done

                                            </div>

                                        </div> */}

                                    </div>

                                    {fetchedImageVisible && (
                                            
                                        <div className="fixed top-0 right-0 bottom-0 left-0 flex backdrop-blur-sm z-50">
                                        
                                            <div className="absolute mx-20 mt-10 text-xl font-semibold">Preview Mode</div>

                                            <div className="mx-20 my-20 grid grid-cols-6 gap-4 overflow-hidden">

                                                {images && images.length > 0 ? images.map(({ blobUrl, mimeType }, index) => {

                                                    return mimeType === 'application/pdf' ? (
                                                        <object
                                                            key={index}
                                                            data={blobUrl}
                                                            type="application/pdf"
                                                            width="100%"
                                                            height="400px"
                                                            aria-label={`Prescription PDF ${index + 1}`}
                                                            className='transition-transform duration-300 ease-in-out transform'
                                                        >
                                                            <p>PDF Preview Not Available</p>
                                                        </object>
                                                    ) : (
                                                        <img
                                                            key={index}
                                                            src={blobUrl}
                                                            alt={`Prescription ${index + 1}`}
                                                            className='transition-transform duration-300 ease-in-out transform hover:scale-105 h-[400px] w-auto'
                                                        />
                                                    );
                                                }) : (
                                        
                                                    <div className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center'>
                                                    
                                                        <div className="flex items-center space-x-2 text-xl">
                                                    
                                                            <div className="animate-spin">
                                                    
                                                                <CgLoadbar />
                                                    
                                                            </div>
                                                    
                                                            <div className="animate-pulse">
                                                    
                                                                Fetching ...
                                                    
                                                            </div>
                                                    
                                                        </div>
                                                    
                                                    </div>
                                                
                                                )}

                                                <IoCloseCircle
                                                    className='absolute top-10 right-10 text-2xl hover:opacity-60 active:opacity-40 cursor-pointer'
                                                    onClick={() => {
                                                        
                                                        setFetchedImageVisible(false);
                                                        setImages([]);
                                                    
                                                    }}
                                                />
                                            
                                            </div>
                                        
                                        </div>
                                
                                    )}

                                </>

                            )}

                            {counsellingDoneActivated && (

                                <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-[2px]">

                                    <form
                                        className='bg-gray-900 p-10 rounded-lg'
                                        onSubmit={counsellingDone}
                                    >

                                        <div className="mb-5">

                                            <label className='text-sm'>Counsellor Message<span className='text-red-400'>*</span></label><br />
                                            <textarea 
                                                required
                                                type='text'
                                                className='bg-[#0d1117] max-h-[100px] min-h-[100px] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 flex-1 w-[300px] max-sm:w-full mt-2 custom-scrollbar'
                                                value={surgeryCounsellorMessage}
                                                onChange={(e) => {

                                                    e.preventDefault();

                                                    const value = e.target.value;

                                                    setSurgeryCounsellorMessage(value);

                                                }}
                                            /> 

                                        </div>

                                        <button
                                            className={`bg-[#238636] hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3`}
                                            type='submit'
                                        > Counselling Done </button>

                                        <button
                                            className={`bg-red-500 hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3 ml-10`}
                                            onClick={(e) => {

                                                e.preventDefault();

                                                setCounsellingDoneActivated(false);

                                            }}
                                        > Cancel </button>

                                    </form>

                                </div>

                            )}

                        </>

                    )}

                </>

            )}

        </>

    )

}

export default MyJobsProfile