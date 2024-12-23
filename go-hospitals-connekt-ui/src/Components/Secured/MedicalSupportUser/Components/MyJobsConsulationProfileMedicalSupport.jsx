import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const MyJobsConsulationProfileMedicalSupport = () => {

// JWT Token
const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

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

    const consultationType = ({
        onSite: 'ONSITETREATMENT',
        medication: 'MEDICATIONPLUSFOLLOWUP',
        surgery: 'SURGERYCARE',
        pharmacy: 'PHARMACY',
        crossConsultation: 'CROSSCONSULTATION',
        patientAdmit: 'PATIENTADMIT'
    });

    const [consulationDoneisVisible, setConsulationDoneisVisible] = useState(false);

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

    const fetchAppointmentData = async () => {

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/medical-support/fetchApplicationById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const appointmentData = response.data;

                setPatientData(appointmentData);

                console.log(appointmentData);

            }

        }catch(error){

            handleError(error);

        }

    }

    const takeJobFunction = async (applicationid) => {

        const applicationId = applicationid;

        const medicalSupportUserId = userObject.id

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/medical-support/assignApplication/${applicationId}/ToMedicalSupportUser/${medicalSupportUserId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                toast.success("Job Taken", {
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
                });

                setTimeout(() => {

                    navigate('/medical-support-current-job');
                    
                }, 1600);

            }

        }catch(error){

            handleError(error);

        }

    }

    const consulationTypeUpdateFunction = async (consultation) => {

        const applicationId = id;

        const consultationType1 = consultation;

        const formData = new FormData();

        formData.append('consultationType', consultationType1);

        try{

            const response = await axios.post(`http://localhost:7777/api/v1/medical-support/makeConsultationType/${applicationId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                toast.success("Consultation Status Updated", {
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
                });

                setTimeout(() => {

                    if ( consultationType1 === consultationType.onSite ) {

                        navigate('/medical-support-on-site-treatement');

                    }

                    if ( consultationType1 === consultationType.medication ) {

                        navigate('/medical-support-medication-plus-follow-up');

                    }

                    if ( consultationType1 === consultationType.surgery ) {

                        navigate('/medical-support-surgery-care');

                    }

                    if ( consultationType1 === consultationType.pharmacy ) {

                        navigate('/medical-support-pharmacy');

                    }

                    if ( consultationType1 === consultationType.crossConsultation ) {

                        navigate('/medical-support-cross-consultation');

                    }

                    if ( consultationType1 === consultationType.patientAdmit ) {

                        navigate('/medical-support-patient-admit');

                    }
                    
                }, 1600);

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

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg w-auto">

                                <div className="text-base text-gray-300">

                                    Patient ID

                                </div>

                                <div className="text-lg w-auto break-words">
                                    
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
                                    
                                    {patientData.medicalSupportUserName ? (

                                        <>
                                        
                                            <span>{patientData.medicalSupportUserName}</span>

                                        </>

                                    ) : (

                                        <>
                                        
                                            <span className='text-red-500'>Not Taken</span>

                                        </>

                                    )}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Appointment Created On

                                </div>

                                <div className="text-lg">
                                    
                                    {formattedDate}

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

                            {!patientData.medicalSupportUserName && (

                                <div className="rounded-lg flex justify-center items-center">

                                    <div 
                                        className="hover:opacity-60 active:opacity-40 cursor-pointer text-green-400"
                                        onClick={(id) => takeJobFunction(patientData.id)}    
                                    >

                                        Take Job

                                    </div>

                                </div>

                            )}
                            
                        </div>

                    </div>

                    {patientData.consultationType === 'WAITING' && (

                        <>

                        <button
                            className='bg-[#238636] mx-10 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40'
                            type='submit'
                            onClick={() => {

                                    setConsulationDoneisVisible(true);

                            }}
                        >

                            Consultation Done

                        </button>

                        {consulationDoneisVisible && (

                            <div 
                                className="absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-sm"
                                onClick={() => {

                                    setConsulationDoneisVisible(false);

                                }}
                            >

                                <div className="block bg-gray-900 text-center text-xl rounded-2xl border-[1px] border-gray-800">
                                
                                    <div 
                                        className="hover:bg-gray-700 py-5 px-10 transition-all duration-200 cursor-pointer rounded-t-2xl"
                                        onClick={(consultation) => consulationTypeUpdateFunction(consultationType.onSite)}
                                    >

                                        <button>On Site Treatment</button>

                                    </div>

                                    <div 
                                        className="hover:bg-gray-700 py-5 px-10 transition-all duration-200 cursor-pointer"
                                        onClick={(consultation) => consulationTypeUpdateFunction(consultationType.medication)}
                                    >

                                        <button>Medication + Follow Up</button>

                                    </div>

                                    <div 
                                        className="hover:bg-gray-700 py-5 px-10 transition-all duration-200 cursor-pointer"
                                        onClick={(consultation) => consulationTypeUpdateFunction(consultationType.surgery)}
                                    >

                                        <button>Surgery Care</button>

                                    </div>

                                    <div 
                                        className="hover:bg-gray-700 py-5 px-10 transition-all duration-200 cursor-pointer"
                                        onClick={(consultation) => consulationTypeUpdateFunction(consultationType.crossConsultation)}    
                                    >

                                        <button>Cross Consultation</button>

                                    </div>

                                    <div    
                                        className="hover:bg-gray-700 py-5 px-10 transition-all duration-200 cursor-pointer rounded-b-2xl"
                                        onClick={(consultation) => consulationTypeUpdateFunction(consultationType.patientAdmit)}    
                                    >

                                        <button>Patient Admit</button>

                                    </div>

                                </div>

                            </div>

                        )}

                        </>

                    )}

                </>

            )}

        </>

    )

}

export default MyJobsConsulationProfileMedicalSupport