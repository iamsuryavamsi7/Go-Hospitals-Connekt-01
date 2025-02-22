import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { FiRefreshCw } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { closeNavBarSearch } from '../../ReduxToolkit/Slices/frontDeskNavBarSlice';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const NewApprovals = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState('');

    const [lockedUsers, setLockedUsers] = useState([]);

    const [refreshButtonStyle, setRefreshButtonStyle] = useState(null);

    const admin = 'ADMIN';

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

            const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/user/fetchUserObject`, formData, {
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

    // Function to fetch LockedUsers
    const lockedUsersFunction = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchLockedUsers`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const lockedUsers = response.data;

                setLockedUsers(lockedUsers);

                return true;

            }

        }catch(error){

            handleError(error);

        }

    }

    //Function for refreshButton
    const refreshButtonFunction = async () => {

        setRefreshButtonStyle(`opacity-[1] animate-spin`);

        const response = await lockedUsersFunction();

        if (response) {
            
            setTimeout(() => {
                setRefreshButtonStyle(null);
            }, 2000);
        
        } else {
        
            setRefreshButtonStyle(null); 
        
        }

    }

    // Function to rejectUsers
    const rejectUserFunction = async (e, id) => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/deleteUserRequest/` + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                toast.success("User Rejected", {
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
                        backgroundColor: 'red' // Tailwind bg-green-400
                    },
                    position: 'top-right'
                }); 

                lockedUsersFunction();

            }

        }catch(error){

            handleError(error);

        }
    
    }

    // Function to acceptUsers
    const acceptUserFunction = async (e, id) => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/acceptUserRequest/` + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                toast.success("User Approved", {
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
                    position: 'top-right'
                });

                lockedUsersFunction();

            }

        }catch(error){

            handleError(error);

        }
    
    }

    useEffect(() => {

        if ( access_token ){

            fetchUserObject(); 

            lockedUsersFunction();  

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    const dispatch = useDispatch();

    const newPatientOnBoardFronDeskFunction = () => {

        dispatch(closeNavBarSearch());

    }

    const [stompClient, setStompClient] = useState(null);

    // Connect to websockets when the component mounts with useEffect hook
    useEffect(() => {

        const sock = new SockJS(`${goHospitalsAPIBaseURL}/go-hospitals-websocket`);
        const client = Stomp.over(() => sock);

        setStompClient(client);

        client.connect(
            {},
            () => {

                client.subscribe(`/common/commonFunction`, (message) => {

                    const messageBody = JSON.parse(message.body);

                    if ( messageBody.notificationType === 'RefreshAdminApprovals' ){

                        lockedUsersFunction();

                    }

                });
        
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

            <Toaster />

            {role === admin && (

                <div 
                    className=""
                    onClick={newPatientOnBoardFronDeskFunction}
                >

                    <div className="text-lg mb-5 mx-20">

                        New Approvals

                    </div>

                    <div className="mt-10 block relative z-10">

                        {/* <FiRefreshCw 
                            className={`text-xl opacity-60 absolute right-36 top-[-20px] cursor-pointer ${refreshButtonStyle}`}
                            onClick={refreshButtonFunction}
                        /> */}

                        <table
                            className='mx-10 w-full text-left z-10'
                        >

                            <thead>

                                <tr
                                    className='h-[60px] border-b-[.5px] border-gray-800'
                                >

                                    <th
                                        className='px-12'
                                    >Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th
                                        className='text-center'
                                    >Take Action</th>

                                </tr>

                            </thead>

                            {lockedUsers && lockedUsers.length > 0 ? (

                                <tbody>

                                    {lockedUsers.map((lockedUser) => {

                                        return (

                                            <tr
                                            className='leading-10 border-b-[.5px] border-gray-800 text-gray-400 z-10'
                                            key={lockedUser.id}
                                            >

                                                <td
                                                    className='px-12'
                                                >{lockedUser.firstName} {lockedUser.lastName}</td>
                                                <td>{lockedUser.email}</td>
                                                <td>{lockedUser.role}</td>
                                                <td
                                                    className='space-x-10 text-center'
                                                >

                                                    <button
                                                        className='hover:text-green-400 transition-all'
                                                        onClick={(e, id) => acceptUserFunction(e, lockedUser.id)}
                                                    >

                                                        Accept

                                                    </button>

                                                    <button
                                                        className='hover:text-red-400 transition-all'
                                                        onClick={(e, id) => rejectUserFunction(e, lockedUser.id)}
                                                    >

                                                        Reject

                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                                ) : (

                                <tbody>

                                    <tr
                                    className='leading-10 border-b-[.5px] border-gray-800 text-gray-400'
                                    >

                                        <td
                                            className='px-12'
                                        > No Data </td>
                                        <td> No Data  </td>
                                        <td> No Data </td>
                                        <td
                                            className='space-x-10 text-center'
                                        >

                                            <button
                                                className='hover:text-green-400 transition-all'
                                            >

                                                No Data 

                                            </button>

                                            <button
                                                className='hover:text-red-400 transition-all'
                                            >

                                                No Data 

                                            </button>

                                        </td>

                                    </tr>

                                </tbody>

                                )}

                        </table>

                    </div>

                </div>

            )}

        </>

    )

}

export default NewApprovals