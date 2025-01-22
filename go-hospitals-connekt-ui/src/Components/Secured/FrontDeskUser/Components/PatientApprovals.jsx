import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { closeNavBarSearch } from '../../ReduxToolkit/Slices/frontDeskNavBarSlice';

const PatientApprovals = () => {

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

    const [surgeryPatients, setsurgeryPatients] = useState([]);

    const [page, setPage] = useState(0); // Track the current page
    
    const pageSize = 10; 

    const [isLastPage, setIsLastPage] = useState(false); // 

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

    const fetchSurgeryPatients = async () => {

        try {
            
            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchSurgeryPatients/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {

                let appointmentsData = response.data;

                console.log(appointmentsData);

                if ( appointmentsData.length === 0 ){

                    return false;

                }

                setIsLastPage(appointmentsData.length < pageSize);

                setsurgeryPatients(appointmentsData);

                return true;
    
            }

        } catch (error) {
        
            handleError(error);

            return false;
        }

    };

    const fetchSurgeryPatients2 = async (page) => {

        try {
            
            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchSurgeryPatients/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {

                let appointmentsData = response.data;

                console.log(appointmentsData);

                if ( appointmentsData.length === 0 ){

                    return false;

                }

                setIsLastPage(appointmentsData.length < pageSize);

                return true;
    
            }

        } catch (error) {
        
            handleError(error);

            return false;
        }

    };

    const nextPage = async () => {

        if ( !isLastPage ) {

            const pageNumber = page + 1

            const hasPage = await fetchSurgeryPatients2(pageNumber);

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

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchSurgeryPatients();

        } else {

            window.open(goHospitalsFRONTENDBASEURL, '_self');

        }

    }, []);

    useEffect(() => {

        fetchSurgeryPatients();

    }, [page]);

    const dispatch = useDispatch();

    const newPatientOnBoardFronDeskFunction = () => {

        dispatch(closeNavBarSearch());

    }

    return (

        <>

            {role === roles.frontDesk && (

                <>

                    <div 
                        className=""
                        onClick={newPatientOnBoardFronDeskFunction}    
                    >

                        <div className="mx-10">

                            <table
                                className='w-full'
                            >

                                <thead>

                                    <tr
                                        className='text-left leading-10 border-b-[.5px] border-gray-800 px-10'
                                    >

                                        <th>S.No</th>
                                        <th>Patient Name</th>
                                        <th>Doctors Name</th>
                                        <th>Bill No</th>
                                        <th>Nurse</th>

                                    </tr>

                                </thead>

                                {surgeryPatients && surgeryPatients.length === 0 ? (

                                    <tbody>

                                    <tr
                                        className='text-left border-b-[.5px] border-gray-800 text-gray-400'
                                    >

                                        <th>No Data</th>
                                        <th>No Data</th>
                                        <th>No Data</th>
                                        <th>No Data</th>
                                        <th>No Data</th>

                                    </tr>

                                    </tbody>

                                ) : (

                                    <tbody>

                                        {surgeryPatients.map((application, index) => (

                                            <tr
                                                key={application.id}
                                                className='text-left leading-10 text-base border-b-[.5px] border-gray-800 text-gray-400'
                                            >

                                                <th>{(page * pageSize) + (index + 1)}</th>

                                                <th>{application.name}</th>
                                                <th>{application.preferredDoctorName}</th>
                                                <th>{application.billNo}</th>
                                                <th>{application.medicalSupportUserName ? (

                                                    <>

                                                        {application.medicalSupportUserName}

                                                    </>

                                                ) : (

                                                    <>
                                                    
                                                        <span 
                                                            className='text-red-500 cursor-pointer'
                                                        >Not Taken</span>

                                                    </>

                                                )}</th>
                                                <th
                                                    className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                                    onClick={(id) => navigate(`/front-desk-follow-up-profile/${application.id}`)}
                                                >View Full Profile</th>

                                            </tr>

                                        ))}

                                    </tbody>

                                )}

                            </table>

                        </div>

                        {surgeryPatients && surgeryPatients.length < 0 && (

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

export default PatientApprovals