import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { LuNewspaper } from 'react-icons/lu';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineFileSync } from 'react-icons/ai';

const NewPatientOnBoardFrontDesk = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState('');

    const [departmentsData, setDepartmentsData] = useState([]);

    const [doctorData, setDoctorData] = useState([]);

    const [formSubmitButton, setFormSubmitButton] = useState(null);

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
        aadharNumber: '',
        contact: '',
        address: '',
        gender: '',
        medicalHistory: '',
        reason: '',
        preferredDoctor: '',
        billNo: ''
    });

    const [patientOnBoardDataPrint, setPatientOnBoardDataPrint] = useState({
        name: '',
        age: '',
        aadharNumber: '',
        contact: '',
        address: '',
        gender: '',
        medicalHistory: '',
        reason: '',
        preferredDoctor: '',
        billNo: '',
        patientID: ''
    });

    const handlePatientFunction = (e) => {

        const value = e.target.value;

        setPatientOnBoardData({...patientOnBoardData, [e.target.name]: value});

        setPatientOnBoardDataPrint((prevElement) => ({

            ...prevElement, [e.target.name]:value

        }));

    }

    const printRef = useRef();

    const handlePrint = () => {
        const printContent = printRef.current;
        
        if (!printContent) return;

        // Open a new window and write the content to it
        const printWindow = window.open('', '');
        
        // Write the content to the print window
        printWindow.document.write('<html><head><title>Onboard Conformation Slip</title>');

        // Include Tailwind CSS (you need to provide the correct path to your Tailwind CSS file)
        printWindow.document.write(`

            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

        `);
        
        printWindow.document.write('</head><body>');
        
        // Clone the content and write it into the print window
        printWindow.document.write(printContent.innerHTML);
        
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        setTimeout(() => {

            // Trigger print dialog
            printWindow.print();

        }, 2000);

    };

    const bookAnAppointment = async (e) => {

        e.preventDefault();

        const gender = patientOnBoardData.gender;

        const reason = patientOnBoardData.reason;

        const doctorName = patientOnBoardData.preferredDoctor;

        if ( gender !== '' && gender !== 'Select Gender' && reason !== '' && reason !== 'Select Reason' && doctorName !== '' && doctorName !== 'Select Doctor'){

            try{

                const response = await axios.post('http://localhost:7777/api/v1/front-desk/bookApplication', {
                    name: patientOnBoardData.name,
                    age: patientOnBoardData.age,
                    contact: patientOnBoardData.contact,
                    gender: patientOnBoardData.gender,
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

                    const responseData = response.data;

                    console.log(responseData);

                    toast.success("Patient Onboard Success", {
                        duration: 1000,
                        style: {
                            backgroundColor: '#1f2937', // Tailwind bg-gray-800
                            color: '#fff', // Tailwind text-white
                            fontWeight: '600', // Tailwind font-semibold
                            borderRadius: '0.5rem', // Tailwind rounded-lg
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                            marginTop: '2.5rem' // Tailwind mt-10,
                        }
                    });

                    setPatientOnBoardData({
                        name: '',
                        age: '',
                        contact: '',
                        address: '',
                        gender: '',
                        medicalHistory: '',
                        reason: '',
                        preferredDoctor: '',
                        billNo: '',
                        aadharNumber: ''
                    });

                    setPatientOnBoardDataPrint((prevElement) => ({
                        ...prevElement,
                        patientID : responseData
                    }));

                    setTimeout(() => {

                        handlePrint();

                    }, 1500);

                }

            }catch(error){

                handleError(error);

            }

        }else {

            toast.error("Fill all fields", {
                    style: {
                        backgroundColor: '#1f2937', // Tailwind bg-gray-800
                        color: '#fff', // Tailwind text-white
                        fontWeight: '600', // Tailwind font-semibold
                        borderRadius: '0.5rem', // Tailwind rounded-lg
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                        marginTop: '2.5rem' // Tailwind mt-10,
                    },
                    duration: 2000
                });

        }

    }

    const fetchDepartments = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/front-desk/getDepartments', {
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

                const response = await axios.get('http://localhost:7777/api/v1/front-desk/getDepartmentById/' + departmentId, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    const departmentData = response.data.departmentName

                    setPatientOnBoardData((prevElement) => ({
                        
                        ...prevElement, 
                        reason: departmentData
                        
                    }))

                    setPatientOnBoardDataPrint((prevElement) => ({

                        ...prevElement, 
                        reason : departmentData
            
                    }));

                }

            }catch(error){

                handleError(error);

            }

        }

        fetchDepartment();

        const fetchDoctors = async () => {

            try{

                const response = await axios.get('http://localhost:7777/api/v1/front-desk/fetchDoctorsByDepartmentId/' + departmentId, {
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

    const fetchDataFunction = async () => {

        const frontDeskUserId = userObject.id;

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/front-desk/fetchPatientData/${frontDeskUserId}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const responseData = response.data;

                setPatientOnBoardData((prevElement) => ({
                    ...prevElement, 
                    name: responseData.newPatientOnBoardName,
                    age: responseData.newPatientOnBoardAge,
                    aadharNumber: responseData.newPatientOnBoardAadharNumber,
                    contact: responseData.newPatientOnBoardContact
                }));
                
                setPatientOnBoardDataPrint((prevElement) => ({
                    ...prevElement, 
                    name: responseData.newPatientOnBoardName,
                    age: responseData.newPatientOnBoardAge,
                    aadharNumber: responseData.newPatientOnBoardAadharNumber,
                    contact: responseData.newPatientOnBoardContact
                }));

            }

        }catch(error){

            handleError(error);

        }

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

            <Toaster />

            {role === roles.frontDesk && (

            <>

                <div className="inline-block">

                    <div className="text-lg mx-20 mb-7 flex items-center space-x-2">

                        <div className="">

                            <LuNewspaper />

                        </div>

                        <div className="">

                            New Patient Onboard

                        </div>

                    </div>

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
                            {/* <span className='text-red-400'>*</span> */}

                                <label>Age <span className='text-red-400'>*</span> </label><br />
                                <input 
                                    type='text'
                                    required
                                    maxLength={3}
                                    minLength={1}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='age'
                                    value={patientOnBoardData.age}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                            </div>

                            <div className="">
                            {/* <span className='text-red-400'>*</span> */}

                                <label>Aadhar Number<span className='text-red-400'>*</span> </label><br />
                                <input 
                                    type='text'
                                    required
                                    maxLength={12}
                                    minLength={12}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='aadharNumber'
                                    value={patientOnBoardData.aadharNumber}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                            </div>

                            <div 
                                className=""
                                onClick={() => {

                                    console.log(patientOnBoardDataPrint);

                                }}
                            >

                            {/* <span className='text-red-400'>*</span> */}
                                <label>Contact <span className='text-red-400'>*</span> </label><br />
                                <input 
                                    type='text'
                                    required
                                    maxLength={10}
                                    minLength={10}
                                    inputMode='numeric'
                                    pattern='[0-9]*'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='contact'
                                    value={patientOnBoardData.contact}
                                    onChange={(e) => handlePatientFunction(e)}
                                />  

                            </div>

                            <div className="">

                            <label>Gender <span className='text-red-400'>*</span></label><br />
                                <select
                                        className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mt-2'
                                        value={patientOnBoardData.gender}
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setPatientOnBoardData({...patientOnBoardData, gender: value});

                                            setPatientOnBoardDataPrint((prevElement) => ({

                                                ...prevElement, gender :value
                                    
                                            }));

                                        }}
                                >

                                    <option>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>

                                </select>

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
                                    value={patientOnBoardData.preferredDoctor}    
                                    onChange={(e) => {

                                            const value = e.target.value;

                                            setPatientOnBoardData(
                                                {...patientOnBoardData, preferredDoctor: value}
                                            )

                                            setPatientOnBoardDataPrint((prevElement) => ({
                                                ...prevElement,
                                                preferredDoctor: value
                                            }));

                                        }}
                                >

                                    <option>Select Doctor</option>
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

                            <div 
                                className="bg-[#334155] inline-flex items-center space-x-1 px-2 py-2 leading-8 rounded-xl cursor-pointer hover:opacity-60 active:opacity-80 my-7"
                                onClick={fetchDataFunction}
                            >

                                <div className="">

                                    <AiOutlineFileSync 
                                        className='text-xl'
                                    />

                                </div>

                                <div className="text-sm">

                                    Sync

                                </div>

                            </div><br />

                            <button
                            className={`bg-[#238636] ${formSubmitButton} hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3`}
                            type='submit'
                            > Onboard Patient </button>

                        </div>

                    </form>

                </div>

            <div
                className="text-center mx-[400px] border-[1px] border-gray-200 hidden"
                ref={printRef}
            >

                <div className="text-left mx-10 space-y-5 py-10">

                    <div className="">

                        <div className="text-black">Patient ID : {patientOnBoardDataPrint.patientID}</div>

                    </div>

                    <div className="block">

                        <div className="">

                            <div className="text-black">Patient Name : {patientOnBoardDataPrint.name}</div>
                            <div className="text-black">Patient Age : {patientOnBoardDataPrint.age}</div>

                        </div>
                        
                        <div className="text-left">
                            <div className="text-black">Consulting Doctor : {patientOnBoardDataPrint.preferredDoctor}</div>
                            <div className="text-black">Patient Gender : {patientOnBoardDataPrint.gender} </div>
                        </div>

                    </div>

                </div>

            </div>

            </>

            )}

        </>

    )

}

export default NewPatientOnBoardFrontDesk