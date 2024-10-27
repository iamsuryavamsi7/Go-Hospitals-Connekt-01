import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SurgeryCare = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const [medicalPlusFollowUpData, setMedicalPlusFollowUpData] = useState([]);

    const roles = {
        medicalSupport: 'MEDICALSUPPORT'
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

                fetchSurgeryCareData(userObject);

            }

        }catch(error){

            handleError(error);

        }

    }

    const fetchSurgeryCareData = async (userObject) => {

        const userObjectId = userObject.id;

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/medical-support/fetchSurgeryCareData/${userObjectId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                let onsiteData = response.data;

                // Sort data to put items with treatmentDone: false at the top
                onsiteData = onsiteData.sort((a, b) => {
                    return a.treatmentDone === b.treatmentDone ? 0 : a.treatmentDone ? 1 : -1;
                });

                setMedicalPlusFollowUpData(onsiteData);

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

                <>
                
                    <div className="">

                        <div className="mx-10 ">

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
                                        <th>Treatment Status</th>
                                        <th>Bill No</th>

                                    </tr>

                                </thead>

                                {medicalPlusFollowUpData && medicalPlusFollowUpData.length === 0 ? (

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

                                        {medicalPlusFollowUpData.map((application, index) => (

                                            <tr
                                                key={application.id}
                                                className='text-left leading-10 text-base border-b-[.5px] border-gray-800 text-gray-400'
                                            >

                                                <th>{index + 1}</th>

                                                <th>{application.name}</th>
                                                <th>{application.preferredDoctorName}</th>
                                                <th>{application.treatmentDone ? (

                                                    <span>Done</span>

                                                ) : (

                                                    <span>Not Done</span>

                                                )}</th>
                                                <th>{application.billNo}</th>
                                                <th
                                                    className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                                    onClick={(id) => navigate(`/medical-support-surgery-care-profile/${application.id}`)}
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

export default SurgeryCare