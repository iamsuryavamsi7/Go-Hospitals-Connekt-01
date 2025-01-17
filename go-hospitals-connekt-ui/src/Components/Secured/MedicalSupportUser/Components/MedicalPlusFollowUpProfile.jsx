import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { Toaster, toast } from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, isAfter, isBefore } from 'date-fns';

const MedicalPlusFollowUpProfile = () => {
 
    // JWT Token
    const access_token = Cookies.get('access_token');

    // State Management
    const [role, setRole] = useState(null);

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    const [userObject, setUserObject] = useState(null);

    const [image, setImage] = useState([]);

    const [pharmacyMessage, setPharmacyMessage] = useState(``);

    const imagesLength = image.length;

    const {id} = useParams();

    const [treatMentDoneVisible, setTreatMentDoneVisible] = useState(false);

    const [treatmentDone, setTreatmentDone] = useState(``);

    const [nextMedicationDate, setNextMedicationDate] = useState(new Date());

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

    // const [consulationDoneisVisible, setConsulationDoneisVisible] = useState(false);

    const roles = {
        medicalSupport: 'MEDICALSUPPORT',
    }

    // Your patient data
    // const patientCreatedOn = {
    // appointmentCreatedOn: "2024-10-20T09:36:33.702+00:00",
    // // other data...
    // };
  
    // Convert to Date object
    const appointmentDate = new Date(patientData.appointmentCreatedOn);
    
    // Format the date and time (example: MM/DD/YYYY, HH:MM AM/PM)
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true // for AM/PM format
    };
    
    // const formattedDate = appointmentDate.toLocaleString('en-US', options);
    

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

    const fetchAppointmentData = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/medical-support/fetchApplicationById/${id}`, {
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

    const handleCapture = (e) => {
        
        const files = Array.from(e.target.files);
        
        setImage(
            (prevFiles) => [...prevFiles, ...files]
        );

        console.log(image.length);
    
    };

    const calendarRef = useRef();

    const treatmentCompleted = async (e) => {
        
        e.preventDefault();

        const applicationId = id;
    
        // Create FormData object
        const formData = new FormData();

        // image.forEach((file) => {

        //     formData.append("imageFile", file);

        // });

        formData.append("prescriptionMessage", treatmentDone);
        formData.append("nextMedicationDate", nextMedicationDate);

        if ( nextMedicationDate !== null && nextMedicationDate !== `` && isAfter(nextMedicationDate, new Date()) ){

            try {

                // Send the form data to the backend
                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/medical-support/medicationPlusFollowUpTreatmentDone/${applicationId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': `multipart/form-data`
                    },
                });
        
                if ( response.status === 200 ){
        
                    // toast.success("Treatment Completed", {
                    //     duration: 1000,
                    //     style: {
                    //         backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    //         color: '#fff', // Tailwind text-white
                    //         fontWeight: '600', // Tailwind font-semibold
                    //         borderRadius: '0.5rem', // Tailwind rounded-lg
                    //         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    //         marginTop: '2.5rem' // Tailwind mt-10,
                    //     },
                    //     position: 'top-right'
                    // });
        
                    setTreatmentDone(``);
        
                    // setImage([]);
        
                    setTreatMentDoneVisible(false);
        
                    fetchAppointmentData();
        
                    if ( stompClient !== null ){
                    
                        const notificationTypeModel = {
                            notificationType: `RefreshFrontDeskCaseClosed`
                        }
            
                        stompClient.send(`/app/commonWebSocket`, {}, JSON.stringify(notificationTypeModel))
        
                    }
        
                }
        
            } catch (error) {
            
                handleError(error);
    
                // toast.error("File size exceeded", {
                //     duration: 2000,
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
    
                setImage([]);
            
            }

        }

    };

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

        } else {

            window.open(goHospitalsFRONTENDBASEURL, `_self`);

        }

    }, [id]);

    // State to store date value
    const [currentDateValue, setCurrentDateValue] = useState(format(new Date(), 'MMMM dd yyyy')); 

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

                console.log(`Connection Successfull`);
        
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

    const [sendPrescriptionActivated, setSendPrescriptionActivated] = useState(false);

    const [pharmacyMessageDuplicated, setPharmacyMessageDuplicated] = useState(``);

    const sendPrescriptionFunction = async (e) => {

        e.preventDefault();

        if ( imagesLength > 0 ){

            const applicationId = id;

            // Create FormData object
            const formData = new FormData();

            formData.append("applicationId", applicationId);

            image.forEach((file) => {

                formData.append("imageFile", file);

            });

            if ( pharmacyMessageDuplicated !== null && pharmacyMessageDuplicated !== `` ){

                formData.append("pharmacyMessage", pharmacyMessageDuplicated);

            }

            try{

                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/medical-support/sendPrescriptionToPharmacy`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                if ( response.status === 200 ){

                    const responseData = response.data;

                    if ( responseData ){

                        if ( stompClient !== null ){
                    
                            const notificationTypeModel = {
                                notificationType: `PendingMedicationsRefresh`
                            }
                
                            stompClient.send(`/app/commonWebSocket`, {}, JSON.stringify(notificationTypeModel));
            
                        }

                        setImage([]);
                        setPharmacyMessageDuplicated(``);

                        setSendPrescriptionActivated(false);

                    }

                }

            }catch(error){

                console.error(error);

            }

        }

    }

    return (

        <>

            <Toaster />

            {role === roles.medicalSupport && (

                <>

                    <div 
                        className=""
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
                                    
                                    {patientData.consultationType}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Treatment Status

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.treatmentDone ? (

                                        <div className="text-base text-gray-300">

                                            Completed

                                        </div>

                                    ) : (

                                        <div className="text-lg">

                                            Not Completed

                                        </div>

                                    )}

                                </div>

                            </div>

                            {pharmacyMessage && <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">
                                
                                <div className="text-base text-gray-300">

                                    Pharmacy Message

                                </div>

                                <div className="text-lg max-h-[100px] h-[100px] overflow-y-scroll w-full scrollableMove scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-700">

                                    {pharmacyMessage}

                                </div>

                            </div>}

                        </div>

                        {!patientData.treatmentDone && (

                            <>

                                <div
                                    className='bg-[#238636] mx-10 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                    onClick={() => {

                                        setTreatMentDoneVisible(true);

                                    }}
                                >

                                    Treatment Done

                                </div>

                                <div
                                    className='bg-[#238636] my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                    onClick={() => {

                                        setSendPrescriptionActivated(true);

                                    }}
                                >

                                    Send Prescription

                                </div>

                            </>

                        )}

                        {treatMentDoneVisible && (

                            <div 
                                className="absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-sm"
                            >

                                <form 
                                    className="block relative bg-gray-900 rounded-2xl border-[1px] border-gray-800 py-5"
                                    onSubmit={treatmentCompleted}
                                >
                                
                                    <div 
                                        className="py-2 px-10 transition-all duration-200 cursor-pointer rounded-t-2xl block"
                                    >
                                        
                                        <label className='text-xs'>Write any feed (Optional)</label><br />

                                        <textarea 
                                            type='text'
                                            className='bg-[#0d1117] min-h-[100px] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] mt-2 text-sm scrollableMove scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-700'
                                            value={treatmentDone}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setTreatmentDone(value);

                                            }}
                                        />
                                    
                                    </div>

                                    {/* <div 
                                        className="px-10 transition-all duration-200 cursor-pointer"
                                    >

                                        <label className='text-xs' onClick={() => console.log(format(nextMedicationDate, 'MMMM dd yyyy'))}>Upload prescription <span className='text-red-400'>*</span></label><br />

                                        <div className="mt-3">

                                            <input 
                                                type="file"
                                                accept="image/*"
                                                capture="environment" // opens the camera on mobile devices
                                                onChange={(e) => handleCapture(e)}
                                                multiple // Allows multiple file selection
                                                className='mt-2 mb-5 cursor-pointer hidden'
                                                id='fileInput'
                                            />

                                            <label 
                                                htmlFor='fileInput'
                                                className="cursor-pointer bg-gray-800 text-sm text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                                    Upload
                                            </label>

                                            <span className='ml-3'>{imagesLength} Files Selected</span>

                                        </div>

                                    </div> */}

                                    <div 
                                        className="px-10 transition-all duration-200 cursor-pointer rounded-t-2xl block"
                                    >
                                        
                                        <label className='text-xs'>Next Consultation Date</label><br />

                                        <div className="relative inline-block">

                                            <DatePicker 
                                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] mt-2 text-sm'
                                                value={currentDateValue}
                                                onChange={(date) => {

                                                    const dateValue = format(date, 'MMMM dd yyyy');

                                                    setCurrentDateValue(dateValue);

                                                    setNextMedicationDate(date);

                                                }}
                                            />
                                            
                                        </div>

                                    </div>

                                    <button 
                                        className='bg-[#238636] mx-10 mt-5 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                        type='submit'
                                    >
                                        Submit

                                    </button>

                                    <IoCloseCircleSharp 
                                        className='absolute z-50 top-5 right-5 cursor-pointer'
                                        onClick={() => {

                                            setTreatMentDoneVisible(false);

                                        }}
                                    />

                                </form>

                            </div>

                        )}

                        {sendPrescriptionActivated && (

                            <div 
                                className="absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-sm"
                            >

                                <form 
                                    className="block relative bg-gray-900 rounded-2xl border-[1px] border-gray-800 py-5"
                                    onSubmit={sendPrescriptionFunction}
                                >
                                
                                    <div 
                                        className="py-5 px-10 transition-all duration-200 cursor-pointer rounded-t-2xl block"
                                    >
                                        
                                        <label className='text-xs'>Write any feed (Optional)</label><br />

                                        <textarea 
                                            type='text'
                                            className='bg-[#0d1117] min-h-[100px] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] mt-2 text-sm scrollableMove scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-700'
                                            value={pharmacyMessageDuplicated}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setPharmacyMessageDuplicated(value);

                                            }}
                                            onKeyDown={(e) => {

                                                if ( e.key === 'Enter' ){

                                                    e.preventDefault();

                                                }

                                            }}
                                        />
                                    
                                    </div>

                                    <div 
                                        className="px-10 transition-all duration-200 cursor-pointer"
                                    >

                                        <label className='text-xs'>Upload prescription <span className='text-red-400'>*</span></label><br />

                                        <div className="mt-3">

                                            <input 
                                                type="file"
                                                accept="image/*"
                                                capture="environment" // opens the camera on mobile devices
                                                onChange={(e) => handleCapture(e)}
                                                multiple // Allows multiple file selection
                                                className='mt-2 mb-5 cursor-pointer hidden'
                                                id='fileInput'
                                            />

                                            <label 
                                                htmlFor='fileInput'
                                                className="cursor-pointer bg-gray-800 text-sm text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                                    Upload
                                            </label>

                                            <span className='ml-3'>{imagesLength} Files Selected</span>

                                        </div>

                                    </div>

                                    <button 
                                        className='bg-[#238636] mx-10 mt-5 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                        type='submit'
                                    >
                                        Submit

                                    </button>

                                    <IoCloseCircleSharp 
                                        className='absolute z-50 top-5 right-5 cursor-pointer'
                                        onClick={() => {

                                            setSendPrescriptionActivated(false);

                                        }}
                                    />

                                </form>

                            </div>

                        )}

                    </div>

                </>

            )}

        </>

    )

}

export default MedicalPlusFollowUpProfile