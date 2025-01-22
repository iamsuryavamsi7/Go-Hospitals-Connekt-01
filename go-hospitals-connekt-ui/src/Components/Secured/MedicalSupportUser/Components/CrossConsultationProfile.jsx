import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const CrossConsultationProfile = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

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
        medicalSupport: 'MEDICALSUPPORT',
    }
  
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

                console.log(appointmentData);

                setPatientData(appointmentData);

            }

        }catch(error){

            handleError(error);

        }

    }

    const sendToFrontDesk = async () => {

        const applicationId = id;

        const sendToFrontDeskObjectModel = {
            applicationId
        }

        if ( stompClient !== null ){

            stompClient.send(`/app/sendRequestToFrontDeskCrossConsultation`, {}, JSON.stringify(sendToFrontDeskObjectModel));

            toast.success("Request Sent", {
                duration: 1000, 
                style: {
                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    color: '#fff', // Tailwind text-white
                    fontWeight: '600', // Tailwind font-semibold
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    marginTop: '2.5rem' // Tailwind mt-10,
                },
                position: 'top-right'
            })

            setTimeout(() => {

                fetchAppointmentData();

            }, 2000);

        }

    }

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

        } else {

            window.open(goHospitalsFRONTENDBASEURL, '_self');

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
                            

                        </div>

                        {!patientData.treatmentDone && (

                            <div
                                className='bg-[#238636] mx-10 my-10 px-2 rounded-lg leading-10 inline-block'
                            >

                                Request Sent

                            </div>

                        )}

                    </div>

                </>

            )}

        </>

    )

}

export default CrossConsultationProfile