import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { FiRefreshCw } from 'react-icons/fi';

const NewApprovals = () => {

// JWT Token
const access_token = Cookies.get('access_token');

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState('');

    const [lockedUsers, setLockedUsers] = useState([]);

    const [refreshButtonStyle, setRefreshButtonStyle] = useState(null);

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

    // Function to fetch LockedUsers
    const lockedUsersFunction = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/admin/fetchLockedUsers', {
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

            const response = await axios.get('http://localhost:7777/api/v1/user/deleteUserRequest/' + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                lockedUsersFunction();

            }

        }catch(error){

            handleError(error);

        }
    
    }

    // Function to rejectUsers
    const acceptUserFunction = async (e, id) => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/user/acceptUserRequest/' + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

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

    return (

        <>

            <div className="">

                <div className="mr-56 mt-10 flex relative">

                    <FiRefreshCw 
                        className={`text-xl opacity-60 absolute right-36 top-[-20px] cursor-pointer ${refreshButtonStyle}`}
                        onClick={refreshButtonFunction}
                    />

                    <table
                        className='mx-10 w-full text-left'
                    >

                        <thead>

                            <tr
                                className='h-[60px]'
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
                                        className='leading-10 border-b-[.5px] border-gray-800 text-gray-400'
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
                                className='leading-10 border-b-[.5px] border-gray-800'
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

        </>

    )

}

export default NewApprovals