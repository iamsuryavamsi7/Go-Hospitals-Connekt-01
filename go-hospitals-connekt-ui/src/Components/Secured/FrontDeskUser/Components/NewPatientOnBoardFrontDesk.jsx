import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const NewPatientOnBoardFrontDesk = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState('');

    const [departmentsData, setDepartmentsData] = useState([]);

    const [doctorData, setDoctorData] = useState([]);

    const roles = {
        frontDesk: 'FRONTDESK',
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

    const bookedByName = userObject.firstName + " " + userObject.lastName;

    const [patientOnBoardData, setPatientOnBoardData] = useState({
        name: '',
        age: '',
        contact: '',
        address: '',
        gender: '',
        medicalHistory: '',
        reason: '',
        preferredDoctor: '',
        billNo: ''
    });

    const handlePatientFunction = (e) => {

        const value = e.target.value;

        setPatientOnBoardData({...patientOnBoardData, [e.target.name]: value});

    }

    const bookAnAppointment = async (e) => {

        e.preventDefault();

        console.log(patientOnBoardData);

        try{

            const response = await axios.post('http://localhost:7777/api/v1/appointments/bookAppointment', {
                name: patientOnBoardData.name,
                age: patientOnBoardData.age,
                contact: patientOnBoardData.contact,
                address: patientOnBoardData.address,
                gender: patientOnBoardData.gender,
                medicalHistory: patientOnBoardData.medicalHistory,
                reasonForVisit: patientOnBoardData.reason,
                billNo: patientOnBoardData.billNo,
                preferredDoctorName: patientOnBoardData.preferredDoctor,
                bookedBy: bookedByName
            }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                alert("Appointment Booked");

                window.location.reload();

            }

        }catch(error){

            handleError(error);

        }

    }

    const fetchDepartments = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/appointments/getDepartments', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const departmentData = response.data;

                setDepartmentsData(departmentData);

            }

        }catch(error){

            handleError(error);

        }

    }

    const handleDepartmentChange = (e) => {

        const departmentId = e.target.value;

        const fetchDepartment = async () => {

            try{

                const response = await axios.get('http://localhost:7777/api/v1/appointments/getDepartmentById/' + departmentId, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    const departmentData = response.data.departmentName

                    setPatientOnBoardData(
                        {...patientOnBoardData, reason: departmentData}
                    )

                }

            }catch(error){

                handleError(error);

            }

        }

        fetchDepartment();

        const fetchDoctors = async () => {

            try{

                const response = await axios.get('http://localhost:7777/api/v1/appointments/fetchDoctorsByDepartmentId/' + departmentId, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    const doctorsData = response.data;

                    setDoctorData(doctorsData);

                }

            }catch(error){

                handleError(error);

            }

        }

        fetchDoctors();

    }


    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchDepartments();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    return (

        <>

            {role === roles.frontDesk && (

            <>

                <div className="inline-block">

                    <form
                        className='mx-20'
                        onSubmit={bookAnAppointment}
                    >

                        <div className="grid grid-cols-2 gap-x-10 gap-y-7">

                            <div className="">

                                <label>Name <span className='text-red-400'>*</span></label><br />
                                <input 
                                    required
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 flex-1 w-[300px] max-sm:w-full mt-2'
                                    name='name'
                                    value={patientOnBoardData.name}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                            </div>

                            <div className="">

                                <label>Age <span className='text-red-400'>*</span></label><br />
                                <input 
                                    required
                                    type='number'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='age'
                                    value={patientOnBoardData.age}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                            </div>

                            <div className="">

                                <label>Contact <span className='text-red-400'>*</span></label><br />
                                <input 
                                    required
                                    type='number'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='contact'
                                    value={patientOnBoardData.contact}
                                    onChange={(e) => handlePatientFunction(e)}
                                />  

                            </div>

                            <div className="">

                                <label>Address <span className='text-red-400'>*</span></label><br />
                                <input 
                                    required
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='address'
                                    value={patientOnBoardData.address}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                            </div>

                            <div className="">

                            <label>Gender <span className='text-red-400'>*</span></label><br />
                                <select
                                        className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mt-2'
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setPatientOnBoardData({...patientOnBoardData, gender: value});

                                        }}
                                >

                                    <option>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>

                                </select>

                            </div>

                            <div className="">

                                <label>Medical history <span className='text-red-400'>*</span></label><br />
                                <input 
                                    required
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='medicalHistory'
                                    value={patientOnBoardData.medicalHistory}
                                    onChange={(e) => handlePatientFunction(e)}
                                />  

                            </div>

                            <div className="">

                                <label>Reason for visit <span className='text-red-400'>*</span></label><br />
                                <select
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mt-2'
                                        onChange={(e) => handleDepartmentChange(e)}
                                >

                                    <option>Select Reason</option>
                                    {departmentsData.map((department, index) => (

                                        <option 
                                            key={index}
                                            value={department.id}
                                        >{department.departmentName}</option>

                                    ))}

                                </select>                                

                            </div>

                            <div className="">

                                <label>Preferred Doctor <span className='text-red-400'>*</span></label><br />
                               
                                <select
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mt-2'
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setPatientOnBoardData(
                                                {...patientOnBoardData, preferredDoctor: value}
                                            )

                                        }}
                                >

                                    <option>Select Reason</option>
                                    {doctorData.map((doctor, index) => (

                                        <option 
                                            key={index}
                                            value={doctor.doctorName}
                                        >{doctor.doctorName}</option>

                                    ))}

                                </select>   

                            </div>

                            <div className="">

                                <label>Bill No <span className='text-red-400'>*</span></label><br />
                                <input 
                                    required
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    value={patientOnBoardData.billNo}
                                    name='billNo'
                                    onChange={(e) => handlePatientFunction(e)}
                                />  

                            </div>

                        </div>

                        <div className="">

                            <button
                            className='bg-[#238636] hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3 mt-7'
                        > Book an appointment </button>

                        </div>

                    </form>

                </div>

            </>

            )}

        </>

    )

}

export default NewPatientOnBoardFrontDesk