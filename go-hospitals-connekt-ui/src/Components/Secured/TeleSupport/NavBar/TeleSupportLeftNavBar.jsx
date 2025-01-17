import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { IoPersonAddSharp } from 'react-icons/io5';
import { MdManageAccounts } from 'react-icons/md';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const TeleSupportLeftNavBar = () => {

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

    // Nurse Variable value
    const teleSupport = 'TELESUPPORT'

    // Function to fetch user role
    const setUserRole = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/tele-support/fetchUserRole`, {
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

    // Pathname to get the hold on page change
    const pathName = window.location.pathname;

    // Running required functions when the component mounts
    useEffect(() => {

        if ( access_token ){

            setUserRole();

            if ( pathName !== `/telesupport-incomplete-patients` ){

                checkIncompletePatientsAvailableOrNot();

            }

        }else {

            window.open(`${goHospitalsFRONTENDBASEURL}`, '_self');

        }

    }, []);

    // States to manage left nav bar style
    const [incompletePatients1, setInCompletePatients1] = useState(`text-gray-400`);

    const [incompletePatients2, setInCompletePatients2] = useState(`text-gray-400`);

    const [myJobs1, setMyJobs1] = useState(`text-gray-400`);

    const [myJobs2, setMyJobs2] = useState(`text-gray-400`);

    useEffect(() => {

        // TELESUPPORT LEFTNAVBAR
        if ( pathName === `/telesupport-incomplete-patients` ){

            setInCompletePatients1(`text-sky-500`);

            setInCompletePatients2(`bg-sky-500 text-white`);

        } else {

            setInCompletePatients1(`text-gray-400`);

            setInCompletePatients2(`text-gray-400`);            

        }

        if ( pathName === `/telesupport-MyJobs` ) {

            setMyJobs1(`text-sky-500`);

            setMyJobs2(`bg-sky-500 text-white`);

        } else {

            setMyJobs1(`text-gray-400`);

            setMyJobs2(`text-gray-400`);            

        }

    }, [pathName]);

    // Function to check the incomplete patients are there 
    const checkIncompletePatientsAvailableOrNot = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/tele-support/checkIncompletePatientsAvailableOrNot`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const booleanValue = response.data;

                if ( booleanValue ){

                    setIncompletePatientsActivated(true);

                }

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to run on notification received
    const commonNotificationReceived = (message) => {
    
        const messageObject = JSON.parse(message.body);

        console.log(messageObject);

        if ( messageObject.notificationType === `RefreshTeleSupportNotifications` ){

            if ( pathName !== `/telesupport-incomplete-patients` ){

                checkIncompletePatientsAvailableOrNot();

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

                client.subscribe(`/common/commonFunction`, (message) => commonNotificationReceived(message))

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

    // State to toggle incomplete patients
    const [incompletePatientsActivated, setIncompletePatientsActivated] = useState(false);

return (

        <>
        
            {role === teleSupport && (

                <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                    <div 
                        className={`${incompletePatients1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3 relative`}
                        onClick={() => {

                            setIncompletePatientsActivated(false);

                            navigate('/telesupport-incomplete-patients')

                        }}
                    >

                        <div className="">

                            <IoPersonAddSharp 
                                className={`${incompletePatients2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            Incomplete Patients

                        </div>

                        {incompletePatientsActivated && <div className="h-2 w-2 bg-red-500 rounded-[50%] left-[-30px] top-2 absolute"></div>}

                    </div>

                    <div 
                        className={`${myJobs1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                        onClick={() => navigate('/telesupport-MyJobs')}
                    >

                        <div className="">

                            <MdManageAccounts 
                                className={`${myJobs2} text-[28px]  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            My Jobs

                        </div>

                    </div>

                </div>

            )}
        
        </>

    )

}

export default TeleSupportLeftNavBar