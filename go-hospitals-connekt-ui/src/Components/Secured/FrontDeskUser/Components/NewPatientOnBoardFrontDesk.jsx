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
        medicalHistory: '',
        reason: '',
        preferredDoctor: '',
        bookedBy: bookedByName
    });

    const [gender, setGender] = useState(null);
    
    const handlePatientFunction = (e) => {

        const value = e.target.value;

        setPatientOnBoardData({...patientOnBoardData, [e.target.name]: value});

    }

    const [doctorName, setDoctorName] = useState();

    const bookAnAppointment = async (e) => {

        e.preventDefault();

        const appointmentObject = selectedAppointment.date + " " + selectedAppointment.time;

        console.log(bookedByName); 

        try{

            const response = await axios.post('http://localhost:7777/api/v1/appointments/bookAppointment', {
                name: patientOnBoardData.name,
                age: patientOnBoardData.age,
                contact: patientOnBoardData.contact,
                address: patientOnBoardData.address,
                gender: gender,
                medicalHistory: patientOnBoardData.medicalHistory,
                reasonForVisit: patientOnBoardData.reason,
                appointmentOn: appointmentObject,
                preferredDoctorName: patientOnBoardData.preferredDoctor,
                bookedBy: bookedByName
            }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                alert("User saved");

                window.location.reload();

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

    }, []);

    return (

        <>

            <style>{`
                /* Custom styles for the DatePicker */
                .react-datepicker {
                    width: 100%; /* Full width */
                    border: 1px solid #d1d5db; /* Tailwind gray-300 */
                    border-radius: 0.5rem; /* Tailwind rounded-lg */
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Tailwind shadow-md */
                }
                .react-datepicker__header {
                    background-color: #3b82f6; /* Tailwind blue-500 */
                    color: white;
                }
                .react-datepicker__day {
                    color: #374151; /* Tailwind gray-800 */
                }
                .react-datepicker__day--today {
                    background-color: #93c5fd; /* Tailwind blue-300 */
                }
                .react-datepicker__day:hover {
                    background-color: #dbeafe; /* Tailwind blue-200 */
                }
                .react-datepicker__triangle {
                    display: none; /* Optional: hide the triangle if you don't want it */
                }
            `}</style>

            {role === roles.frontDesk && (

            <>

                <div className="inline-block">

                    <form
                        className='mx-20'
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

                                            setGender(e.target.value);

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
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            if ( value === 'Go Vascular' ){

                                                setDoctorName("Suvarna");

                                            } else if ( value === 'Go Hospital'){

                                                setDoctorName("Suresh");

                                            } else if ( value === 'Hypro Diagnostics'){

                                                setDoctorName("Sravan");

                                            }

                                        }}
                                >

                                    <option>Select Reason</option>
                                    <option>Go Vascular</option>
                                    <option>Go Hospital</option>
                                    <option>Hypro Diagnostics</option>

                                </select>                                

                            </div>

                            <div className="">

                                <label>Preferred Doctor</label><br />
                                <div 
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600 h-[35px] focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='preferredDoctor'
                                >{doctorName}</div> 

                            </div>

                        </div>

                        <div className="">

                            <button
                            className='bg-[#238636] hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3 mt-7'
                            onClick={bookAnAppointment}
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