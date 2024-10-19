import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import NavBarUser from '../NavBar/NavBarUser';
import LeftNavBar from '../NavBar/LeftNavBar';
import { IoRefreshCircleOutline } from 'react-icons/io5';
import { FiRefreshCw } from 'react-icons/fi';

const UserPage = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

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

            const response = await axios.get('http://localhost:7777/api/v1/user/fetchUnlockedUsers', {
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

            {role === roles.admin && (

                <>

                    <NavBarUser 
                        userObject = {userObject} 
                    />

                    <LeftNavBar />

                    <div className=" pt-16 pl-[457px]">

                        <div className="mr-56 flex mt-20 relative">

                            <FiRefreshCw 
                                className={`text-xl opacity-60 absolute right-20 top-[-40px] cursor-pointer ${refreshButtonStyle}`}
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

            )}

        
            {role === roles.frontDesk && (

            <>

                <NavBarUser 
                    userObject = {userObject} 
                />

                <LeftNavBar />

                <div className=" pt-16 pl-[457px]">

                    Hi

                </div>

            </>

            )}

            {role === roles.medicalSupport && (

            <div className="">

                This is Medical Support User

            </div>

            )}

            {role === roles.teleSupport && (

            <div className="">

                This is Tele Support User

            </div>

            )}  

            {role === roles.pharmacyCare && (

            <div className="">

                This is Pharmacy Care User

            </div>

            )}

            {role === roles.otCoordination && (

            <div className="">

                This is Ot Coordination User

            </div>

            )}

            {role === roles.diagnosticsCenter && (

            <div className="">

                This is Diagnostics Center User

            </div>

            )}

            {role === roles.transportTeam && (

            <div className="">

                This is Transport Team User

            </div>

            )}

        </>

    )

}

export default UserPage