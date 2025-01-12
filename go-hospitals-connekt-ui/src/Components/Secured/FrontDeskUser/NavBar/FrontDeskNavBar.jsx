import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineLogout, HiOutlineSpeakerphone } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const FrontDeskNavBar = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // Use Navigate Hook
    const navigate = useNavigate();

    // State to store the medical support user role
    const fronDesk = 'FRONTDESK';

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    // State Management
    const [role, setRole] = useState(null);

    // State to store user object
    const [userObject, setUserObject] = useState(null);

    // State to toggle notification
    const [notificationsVisible, setNotificationsVisible] = useState(false);

    // State to store notifications
    const [notificationArray, setNotificationArray] = useState([]);

    // State to set the notification count
    const [notificationCount, setNotificationCount] = useState(0);

    // Function to toggle notification
    const activateNotifications = () => {

        if ( notificationsVisible ) {

            setNotificationsVisible(false);

        } else {

            setNotificationsVisible(true);

        }

    }

    // Function to logout
    const logoutFunction = async () => {

        try{

            const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/logout`,{}, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                Cookies.remove('access_token', { path: '/', domain: '.gohospitals.in' });

                toast.success("Logout Succesfull", {
                    duration: 1000,
                    style: {
                        backgroundColor: '#1f2937', // Tailwind bg-gray-800
                        color: '#fff', // Tailwind text-white
                        fontWeight: '600', // Tailwind font-semibold
                        borderRadius: '0.5rem', // Tailwind rounded-lg
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                        marginTop: '2.5rem' // Tailwind mt-10,
                    },
                    position: 'top-center'
                });

                setTimeout(() => {

                    navigate('/');

                }, 1600);

            }

        }catch(error){

            handleError(error);

        }

    }

    // Function to fetch user object
    const fetchUserObject = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchUserObject`, {
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

            console.error(error);

        }

    }

    // Function to fetch existing notifications
    const fetchNotifications = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchNotificationByUserId`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const notificationData = response.data;

                setNotificationArray(notificationData);

                console.log(`Notification Fetched`);

            }

        }catch(error){

            console.error(error);

        }

    }

    // State to fetch required data with REST API with useEffect Hook
    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchNotifications();

        } else {

            window.open(`${goHospitalsFRONTENDBASEURL}`, '_self');

        }

    }, []);

    // Function to run when the user clicks on notification
    const notificationFunction = async (notificationObject) => {

        const applicationID = notificationObject.applicationId;

        const notificationID = notificationObject.id;

        const notificationStatus = notificationObject.notificationStatus;

        setNotificationsVisible(false);

            try{

                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/setNotificationReadByNotificationId/${notificationID}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                if ( response.status === 200 ){

                    const responseData = response.data;

                    fetchNotifications();                    

                }

            }catch(error){

                console.error(error);

            }

        if ( notificationStatus === 'CROSSCONSULTATIONNEEDED' ){

            navigate(`/front-desk-follow-up-profile/${applicationID}`);

        }

        if ( notificationStatus === 'FOLLOWUPPATIENT' ){

            navigate(`/front-desk-follow-up-profile/${applicationID}`);

        }

    }

    // Setting the notification count with useEffect hook
    useEffect(() => {
    
        const unreadNotifications = notificationArray.filter(notification => {
            return !notification.read
        });

        setNotificationCount(unreadNotifications.length);

        const unPlayedNotificationsCount = notificationArray.filter((notification) => {

            return !notification.notificationSoundPlayed

        });

        const playMusicFunction = async () => {
                
            for(let i = 0; i < unPlayedNotificationsCount.length; i++){

                const currentNotificationID = unPlayedNotificationsCount[i].id;

                try{

                    const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/notificationSoundPlayed/${currentNotificationID}`, {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        }
                    })

                    if ( response.status === 200 ){

                        const responseData = response.data;

                        console.log(responseData);

                        setTimeout(() => {

                            const audio = new Audio(`/Notifications/notification_count.mp4`);
        
                            audio.play().catch((error) => {
                                console.log("Audio play failed", error);
                            });
        
                        }, i * 800); 

                    }

                }catch(error){

                    console.error(error);

                }

            }
        
        }

        playMusicFunction();

    }, [notificationArray]);

    // Function to run when the new notification received
    const newNotificationReceived = (message) => {

        const messageObject = JSON.parse(message.body);

        console.log(messageObject);

        if ( messageObject.notificationStatus === 'CROSSCONSULTATIONNEEDED' ){

            fetchNotifications();

        }

    }

    const commonNotificationReceived = (message) => {

        const messageObject = JSON.parse(message.body);

        console.log(messageObject);

        if ( messageObject.notificationType === `RefreshMedicationPlusFollowUpPage` ){

            fetchNotifications();

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

                client.subscribe(`/frontDeskUserNotification/newNotifications`, (message) => newNotificationReceived(message));

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

    return (

        <>

            { role === fronDesk && <div className="h-16 flex items-center justify-between border-[1px] border-gray-800 fixed z-50 top-0 left-0 right-0 bg-[#0F172A]">
            
                <Toaster />

                <div className="ml-56 flex items-center">

                    <div className="">

                        <img
                            src='/Go-Hospitals-Logo.webp'
                            alt='Go Hospitals'
                            className='h-6 w-auto'
                        />

                    </div>

                    <div className="leading-8 text-[30px] font-semibold mx-2 josefin-sans-navBarUser">

                        works

                    </div>

                </div>

                <div className="mr-56 flex items-center space-x-3">

                    <div className="relative">

                        <HiOutlineSpeakerphone 
                            className='text-2xl opacity-60 hover:opacity-80 active:opacity-40 cursor-pointer'
                            onClick={activateNotifications}
                        />

                        <div className="absolute top-[-10px] notificationCount right-[-7px]">

                            {notificationCount > 0 && notificationCount <= 9 && (
                            
                                <>
                                
                                    {notificationCount}
                                
                                </>

                            )}

                            {notificationCount > 9 && (

                                <>
                                
                                    9+
                                
                                </>
                                
                            )}

                        </div>

                        {notificationsVisible && (

                            <div className="absolute border-2 border-gray-800 text-white w-[300px] rounded-lg top-12 left-[-20px] bg-gray-900 z-50">

                                <div 
                                    className="py-3 px-2 mx-2 text-xl border-b-[1px] border-gray-800"
                                >

                                    Notifications

                                </div>

                                <div className="mb-2 space-y-1 h-[300px] overflow-hidden overflow-y-auto custom-scrollbar relative">

                                    {notificationArray && notificationArray.length === 0 ? (

                                        <div className={`absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center`}>

                                            No Notifications found
                                            
                                        </div>

                                    ) : (

                                        <>

                                            {notificationArray.map((notification) => {

                                                return (

                                                    <div
                                                        key={notification.id}
                                                    >

                                                        {role === fronDesk && (

                                                            <div 
                                                                className={`py-3 mx-2 px-2 text-base rounded-lg ${notification.read ? '' : 'bg-sky-900'} transition-all duration-200 cursor-pointer hover:opacity-60 active:opacity-40`}
                                                                onClick={(notificationObject) => notificationFunction(notification)} 
                                                            >

                                                                <div className="">

                                                                    {notification.message}

                                                                </div>

                                                                <div className="text-xs text-gray-400">

                                                                    {new Date(notification.timeStamp).toLocaleString()}

                                                                </div>

                                                            </div>

                                                        )}

                                                    </div>
                                                    
                                                );

                                            })}

                                        </>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                    <div className="border-x-[1px] border-gray-800 px-3">

                    {userObject ? userObject.firstName : 'Loading...'}

                    </div>

                    <div className="">

                        <HiOutlineLogout 
                            className='text-2xl opacity-60 hover:opacity-80 active:opacity-40 cursor-pointer'
                            onClick={logoutFunction}
                        />

                    </div>

                </div>


            </div>}

        </>

    )

}

export default FrontDeskNavBar