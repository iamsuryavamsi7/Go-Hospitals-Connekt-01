import React, { useEffect, useState } from 'react'
import { MdAddBox, MdOutlineEdit } from 'react-icons/md';
import { RiDeleteBin5Line } from 'react-icons/ri';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ImCancelCircle } from 'react-icons/im';

const AdminManagement02 = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

    const [doctorsData, setDoctorsData] = useState([]);

    const [addDoctorIsVisible, setAddDoctorIsVisible] = useState(false);

    const [addDoctorData, setAddDoctorData] = useState('');

    const [editDoctorData, setEditDoctorData] = useState({
        doctorId: '',
        doctorName: '',
    });

    const [editDepartmentId, setEditDepartmentId] = useState(null);

    const [editDoctorVisible, setEditDoctorVisible] = useState(false);

    const [departmentData, setDepartmentData] = useState([]);

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

    const fetchDoctors = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/admin/getDoctors', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const departmentData = response.data;

                console.log(departmentData);

                setDoctorsData(departmentData);                

            }

        }catch(error){

            handleError(error);

        }

    }

    const activateAddDoctor = () => {

        console.log("activeAddDoctor");

        if ( addDoctorIsVisible ){

            setAddDoctorIsVisible(false);

        }else {

            setAddDoctorIsVisible(true);

        }

    }

    const AddDoctorForm = async (e) => {

        e.preventDefault();

        console.log("Add Department Form");

        try{

            const response = await axios.post('http://localhost:7777/api/v1/admin/addDoctor',{
                doctorName: addDoctorData
            } , {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const departmentData = response.data;

                console.log(departmentData);

                setAddDoctorData('');

                setAddDoctorIsVisible(false);

                fetchDoctors();                

            }

        }catch(error){

            handleError(error);

        }

    }

    const deleteDoctorFunction = async (e, id) => {

        try{

            const response = await axios.delete('http://localhost:7777/api/v1/admin/deleteDoctor/' + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const departmentData = response.data;

                console.log(departmentData);

                fetchDoctors();                

            }

        }catch(error){

            handleError(error);

        }

    }

    const editDoctorFunction = (e, id) => {

        const doctorId = id

        console.log(doctorId);

        const fetchDoctor = async () => {

            try{

                const response = await axios.get('http://localhost:7777/api/v1/admin/getDoctor/' + doctorId, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    const doctorData = response.data; 

                    console.log(doctorData);

                    setEditDoctorData({
                        doctorId: doctorData.id,
                        doctorName: doctorData.doctorName
                    })

                }

            }catch(error){

                handleError(error);

            }

        }

        fetchDoctor();

        const fetchDepartments = async () => {

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

        fetchDepartments();

        setEditDoctorVisible(true);

    }

    const doctorEditFunction = async (e) => {

        e.preventDefault();

        try{

            const response = await axios.put(`http://localhost:7777/api/v1/admin/updateDoctor/${editDoctorData.doctorId}/updateDepartment/${editDepartmentId}`, {
                doctorName: editDoctorData.doctorName
            }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                fetchDoctors();

                setEditDoctorVisible(false);

            }

        }catch(error){

            handleError(error);

        }

    }

    useEffect(() => {

        if ( access_token ){

            fetchDoctors();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    return (

        <div className="my-10 w-[70%]">

            {editDoctorVisible && (

                <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center">

                    <form
                        className='text-left bg-[#151b23] border-[#3d444d] border-2 px-5 py-5 rounded-xl mb-5 relative'
                        onSubmit={(e) => doctorEditFunction(e)}
                    >
                        <ImCancelCircle 
                            className='absolute top-3 right-3 cursor-pointer'
                            onClick={() => {

                                setEditDoctorVisible(false);

                            }}
                        />

                        <label
                            className='text-sm'
                        > Doctor Name <span className='text-red-400'>*</span></label><br />
                        <input 
                            type='text'
                            className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600 focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                            value={editDoctorData.doctorName}
                            name='doctorName'
                            onChange={(e) => {

                                const value = e.target.value;

                                setEditDoctorData({...editDoctorData, doctorName : value});

                            }}
                        /><br /><br />

                        <div className="">

                        <label>Select Department</label><br />
                        <select
                            className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mb-7'
                            onChange={(e) => {

                                const value = e.target.value;

                                setEditDepartmentId(value);

                            }}
                        >

                            <option>Select Department</option>
                            
                            {departmentData.map((department, index) => (

                                <option 
                                    key={index}
                                    value={department.id}
                                >{department.departmentName}</option>

                            ))}

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

            <div className="text-center text-xl">

                Doctors

            </div>

            <div className="mx-20 mt-5">

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
                            <th>Doctor Name</th>
                            <th>Doctor Department</th>

                        </tr>

                    </thead>

                    {doctorsData && doctorsData.length === 0 ? (

                        <tbody>

                            <tr
                                className='h-[55px] border-b-[1px] border-gray-700'
                            >

                                <td
                                    className='px-5'
                                >No Data</td>
                                <td>No Data</td>
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

                        </tbody>
                    ) : (

                        <tbody>

                            {doctorsData.map((doctor, index) => {

                                return (

                                    <tr
                                        key={doctor.id}
                                        className='h-[55px] border-b-[1px] border-gray-700'
                                    >

                                        <td
                                            className='px-5'
                                        >{index + 1}</td>
                                        <td>{doctor.doctorName}</td>
                                        <td>{doctor.doctorDepartment}</td>
                                        <td>

                                            <MdOutlineEdit 
                                                className='text-base cursor-pointer mr-5'
                                                onClick={(e, id) => editDoctorFunction(e, doctor.id)}
                                            />

                                        </td>
                                        <td>

                                            <RiDeleteBin5Line 
                                                className='text-base cursor-pointer'
                                                onClick={(e, id) => deleteDoctorFunction(e, doctor.id)}
                                            />

                                        </td>

                                    </tr>
                                
                                )}
                                
                            )}

                        </tbody>

                    )}

                </table>

                <div className="">

                    <div 
                        className="my-3 text-sm items-center inline-flex cursor-pointer hover:opacity-60 active:opacity-40"
                        onClick={activateAddDoctor}
                    >

                        Add Doctor 
                        <MdAddBox 
                            className='ml-3 text-base'
                        />

                    </div>

                    {addDoctorIsVisible && (

                        <div className="top-10">

                            <form
                                className='flex items-end space-x-5'
                                onSubmit={(e) => AddDoctorForm(e)}
                            >

                                <div className="">

                                    <label
                                        className='text-xs'
                                    >Department Name <span className='text-red-400'>*</span></label><br />
                                    <input 
                                        className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                        value={addDoctorData}
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setAddDoctorData(value);

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

    )

}

export default AdminManagement02