import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PendingMedications = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const [inCompleteApplications, setInCompleteApplications] = useState([]);

    const [page, setPage] = useState(0); // Track the current page
    
    const pageSize = 10; 

    const [isLastPage, setIsLastPage] = useState(false); // 

    const roles = {
        pharmacy: 'PHARMACYCARE'
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

    const fetchIncompleteApplications = async () => {
        
        try {
            
            const response = await axios.get(`http://localhost:7777/api/v1/pharmacy/fetchAllPharmacyMedicationsPaging/${page}/${pageSize}`, {
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

                appointmentsData = appointmentsData.sort((a, b) => {
                    const aHasSupportUser = a.medicalSupportUserId != null && a.medicalSupportUserName != null;
                    const bHasSupportUser = b.medicalSupportUserId != null && b.medicalSupportUserName != null;

                    return aHasSupportUser - bHasSupportUser;
                });

                setInCompleteApplications(appointmentsData);

                console.log("Finished")

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

    const nextPage = async () => {

        if ( !isLastPage ) {

            const hasPage = await fetchIncompleteApplications(page + 1);

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

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchIncompleteApplications();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    useEffect(() => {

        fetchIncompleteApplications();

    }, [page]);

    return (

        <>

            <ToastContainer />

            {role === roles.pharmacy && (

                <>

                    <div className="">

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
                                        <th>Medical Support User</th>
                                        <th>Status</th>

                                    </tr>

                                </thead>

                                {inCompleteApplications && inCompleteApplications.length === 0 ? (

                                    <tbody>

                                    <tr
                                        className='text-left border-b-[.5px] border-gray-800 text-gray-400'
                                    >

                                        <th>No Data</th>
                                        <th>No Data</th>
                                        <th>No Data</th>
                                        <th>No Data</th>

                                    </tr>

                                    </tbody>

                                ) : (

                                    <tbody>

                                        {inCompleteApplications.map((application, index) => (

                                            <tr
                                                key={application.id}
                                                className='text-left leading-10 text-base border-b-[.5px] border-gray-800 text-gray-400'
                                            >

                                                <th>{index + 1}</th>

                                                <th>{application.name}</th>
                                                <th>{application.preferredDoctorName}</th>
                                                <th>{application.billNo}</th>
                                                <th>{application.medicalSupportUserName}</th>
                                                <th>
                                                    
                                                    {application.consultationType === 'ONSITETREATMENT' && (

                                                    <span>On Site Treatment</span>

                                                    )}

                                                    {application.consultationType === 'MEDICATIONPLUSFOLLOWUP' && (

                                                    <span>Medication Plus Follow Up</span>

                                                    )}

                                                    {application.consultationType === 'SURGERYCARE' && (

                                                    <span>Surgery Care</span>

                                                    )}

                                                    {application.consultationType === 'PHARMACY' && (

                                                    <span>Pharmacy</span>

                                                    )}

                                                    {application.consultationType === 'PATIENTADMIT' && (

                                                    <span>Patient Admit</span>

                                                    )}

                                                </th>
                                                <th
                                                    className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                                    onClick={(id) => navigate(`/pharmacy-profiles/${application.id}`)}
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
                                className='bg-gray-800 cursor-pointer px-2 py-2 text-xs rounded-md hover:opacity-60 active:opacity-40'
                            >Previous</button>
                            
                            <span className='bg-gray-800 px-2 py-2 text-sm rounded-md cursor-pointer'>Page {page + 1}</span>
                            
                            <button 
                                onClick={nextPage}
                                className='bg-gray-800 cursor-pointer px-2 py-2 text-xs rounded-md hover:opacity-60 active:opacity-40'
                            >Next</button>
                        
                        </div>

                    </div>

                </>

            )}

        </>

    )

}

export default PendingMedications