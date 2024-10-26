import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const CurrentJob = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

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

    const fetchMyJobs = async (userObject) => {

        const medicalSupportId = userObject.id;

        try {
            
            const response = await axios.get(`http://localhost:7777/api/v1/medical-support/fetchMedicalSupportJobsById/${medicalSupportId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {
                
                let myJobsData = response.data;

                // Sort to place items with consultationType "WAITING" first
                myJobsData = myJobsData.sort((a, b) => {
                    
                    if (a.consultationType === "WAITING" && b.consultationType !== "WAITING") {
                    
                        return -1;
                    
                    } else if (a.consultationType !== "WAITING" && b.consultationType === "WAITING") {
                    
                        return 1;
                    
                    } else {
                    
                        return 0;
                    
                    }
                
                });

                setMyJobs(myJobsData);

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

                fetchMyJobs(userObject);

            }

        }catch(error){

            handleError(error);

        }

    }

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    return (

        <>
        
            {role === roles.medicalSupport && (

                <div className="">

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

                                            <th>{index + 1}</th>

                                            <th>{job.name}</th>
                                            <th>{job.preferredDoctorName}</th>
                                            <th>{job.consultationType === null ? (

                                                <span>Not Decided</span>

                                            ) : (

                                                <span>{job.consultationType}</span>

                                            )}</th>
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

                </div>

            )}
        
        </>

    )

}

export default CurrentJob