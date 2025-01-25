import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import { format, isAfter } from 'date-fns';
import { IoCloseCircleSharp } from 'react-icons/io5';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const SurgeryCareProfile = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    // const [image, setImage] = useState([]);

    const {id} = useParams();

    const [treatMentDoneVisible, setTreatMentDoneVisible] = useState(false);

    const [treatmentDone, setTreatmentDone] = useState(``);

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
    const patientCreatedOn = {
    appointmentCreatedOn: "2024-10-20T09:36:33.702+00:00",
    // other data...
    };
  
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
    
    const formattedDate = appointmentDate.toLocaleString('en-US', options);
    

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

                setPatientData(appointmentData);

            }

        }catch(error){

            handleError(error);

        }

    }

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, [id]);

    const [caseCloseButtonActivated, setCaseCloseButtonActivated] = useState(false);
    
    const [caseCloseInputValue, setCaseCloseInputValue] = useState(``);

    const caseClosedFunction = async (e) => {

        e.preventDefault();

        const applicationID = id;

        const caseCloseInput = caseCloseInputValue;

        const formData = new FormData();

        if ( caseCloseInputValue !== `` && caseCloseInputValue !== null ){

            formData.append("caseCloseInput", caseCloseInput);

            try{

                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/front-desk/caseCloseById/${applicationID}`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
    
                if ( response.status === 200 ){
    
                    const booleanValue = response.data;
    
                    if ( booleanValue ){
    
                        setCaseCloseButtonActivated(false);
    
                        fetchAppointmentData();
    
                    }
    
                }
    
            }catch(error){
    
                console.error(error);
    
            }

        }
        
    }

    const [patientDropOutVisible, setPatientDropOutVisible] = useState(false);

    const [patientDropOutMessage, setPatientDropOutMessage] = useState(``);

    const patientDropOutFunction = async (e) => {

        e.preventDefault();

        if ( patientDropOutMessage.trim() !== null && patientDropOutMessage.trim !== `` ){

            try{

                const formData = new FormData();

                formData.append('patientDropOutMessage', patientDropOutMessage.trim());

                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/medical-support/patientDropOutById/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                if ( response.status === 200 ){

                    const booleanValue = response.data;

                    if ( booleanValue ){

                        fetchAppointmentData();

                        setPatientDropOutVisible(false);

                        if ( stompClient ){

                            const notificationTypeModel = {
                                notificationType: `RefreshFrontDeskCaseClosed`
                            }
                
                            stompClient.send(`/app/commonWebSocket`, {}, JSON.stringify(notificationTypeModel));

                        }

                    }

                }

            }catch(error){

                console.error(error);

            }

        }

    }

    const [image, setImage] = useState([]);

    const [pharmacyMessage, setPharmacyMessage] = useState(``);

    const imagesLength = image.length;

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

                        setPharmacyMessageDuplicated(``);
                    
                        setSendPrescriptionActivated(false);

                        if ( stompClient ){

                            const notificationTypeModel = {
                                notificationType: `PendingMedicationsRefresh`
                            }
                
                            stompClient.send(`/app/commonWebSocket`, {}, JSON.stringify(notificationTypeModel));

                        }

                    }

                }

            }catch(error){

                console.error(error);

            }

        }

    }

    const [nextMedicationDate, setNextMedicationDate] = useState(new Date());

    const [sendPrescriptionActivated, setSendPrescriptionActivated] = useState(false);

    const [pharmacyMessageDuplicated, setPharmacyMessageDuplicated] = useState(``);

    // State to store date value
    const [currentDateValue, setCurrentDateValue] = useState(format(new Date(), 'MMMM dd yyyy')); 

    const handleCapture = (e) => {
        
        const files = Array.from(e.target.files);
        
        setImage(
            (prevFiles) => [...prevFiles, ...files]
        );
    
    };

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

    const treatmentDoneFunction = async (e) => {

        e.preventDefault();

        const applicationId = id;
    
        // Create FormData object
        const formData2 = new FormData();

        if ( treatmentDone !== null && treatmentDone !== `` ){

            formData2.append("prescriptionMessage", treatmentDone);

        }

        formData2.append("nextMedicationDate", nextMedicationDate);

        try {

            // Send the form data to the backend
            const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/medical-support/medicationPlusFollowUpTreatmentDone/${applicationId}`, formData2, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': `multipart/form-data`
                },
            });
    
            if ( response.status === 200 ){
    
                setTreatmentDone(``);
    
                if ( stompClient !== null ){
                
                    const notificationTypeModel = {
                        notificationType: `RefreshFrontDeskCaseClosed`
                    }
        
                    stompClient.send(`/app/commonWebSocket`, {}, JSON.stringify(notificationTypeModel))
    
                }

                fetchAppointmentData();

                setTreatMentDoneVisible(false);
    
            }
    
        } catch (error) {
        
            handleError(error);

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

                                    Surgery Completed

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.surgeryCompleted ? 'Surgery Completed' : 'Not Completed'}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Treatment Status

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.treatmentDone ? 'Completed' : 'Not Completed'}

                                </div>

                            </div>
                            

                        </div>

                        {!patientData.surgeryCompleted && (

                            <div
                                className='bg-gray-800 mx-10 my-10 px-2 rounded-lg leading-10 cursor-pointer inline-block'
                            >

                                In Progress

                            </div>

                        )}

                        {patientData.surgeryCompleted && !patientData.treatmentDone && (

                            <>

                                <div
                                    className='bg-[#238636] ml-10 mr-5 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                    onClick={() => {

                                        setTreatMentDoneVisible(true);

                                    }}
                                >

                                    Treatment Done

                                </div>

                                <div
                                    className='bg-[#238636] my-10 mr-5 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                    onClick={() => {

                                        setSendPrescriptionActivated(true);

                                    }}
                                >

                                    Upload Prescription

                                </div>

                                <div
                                    className='bg-red-500 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                    onClick={() => {

                                        setCaseCloseButtonActivated(true);

                                    }}
                                >

                                    Case Closed

                                </div>

                                <div
                                    className='bg-red-500 ml-5 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                    onClick={() => {

                                        setPatientDropOutVisible(true);

                                    }}
                                >

                                    Patient Drop Out

                                </div>

                            </>

                        )}

                        {treatMentDoneVisible && (
                        
                            <div 
                                className="absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-sm"
                            >

                                <form 
                                    className="block relative bg-gray-900 text-xl rounded-2xl border-[1px] border-gray-800"
                                    onSubmit={treatmentDoneFunction}
                                >
                                
                                    <div 
                                        className="py-2 px-10 transition-all duration-200 cursor-pointer rounded-t-2xl block mt-5"
                                    >
                                        
                                        <label className='text-xs'>Treatment Done Message (Optional)</label><br />

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
                                        className='bg-[#238636] mx-10 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
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

                        {patientData.surgeryCompleted && !patientData.treatmentDone && sendPrescriptionActivated && (

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
                                        
                                        <label className='text-xs'>Message to pharmacy (Optional)</label><br />

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
                        
                        {caseCloseButtonActivated && (

                            <form
                                className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm'
                                onSubmit={(e) => caseClosedFunction(e)}
                            >

                                <div className="bg-gray-900 py-10 rounded-lg">

                                    <div className="flex flex-col mx-10">

                                        <label className='text-xs mb-2'>Case Close Note <span className='text-red-500'>*</span></label>

                                        <textarea 
                                            className='bg-[#0d1117] min-h-[100px] max-h-[100px] custom-scrollbar text-white border-gray-400 border-[.5px] focus:outline-none focus:border-2 rounded-lg h-[80px] px-3 w-[300px] max-sm:w-full'
                                            value={caseCloseInputValue}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setCaseCloseInputValue(value);

                                            }}
                                        />

                                    </div>

                                    <div className="">

                                        <button 
                                            className='bg-[#238636] ml-10 mt-5 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                            type='submit'
                                        >
                                            Submit

                                        </button>

                                        <button 
                                            className='bg-red-500 ml-5 mt-5 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                            onClick={(e) => {

                                                e.preventDefault();

                                                setCaseCloseButtonActivated(false);
                                                
                                            }}
                                        >
                                            Cancel

                                        </button>

                                    </div>

                                </div>

                            </form>

                        )}

                        {patientDropOutVisible && (

                            <form
                                className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm'
                                onSubmit={(e) => patientDropOutFunction(e)}
                            >

                                <div className="bg-gray-900 py-10 rounded-lg">

                                    <div className="flex flex-col mx-10">

                                        <label className='text-xs mb-2'>Patient Drop Out Message <span className='text-red-500'>*</span></label>

                                        <textarea 
                                            className='bg-[#0d1117] min-h-[100px] max-h-[100px] custom-scrollbar text-white border-gray-400 border-[.5px] focus:outline-none focus:border-2 rounded-lg h-[80px] px-3 w-[300px] max-sm:w-full'
                                            value={patientDropOutMessage}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setPatientDropOutMessage(value);

                                            }}
                                        />

                                    </div>

                                    <div className="">

                                        <button 
                                            className='bg-[#238636] ml-10 mt-5 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                            type='submit'
                                        >
                                            Submit

                                        </button>

                                        <button 
                                            className='bg-red-500 ml-5 mt-5 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                            onClick={(e) => {

                                                e.preventDefault();

                                                setPatientDropOutVisible(false);
                                                
                                            }}
                                        >
                                            Cancel

                                        </button>

                                    </div>

                                </div>

                            </form>

                        )}

                    </div>

                </>

            )}

        </>

    )

}

export default SurgeryCareProfile