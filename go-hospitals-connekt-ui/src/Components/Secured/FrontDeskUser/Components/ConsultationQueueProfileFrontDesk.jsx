import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { closeNavBarSearch } from '../../ReduxToolkit/Slices/frontDeskNavBarSlice';

const ConsultationQueueProfileFrontDesk = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

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

    const roles = {
        admin: 'ADMIN',
        frontDesk: 'FRONTDESK',
        medicalSupport: 'MEDICALSUPPORT',
        teleSupport: 'TELESUPPORT',
        pharmacyCare: 'PHARMACYCARE',
        otCoordination: 'OTCOORDINATION',
        diagnosticsCenter: 'DIAGNOSTICSCENTER',
        transportTeam: 'TRANSPORTTEAM'
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

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchApplicationById/${id}`, {
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

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, [id]);

    const dispatch = useDispatch();

    const newPatientOnBoardFronDeskFunction = () => {

        dispatch(closeNavBarSearch());

    }

    return (

        <>

            {role === roles.frontDesk && (

                <div 
                    className=""
                >

                    <div className="mr-40 ml-10 text-2xl flex items-center space-x-3 mb-10 justify-center">

                        Patient Details    

                    </div>

                    <div className="mr-40 ml-10 grid grid-cols-3 gap-x-5 gap-y-5">

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

                        {!patientData.appointmentFinished ? (

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Op Status

                                </div>

                                <div className="text-lg">
                                    
                                    Waiting

                                </div>

                            </div>


                        ): (

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    OP Status

                                </div>

                                <div className="text-lg">
                                    
                                    Completed

                                </div>

                            </div>

                        )}
                        
                    </div>

                </div>

            )}

        </>

    )

}

export default ConsultationQueueProfileFrontDesk