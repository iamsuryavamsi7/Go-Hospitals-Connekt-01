import React, { useEffect, useState } from 'react'
import { GiSandsOfTime } from 'react-icons/gi'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClosedCasesFrontDesk = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // Use Navigate Hook
    const navigate = useNavigate();

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    // State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const [caseClosedAppointments, setCaseClosedApprointments] = useState([]);

    const [page, setPage] = useState(0); // Track the current page
    
    const pageSize = 5; 

    const [isLastPage, setIsLastPage] = useState(false); // 

    const frontDesk = 'FRONTDESK';

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

    const fetchCaseClosedAppointments2 = async (page) => {
        
        try {
            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchCaseClosedAppointments/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {

                const appointmentsData = response.data;

                console.log(appointmentsData);

                if ( appointmentsData.length === 0 ){

                    return false;

                }

                return true;

            }
        } catch (error) {
            
            return false;
        
        }
    
    };

    const nextPage = async () => {

        if ( !isLastPage ) {

            const page = page + 1;

            const hasPage = await fetchCaseClosedAppointments2(page);

            if ( hasPage ){

                setPage((prevPage) => prevPage + 1);

            }

        } else {

            toast.error('No Page Available', {
                duration: 2000
            });

        }

    }

    const prevPage = () => {

        if ( page > 0 ) {

            setPage((prevPage) => prevPage - 1);

            setIsLastPage(false);

        } 

    }

    const fetchCaseClosedAppointments = async () => {
        
        try {
            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchCaseClosedAppointmentsPaging/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {

                const appointmentsData = response.data;

                console.log(appointmentsData);

                if ( appointmentsData.length === 0 ){

                    return false;

                }

                setIsLastPage(appointmentsData.length < pageSize);

                setCaseClosedApprointments(appointmentsData);

                return true;

            }
        } catch (error) {
            
            handleError(error);

            return false;
        
        }
    
    };
    
    const fetchUserObject = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchUserObject`, {
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

            fetchCaseClosedAppointments();

        } else {

            window.open(goHospitalsFRONTENDBASEURL, '_self');

        }

    }, []);

    useEffect(() => {

        fetchCaseClosedAppointments();

    }, [page]);

    return (
        
        <>
        
            {role === frontDesk && (
            
                <>

                    <div className="">

                        <div className="mx-10 text-lg mb-5 flex items-center space-x-2">

                            <div className="">

                                <GiSandsOfTime />

                            </div>
                            
                            <div className="">

                                Closed Cases

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
                                        <th>Bill No</th>
                                        <th>Patient ID</th>

                                    </tr>

                                </thead>

                                {caseClosedAppointments && caseClosedAppointments.length === 0 ? (

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

                                        {caseClosedAppointments.map((appointment, index) => (

                                            <tr
                                                key={appointment.id}
                                                className='text-left text-gray-500 leading-10 text-base'
                                            >

                                                <th>{(page * pageSize) + (index + 1)}</th>

                                                <th>{appointment.name}</th>
                                                <th>{appointment.billNo}</th>
                                                <th>{appointment.patientId}</th>
                                                <th
                                                    className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                                    onClick={(id) => navigate(`/front-desk-follow-up-profile/${appointment.id}`)}
                                                >View Full Profile</th>

                                            </tr>

                                        ))}

                                    </tbody>

                                )}

                            </table>

                        </div>

                        {caseClosedAppointments && caseClosedAppointments.length > 0 && (

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

                        )}

                    </div>

                </>

            )}
        
        </>

    )

}

export default ClosedCasesFrontDesk