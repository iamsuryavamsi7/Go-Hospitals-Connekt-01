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
            
            const response = await axios.get('http://localhost:7777/api/v1/pharmacy/fetchAllPharmacyMedications', {
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

                setInCompleteApplications(appointmentsData);
    
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

            fetchIncompleteApplications();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

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

                                {inCompleteApplications && inCompleteApplications === 0 ? (

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
                                                <th>{application.consultationType === 'ONSITETREATMENT' && (

                                                    <span>On Site Treatment</span>

                                                )}</th>
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

                    </div>

                </>

            )}

        </>

    )

}

export default PendingMedications