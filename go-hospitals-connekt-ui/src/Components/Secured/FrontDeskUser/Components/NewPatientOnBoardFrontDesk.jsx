import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { LuNewspaper } from 'react-icons/lu';
import toast, { Toaster } from 'react-hot-toast';
// import { AiOutlineFileSync } from 'react-icons/ai';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useDispatch } from 'react-redux';
import { closeNavBarSearch } from '../../ReduxToolkit/Slices/frontDeskNavBarSlice';

const NewPatientOnBoardFrontDesk = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

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

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchUserObject`, {
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
        id: ``,
        name: '',
        age: '',
        aadharNumber: '',
        contact: '',
        location: '',
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
        location: '',
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

        }, 1000);

    };

    const bookAnAppointment = async (e) => {

        e.preventDefault();

        const gender = patientOnBoardData.gender;

        const reason = patientOnBoardData.reason;

        const doctorName = patientOnBoardData.preferredDoctor;

        const temporaryID = patientOnBoardData.id;

        if ( gender !== '' && gender !== 'Select Gender' && reason !== '' && reason !== 'Select Reason' && doctorName !== '' && doctorName !== 'Select Doctor'){

            try{

                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/checkTheAppointmentIsAvailable/${temporaryID}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }); 

                if ( response.status === 200 ){

                    const responseData = response.data;

                    console.log(responseData);

                    if ( responseData ){

                        try{

                            const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/front-desk/bookApplication/${temporaryID}`, {
                                    deleteAppointmentID: patientOnBoardData.id,
                                    name: patientOnBoardData.name,
                                    age: patientOnBoardData.age,
                                    contact: patientOnBoardData.contact,
                                    gender: patientOnBoardData.gender,
                                    reasonForVisit: patientOnBoardData.reason,
                                    location: patientOnBoardData.location,
                                    tempororyBillNo: patientOnBoardData.billNo,
                                    preferredDoctorName: patientOnBoardData.preferredDoctor,
                                    bookedBy: bookedByName
                                }, {
                                    headers: {
                                        Authorization: `Bearer ${access_token}`
                                    }
                                })

                                if ( response.status === 200 ){

                                    const patientID = response.data;

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

                                        if ( stompClient !== null ){

                                            stompClient.send(`/app/book-appointment-send-to-medical-support-user`, {}, JSON.stringify({}));

                                            const webSocketNotificationTypeModel = {
                                                notificationType: `WaitingPatientsRefreshLeftNavBar`
                                            }

                                            stompClient.send(`/app/commonWebSocket`, {}, JSON.stringify(webSocketNotificationTypeModel));

                                            const webSocketAnalyticsPageModel = {
                                                analyticsModelRefreshType: `RefreshAdminMainAnalytics` 
                                            }

                                            stompClient.send(`/app/adminAnalytics`, {}, JSON.stringify(webSocketAnalyticsPageModel));
                            
                                            setPatientOnBoardDataPrint((prevElement) => ({
                                                ...prevElement,
                                                patientID : patientID,
                                                name: patientOnBoardData.name,
                                                age: patientOnBoardData.age
                                            }));
                        
                                            setPatientOnBoardData({
                                                name: '',
                                                age: '',
                                                contact: '',
                                                location: '',
                                                gender: '',
                                                medicalHistory: '',
                                                reason: '',
                                                preferredDoctor: '',
                                                billNo: '',
                                                aadharNumber: ''
                                            });
                        
                                            setPatientDetailsOnBoard((prevElement) => ({
                                                ...prevElement,
                                                newPatientOnBoardActivated: false
                                            }));
                                
                                            setTimeout(() => {

                                                fetchPatientTemporaryData();
                        
                                                handlePrint();
                        
                                            }, 1000);

                                    }

                                }

                        }catch(error){

                            console.error(error);

                        }
    
                    }else {

                        toast.error(`Already Filled or Not Found`, {
                            duration: 2000,
                            style: {
                                backgroundColor: '#1f2937', // Tailwind bg-gray-800
                                color: '#fff', // Tailwind text-white
                                fontWeight: '600', // Tailwind font-semibold
                                borderRadius: '0.5rem', // Tailwind rounded-lg
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                                marginTop: '2.5rem' // Tailwind mt-10,
                            }
                        });

                    }

                }else {

                    toast.error(`Already Filled or Not Found`, {
                        duration: 2000,
                        style: {
                            backgroundColor: '#1f2937', // Tailwind bg-gray-800
                            color: '#fff', // Tailwind text-white
                            fontWeight: '600', // Tailwind font-semibold
                            borderRadius: '0.5rem', // Tailwind rounded-lg
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                            marginTop: '2.5rem' // Tailwind mt-10,
                        }
                    });

                }

            }catch(error){

                console.error(error);

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

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/getDepartments`, {
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

                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/getDepartmentById/` + departmentId, {
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

                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchDoctorsByDepartmentId/` + departmentId, {
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

            fetchPatientTemporaryData();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    // toggle new OP procedure screen with useState hook
    const [patientDetialsOnBoard , setPatientDetailsOnBoard] = useState({
        newPatientOnBoardActivated: false
    });

    // Function to delete the temporary data
    const deleteTemparoryData = async (appointment) => {

        const appointmentID = appointment.id;

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/deleteTemporaryAppointmentById/${appointmentID}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(`\n\n\nBoolean Value : ${responseData}\n\n\n`);

                fetchPatientTemporaryData()

            }

        }catch(error){

            console.error(error);

        }

    }

    // State to store the data of patients in queue
    const [fetchedPatientOnBoardData, setFetchedPatientOnBoardData] = useState([]);

    const fetchPatientTemporaryData = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchPatientOnBoardData`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log();

                setFetchedPatientOnBoardData(responseData);

            }

        }catch(error){

            handleError(error);

        }

    }

    // Function to run when patient onbaord data received through websockets
    const patientOnBoardDataReceived = (message) => {

        const messageBody = JSON.parse(message.body);

        setFetchedPatientOnBoardData((prevElement) => {

            const updatedFetchedPatiendOnBoardData = [...prevElement];

            updatedFetchedPatiendOnBoardData.push(messageBody);

            return updatedFetchedPatiendOnBoardData;

        });

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

                client.subscribe(`/frontDeskOnBoardPublicPage/public-page-frontDesk-onboard`, (message) => patientOnBoardDataReceived(message));
        
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

    const dispatch = useDispatch();

    const newPatientOnBoardFronDeskFunction = () => {

        dispatch(closeNavBarSearch());

    }

    return (

        <>

            <Toaster />

            {role === roles.frontDesk && (

            <>

                {!patientDetialsOnBoard.newPatientOnBoardActivated && <div
                onClick={newPatientOnBoardFronDeskFunction}
                className='h-[800px] lg:mx-10 max-sm:px-5 max-sm:overflow-x-scroll lg:mr-56 max-h-[800px] overflow-y-scroll scrollableMove scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-700'>

                    <table
                        className='w-[100%]'
                    >

                        <thead>

                            <tr
                                className='text-left leading-10'
                            >

                                <th className='pr-5'>S.No</th>
                                <th className='whitespace-nowrap'>Patient Name</th>
                                <th className='pl-20 pr-5'>Age</th>
                                <th className='whitespace-nowrap pr-5'>Phone Number</th>

                            </tr>

                        </thead>

                        {fetchedPatientOnBoardData && fetchedPatientOnBoardData.length === 0 ? (

                            <tbody>

                            <tr
                                className='text-left'
                            >

                                <th>No Data</th>
                                <th>No Data</th>
                                <th className='pl-20'>No Data</th>
                                <th>No Data</th>

                            </tr>

                            </tbody>

                        ) : (

                            <tbody
                                
                            >

                                {fetchedPatientOnBoardData.slice().reverse().map((appointment, index) => (

                                    <tr
                                        key={index}
                                        className='text-left text-gray-500 leading-10 text-base'
                                    >

                                        <th>{index + 1}</th>
                                        <th className='whitespace-nowrap w-[170px] max-w-[250px] overflow-hidden text-ellipsis'>{appointment.newPatientOnBoardName}</th>
                                        <th className='pl-20'>{appointment.newPatientOnBoardAge}</th>
                                        <th>{appointment.newPatientOnBoardContact}</th>
                                        <th>

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:opacity-60 active:opacity-80 cursor-pointer"
                                            onClick={() => deleteTemparoryData(appointment)}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </th>
                                        <th
                                            className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                            onClick={async () => {

                                                try{

                                                    const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/checkTheAppointmentIsAvailable/${appointment.id}`, {
                                                        headers: {
                                                            Authorization: `Bearer ${access_token}`
                                                        }
                                                    }); 

                                                    if ( response.status === 200 ){

                                                        const responseData = response.data;

                                                        console.log(responseData);

                                                        if ( responseData ){

                                                            setPatientOnBoardData((prevElement) => {

                                                                const updatedPatientOnBoarddata = {...prevElement};
            
                                                                updatedPatientOnBoarddata.id = appointment.id;
                                                                updatedPatientOnBoarddata.name = appointment.newPatientOnBoardName;
                                                                updatedPatientOnBoarddata.age = appointment.newPatientOnBoardAge;
                                                                updatedPatientOnBoarddata.contact = appointment.newPatientOnBoardContact;
                                                                updatedPatientOnBoarddata.aadharNumber = appointment.newPatientOnBoardAadharNumber;
                                                                updatedPatientOnBoarddata.location = appointment.newPatientOnBoardLocation;
            
                                                                return updatedPatientOnBoarddata; 
            
                                                            });
            
                                                            setPatientDetailsOnBoard((prevElement) => {
            
                                                                const updatedData = {...prevElement};
            
                                                                updatedData.newPatientOnBoardActivated = true;
            
                                                                return updatedData;
            
                                                            });

                                                        }else {

                                                            toast.error(`Already Filled or Not Found`, {
                                                                duration: 2000,
                                                                style: {
                                                                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                                                                    color: '#fff', // Tailwind text-white
                                                                    fontWeight: '600', // Tailwind font-semibold
                                                                    borderRadius: '0.5rem', // Tailwind rounded-lg
                                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                                                                    marginTop: '2.5rem' // Tailwind mt-10,
                                                                }
                                                            });

                                                        }

                                                    }

                                                }catch(error){

                                                    console.error(error);

                                                }

                                            }}
                                        >

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                            </svg>


                                        </th>

                                    </tr>

                                ))}

                            </tbody>

                        )}

                    </table>

                </div>}

                {patientDetialsOnBoard.newPatientOnBoardActivated && <div className="inline-block">

                    <div 
                        onClick={newPatientOnBoardFronDeskFunction}
                        className="text-lg mx-20 mb-7 flex items-center space-x-2">

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
                        onClick={newPatientOnBoardFronDeskFunction}
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

                            <div 
                                className=""
                                onClick={() => {

                                    console.log(patientOnBoardDataPrint);

                                }}
                            >

                                <label>Location <span className='text-red-400'>*</span> </label><br />
                                <input 
                                    type='text'
                                    required
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='location'
                                    value={patientOnBoardData.location}
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

                        <div className="mt-10 flex items-center">

                            <button
                                className={`bg-[#238636] ${formSubmitButton} hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3`}
                                type='submit'
                            > Onboard Patient </button>

                            <button
                                className={`bg-red-500 ${formSubmitButton} hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3 ml-10`}
                                onClick={(e) => {

                                    e.preventDefault();

                                    setPatientDetailsOnBoard((prevElement) => {

                                        const updatedElement = {...prevElement};

                                        updatedElement.newPatientOnBoardActivated = false;

                                        return updatedElement;

                                    });

                                }}
                            > Cancel </button>

                        </div>

                    </form>

                </div>}

                {/* Hidden page for printing patient details */}
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