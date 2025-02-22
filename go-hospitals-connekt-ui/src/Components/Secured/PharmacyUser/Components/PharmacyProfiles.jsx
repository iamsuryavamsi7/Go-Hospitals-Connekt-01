import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../../../Style/secured/navbar/navbaruser.css'
import axios from 'axios';
import { IoCloseCircle } from 'react-icons/io5';
import { CgLoadbar } from 'react-icons/cg';
import { Toaster, toast } from 'react-hot-toast';
import { format } from 'date-fns';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const PharmacyProfiles = () => {

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
        pharmacy: 'PHARMACYCARE',
    }

    // const [patientPrescriptionSrc, setPatientPrescriptionSrc] = useState([]);

    const [fetchedImageVisible, setFetchedImageVisible] = useState(false);

    const [checkedStatus, setCheckedStatus] = useState(false);

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
    // const appointmentDate = new Date(patientData.appointmentCreatedOn);
    
    // const formattedDate = appointmentDate.toLocaleString('en-US', options);

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

    // Function to fetch appointment data
    const fetchAppointmentData = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/pharmacy/fetchApplicationById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const appointmentData = response.data;

                console.log(appointmentData);

                setPatientData(appointmentData);

                if ( appointmentData.prescriptionsUrls[0].prescriptionMessage !== null && appointmentData.prescriptionsUrls[0].prescriptionMessage !== `` ){

                    setNurseMessage(appointmentData.prescriptionsUrls[0].prescriptionMessage);

                }

            }

        }catch(error){

            handleError(error);

        }

    }

    // Function to fetch userObject
    const fetchUserObject = async () => {

        const formData = new FormData();

        formData.append("jwtToken", access_token);

        try{

            const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/user/fetchUserObject`, formData, {
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

    // Function to run after payment done
    const paymentDoneFunction = async () => {

        const applicationId = id; 

        const pharmacyMessage = ifNeededData;

        const formData = new FormData();

        formData.append('pharmacyMessage', pharmacyMessage);

        formData.append(`billNo`, billNo);

        formData.append(`consultationType`, patientData.consultationType);

        if ( checkedStatus && billNo !== null && billNo !== `` ){

            try{

                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/pharmacy/medicinesTaken/${applicationId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
    
                if ( response.status === 200 ){
    
                    // toast.success("Application Completed", {
                    //     duration: 1000,
                    //     style: {
                    //         backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    //         color: '#fff', // Tailwind text-white
                    //         fontWeight: '600', // Tailwind font-semibold
                    //         borderRadius: '0.5rem', // Tailwind rounded-lg
                    //         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    //         marginTop: '2.5rem' // Tailwind mt-10,
                    //     },
                    //     position: 'top-center'
                    // });

                    if ( patientData.consultationType === 'FOLLOWUPCOMPLETED' ) {

                        const webSocketNotificationTypeModel = {
                            notificationType: `MedicinesGiven`
                        }

                        if ( stompClient ){

                            stompClient.send(`/app/commonWebSocket`,{}, JSON.stringify(webSocketNotificationTypeModel));

                        }

                    }

                    if ( patientData.consultationType === 'ONSITREVIEWPATIENTDRESSING' || patientData.consultationType === 'ONSITEVASCULARINJECTIONS' || patientData.consultationType === 'ONSITEQUICKTREATMENT' || patientData.consultationType === 'ONSITECASCUALITYPATIENT' || patientData.consultationType === 'SURGERYCARE' ) {

                        const webSocketNotificationTypeModel = {
                            notificationType: `MedicinesGivenMedicalSupport`
                        }

                        if ( stompClient ){

                            stompClient.send(`/app/commonWebSocket`,{}, JSON.stringify(webSocketNotificationTypeModel));

                        }

                    }

                    fetchAppointmentData();
                    
                }
    
            }catch(error){
    
                handleError(error);
    
            }

        } else {

            toast.error("Checkbox is not checked", {
                duration: 2000,
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

    }

    // State to store the images
    const [images, setImages] = useState([]);

    // Functin to fetch images
    const fetchImages = async () => {

        const imageSrc = patientData.prescriptionsUrls[0];

        const mainImageSrc = imageSrc.prescriptionURL;

        setFetchedImageVisible(true);
    
        const imagePromises = mainImageSrc.map(async (imgSrc) => {

            const imageUrl = imgSrc;

            try {

                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/files/display/` + imageUrl, {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
    
                if ( response.status === 200 ){

                    const value = response.data;

                    const mimeType = response.headers['content-type'];
                    const blobUrl = URL.createObjectURL(value);

                    console.log(blobUrl);

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

    // Function to download images
    const downloadImage = async () => {

        const imageSrc = patientData.prescriptionsUrls[0];

        const mainImageSrc = imageSrc.prescriptionURL;

        mainImageSrc.map(async (imgSrc) => {

            const imageUrl = imgSrc;

            console.log(imageUrl);

            try {

                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/files/download/${imgSrc}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                    responseType: 'blob'
                })

                if ( response.status === 200 ){

                    const url = window.URL.createObjectURL(new Blob([response.data]));

                    const link = document.createElement('a');

                    link.href = url;

                    link.setAttribute('download', imageUrl);

                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                }
    
            } catch (error) {

                handleError(error);

            }

        });

    }

    const [ ifNeededData, setIfNeededData] = useState('');
    
    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, [id]);

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

                console.log(`Connected to websockets in pharmacy profiles page`);
        
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

    const [NurseMessage, setNurseMessage] = useState(``);

    const [billNo, setBillNo] = useState(``);

    return (

        <>

            <Toaster />

            {role === roles.pharmacy && (

                <>

                    <div 
                        className="mb-20"
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

                            {/* <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Messasge from Nurse

                                </div>

                                <div className="text-lg max-h-[100px] h-[100px] overflow-y-scroll w-full scrollableMove scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-700">
                                    
                                    {NurseMessage}

                                </div>

                            </div> */}

                            {NurseMessage && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Message From Nurse

                                    </div>

                                    <div className="text-lg">
                                        
                                        {NurseMessage}

                                    </div>

                                </div>

                            )}

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

                        </div>

                        <div className="flex">

                            <div className="ml-10 mt-10">

                                <button
                                    onClick={fetchImages}
                                    className='cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                >

                                    Show Prescription

                                </button>

                            </div>

                            <div className="mx-5 mt-10">

                                <button
                                    onClick={downloadImage}
                                    className='cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                >

                                    Download Prescription

                                </button>

                            </div>

                        </div>

                        { patientData.needMedicines && (

                            <>

                                <div className="mx-10 my-5">

                                    <label className='text-xs'>Write any feed (Optional)</label><br />

                                    <textarea
                                        className='mt-2 h-[80px] border-[1px] border-gray-700 focus-within:outline-none custom-scrollbar cursor-pointer bg-gray-800 px-2 py-2 rounded-lg'
                                        value={ifNeededData}
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setIfNeededData(value);

                                        }}
                                    />

                                </div>

                                <div className="mx-10 my-5">

                                    <label className='text-xs'>Bill No <span className='text-red-500'>*</span></label><br />

                                    <input
                                        className='mt-2 border-[1px] border-gray-700 focus-within:outline-none custom-scrollbar cursor-pointer bg-gray-800 px-2 py-2 rounded-lg'
                                        value={billNo}
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setBillNo(value);

                                        }}
                                    />

                                </div>

                            </>

                        )}

                        { patientData.needMedicines && (

                            <div className="ml-10">

                                <div className="flex space-x-2 text-xs mb-3">

                                    <input 
                                        type='checkbox'
                                        onChange={(e) => {

                                            const value = e.target.checked;

                                            setCheckedStatus(value);

                                        }}
                                        id='checkBox'
                                    /><br />

                                    <label htmlFor='checkBox' className='cursor-pointer'>Is the payment completed ?<span className='text-red-400 ml-1 relative bottom-[2px]'>*</span></label>

                                </div>

                                <button
                                    className='cursor-pointer bg-green-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                    onClick={paymentDoneFunction}
                                >

                                    Payment Done

                                </button>

                            </div>

                        )}

                    </div>

                    {fetchedImageVisible && (
                            
                        <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex backdrop-blur-sm">
                        
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

        </>

    )

}

export default PharmacyProfiles