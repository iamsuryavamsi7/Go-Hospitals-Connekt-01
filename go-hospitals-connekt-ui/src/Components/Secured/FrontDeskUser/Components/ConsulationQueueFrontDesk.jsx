import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BiSolidInjection } from 'react-icons/bi'

const ConsulationQueueFrontDesk = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const [inCompleteAppointments, setInCompleteAppointments] = useState([]);

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

    const fetchIncompleteAppointments = async () => {
        
        try {
            const response = await axios.get('http://localhost:7777/api/v1/front-desk/getAllBookingsByNotComplete', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {

                let appointmentsData = response.data;

                appointmentsData = appointmentsData.sort((a, b) => {
                    const aHasSupportUser = a.medicalSupportUserId != null && a.medicalSupportUserName != null;
                    const bHasSupportUser = b.medicalSupportUserId != null && b.medicalSupportUserName != null;

                    return aHasSupportUser - bHasSupportUser;
                });

                setInCompleteAppointments(appointmentsData);
    

            }
        } catch (error) {
            
            handleError(error);
        
        }
    
    };
    
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

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchIncompleteAppointments();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    return (

        <>

            {role === roles.frontDesk && (

                <>

                    <div className="">

                        <div className="mx-10 text-lg mb-5 flex items-center space-x-2">

                            <div className="">

                                <BiSolidInjection />

                            </div>
                            
                            <div className="">

                                Consultations

                            </div>

                        </div>

                        <div className="mx-10 mr-56">

                            <table
                                className='w-full'
                            >

                                <thead>

                                    <tr
                                        className='text-left leading-10'
                                    >

                                        <th>S.No</th>
                                        <th>Patient Name</th>
                                        <th>Doctors Name</th>
                                        <th>Bill No</th>
                                        <th>Medical Support User</th>

                                    </tr>

                                </thead>

                                {inCompleteAppointments && inCompleteAppointments === 0 ? (

                                    <tbody>

                                    <tr
                                        className='text-left'
                                    >

                                        <th>No Data</th>
                                        <th>No Data</th>
                                        <th>No Data</th>
                                        <th>No Data</th>

                                    </tr>

                                    </tbody>

                                ) : (

                                    <tbody>

                                        {inCompleteAppointments.map((appointment, index) => (

                                            <tr
                                                key={appointment.id}
                                                className='text-left text-gray-500 leading-10 text-base'
                                            >

                                                <th>{index + 1}</th>

                                                <th>{appointment.name}</th>
                                                <th>{appointment.preferredDoctorName}</th>
                                                <th>{appointment.billNo}</th>
                                                <th>{appointment.medicalSupportUserName ? (

                                                    <>

                                                        {appointment.medicalSupportUserName}

                                                    </>

                                                ) : (

                                                    <>
                                                    
                                                        <span className='text-red-500'>Not Taken</span>

                                                    </>

                                                )}</th>
                                                <th
                                                    className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                                    onClick={(id) => navigate(`/front-desk-consultation-queue/${appointment.id}`)}
                                                >View Full Profile</th>

                                            </tr>

                                        ))}

                                    </tbody>

                                )}

                            </table>

                        </div>

                    </div>

                </>

            )}
            
        </>

    )

}

export default ConsulationQueueFrontDesk