import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { MdAddBox, MdOutlineEdit } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { ImCancelCircle } from 'react-icons/im';
import AdminManagement02 from './MinorComponents/AdminManagement02';

const AdminManagement = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState('');

    const [addDepartmentIsVisible, setAddDepartmentIsVisible] = useState(false);

    const [departmentData, setDepartmentData] = useState([]);

    const [departmentName, setDepartmentName] = useState('');

    const [editDepartmentVisible, setEditDepartmentVisible] = useState(false);

    const [editDepartmentData, setEditDepartmentData] = useState({
        departmentId: '',
        departmentName: '',
    });

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

    const fetchDepartmentName = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/admin/getDepartments', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const departmentData = response.data;

                setDepartmentData(departmentData);                

            }

        }catch(error){

            handleError(error);

        }

    }

    const AddDepartmentForm = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("departmentName", departmentName);

        try{

            const response = await axios.post('http://localhost:7777/api/v1/admin/addDepartment', formData, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                fetchDepartmentName();       
                
                setAddDepartmentIsVisible(false);

            }

        }catch(error){

            handleError(error);

        }

    }

    const departmentDeleteFunction = async (e, id) => { 

        try{

            const response = await axios.delete('http://localhost:7777/api/v1/admin/deleteDepartmentById/' + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                fetchDepartmentName();       
                
            }

        }catch(error){

            handleError(error);

        }

    }

    const activateAddManagement = () => {

        if ( addDepartmentIsVisible ){

            setAddDepartmentIsVisible(false);

        } else {

            setAddDepartmentIsVisible(true);

        }

    }

    const departmentEditFunction = async (e) => {

        e.preventDefault();

        try{

            const response = await axios.put('http://localhost:7777/api/v1/admin/editDepartmentById/' + editDepartmentData.departmentId,{
                departmentName: editDepartmentData.departmentName
            } ,{
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const responseData = response.data;

                setEditDepartmentData({
                    departmentId: '',
                    departmentName: '',
                });

                setEditDepartmentVisible(false);

                fetchDepartmentName();

            }

        }catch(error){

            handleError(error);

        }

    }

    const editButtonFunction = (e, id) => {

        const departmentId = id;

        const fetchDepartmentData = async () => {

            try{

                const response = await axios.get('http://localhost:7777/api/v1/admin/fetchDepartmentDataById/' + departmentId, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    const departmentData = response.data;

                    setEditDepartmentData({
                        departmentId: departmentData.id,
                        departmentName: departmentData.departmentName
                    });

                }

            }catch(error){

                handleError(error);

            }

        }

        fetchDepartmentData();

        if ( editDepartmentVisible ){

            setEditDepartmentVisible(false);

        } else {

            setEditDepartmentVisible(true)

        }

    } 

    useEffect(() => {

        if ( access_token ){

            fetchUserObject(); 

            fetchDepartmentName();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    return (

        <>

            {role === admin && (

                <>

                    <div className=""> 

                        {editDepartmentVisible && (

                            <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center">

                                <form
                                    className='text-left bg-[#151b23] border-[#3d444d] border-2 px-5 py-5 rounded-xl mb-5 relative'
                                    onSubmit={(e) => departmentEditFunction(e)}
                                >
                                    <ImCancelCircle 
                                        className='absolute top-3 right-3 cursor-pointer'
                                        onClick={() => {

                                            setEditDepartmentVisible(false);

                                        }}
                                    />

                                    <label
                                        className='text-sm'
                                    > Department Name <span className='text-red-400'>*</span></label><br />
                                    <input 
                                        type='text'
                                        className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600 focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                        value={editDepartmentData.departmentName}
                                        name='departmentName'
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setEditDepartmentData({...editDepartmentData, departmentName: value});

                                        }}
                                    /><br /><br />

                                    <button
                                        className='bg-[#238636] w-full rounded-lg leading-10 hover:cursor-pointer'
                                        type='submit'
                                    >

                                        Update

                                    </button>

                                </form>

                            </div>

                        )}

                        <div className="w-[50%] mx-20">

                            <div className="text-lg text-center mb-5">

                                Departments

                            </div>

                            <table
                                className='text-left w-full'
                            >

                                <thead>

                                    <tr
                                        className='h-[55px] border-b-[1px] border-gray-700'
                                    >

                                        <th
                                            className='px-5'
                                        >S.No</th>
                                        <th>Department Name</th>

                                    </tr>

                                </thead>

                                {departmentData && departmentData.length === 0 ? (

                                    <tbody>

                                        <tr
                                            className='h-[55px] border-b-[1px] border-gray-700'
                                        >

                                            <td
                                                className='px-5'
                                            >No Data</td>
                                            <td>No Data</td>

                                        </tr>

                                    </tbody>
                                ) : (

                                    <tbody>

                                        {departmentData.map((department, index) => {

                                            return (

                                        <tr
                                            key={department.id}
                                            className='h-[55px] border-b-[1px] border-gray-700'
                                        >

                                            <td
                                                className='px-5'
                                            >{index + 1}</td>
                                            <td>{department.departmentName}</td>
                                            <td>

                                                <MdOutlineEdit 
                                                    className='text-base cursor-pointer mr-5'
                                                    onClick={(e, id) => editButtonFunction(e, department.id)}
                                                />

                                            </td>
                                            <td>

                                                <RiDeleteBin5Line 
                                                    className='text-base cursor-pointer'
                                                    onClick={(e, id) => departmentDeleteFunction(e, department.id)}
                                                />

                                            </td>

                                        </tr>

                                        )})}

                                    </tbody>

                                )}

                            </table>

                            <div className="">

                                <div 
                                    className="my-3 text-sm items-center inline-flex cursor-pointer hover:opacity-60 active:opacity-40"
                                    onClick={activateAddManagement}
                                >

                                    Add Department 
                                    <MdAddBox 
                                        className='ml-3 text-balg'
                                    />

                                </div>

                                {addDepartmentIsVisible && (

                                    <div className="top-10">

                                        <form
                                            className='flex items-end space-x-5'
                                            onSubmit={(e) => AddDepartmentForm(e)}
                                        >

                                            <div className="">

                                                <label
                                                    className='text-xs'
                                                >Department Name <span className='text-red-400'>*</span></label><br />
                                                <input 
                                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                                    value={departmentName}
                                                    name='departmentName'
                                                    onChange={(e) => {

                                                        const value = e.target.value;

                                                        setDepartmentName(value);

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

                            </div>
                            
                        </div>

                    </div>

                    <AdminManagement02 />

                </>

            )}

        </>

    )

}

export default AdminManagement