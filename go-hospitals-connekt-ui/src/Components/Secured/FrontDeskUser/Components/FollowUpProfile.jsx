import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../../../Style/secured/navbar/navbaruser.css'
import axios from 'axios';
import '../../../../Style/secured/navbar/navbaruser.css'
// import { GiCancel } from 'react-icons/gi';
import { Toaster, toast } from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { GiCancel } from 'react-icons/gi';
import "react-datepicker/dist/react-datepicker.css";
import { format, isAfter } from 'date-fns';
import DatePicker from 'react-datepicker';

const FollowUpProfile = () => { 

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
        nextAppointmentDate: []
    });

    const roles = {
        frontDesk: 'FRONTDESK'
    }

    // const [patientPrescriptionSrc, setPatientPrescriptionSrc] = useState([]);

    // const [fetchedImageVisible, setFetchedImageVisible] = useState(false);

    // const [checkedStatus, setCheckedStatus] = useState(false);

    // // Format the date and time (example: MM/DD/YYYY, HH:MM AM/PM)
    // const options = { 
    //     year: 'numeric', 
    //     month: 'long', 
    //     day: 'numeric', 
    //     hour: 'numeric', 
    //     minute: 'numeric', 
    //     hour12: true // for AM/PM format
    // };
      
    // Convert to Date object
    // const appointmentDate = new Date(patientData.appointmentCreatedOn);
    
    // const formattedDate = appointmentDate.toLocaleString('en-US', options);

    // Convert to Date object
    // const appointmentCompletedDate = new Date(patientData.applicationCompletedTime);

    // const appointmentCompletedFormattedDate = appointmentCompletedDate.toLocaleString('en-US', options);

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

    // const [images, setImages] = useState([]);

    // const fetchImages = async () => {

    //     const imageSrc = patientData.prescriptionsUrls;

    //     setFetchedImageVisible(true);

    //     const imagePromises = imageSrc.map(async (imgSrc) => {
            
    //         const imageSrc1 = imgSrc.prescriptionURL;

    //         try{

    //             const response = await axios.get('http://localhost:7777/api/v1/files/display/' + imageSrc1, {
    //                 responseType: 'blob',
    //                 headers: {
    //                     Authorization: `Bearer ${access_token}`
    //                 }
    //             })

    //             const value = response.data;

    //             const imageBlob = URL.createObjectURL(value);

    //             return imageBlob;

    //         }catch(error){

    //             handleError(error);

    //         }
        
    //     });

    //     const blobs = await Promise.all(imagePromises);

    //     setImages(
    //         (prevImages) => [...prevImages, ...blobs.filter((blob) => blob !== null)]
    //     );

    // }

    // const downloadImage = async () => {

    //     setPatientPrescriptionSrc(null);

    //     const fileName = patientData.prescriptionsUrls;

    //     fileName.map( async (file1) => {
            
    //         const fileName1 = file1.prescriptionURL;

    //         try{

    //             const response = await axios.get(`http://localhost:7777/api/v1/files/download/${fileName1}`, {
    //                 headers: {
    //                     Authorization: `Bearer ${access_token}`
    //                 },
    //                 responseType: 'blob'
    //             })

    //             if ( response.status === 200 ){

    //                 const url = window.URL.createObjectURL(new Blob([response.data]));

    //                 const link = document.createElement('a');

    //                 link.href = url;

    //                 link.setAttribute('download', fileName1);
    //                 document.body.appendChild(link);
    //                 link.click();

    //                 document.body.removeChild(link);
    //                 window.URL.revokeObjectURL(url);

    //             }

    //         }catch(error){

    //             handleError(error);

    //         }

    //     });

    // }

    // const approveFunction = async () => {

    //     const patientAdmitMessage = patientData.patientAdmitMessage;

    //     const formData = new FormData();

    //     formData.append("patientAdmitMessage", patientAdmitMessage);

    //     try{

    //         const response = await axios.post(`http://localhost:7777/api/v1/front-desk/acceptApplicationById/${id}`, formData, {
    //             headers: {
    //                 'Authorization': `Bearer ${access_token}`
    //             }
    //         });

    //         if ( response.status === 200 ){

    //             toast.success("Patient Approved", {
    //                 duration: 1000,
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

    //                 navigate('/front-desk-new-patient-on-board');

    //             }, 1600);

    //         }

    //     }catch(error){

    //         handleError(error);

    //         toast.success("Something Went Wrong", {
    //             duration: 2000,
    //             style: {
    //                 backgroundColor: '#1f2937', // Tailwind bg-gray-800
    //                 color: '#fff', // Tailwind text-white
    //                 fontWeight: '600', // Tailwind font-semibold
    //                 borderRadius: '0.5rem', // Tailwind rounded-lg
    //                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
    //                 marginTop: '2.5rem' // Tailwind mt-10,
    //             },
    //             position: 'top-center'
    //         });

    //     }

    // }

    // const rejectFunction = async () => {

    //     try{

    //         const response = await axios.delete(`http://localhost:7777/api/v1/front-desk/deleteApplicationById/${id}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${access_token}`
    //             }
    //         });

    //         if ( response.status === 200 ){

    //             toast.success("Patient Rejected", {
    //                 duration: 1000,
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

    //                 navigate("/front-desk-new-patient-on-board");

    //             }, 1600);

    //         }

    //     }catch(error){

    //         handleError(error);

    //         toast.error("Something Went Wrong", {
    //             duration: 2000,
    //             style: {
    //                 backgroundColor: '#1f2937', // Tailwind bg-gray-800
    //                 color: '#fff', // Tailwind text-white
    //                 fontWeight: '600', // Tailwind font-semibold
    //                 borderRadius: '0.5rem', // Tailwind rounded-lg
    //                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
    //                 marginTop: '2.5rem' // Tailwind mt-10,
    //             },
    //             position: 'top-center'
    //         });

    //     }

    // }

    const [updateFormVisible, setUpdateFormVisible] = useState(false);

    const [patientOnBoardData, setPatientOnBoardData] = useState({
        name: '',
        age: '',
        contact: '',
        address: '',
        gender: '',
        medicalHistory: '',
        reason: '',
        preferredDoctor: '',
        billNo: ''
    });

    const [doctorData, setDoctorData] = useState([]);

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

    const handleDepartmentChange = (e) => {

        const departmentId = e.target.value;

        const fetchDepartment = async () => {

            try{

                const response = await axios.get('http://localhost:7777/api/v1/front-desk/getDepartmentById/' + departmentId, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    const departmentData = response.data.departmentName

                    setPatientOnBoardData(
                        {...patientOnBoardData, reason: departmentData}
                    )

                }

            }catch(error){

                handleError(error);

            }

        }

        fetchDepartment();

        const fetchDoctors = async () => {

            try{

                const response = await axios.get('http://localhost:7777/api/v1/front-desk/fetchDoctorsByDepartmentId/' + departmentId, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    const doctorsData = response.data;

                    setDoctorData(doctorsData);

                }

            }catch(error){

                handleError(error);

            }

        }

        fetchDoctors();

    }

    const formSubmitFunction01 = async (e) => {

        e.preventDefault();

        const reason = patientOnBoardData.reason;

        const doctorName = patientOnBoardData.preferredDoctor;

        const applicationId = id;

        const billNo = patientOnBoardData.billNo;

        if ( reason !== null && reason !== `` && doctorName !== null && doctorName !== `` && applicationId !== null && applicationId !== `` && billNo !== null && billNo !== ``){

            const acceptCrossConsultationModel = {
                applicationId,
                reasonForVisit: reason,
                doctorName,
                billNo
            }
    
            if ( stompClient !== null ){
    
                stompClient.send(`/app/acceptCrossConsultation`, {}, JSON.stringify(acceptCrossConsultationModel));
    
                toast.success("Cross Consultation Approved", {
                    autoClose: 1000,
                    style: {
                        backgroundColor: '#1f2937', // Tailwind bg-gray-800
                        color: '#fff', // Tailwind text-white
                        fontWeight: '600', // Tailwind font-semibold
                        borderRadius: '0.5rem', // Tailwind rounded-lg
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                        marginTop: '2.5rem' // Tailwind mt-10,
                    }
                });

                setTimeout(() => {

                    handlePrint();

                }, 1000);

                setTimeout(() => {
    
                    navigate(`/front-desk-new-patient-on-board`);
    
                }, 2000);
    
            }

        }

    }

    const printRef = useRef();
    
    const handlePrint = () => {
        const printContent = printRef.current;
        
        if (!printContent) return;

        // Open a new window and write the content to it
        const printWindow = window.open('', '');
        
        // Write the content to the print window
        printWindow.document.write('<html><head><title>Onboard Conformation Slip</title>');

        // Include Tailwind CSS (you need to provide the correct path to your Tailwind CSS file)
        printWindow.document.write(`

            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

        `);
        
        printWindow.document.write('</head><body>');
        
        // Clone the content and write it into the print window
        printWindow.document.write(printContent.innerHTML);
        
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        setTimeout(() => {

            // Trigger print dialog
            printWindow.print();

        }, 1000);

    };

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

            fetchDepartments();

        } else {

            window.location.pathname(goHospitalsFRONTENDBASEURL, '_self');

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

                console.log(`WebSockets are connected`);

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

    // State to toggle follow up date reschedule
    const [followUpRescheduleActivated, setFollowUpRescheduleActivated] = useState(false);

    const [currentDateValue, setCurrentDateValue] = useState(format(patientData.nextFollowUpDate, 'MMMM dd yyyy')); 

    // Function to reschedule appointment
    const rescheduleAppointmentButton = async () => {

        const note = patientData.noteData;
        const updateNextAppointmentDateValue = patientData.updatableNextFollowUpDate;

        if ( note !== `` && note !== null && updateNextAppointmentDateValue !== null && updateNextAppointmentDateValue !== `` && isAfter(updateNextAppointmentDateValue, patientData.nextFollowUpDate)){

            const formData = new FormData();

            formData.append('note', note);
            formData.append('updateNextAppointmentDateValue', updateNextAppointmentDateValue);

            try{

                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/front-desk/rescheduleAppointment/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    const responseData = response.data;

                    if ( responseData ){

                        fetchAppointmentData();

                        setFollowUpRescheduleActivated(false);

                    }

                }

            }catch(error){

                console.error(error);

            }

        }
        
    }

    const followUpRescheduleDelete = async (appointment) => {

        const nextAppointmentID = appointment.id;

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/deleteNextAppointmentData/${nextAppointmentID}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const booleanValue = response.data;

                console.log(booleanValue);

                if ( booleanValue ){

                    fetchAppointmentData();

                }

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to book appointment
    const bookAppointmentFunction = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/forwardToNurse/${id}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const booleanValue = response.data;

                if ( booleanValue ){

                    fetchAppointmentData();

                    if ( stompClient !== null ){
                    
                        const notificationTypeModel = {
                            notificationType: `FollowUpPatientCame`
                        }
            
                        stompClient.send(`/app/commonWebSocket`, {}, JSON.stringify(notificationTypeModel))
        
                    }

                    navigate(`/front-desk-new-patient-on-board`);

                }

            }

        }catch(error){

            console.error(error);

        }

    }

    return (

        <>

            <Toaster />

            {role === roles.frontDesk && (

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

                                    Medical Support Name

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
                                    
                                    {patientData.consultationType === 'FOLLOWUPCOMPLETED' && 'Follow-Up Scheduled'}

                                    {patientData.consultationType === 'CROSSCONSULTATION' && 'Cross Consultation'}

                                    {patientData.consultationType === 'CASECLOSED' && 'Case Closed'}

                                    {patientData.consultationType === 'WAITING' && 'Waiting for nurse'}

                                </div>

                            </div>

                            {patientData.consultationType === 'CASECLOSED' && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Completed On

                                    </div>

                                    <div className="text-lg">
                                        
                                        {format(patientData.applicationCompletedTime, 'MMMM dd yyyy')}

                                    </div>

                                </div>

                            )}

                            {patientData.pharmacyMessage && <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Pharmacy Message

                                </div>

                                <div className="text-lg max-h-[100px] overflow-y-scroll custom-scrollbar">
                                    
                                    {patientData.pharmacyMessage}

                                </div>

                            </div>}

                            {/* {patientData.consultationType === 'COMPLETED' && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Application Completed On

                                    </div>

                                    <div className="text-lg">
                                        
                                        {appointmentCompletedFormattedDate}

                                    </div>

                                </div> */}

                            {/* )} */}

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
                        
                        {patientData.consultationType === 'FOLLOWUPCOMPLETED' && (

                            <>

                                <div className="my-10 mx-10 relative">

                                    <button
                                        className={`bg-[#238636] hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3`}
                                        onClick={() => setFollowUpRescheduleActivated(true)}
                                    >

                                        Reschedule Follow Up

                                    </button>

                                    <button
                                        className={`bg-[#238636] hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3 ml-5`}
                                        onClick={bookAppointmentFunction}
                                    >

                                        Book Appointment

                                    </button>

                                    { followUpRescheduleActivated && <div className="fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-[2px] flex justify-center items-center">

                                        <div className="bg-gray-900 py-10 rounded-lg">

                                            <div className="flex flex-col mx-10">

                                                <label className='text-xs mb-2'>Note Message <span className='text-red-500'>*</span></label>

                                                <textarea 
                                                    className='bg-[#0d1117] min-h-[100px] max-h-[100px] custom-scrollbar text-white border-gray-400 border-[.5px] focus:outline-none focus:border-2 rounded-lg h-[80px] px-3 w-[300px] max-sm:w-full'
                                                    value={patientData.noteData}
                                                    onChange={(e) => {

                                                        const value = e.target.value;

                                                        setPatientData((prevElement) => {

                                                            const updatedData = {...prevElement};

                                                            updatedData.noteData = value;

                                                            return updatedData;

                                                        })

                                                    }}
                                                />

                                            </div>

                                            <div 
                                                className="mt-2 px-10 transition-all duration-200 cursor-pointer rounded-t-2xl block"
                                            >
                                                
                                                <label className='text-xs'>Rescheduled Date <span className='text-red-500'>*</span></label><br />

                                                <div className="relative inline-block">

                                                    <DatePicker 
                                                        className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] mt-2 text-sm'
                                                        value={currentDateValue}
                                                        onChange={(date) => {

                                                            const dateValue = format(date, 'MMMM dd yyyy');

                                                            setCurrentDateValue(dateValue);

                                                            setPatientData((prevElement) => {

                                                                const updatedData = {...prevElement};

                                                                updatedData.updatableNextFollowUpDate = date;

                                                                return updatedData;

                                                            });

                                                        }}
                                                    />
                                                    
                                                </div>

                                            </div>

                                            <div className="">

                                                <button 
                                                    className='bg-[#238636] ml-10 mt-5 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                                    onClick={rescheduleAppointmentButton}
                                                >
                                                    Submit

                                                </button>

                                                <button 
                                                    className='bg-red-500 ml-5 mt-5 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                                    onClick={() => setFollowUpRescheduleActivated(false)}
                                                >
                                                    Cancel

                                                </button>

                                            </div>

                                        </div>

                                    </div>}

                                </div>
                            
                            </>

                        )}

                        {patientData.consultationType === 'FOLLOWUPCOMPLETED' && patientData.nextAppointmentDate.length > 1 && (

                            <div className="mx-10 grid grid-cols-3 gap-5">

                                {patientData.nextAppointmentDate.slice(1).map((appointment, index) => {
                                    
                                    return (

                                    <div 
                                        className="mb-5 flex space-x-2 bg-gray-800 rounded-lg p-5 relative"
                                        key={index}
                                    >

                                        <div className="">

                                            {index + 1}{')'}

                                        </div>

                                        <div className="">

                                            <div className="flex items-center">

                                                <div className="text-sm">Actual Date : </div>

                                                <div className="ml-1 text-gray-400">{patientData.appointmentCreatedOn && format(patientData.appointmentCreatedOn, 'MMMM dd yyyy')}</div>

                                            </div>

                                            <div className="flex items-center">

                                                <div className="text-sm">Rescheduled Date : </div>

                                                <div className="ml-1 text-gray-400">{appointment.nextFollowUpDate && format(appointment.nextFollowUpDate, 'MMMM dd yyyy')}</div>

                                            </div>

                                            <div className="">

                                                <div className="text-sm">Note : </div>

                                                <div className="text-gray-400">{appointment.note}</div>

                                            </div>

                                        </div>

                                        {index === 0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 absolute right-4 top-4"
                                            onClick={() => followUpRescheduleDelete(appointment)}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>}

                                    </div>

                                )})}

                            </div>

                        )}

                        {/* {patientData.patientGotApproved && !patientData.forCrossConsultation && (

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

                        )} */}

                        {/* {fetchedImageVisible && (
                            
                            <div className="absolute top-0 right-0 bottom-0 left-0 flex backdrop-blur-sm">

                                <div className="absolute mx-20 mt-10 text-xl font-semibold">

                                    Preview Mode

                                </div>
                            
                                <div className="mx-20 my-20 grid grid-cols-6 gap-4 overflow-hidden"> 
                                    
                                    {images && images.length > 0 ? images.map((imageSrc, index) => {
                                        
                                        return (

                                            <img 
                                                key={index} 
                                                src={imageSrc}
                                                alt={`Prescription ${index + 1}`} 
                                                className='transition-transform duration-300 ease-in-out transform hover:scale-105 h-[400px] w-auto'
                                            />

                                    )}) : (

                                        <div
                                            className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center'
                                        >

                                            <div className="flex items-center space-x-2 text-xl">

                                                <div className="animate-spin">

                                                    <CgLoadbar />

                                                </div>

                                                <div className="animate-pulse">

                                                    Fetching ...

                                                </div>

                                            </div>, 'MMMM dd yyyy

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

                        {!patientData.patientGotApproved && (

                            <>

                               <div className="block mt-5 mx-10 space-y-3">
                               
                                    <label 
                                        className='text-xs'
                                    >Any Message (Optional)</label><br />

                                    <textarea 
                                        className='bg-[#0d1117] custom-scrollbar text-white border-gray-400 border-[.5px] focus:outline-none focus:border-2 rounded-lg h-[80px] px-3 w-[300px] max-sm:w-full'
                                        name='patientAdmitMessage'
                                        value={patientData.patientAdmitMessage}
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setPatientData({...patientData, [e.target.name]: value})

                                        }}
                                    />

                               </div>

                                <div className="mx-10 mb-10 mt-5 space-x-5">

                                    <button
                                        className = {`bg-green-700 px-2 py-1 rounded-lg hover:opacity-60 active:opacity-40`}
                                        onClick = {approveFunction}
                                    > Approve </button>

                                    <button
                                        className = {`bg-red-800 px-2 py-1 rounded-lg hover:opacity-60 active:opacity-40`}
                                        onClick = {rejectFunction}
                                    > Reject </button>

                                </div>

                            </>

                        )} */}

                        {patientData.consultationType === "CROSSCONSULTATION" && (

                            <>

                                <div className="mx-10 my-10 space-x-5">

                                    <button
                                        className = {`bg-green-800 px-2 py-1 rounded-lg hover:opacity-60 active:opacity-40`}
                                        onClick={() => {

                                            setUpdateFormVisible(true);

                                        }}  
                                    > Change Doctor </button>

                                </div>

                                {updateFormVisible && (

                                    <form
                                        className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm'
                                        onSubmit={(e) => formSubmitFunction01(e)}
                                    >

                                        <div className="bg-gray-900 px-10 py-10 rounded-2xl relative">

                                            <GiCancel 
                                                className='absolute top-5 right-5 cursor-pointer'
                                                onClick={() => {

                                                    setUpdateFormVisible(false);

                                                }}
                                            />

                                            <div className="block">

                                                <div className="">

                                                    <label>Reason for visit <span className='text-red-400'>*</span></label><br />
                                                    <select
                                                        className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mt-2'
                                                            onChange={(e) => handleDepartmentChange(e)}
                                                    >

                                                        <option>Select Reason</option>
                                                        {departmentsData.map((department, index) => (

                                                            <option 
                                                                key={index}
                                                                value={department.id}
                                                            >{department.departmentName}</option>

                                                        ))}

                                                    </select>                                

                                                </div>

                                                <div className="mt-10">

                                                    <label>Preferred Doctor <span className='text-red-400'>*</span></label><br />
                                                
                                                    <select
                                                        className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mt-2'
                                                            onChange={(e) => {

                                                                const value = e.target.value;

                                                                setPatientOnBoardData((prevValue) => ({
                                                                    ...prevValue, 
                                                                    preferredDoctor: value}
                                                                ));

                                                            }}
                                                    >

                                                        <option>Select Reason</option>
                                                        {doctorData.map((doctor, index) => (

                                                            <option 
                                                                key={index}
                                                                value={doctor.doctorName}
                                                            >{doctor.doctorName}</option>

                                                        ))}

                                                    </select>   

                                                </div>

                                                <div className="mt-10">

                                                    <label> Bill No <span className='text-red-400'>*</span></label><br />
                                                
                                                    <input 
                                                        type='text'
                                                        required
                                                        className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                                        name='billNo'
                                                        value={patientOnBoardData.billNo}
                                                        onChange={(e) => {

                                                            const value = e.target.value;

                                                            setPatientOnBoardData((prevValue) => ({
                                                                ...prevValue,
                                                                billNo: value
                                                            }));

                                                        }}
                                                    /> 

                                                </div>

                                            </div>

                                            <div className="">

                                                <button
                                                className='bg-[#238636] hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3 mt-7'
                                            > Update Application </button>

                                            </div>

                                        </div>

                                    </form>

                                )}

                            </>

                        )}

                    </div>

                    {/* Hidden page for printing patient details */}
                    <div
                        className="text-center mx-[400px] border-[1px] border-gray-200 hidden"
                        ref={printRef}
                    >

                        <div className="text-left mx-10 space-y-5 py-10">

                            <div className="">

                                <div className="text-black">Patient ID : {patientData.patientId}</div>

                            </div>

                            <div className="block">

                                <div className="">

                                    <div className="text-black">Patient Name : {patientData.name}</div>
                                    <div className="text-black">Patient Age : {patientData.age}</div>

                                </div>
                                
                                <div className="text-left">
                                    <div className="text-black">Consulting Doctor : {patientData.preferredDoctorName}</div>
                                    <div className="text-black">Patient Gender : {patientData.gender} </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </>

            )}

        </>

    )

}

export default FollowUpProfile