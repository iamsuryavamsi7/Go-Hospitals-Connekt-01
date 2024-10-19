import React, { useEffect, useState } from 'react'
import { IoPersonAddSharp } from 'react-icons/io5';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeftNavBar = () => {

// UseNavigation Hook
    const navigate = useNavigate();

// JWT Token
    const access_token = Cookies.get('access_token');

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

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

    const [newApprovals, setNewApprovals] = useState(`text-gray-400`);

    const [newApprovals2, setNewApprovals2] = useState(`text-gray-400`);

    const [newPatientRegistration, setNewPatientRegistration] = useState(`text-gray-400`);

    const [newPatientRegistration2, setNewPatientRegistration2] = useState(`text-gray-400`);

    const [pendingConsultations, setPendingConsultations] = useState(`text-gray-400`);

    const [pendingConsultations2, setPendingConsultations2] = useState(`text-gray-400`);

    const [followUpPatients, setFollowUpPatients] = useState(`text-gray-400`);

    const [followUpPatients2, setFollowUpPatients2] = useState(`text-gray-400`);

    const pathName = window.location.pathname;

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

            }

        }catch(error){

            handleError(error);

        }

    }

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

        }else {

            console.log("Jwt Token Not Available");

        }

        if (pathName === '/user-profile') {

            setNewApprovals(`text-sky-500`)

            setNewApprovals2(`bg-sky-500 text-white`)

            setNewPatientRegistration(`text-sky-500`)

            setNewPatientRegistration2(`bg-sky-500 text-white`)

        } else {

            setNewApprovals(`text-gray-400`)

            setNewApprovals2(`text-gray-400`)

            setNewPatientRegistration(`text-gray-400`)

            setNewPatientRegistration2(`text-gray-400`)

        }

    }, []);

    return (

        <>

            {role === roles.admin && (

                <>
                
                    <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                        <div 
                            className={`${newApprovals} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/user-profile')}
                        >

                            <div className="">

                                <IoPersonAddSharp 
                                    className={`${newApprovals2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                New Approvals

                            </div>

                        </div>

                    </div>

                </>

            )}

            {role === roles.frontDesk && (

                <>

                    <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                        <div 
                            className={`${newPatientRegistration} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/user-profile')}
                        >

                            <div className="">

                                <IoPersonAddSharp 
                                    className={`${newPatientRegistration2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                New Patient Onboarding

                            </div>

                        </div>

                        <div className={`${pendingConsultations} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}>

                            <div className="">

                                <IoPersonAddSharp 
                                    className={`${pendingConsultations2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                Pending Consultations

                            </div>

                        </div>

                        <div className={`${followUpPatients} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}>

                            <div className="">

                                <IoPersonAddSharp 
                                    className={`${followUpPatients2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                Follow-up Patients

                            </div>

                        </div>

                    </div>

                </>

            )}

        </>

    )

}

export default LeftNavBar