import React, { useEffect, useState } from 'react'
import { LuPersonStanding } from 'react-icons/lu'
import { MdAddBox, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Cookies from 'js-cookie'
import axios from 'axios'
import { ImCancelCircle } from 'react-icons/im'

const AdminManagement03 = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    // State to store mobile numbers data
    const [mobileNumbers, setMobileNumbers] = useState([]);

    // State to toggle mobile numbers
    const [addMobileNumberActivated, setAddMobileNumberActivated] = useState(false);

    // Function to fetch mobile numbers data and set data
    const fetchNumbers = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchNumbers`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const mobileNumbersData = response.data;

                console.log(mobileNumbersData);

                setMobileNumbers(mobileNumbersData);

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to toggle add number data
    const toggleAddMobileNumberFunction = () => {

        if ( addMobileNumberActivated ) {

            setAddMobileNumberActivated(false);

        }else {

            setAddMobileNumberActivated(true);

        }

    }

    // State to store add mobile number data
    const [addMobileNumberData, setAddMobileNumberData] = useState({
        name: ``,
        mobileNumber: ``
    });

    // Function to run when the add mobile number is submitted
    const addMobileNumberFunction = async (e) => {

        e.preventDefault();

        if ( addMobileNumberData.name.trim() !== null && addMobileNumberData.name.trim() !== `` && addMobileNumberData.mobileNumber.trim() !== null && addMobileNumberData.mobileNumber.trim() !== `` ){

            const formData = new FormData();

            formData.append("name", addMobileNumberData.name.trim());
            formData.append("mobileNumber", addMobileNumberData.mobileNumber.trim());

            try{

                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/admin/addMobileNumber`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                if ( response.status === 200 ){

                    const booleanValue = response.data;

                    if (booleanValue){

                        fetchNumbers();

                        setAddMobileNumberActivated(false);

                        setAddMobileNumberData({
                            name: ``,
                            mobileNumber: ``
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

            const response = await axios.delete(`${goHospitalsAPIBaseURL}/api/v1/admin/deleteMobileNumberById/${id}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const booleanValue = response.data;

                if (booleanValue){

                    fetchNumbers();

                }

            }

        }catch(error){

            console.error(error);

        }

    }

    // State to toggle edit mobile screen
    const [editMobileNumberActivated, setEditMobileNumberActivated] = useState(false);

    // State to store the temporory mobile number data
    const [tempororyMobileNumberData, setTempororyMobileNumberData] = useState({
        id: ``,
        name: ``,
        mobileNumber: ``
    });

    // Function to run when the edit mobile is activated
    const editMobileNumberActivateFunction = async (e, id) => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchMobileNumberById/${id}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                setTempororyMobileNumberData({
                    id: responseData.id,
                    name: responseData.name,
                    mobileNumber: responseData.mobileNumber
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

        if (tempororyMobileNumberData.name.trim() !== null && tempororyMobileNumberData.name.trim() !== `` && tempororyMobileNumberData.mobileNumber.trim() !== null && tempororyMobileNumberData.mobileNumber.trim() !== `` ){

            const formData = new FormData();

            formData.append("name", tempororyMobileNumberData.name.trim());
            formData.append("mobileNumber", tempororyMobileNumberData.mobileNumber.trim());

            try{


                const response = await axios.put(`${goHospitalsAPIBaseURL}/api/v1/admin/editMobileNumberById/${tempororyMobileNumberData.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });


                if ( response.status === 200 ){

                    const booleanValue = response.data;

                    if ( booleanValue ){

                        fetchNumbers();

                        setTempororyMobileNumberData({
                            id: ``,
                            name: ``,
                            mobileNumber: ``
                        });

                        setEditMobileNumberActivated(false);

                    }

                }

            }catch(error){

                console.error(error);

            }

        }else {

            console.log(`Its having some issues`);

        }

    }

    // useEffect hook to run when the page is mounted
    useEffect(() => {

        if ( access_token ){

            fetchNumbers();

        }else {

            window.open(goHospitalsFRONTENDBASEURL, '_self');

        }

    }, []);

    return (

        <div className="mx-20 mb-20 w-[50%]">

            <div className="flex items-center">

                <div className="mr-2 text-2xl ml-3">

                    <LuPersonStanding />

                </div>

                <div className="">OT Members</div>

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
                            >Name</th>
                            <th>Mobile Number</th>

                        </tr>

                    </thead>

                    <tbody>

                        { mobileNumbers.length > 0 ? mobileNumbers.map((mobileNum, index) => (
                            
                                <tr
                                    className='h-[55px] border-b-[1px] border-gray-700'
                                    key={index}
                                >

                                    <td
                                        className='pl-5'
                                    >{index + 1}</td>
                                    <td>{mobileNum.name}</td>
                                    <td
                                        className='max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pr-5'
                                    >{mobileNum.mobileNumber}</td>
                                    <td>
                                        <MdOutlineEdit 
                                            className='text-base cursor-pointer mr-5'
                                            onClick={(e, id) => editMobileNumberActivateFunction(e, mobileNum.id)}
                                        />

                                    </td>
                                    <td>

                                        <RiDeleteBin5Line 
                                            className='text-base cursor-pointer'
                                            onClick={(e, id) => deleteMobileNumberById(e, mobileNum.id)}
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

                    Add Number 
                    <MdAddBox 
                        className='ml-3 text-base'
                    />

                </div>

                {addMobileNumberActivated && (

                    <div className="">

                        <form
                            className='flex items-end space-x-5'
                            onSubmit={addMobileNumberFunction}
                        >

                            <div className="">

                                <label
                                    className='text-xs'
                                > Name <span className='text-red-400'>*</span></label><br />
                                <input 
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    value={addMobileNumberData.name}
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setAddMobileNumberData({
                                            ...addMobileNumberData,
                                            name: value
                                        });

                                    }}
                                />

                            </div>

                            <div className="">

                                <label
                                    className='text-xs'
                                > Mobile Number <span className='text-red-400'>*</span></label><br />
                                <input 
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    value={addMobileNumberData.mobileNumber}
                                    maxLength={10}
                                    minLength={10}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setAddMobileNumberData({
                                            ...addMobileNumberData,
                                            mobileNumber: value
                                        });

                                    }}
                                />

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
    
                                    setEditDoctorVisible(false);
    
                                }}
                            />
    
                            <label
                                className='text-sm'
                            > Name <span className='text-red-400'>*</span></label><br />

                            <input 
                                type='text'
                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600 focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                value={tempororyMobileNumberData.name}
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setTempororyMobileNumberData({
                                            ...tempororyMobileNumberData,
                                            name: value
                                        })

                                    }}
                            /><br /><br />

                            <div className="mb-5">

                                <label
                                    className='text-xs'
                                > Mobile Number <span className='text-red-400'>*</span></label><br />

                                <input 
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    maxLength={10}
                                    minLength={10}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={tempororyMobileNumberData.mobileNumber}
                                    onChange={(e) => {

                                        const value = e.target.value;

                                        setTempororyMobileNumberData({
                                            ...tempororyMobileNumberData,
                                            mobileNumber: value
                                        })

                                    }}
                                />

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

export default AdminManagement03