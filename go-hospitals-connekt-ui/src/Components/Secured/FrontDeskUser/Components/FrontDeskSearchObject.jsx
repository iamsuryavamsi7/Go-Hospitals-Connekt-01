import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios';
import { format } from 'date-fns';
import { GiCancel } from 'react-icons/gi';
import { CgLoadbar } from 'react-icons/cg';
import { IoCloseCircle } from 'react-icons/io5';

const FrontDeskSearchObject = () => {


// JWT Token
const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    const [pharmacyMessage, setPharmacyMessage] = useState(``);

    const {id} = useParams();

    const [patientData, setPatientData] = useState({
        id: id,
        patientId: ``,
        name: '',
        age: '',
        contact: '',
        address: '',
        gender: '',
        medicalHistory: '',
        reasonForVisit: '',
        appointmentOn: '',
        preferredDoctorName: '',
        appointmentCreatedOn: new Date(),
        appointmentFinished: '',
        patientAdmitMessage: '',
        nextFollowUpDate: new Date(),
        updatableNextFollowUpDate: ``,
        noteData: ``,
        nextAppointmentDate: [],
        prescriptionUrl: [],
        patientDropOutMessage: ``
    });

    const roles = {
        frontDesk: 'FRONTDESK'
    }

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

            const response = await axios.get(`http://localhost:7777/api/v1/front-desk/fetchApplicationById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const appointmentData = response.data;

                console.log(appointmentData);

                setPatientData(appointmentData);

                if ( appointmentData.pharmacyMessages && appointmentData.pharmacyMessages[0].pharmacyMessage ){

                    setPharmacyMessage(appointmentData.pharmacyMessages[0].pharmacyMessage);

                }

            }

        }catch(error){

            handleError(error);

        }

    }

    const fetchUserObject = async () => {

        const formData = new FormData();

        formData.append("jwtToken", access_token);

        try{

            const response = await axios.post('http://localhost:7777/api/v1/user/fetchUserObject', formData, {
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

    const [departmentsData, setDepartmentsData] = useState([]);

    const fetchDepartments = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/front-desk/getDepartments', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const departmentData = response.data;

                setDepartmentsData(departmentData);

            }

        }catch(error){

            handleError(error);

        }

    }

    // const handleDepartmentChange = (e) => {

    //     const departmentId = e.target.value;

    //     const fetchDepartment = async () => {

    //         try{

    //             const response = await axios.get('http://localhost:7777/api/v1/front-desk/getDepartmentById/' + departmentId, {
    //                 headers: {
    //                     'Authorization': `Bearer ${access_token}`
    //                 }
    //             })

    //             if ( response.status === 200 ){

    //                 const departmentData = response.data.departmentName

    //                 setPatientOnBoardData(
    //                     {...patientOnBoardData, reason: departmentData}
    //                 )

    //             }

    //         }catch(error){

    //             handleError(error);

    //         }

    //     }

    //     fetchDepartment();

    //     const fetchDoctors = async () => {

    //         try{

    //             const response = await axios.get('http://localhost:7777/api/v1/front-desk/fetchDoctorsByDepartmentId/' + departmentId, {
    //                 headers: {
    //                     'Authorization': `Bearer ${access_token}`
    //                 }
    //             })

    //             if ( response.status === 200 ){

    //                 const doctorsData = response.data;

    //                 setDoctorData(doctorsData);

    //             }

    //         }catch(error){

    //             handleError(error);

    //         }

    //     }

    //     fetchDoctors();

    // }

    // const formSubmitFunction01 = async (e) => {

    //     e.preventDefault();

    //     const reason = patientOnBoardData.reason;

    //     const doctorName = patientOnBoardData.preferredDoctor;

    //     const applicationId = id;

    //     const billNo = patientOnBoardData.billNo;

    //     if ( reason !== null && reason !== `` && doctorName !== null && doctorName !== `` && applicationId !== null && applicationId !== `` && billNo !== null && billNo !== ``){

    //         const acceptCrossConsultationModel = {
    //             applicationId,
    //             reasonForVisit: reason,
    //             doctorName,
    //             billNo
    //         }
    
    //         if ( stompClient !== null ){
    
    //             stompClient.send(`/app/acceptCrossConsultation`, {}, JSON.stringify(acceptCrossConsultationModel));
    
    //             toast.success("Cross Consultation Approved", {
    //                 autoClose: 1000,
    //                 style: {
    //                     backgroundColor: '#1f2937', // Tailwind bg-gray-800
    //                     color: '#fff', // Tailwind text-white
    //                     fontWeight: '600', // Tailwind font-semibold
    //                     borderRadius: '0.5rem', // Tailwind rounded-lg
    //                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
    //                     marginTop: '2.5rem' // Tailwind mt-10,
    //                 }
    //             });

    //             setTimeout(() => {

    //                 handlePrint();

    //             }, 1000);

    //             setTimeout(() => {
    
    //                 navigate(`/front-desk-new-patient-on-board`);
    
    //             }, 2000);
    
    //         }

    //     }

    // }

    // const printRef = useRef();
    
    // const handlePrint = () => {
    //     const printContent = printRef.current;
        
    //     if (!printContent) return;

    //     // Open a new window and write the content to it
    //     const printWindow = window.open('', '');
        
    //     // Write the content to the print window
    //     printWindow.document.write('<html><head><title>Onboard Conformation Slip</title>');

    //     // Include Tailwind CSS (you need to provide the correct path to your Tailwind CSS file)
    //     printWindow.document.write(`

    //         <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

    //     `);
        
    //     printWindow.document.write('</head><body>');
        
    //     // Clone the content and write it into the print window
    //     printWindow.document.write(printContent.innerHTML);
        
    //     printWindow.document.write('</body></html>');
    //     printWindow.document.close();

    //     setTimeout(() => {

    //         // Trigger print dialog
    //         printWindow.print();

    //     }, 1000);

    // };

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

            fetchDepartments();

        } else {

            window.location.pathname(goHospitalsFRONTENDBASEURL, '_self');

        }

    }, [id]);

    const [pharmacyMessageViewMoreActivated, setPharmacyMessageViewMoreActivated] = useState(false);

    const [billNoViewMoreActivated, setBillNoViewMoreActivated] = useState(false);

    const [prescriptionURLData, setPrescriptionURLData] = useState(false);

    const [images, setImages] = useState(null);

    const [fetchedImageVisible, setFetchedImageVisible] = useState(false);

    // Functin to fetch images
    const fetchImages = async (e, index) => {

        const imageSrc = patientData.prescriptionUrl[index];

        const mainImageSrc = imageSrc.prescriptionURL;

        setPrescriptionURLData(false);

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
            [...blobs.filter((blob) => blob !== null)]
        );
        
    };

    // Function to download images
    const downloadImage = async (e, index) => {

        const imageSrc = patientData.prescriptionUrl[index];

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

    const [addBillActivated, setAddBillActivated] = useState(false);

    const [billNoValue, setBillNoValue] = useState(``);

    const addBillFunction = async () => {

        if ( billNoValue.trim() !== `` && billNoValue !== null ){

            try{

                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/updateBillNo/${billNoValue}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                if ( response.status === 200 ){

                    const booleanValue = response.data;

                    if ( booleanValue ){

                        fetchAppointmentData();

                        setAddBillActivated(false);

                    }

                }

            }catch(error){

                console.error(error);

            }

        }

    }

    return (

        <>

            {role === roles.frontDesk && (

                <>

                    <div 
                        className="mb-10"
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

                                    Contact

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.contact}

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

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg relative">

                                <div className="text-base text-gray-300">

                                    Bill No

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.billNo}

                                </div>

                                <div 
                                    className="text-xs text-gray-200 absolute top-4 right-3 hover:opacity-60 active:opacity-80 cursor-pointer"
                                    onClick={() => setBillNoViewMoreActivated(true)}    
                                >View More</div>

                            </div>

                            {patientData.consultationType === 'FOLLOWUPCOMPLETED' && <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Follow-Up Scheduled

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.nextFollowUpDate && (

                                        <span>{format(patientData.nextFollowUpDate, 'MMMM dd, yyyy')}</span>

                                    )}

                                </div>

                            </div>}

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Preferred Doctor

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.preferredDoctorName}

                                </div>

                            </div>

                            {patientData.consultationType === 'CASECLOSED' ? (
                                
                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Case Closed by                                        

                                    </div>

                                    <div className="text-lg">
                                        
                                        {patientData.medicalSupportUserName}

                                    </div>

                                </div>
                            
                            ) : (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Nurse

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.medicalSupportUserName}

                                </div>

                            </div>

                            )}

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

                                    {patientData.consultationType === 'PATIENTDROPOUT' && 'Patient Dropped Out'}

                                </div>

                            </div>

                            {patientData.treatmentDoneMessage && <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Treatment Done Message

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.treatmentDoneMessage}

                                </div>

                            </div>}

                            {patientData.consultationType === 'CASECLOSED' && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Closed On

                                    </div>

                                    <div className="text-lg">
                                        
                                        {format(patientData.applicationCompletedTime, 'MMMM dd yyyy')}

                                    </div>

                                </div>

                            )}

                            {patientData.caseCloseInput && <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Case Closed Message

                                </div>

                                <div className="text-lg max-h-[100px] overflow-y-scroll custom-scrollbar">
                                    
                                    {patientData.caseCloseInput}

                                </div>

                            </div>}

                            {pharmacyMessage && <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg relative">

                                <div className="text-base text-gray-300">

                                    Pharmacy Message

                                </div>

                                <div className="text-lg whitespace-nowrap overflow-hidden max-w-[250px text-ellipsis]">
                                    
                                    {pharmacyMessage}

                                </div>

                                <div 
                                    className="text-xs text-gray-200 absolute top-4 right-3 hover:opacity-60 active:opacity-80 cursor-pointer"
                                    onClick={() => setPharmacyMessageViewMoreActivated(true)}    
                                >View More</div>

                            </div>}

                            {patientData.prescriptionUrl.length > 0 && <div className="bg-gray-800 px-5 py-3 rounded-lg flex items-center justify-center">

                                <div 
                                    className="hover:opacity-60 active:opacity-80 cursor-pointer"
                                    onClick={() => setPrescriptionURLData(true)}    
                                >View All Presciptions</div>

                            </div>}

                            {(patientData.consultationType === 'COMPLETED' || patientData.consultationType === `CROSSCONSULTATION`) && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Payment Status

                                    </div>

                                    <div className="text-lg">
                                        
                                        Done

                                    </div>

                                </div>

                            )}

                            {(patientData.consultationType === 'PATIENTDROPOUT') && patientData.patientDropOutMessage.length > 0 && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Patient Dropped out message

                                    </div>

                                    <div className="text-lg">
                                        
                                        {patientData.patientDropOutMessage}

                                    </div>

                                </div>

                            )}

                            {patientData.consultationType === 'COMPLETED' && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Pharmacy Message

                                    </div>

                                    <div className="text-lg">
                                        
                                        {patientData.pharmacyMessage ? (

                                            <span>{patientData.pharmacyMessage}</span>

                                        ): (

                                            <span>No Data</span>

                                        )}

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                    {pharmacyMessageViewMoreActivated && <div className="fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-[2px]">

                        <div className="bg-gray-900 p-10 rounded-lg max-h-[600px] overflow-y-scroll custom-scrollbar relative">

                            <div className="mb-5 font-xl text-center font-semibold">Pharmacy Messages</div>

                            {patientData.pharmacyMessages.map((item, index) => (

                                <div 
                                    className="flex space-x-2"
                                    key={index}    
                                >

                                    <div className="">{index + 1}{')'}</div>

                                    <div className="flex items-center space-x-2 mb-2">

                                        <div className="w-[300px]"> {item.pharmacyMessage ? item.pharmacyMessage : 'No Data'} </div>
                                        <div className="text-xs text-gray-200"> {'('}{format(item.timeStamp, 'MMMM dd yyyy, hh:mm a')}{')'} </div>

                                    </div>

                                </div>

                            ))}

                            <GiCancel 
                                className='absolute top-3 right-2 cursor-pointer'
                                onClick={() => {

                                    setPharmacyMessageViewMoreActivated(false);

                                }}
                            />

                        </div>

                    </div>}

                    {billNoViewMoreActivated && <div className="fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-[2px]">

                        <div className="bg-gray-900 p-10 rounded-2xl max-h-[600px] overflow-y-scroll custom-scrollbar relative">

                            <div className="mb-5 font-xl text-center font-semibold">Bill History</div>

                            {patientData.bills.map((item, index) => (

                                <div 
                                    className="flex space-x-2"
                                    key={index}    
                                >

                                    <div className="max-w-[100px]">{index + 1}{')'}</div>

                                    <div className="flex items-center space-x-5 mb-2">

                                        <div className="w-[100px]"> {item.billNo} </div>
                                        <div className=""> {item.billType === 'FRONTDESKBILL' ? 'Front Desk Bill' : 'Pharmacy Bill'} </div>
                                        <div className="text-xs text-gray-200"> {'('}{format(item.timeStamp, 'MMMM dd yyyy, hh:mm a')}{')'} </div>

                                    </div>

                                </div>

                            ))}

                            <GiCancel 
                                className='absolute top-3 right-2 cursor-pointer'
                                onClick={() => {

                                    setBillNoViewMoreActivated(false);

                                }}
                            />

                        </div>

                    </div>}

                    {prescriptionURLData && <div className="fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-[2px]">

                        <div className="bg-gray-900 p-10 rounded-2xl max-h-[600px] overflow-y-scroll custom-scrollbar relative">

                            <div className="mb-5 font-xl text-center font-semibold">Prescription History</div>

                            {patientData.prescriptionUrl.map((item, index) => (

                                <div 
                                    className="flex space-x-2"
                                    key={index}    
                                >

                                    <div className="">{index + 1}{')'}</div>

                                    <div className="flex items-center space-x-5 mb-2">

                                        <div className="w-[300px]"> {item.prescriptionMessage ? item.prescriptionMessage : 'No Data'} </div>
                                        <div className="text-xs text-gray-200"> {'('}{format(item.timeStamp, 'MMMM dd yyyy, hh:mm a')}{')'} </div>
                                        <div   
                                            className="text-xs text-gray-200 hover:opacity-60 active:opacity-80 cursor-pointer"
                                            onClick={(e, ind) => fetchImages(e, index)}    
                                        >View Prescriptions</div>
                                        <div   
                                            className="text-xs text-gray-200 hover:opacity-60 active:opacity-80 cursor-pointer"
                                            onClick={(e, ind) => downloadImage(e, index)}    
                                        >Download Prescriptions</div>

                                    </div>

                                </div>

                            ))}

                            <GiCancel 
                                className='absolute top-3 right-2 cursor-pointer'
                                onClick={() => {

                                    setPrescriptionURLData(false);

                                }}
                            />

                        </div>

                    </div>}

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

                    <div 
                        className="mx-10 bg-green-800 inline-block px-5 py-2 rounded-lg hover:opacity-60 active:opacity-80 transition-all cursor-pointer"
                        onClick={() => setAddBillActivated(true)}    
                    >

                            Add Bill
                            
                    </div>

                    {addBillActivated && (

                        <div className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center backdrop-blur-[2px]">

                            <div className="bg-gray-900 flex flex-col items-start p-10 rounded-lg">

                                <label className='text-xs'>Bill No <span className='text-red-500'>*</span></label>

                                <input 
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    value={billNoValue}
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setBillNoValue(value);

                                    }}
                                />

                                <div className="">

                                    <button 
                                        className='bg-green-800 inline-block px-5 py-2 mt-5 rounded-lg transition-all hover:opacity-60 active:opacity-80 cursor-pointer'
                                        onClick={addBillFunction}    
                                    >Submit</button>

                                    <button 
                                        className='bg-red-500 ml-5 inline-block px-5 py-2 mt-5 rounded-lg transition-all hover:opacity-60 active:opacity-80 cursor-pointer'
                                        onClick={() => setAddBillActivated(false)}    
                                    >Cancel</button>

                                </div>

                            </div>

                        </div>

                    )}

                </>

            )}

        </>

    )

}

export default FrontDeskSearchObject