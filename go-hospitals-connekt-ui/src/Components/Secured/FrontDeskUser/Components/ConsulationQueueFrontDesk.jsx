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

    const [page, setPage] = useState(0); // Track the current page
    
    const pageSize = 10; 

    const [isLastPage, setIsLastPage] = useState(false); // 

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

    const nextPage = async () => {

        if ( !isLastPage ) {

            const hasPage = await fetchcompleteApplications(page + 1);

            if ( hasPage ){

                setPage((prevPage) => prevPage + 1);

            }

        }

    }

    const prevPage = () => {

        if ( page > 0 ) {

            setPage((prevPage) => prevPage - 1);

            setIsLastPage(false);

        } 

    }

    const fetchIncompleteAppointments = async () => {
        
        try {
            const response = await axios.get(`http://localhost:7777/api/v1/front-desk/getAllBookingsByNotCompletePaging/${pageNumber}/${defaultSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {

                let appointmentsData = response.data;

                if ( appointmentsData.length === 0 ){

                    return false;

                }

                setIsLastPage(appointmentsData.length < pageSize);

                appointmentsData = appointmentsData.sort((a, b) => {
                    const aHasSupportUser = a.medicalSupportUserId != null && a.medicalSupportUserName != null;
                    const bHasSupportUser = b.medicalSupportUserId != null && b.medicalSupportUserName != null;

                    return aHasSupportUser - bHasSupportUser;
                });

                setInCompleteAppointments(appointmentsData);

                return true;

            }
        } catch (error) {
            
            handleError(error);

            return false;
        
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

    useEffect(() => {

        fetchIncompleteAppointments();

    }, [page]);

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

                                {inCompleteAppointments && inCompleteAppointments.length === 0 ? (

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

                                                <th>{(page * pageSize) + (index + 1)}</th>

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

                        <div className="space-x-5 text-center mx-10 mt-5">
                            
                            <button 
                                onClick={prevPage} 
                                disabled={page === 0}
                                className='bg-gray-800 cursor-pointer px-2 py-2 text-xs rounded-md'
                            >Previous</button>
                            
                            <span className='bg-gray-800 px-2 py-2 text-sm rounded-md cursor-pointer'>Page {page + 1}</span>
                            
                            <button 
                                onClick={nextPage}
                                className='bg-gray-800 cursor-pointer px-2 py-2 text-xs rounded-md'
                            >Next</button>
                        
                        </div>

                    </div>

                </>

            )}
            
        </>

    )

}

export default ConsulationQueueFrontDesk