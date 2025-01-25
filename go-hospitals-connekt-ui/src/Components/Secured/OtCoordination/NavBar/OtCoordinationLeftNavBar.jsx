import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { IoPeopleCircleOutline, IoPersonAddSharp } from 'react-icons/io5';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const OtCoordinationLeftNavBar = () => {

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

    // Pharmacy Variable value
    const pharmacy = 'OTCOORDINATION'

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

    useEffect(() => {

        if ( access_token ){

            if ( pathName !== `/pharmacy-pending-medications` ){

                console.log(`Function is running in pharmacy left nav bar and the pathName is ${pathName}`);

                // checkPendingMedicationsRefreshFunction();

            }

        }

    }, []);

    const [leftNavBarRedBall, setLeftNavBarRedBall] = useState({
        pendingMedications: false,
        completedMedications: false
    });

    // // Function to check pending medications
    // const checkPendingMedicationsRefreshFunction = async () => {

    //     try{

    //         const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/pharmacy/checkPendingMedicationsRefresh`, {
    //             headers: {
    //                 Authorization: `Bearer ${access_token}`
    //             }
    //         });

    //         if ( response.status === 200 ){

    //             const responseData = response.data;

    //             if ( responseData ){

    //                 setLeftNavBarRedBall((prevElement) => {
    
    //                     const updatedData = {...prevElement};

    //                     updatedData.pendingMedications = true;

    //                     return updatedData;

    //                 });

    //             }

    //         }

    //     }catch(error){

    //         console.error(error);

    //     }

    // }

    const newNotificationReceived = (message) => {

        const messageObject = JSON.parse(message.body);

        if ( pathName !== `/pharmacy-pending-medications` ){

            if ( messageObject.notificationType === `PendingMedicationsRefresh` ){

                console.log(`\n\n\nFunction running inside messageObject.notificationType\n\n\n`);

                checkPendingMedicationsRefreshFunction();

            }

        }

    }

    // State to store stompClient
    const [stompClient, setStompClient] = useState(null);

    // Connect to websockets when the component mounts with useEffect hook
    useEffect(() => {

        const sock = new SockJS(`${goHospitalsAPIBaseURL}/go-hospitals-websocket`);
        const client = Stomp.over(() => sock);

        setStompClient(client);

        client.connect(
            {},
            () => {

                client.subscribe(`/common/commonFunction`, (message) => newNotificationReceived(message));
        
            },
            () => {

                console.error(error);
        
            }
        );

        // Disconnect on page unmount
        return () => {

            if ( client ){

                client.disconnect();

            }

        }

    }, []);

    return (

        <>

            {role === pharmacy && (

                <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                    <div 
                        className={`${pendingMedications1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3 relative`}
                        onClick={() => {

                            if ( leftNavBarRedBall.pendingMedications ){

                                setLeftNavBarRedBall((prevElement) => {

                                    const updatedData = {...prevElement};
        
                                    updatedData.pendingMedications = false;
        
                                    return updatedData;
        
                                });

                            }

                            navigate('/ot-coordination-current-surgeries');

                        }}
                    >

                        <div className="">

                            <IoPersonAddSharp 
                                className={`${pendingMedications2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            Current Surgeries

                        </div>

                        {leftNavBarRedBall.pendingMedications && <div className="bg-red-500 h-2 w-2 rounded-[50%] absolute left-[-30px] top-2 animate-pulse"></div>}

                    </div>

                    <div 
                        className={`${completedMedication1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3 relative`}
                        onClick={() => navigate('/ot-coordination-future-surgeries')}
                    >

                        <div className="">

                            <IoPeopleCircleOutline 
                                className={`${completedMedication2} text-2xl  leading-8 p-[1px] rounded-md`}
                            />

                        </div>

                        <div className="">

                            Future Surgeries

                        </div>

                        {leftNavBarRedBall.completedMedications && <div className="bg-red-500 h-2 w-2 rounded-[50%] absolute left-[-30px] top-2 animate-pulse"></div>}

                    </div>
                    
                    <div 
                        className={`${completedMedication1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3 relative`}
                        onClick={() => navigate('/ot-coordination-completed-surgeries')}
                    >

                        <div className="">

                            <IoPeopleCircleOutline 
                                className={`${completedMedication2} text-2xl  leading-8 p-[1px] rounded-md`}
                            />

                        </div>

                        <div className="">

                            Completed Surgeries

                        </div>

                        {leftNavBarRedBall.completedMedications && <div className="bg-red-500 h-2 w-2 rounded-[50%] absolute left-[-30px] top-2 animate-pulse"></div>}

                    </div>

                </div>

            )}

        </>

    )

}

export default OtCoordinationLeftNavBar