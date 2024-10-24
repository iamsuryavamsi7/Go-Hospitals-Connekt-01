import React, { useEffect, useState } from 'react';
import '../../../Style/NavBarUser.css'
import { HiOutlineLogout, HiOutlineSpeakerphone } from 'react-icons/hi';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../Style/secured/navbar/navbaruser.css';

const NavBarUser = () => {

// Jwt Token
    const access_token = Cookies.get('access_token');

    const [userObject, setUserObject] = useState(null);

    const [notificationsVisible, setNotificationsVisible] = useState(false);

    const [notificationArray, setNotificationArray] = useState([]);

    const [notificationCount, setNotificationCount] = useState(0);

// useNavigate Hook
    const navigate = useNavigate();

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

                setUserObject(userObject);

                fetchNotifications(userObject);

            }

        }catch(error){

            handleError(error);

        }

    }

    const logoutFunction = async () => {

        try{

            const response = await axios.post('http://localhost:7777/api/v1/logout',{}, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                Cookies.remove('access_token', { path: '/', domain: '.gohospitals.in' });

                toast.success("Logout Succesfull", {
                    autoClose: 1000,
                    style: {
                        backgroundColor: '#1f2937', // Tailwind bg-gray-800
                        color: '#fff', // Tailwind text-white
                        fontWeight: '600', // Tailwind font-semibold
                        borderRadius: '0.5rem', // Tailwind rounded-lg
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                        marginTop: '2.5rem' // Tailwind mt-10,
                    },
                    progressStyle: {
                        backgroundColor: '#22c55e' // Tailwind bg-green-400
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
   
    const activateNotifications = () => {

        if ( notificationsVisible ) {

            setNotificationsVisible(false);

        } else {

            setNotificationsVisible(true);

        }

    }

    const colorChange = (booleanValue) => {

        if ( booleanValue ){

            return '';

        } else {

            return 'bg-sky-900';

        }

    }

    const fetchNotifications = async (userObject) => {

        try{

            const userId = userObject.id;

            const response = await axios.get(`http://localhost:7777/api/v1/medical-support/fetchNotificationByUserId/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                let notificationData = response.data;

                // Sort notifications by timeStamp in descending order (latest first)
                notificationData.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    
                setNotificationArray(notificationData);

                console.log(notificationData);

            }

        }catch(error){

            handleError(error);

        }

    }

    const notificationFunction = async (id, notificationId) => {

        navigate(`/medical-support-consultation-queue/${id}`);

        setNotificationsVisible(false);

        notificationId

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/medical-support/setNotificationReadByNotificationId/${notificationId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                try{

                    const userId = userObject.id;
        
                    const response = await axios.get(`http://localhost:7777/api/v1/medical-support/fetchNotificationByUserId/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    })
        
                    if ( response.status === 200 ){
        
                        let notificationData = response.data;

                        // Sort notifications by timeStamp in descending order (latest first)
                        notificationData.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
            
                        setNotificationArray(notificationData);
        
                    }
        
                }catch(error){
        
                    handleError(error);
        
                }

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

    }, [access_token]);

    const pathName = window.location.pathname;

    useEffect(() => {

        const unreadNotifications = notificationArray.filter(notification => {
            return !notification.read
        });

        setNotificationCount(unreadNotifications.length);

    }, [notificationArray, pathName]);

    return (

        <div className="h-16 flex items-center justify-between border-[1px] border-gray-800 fixed top-0 left-0 right-0 bg-[#0F172A]">

            <ToastContainer />

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

                    <div className="absolute top-[-10px] right-[-7px]">

                        {/* {notif} */}

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

                        <div className="absolute border-2 border-gray-800 text-white w-[300px] rounded-lg top-12 left-[-20px] bg-[#0F172A]">

                            <div className="py-3 px-2 mx-2 text-xl border-b-[1px] border-gray-800">

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
                                                    className={`py-3 mx-2 px-2 text-base rounded-lg ${colorChange(notification.read)} transition-all duration-200 cursor-pointer hover:opacity-60 active:opacity-40`}
                                                    onClick={(id, notificationid) => notificationFunction(notification.applicationId, notification.id)}    
                                                >

                                                    <div className="">

                                                        {notification.message}

                                                    </div>

                                                    <div className="text-xs text-gray-400">

                                                        {new Date(notification.timeStamp).toLocaleString()}

                                                    </div>

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


        </div>

    )

}

export default NavBarUser