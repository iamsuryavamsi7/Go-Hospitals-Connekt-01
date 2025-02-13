import React, { useEffect, useState } from 'react'
import { LuPersonStanding } from 'react-icons/lu'
import { MdAddBox, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Cookies from 'js-cookie'
import axios from 'axios'
import { ImCancelCircle } from 'react-icons/im'
import { useDispatch } from 'react-redux'
import { closeNavBarSearch } from '../../../ReduxToolkit/Slices/frontDeskNavBarSlice'
import { FiUserPlus } from 'react-icons/fi'

const AdminManagement04 = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    // State to store mobile numbers data
    const [fetchedUsersData, setFetchedUsersData] = useState([]);

    // State to toggle mobile numbers
    const [addUserDataActivated, setAddUserDataActivated] = useState(false);

    // Function to fetch mobile numbers data and set data
    const fetchUsersData = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchUsersData`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(responseData);

                setFetchedUsersData(responseData);

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to toggle add number data
    const toggleAddMobileNumberFunction = () => {

        if ( addUserDataActivated ) {

            setAddUserDataActivated(false);

        }else {

            setAddUserDataActivated(true);

        }

    }

    // State to store add mobile number data
    const [addUserData, setAddUserData] = useState({
        name: ``,
        password: ``,
        role: `FRONTDESK`
    });

    // Function to run when the add mobile number is submitted
    const addUserName = async (e) => {

        e.preventDefault();

        if ( addUserData.name.trim() !== null && addUserData.name.trim() !== `` && addUserData.password.trim() !== null && addUserData.password.trim() !== `` && addUserData.role.trim() !== null && addUserData.role.trim() !== `` ){

            const formData = new FormData();

            formData.append("username", addUserData.name.trim());
            formData.append("password", addUserData.password.trim());
            formData.append("role", addUserData.role.trim());

            try{

                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/admin/addUserName`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                if ( response.status === 200 ){

                    const booleanValue = response.data;

                    if (booleanValue){

                        fetchUsersData();

                        setAddUserDataActivated(false);

                        setAddUserData({
                            name: ``,
                            password: ``,
                            role: ``
                        })

                    }

                }

            }catch(error){

                console.error(error);

            }

        }

    } 

    // Function to delete mobile number by id 
    const deleteMobileNumberById = async (e, id) => {
        
        try{

            const response = await axios.delete(`${goHospitalsAPIBaseURL}/api/v1/admin/deleteUserByIdPermanent/${id}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const booleanValue = response.data;

                if (booleanValue){

                    fetchUsersData();

                }

            }

        }catch(error){

            console.error(error);

        }

    }

    // State to toggle edit mobile screen
    const [editMobileNumberActivated, setEditMobileNumberActivated] = useState(false);

    // State to store the temporory mobile number data
    const [tempororyUserData, setTempororyUserData] = useState({
        id: ``,
        username: ``,
        password: ``,
        role: ``
    });

    // Function to run when the edit mobile is activated
    const editMobileNumberActivateFunction = async (e, id) => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchUserDataById/${id}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(responseData);

                setTempororyUserData({
                    id: responseData.id,
                    username: responseData.username,
                    password: '',
                    role: responseData.role
                })

                setEditMobileNumberActivated(true);

            }

        }catch(error){

            console.error(error);

        }

    }
    
    // Function to run when edit mobile form is submitted
    const editMobileNumberFunction = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        if ( tempororyUserData.username.trim() != null && tempororyUserData.username.trim() !== '' ){

            formData.append("username", tempororyUserData.username.trim());

        }

        if ( tempororyUserData.password.trim() != null && tempororyUserData.password.trim() !== ''  ) {

            formData.append("password", tempororyUserData.password.trim());

        }

        if ( tempororyUserData.role.trim() != null && tempororyUserData.role.trim() !== '' ){

            formData.append("role", tempororyUserData.role.trim());

        }

        try{


            const response = await axios.put(`${goHospitalsAPIBaseURL}/api/v1/admin/editUserDataById/${tempororyUserData.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });


            if ( response.status === 200 ){

                const booleanValue = response.data;

                if ( booleanValue ){

                    fetchUsersData();

                    setTempororyUserData({
                        id: ``,
                        username: ``,
                        password: ``,
                        role: ``
                    });

                    setEditMobileNumberActivated(false);

                }

            }

        }catch(error){

            console.error(error);

        }

    }

    // useEffect hook to run when the page is mounted
    useEffect(() => {

        if ( access_token ){

            fetchUsersData();

        }else {

            window.open(goHospitalsFRONTENDBASEURL, '_self');

        }

    }, []);

    const dispatch = useDispatch();

    const newPatientOnBoardFronDeskFunction = () => {

        dispatch(closeNavBarSearch());

    }

    return (

        <div 
            className="mx-20 mb-20 w-[50%]"
            onClick={newPatientOnBoardFronDeskFunction}    
        >

            <div className="flex items-center">

                <div className="mr-2 text-xl ml-5">

                    <FiUserPlus />

                </div>

                <div className="">Add User</div>

            </div>

            <div className="mt-5">

                <table
                    className='w-full'
                >

                    <thead>

                        <tr
                            className='h-[55px] border-b-[1px] border-gray-700 text-left'
                        >

                            <th
                                className='pl-5'
                            >S.No</th>
                            <th
                                className=''
                            >Username</th>
                            <th>Role</th>

                        </tr>

                    </thead>

                    <tbody>

                        { fetchedUsersData.length > 0 ? fetchedUsersData.map((fetchedUser, index) => (
                            
                                <tr
                                    className='h-[55px] border-b-[1px] border-gray-700'
                                    key={index}
                                >

                                    <td
                                        className='pl-5'
                                    >{index + 1}</td>
                                    <td>{fetchedUser.username}</td>
                                    <td>
                                        
                                        {fetchedUser.role === 'FRONTDESK' && 'Front Office'}
                                    
                                        {fetchedUser.role === 'MEDICALSUPPORT' && 'Nurse'}

                                        {fetchedUser.role === 'TELESUPPORT' && 'Counsellor'}

                                        {fetchedUser.role === 'PHARMACYCARE' && 'Pharmacy'}
                                    </td>
                                    <td>
                                        <MdOutlineEdit 
                                            className='text-base cursor-pointer mr-5'
                                            onClick={(e, id) => editMobileNumberActivateFunction(e, fetchedUser.id)}
                                        />

                                    </td>
                                    <td>

                                        <RiDeleteBin5Line 
                                            className='text-base cursor-pointer'
                                            onClick={(e, id) => deleteMobileNumberById(e, fetchedUser.id)}
                                        />

                                    </td>

                                </tr>

                        )) : (

                                <tr
                                    className='h-[55px] border-b-[1px] border-gray-700'
                                >

                                    <td
                                        className='pl-5'
                                    >No Data</td>
                                    <td
                                        className='max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pr-5'
                                    >No Data</td>
                                    <td>No Data</td>
                                    <td>
                                        <MdOutlineEdit 
                                            className='text-base cursor-pointer mr-5'
                                        />

                                    </td>
                                    <td>

                                        <RiDeleteBin5Line 
                                            className='text-base cursor-pointer'
                                        />

                                    </td>

                                </tr>

                        )}

                    </tbody>

                </table>

            </div>

            <div className="">
            
                <div 
                    className="my-3 text-sm items-center inline-flex cursor-pointer hover:opacity-60 active:opacity-40"
                    onClick={toggleAddMobileNumberFunction}
                >

                    Add User
                    <MdAddBox 
                        className='ml-3 text-base'
                    />

                </div>

                {addUserDataActivated && (

                    <div className="">

                        <form
                            className='flex items-end space-x-5'
                            onSubmit={addUserName}
                        >

                            <div className="">

                                <label
                                    className='text-xs'
                                > Username <span className='text-red-400'>*</span></label><br />
                                <input 
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    value={addUserData.name}
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setAddUserData({
                                            ...addUserData,
                                            name: value
                                        });

                                    }}
                                />

                            </div>

                            <div className="">

                                <label
                                    className='text-xs'
                                > Password <span className='text-red-400'>*</span></label><br />
                                <input 
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    value={addUserData.password}
                                    type='password'
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setAddUserData({
                                            ...addUserData,
                                            password: value
                                        });

                                    }}
                                />

                            </div>

                            <div className="">

                                <label
                                    className='text-xs'
                                > Role <span className='text-red-400'>*</span></label><br />
                                <select 
                                    className='bg-[#0d1117] text-white text-sm border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mt-2'
                                    value={addUserData.role}
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setAddUserData({
                                            ...addUserData,
                                            role: value 
                                        });

                                    }}
                                >

                                    <option value={'FRONTDESK'}>Front Office</option>
                                    <option value={'MEDICALSUPPORT'}>Nurse</option>
                                    <option value={'TELESUPPORT'}>Counsellor</option>
                                    <option value={'PHARMACYCARE'}>Pharmacy</option>

                                </select>

                            </div>

                            <button
                                type='submit'
                                className='hover:text-[#238636] px-2 py-1 rounded-md text-base cursor-pointer transition-all'
                            >Add</button>

                        </form>

                    </div>

                )}

                {editMobileNumberActivated && (
    
                    <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center backdrop-blur-[2px]">
    
                        <form
                            className='text-left bg-[#151b23] border-[#3d444d] border-2 px-5 py-5 rounded-xl mb-5 relative'
                            onSubmit={editMobileNumberFunction}
                        >
                            <ImCancelCircle 
                                className='absolute top-3 right-3 cursor-pointer'
                                onClick={() => {
    
                                    setEditMobileNumberActivated(false);
    
                                }}
                            />
    
                            <label
                                className='text-sm'
                            > Name <span className='text-red-400'>*</span></label><br />

                            <input 
                                type='text'
                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600 focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                value={tempororyUserData.username}
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setTempororyUserData({
                                            ...tempororyUserData,
                                            username: value
                                        })

                                    }}
                            /><br /><br />

                            <div className="mb-5">

                                <label
                                    className='text-xs'
                                > Password <span className='text-red-400'>*</span></label><br />

                                <input 
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    value={tempororyUserData.password}
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setTempororyUserData({
                                            ...tempororyUserData,
                                            password: value
                                        })

                                    }}
                                />

                            </div>

                            <div className="mb-10">

                                <label
                                    className='text-xs'
                                > Role <span className='text-red-400'>*</span></label><br />
                                <select 
                                    className='bg-[#0d1117] text-white text-sm border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mt-2'
                                    value={tempororyUserData.role}
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        console.log(value);

                                        setTempororyUserData({
                                            ...tempororyUserData,
                                            role: value 
                                        });

                                    }}
                                >

                                    <option value={'FRONTDESK'}>Front Office</option>
                                    <option value={'MEDICALSUPPORT'}>Nurse</option>
                                    <option value={'TELESUPPORT'}>Counsellor</option>
                                    <option value={'PHARMACYCARE'}>Pharmacy</option>

                                </select>

                            </div>
    
                            <button
                                className='bg-[#238636] w-full rounded-lg leading-10 hover:cursor-pointer'
                                type='submit'
                            >
    
                                Update
    
                            </button>
    
                        </form>
    
                    </div>
    
                )}

            </div>

        </div>

    )

}

export default AdminManagement04