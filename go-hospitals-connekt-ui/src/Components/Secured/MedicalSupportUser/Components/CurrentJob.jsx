import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const CurrentJob = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const [userId, setUserId] = useState(null);

    const [page, setPage] = useState(0); // Track the current page
    
    const pageSize = 25; 

    const [isLastPage, setIsLastPage] = useState(false); //  

    const roles = {
        medicalSupport: 'MEDICALSUPPORT'
    }

    const [myJobs, setMyJobs] = useState([]);

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

    const fetchMyJobs = async () => {

        try {
            
            const response = await axios.get(`http://localhost:7777/api/v1/medical-support/fetchMedicalSupportJobsByIdPaging/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {
                
                let myJobsData = response.data;

                console.log(myJobsData);

                if ( myJobsData.length === 0 ){ 

                    return false;

                }

                setIsLastPage(myJobsData.length < pageSize);

                setMyJobs(myJobsData);

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

                fetchMyJobs(userObject);

                setUserId(userObject.id);

            }

        }catch(error){

            handleError(error);

        }

    }

    const nextPage = async () => {

        if ( !isLastPage ) {

            const hasPage = await fetchMyJobs(page + 1);

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

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    useEffect(() => {

        fetchMyJobs(userObject);

    }, [page]);

    return (

        <>

            <Toaster />
        
            {role === roles.medicalSupport && (

                <div className="mb-10">

                    <div className="mx-20 text-lg mb-5">

                        My Current Jobs

                    </div>

                    <div className="mx-20">

                        <table
                            className='w-full'
                        >

                            <thead>

                                <tr
                                    className='text-left leading-10 border-b-[.5px] border-gray-800'
                                >

                                    <th>S.No</th>
                                    <th>Patient Name</th>
                                    <th>Doctors Name</th>
                                    <th>Status</th>
                                    <th>Bill No</th>

                                </tr>

                            </thead>

                            {myJobs && myJobs.length === 0 ? (

                                <tbody>

                                <tr
                                    className='text-left'
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

                                    {myJobs.map((job, index) => ( 

                                        <tr
                                            key={job.id}
                                            className='text-left text-gray-500 leading-10 text-base border-b-[.5px] border-gray-800'
                                        >

                                            <th>{(page * pageSize) + (index + 1)}</th>

                                            <th>{job.name}</th>
                                            <th>{job.preferredDoctorName}</th>
                                            <th>

                                                {job.consultationType === 'WAITING' && 'Waiting for DMO'}

                                                {job.consultationType === 'DMOCARECOMPLETED' && 'Waiting for Consultation'}

                                                {job.consultationType === 'ONSITETREATMENT' && 'On Site Treatment'}

                                                {job.consultationType === 'CROSSCONSULTATION' && 'Cross Consultation'}

                                            </th>
                                            <th>{job.billNo}</th>
                                            <th
                                                className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                                onClick={(id) => navigate(`/medical-support-consultation-queue-current-job/${job.id}`)}
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

            )}
        
        </>

    )

}

export default CurrentJob