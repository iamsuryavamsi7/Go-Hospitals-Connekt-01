import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { IoPeopleCircleOutline, IoPersonAddSharp } from 'react-icons/io5';

const PharmacyLeftNavBar = () => {

    // UseNavigation Hook
    const navigate = useNavigate();

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    // State to store the role
    const [role, setRole] = useState(``);

    // Medical Support User Variable value
    const pharmacy = 'PHARMACYCARE'

    // Function to fetch user role
    const setUserRole = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/pharmacy/fetchUserRole`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const userRole = response.data;

                setRole(userRole);

            }

        }catch(error){

            handleError(error);

        }

    }

    // Running required functions when the component mounts
    useEffect(() => {

        if ( access_token ){

            setUserRole();

        }else {

            window.open(`${goHospitalsFRONTENDBASEURL}`, '_self');

        }

    }, []);

    // Pathname to get the hold on page change
    const pathName = window.location.pathname;

    // States to manage left nav bar style
    const [pendingMedications1, setPendingMedications1] = useState(`text-gray-400`);

    const [pendingMedications2, setPendingMedications2] = useState(`text-gray-400`);

    const [completedMedication1, setCompletedMedications1] = useState(`text-gray-400`);

    const [completedMedication2, setCompletedMedications2] = useState(`text-gray-400`);

    useEffect(() => {

        // PHARMACY LEFTNAVBAR
        if ( pathName === `/pharmacy-pending-medications`){

            setPendingMedications1(`text-sky-500`);

            setPendingMedications2(`bg-sky-500 text-white`);

        } else {

            setPendingMedications1(`text-gray-400`);

            setPendingMedications2(`text-gray-400`);            

        }

        if ( pathName === `/pharmacy-completed-medications`){

            setCompletedMedications1(`text-sky-500`);

            setCompletedMedications2(`bg-sky-500 text-white`);

        } else {

            setCompletedMedications1(`text-gray-400`);

            setCompletedMedications2(`text-gray-400`);            

        }        

    }, [pathName]);

    return (

        <>

            {role === pharmacy && (

                <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                    <div 
                        className={`${pendingMedications1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                        onClick={() => navigate('/pharmacy-pending-medications')}
                    >

                        <div className="">

                            <IoPersonAddSharp 
                                className={`${pendingMedications2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            Pending Medications

                        </div>

                    </div>

                    <div 
                        className={`${completedMedication1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                        onClick={() => navigate('/pharmacy-completed-medications')}
                    >

                        <div className="">

                            <IoPeopleCircleOutline 
                                className={`${completedMedication2} text-2xl  leading-8 p-[1px] rounded-md`}
                            />

                        </div>

                        <div className="">

                            Completed Medications

                        </div>

                    </div>

                </div>

            )}

        </>

    )

}

export default PharmacyLeftNavBar