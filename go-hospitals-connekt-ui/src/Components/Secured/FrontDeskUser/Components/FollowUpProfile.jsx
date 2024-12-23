import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../../../Style/secured/navbar/navbaruser.css'
import axios from 'axios';
import '../../../../Style/secured/navbar/navbaruser.css'
import { IoCloseCircle } from 'react-icons/io5';
import { CgLoadbar } from 'react-icons/cg';
import { GiCancel } from 'react-icons/gi';
import { Toaster, toast } from 'react-hot-toast';

const FollowUpProfile = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const {id} = useParams();

    const [patientData, setPatientData] = useState({
        id: id,
        name: '',
        age: '',
        contact: '',
        address: '',
        gender: '',
        medicalHistory: '',
        reasonForVisit: '',
        appointmentOn: '',
        preferredDoctorName: '',
        appointmentCreatedOn: '',
        appointmentFinished: '',
        patientAdmitMessage: ''
    });

    const roles = {
        frontDesk: 'FRONTDESK'
    }

    const [patientPrescriptionSrc, setPatientPrescriptionSrc] = useState([]);

    const [fetchedImageVisible, setFetchedImageVisible] = useState(false);

    const [checkedStatus, setCheckedStatus] = useState(false);

    // Format the date and time (example: MM/DD/YYYY, HH:MM AM/PM)
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true // for AM/PM format
    };
      
    // Convert to Date object
    const appointmentDate = new Date(patientData.appointmentCreatedOn);
    
    const formattedDate = appointmentDate.toLocaleString('en-US', options);

    // Convert to Date object
    const appointmentCompletedDate = new Date(patientData.applicationCompletedTime);

    const appointmentCompletedFormattedDate = appointmentCompletedDate.toLocaleString('en-US', options);

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

    const fetchAppointmentData = async () => {

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/pharmacy/fetchApplicationById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const appointmentData = response.data;

                setPatientData(appointmentData);

            }

        }catch(error){

            handleError(error);

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

    const [images, setImages] = useState([]);

    const fetchImages = async () => {

        const imageSrc = patientData.prescriptionsUrls;

        setFetchedImageVisible(true);

        const imagePromises = imageSrc.map(async (imgSrc) => {
            
            const imageSrc1 = imgSrc.prescriptionURL;

            try{

                const response = await axios.get('http://localhost:7777/api/v1/files/display/' + imageSrc1, {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                })

                const value = response.data;

                const imageBlob = URL.createObjectURL(value);

                return imageBlob;

            }catch(error){

                handleError(error);

            }
        
        });

        const blobs = await Promise.all(imagePromises);

        setImages(
            (prevImages) => [...prevImages, ...blobs.filter((blob) => blob !== null)]
        );

    }

    const downloadImage = async () => {

        setPatientPrescriptionSrc(null);

        const fileName = patientData.prescriptionsUrls;

        fileName.map( async (file1) => {
            
            const fileName1 = file1.prescriptionURL;

            try{

                const response = await axios.get(`http://localhost:7777/api/v1/files/download/${fileName1}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                    responseType: 'blob'
                })

                if ( response.status === 200 ){

                    console.log("Download Started");

                    const url = window.URL.createObjectURL(new Blob([response.data]));

                    const link = document.createElement('a');

                    link.href = url;

                    link.setAttribute('download', fileName1);
                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                }

            }catch(error){

                handleError(error);

            }

        });

    }

    const approveFunction = async () => {

        const patientAdmitMessage = patientData.patientAdmitMessage;

        const formData = new FormData();

        formData.append("patientAdmitMessage", patientAdmitMessage);

        try{

            const response = await axios.post(`http://localhost:7777/api/v1/front-desk/acceptApplicationById/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                toast.success("Patient Approved", {
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
                
                setTimeout(() => {

                    navigate('/front-desk-new-patient-on-board');

                }, 1600);

            }

        }catch(error){

            handleError(error);

            toast.success("Something Went Wrong", {
                duration: 2000,
                style: {
                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    color: '#fff', // Tailwind text-white
                    fontWeight: '600', // Tailwind font-semibold
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    marginTop: '2.5rem' // Tailwind mt-10,
                },
                position: 'top-center'
            });

        }

    }

    const rejectFunction = async () => {

        try{

            const response = await axios.delete(`http://localhost:7777/api/v1/front-desk/deleteApplicationById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                toast.success("Patient Rejected", {
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
                
                setTimeout(() => {

                    navigate("/front-desk-new-patient-on-board");

                }, 1600);

            }

        }catch(error){

            handleError(error);

            toast.error("Something Went Wrong", {
                duration: 2000,
                style: {
                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    color: '#fff', // Tailwind text-white
                    fontWeight: '600', // Tailwind font-semibold
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    marginTop: '2.5rem' // Tailwind mt-10,
                },
                position: 'top-center'
            });

        }

    }

    const [updateFormVisible, setUpdateFormVisible] = useState(false);

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

    const [doctorData, setDoctorData] = useState([]);

    const [departmentsData, setDepartmentsData] = useState([]);

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

        console.log(departmentId);

        const fetchDepartment = async () => {

            try{

                const response = await axios.get('http://localhost:7777/api/v1/front-desk/getDepartmentById/' + departmentId, {
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

        console.log(patientOnBoardData.preferredDoctor);

    }

    const formSubmitFunction01 = async (e) => {

        e.preventDefault();

        const reason = patientOnBoardData.reason;

        const doctorName = patientOnBoardData.preferredDoctor;

        const applicationId = id;

        console.log(reason);

        console.log(doctorName);

        const formData = new FormData();

        formData.append("reasonForVisit", reason);
        formData.append("doctorName", doctorName);

        try{

            const response = await axios.post(`http://localhost:7777/api/v1/front-desk/acceptCrossConsultation/${applicationId}`, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                toast.success("Cross Consultation Approved", {
                    autoClose: 1000,
                    style: {
                        backgroundColor: '#1f2937', // Tailwind bg-gray-800
                        color: '#fff', // Tailwind text-white
                        fontWeight: '600', // Tailwind font-semibold
                        borderRadius: '0.5rem', // Tailwind rounded-lg
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                        marginTop: '2.5rem' // Tailwind mt-10,
                    }
                });

                setTimeout(() => {

                    navigate(`/front-desk-new-patient-on-board`);

                }, 1600);

            }

        }catch(error){

            handleError(error);

            toast.error("Something Went Wrong", {
                autoClose: 2000,
                style: {
                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    color: '#fff', // Tailwind text-white
                    fontWeight: '600', // Tailwind font-semibold
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    marginTop: '2.5rem' // Tailwind mt-10,
                },
                progressStyle: {
                    backgroundColor: 'red' // Tailwind bg-green-400
                },
                position: 'top-center'
            });

        }

    }

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

            fetchDepartments();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, [id]);

    return (

        <>

            <Toaster />

            {role === roles.frontDesk && (

                <>

                    <div 
                        className="mb-20"
                    >

                        <div className="ml-10 text-2xl flex items-center space-x-3 mb-10 justify-center">

                            Patient Details    

                        </div>

                        <div className="ml-10 grid grid-cols-3 gap-x-5 gap-y-5">

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Name

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.name}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Age

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.age}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Contact

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.contact}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Address

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.address}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Gender

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.gender}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg w-auto">

                                <div className="text-base text-gray-300">

                                    Medical History

                                </div>

                                <div className="text-lg w-auto break-words">
                                    
                                    {patientData.medicalHistory}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Reason for visit

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.reasonForVisit}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Bill No

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.billNo}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Preferred Doctor

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.preferredDoctorName}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Medical Support Name

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.medicalSupportUserName}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Appointment Created On

                                </div>

                                <div className="text-lg">
                                    
                                    {formattedDate}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Booked By

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.bookedBy}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Status

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.consultationType}

                                </div>

                            </div>

                            {patientData.consultationType === 'COMPLETED' && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Application Completed On

                                    </div>

                                    <div className="text-lg">
                                        
                                        {appointmentCompletedFormattedDate}

                                    </div>

                                </div>

                            )}

                            {patientData.consultationType === 'COMPLETED' && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Payment Status

                                    </div>

                                    <div className="text-lg">
                                        
                                        Done

                                    </div>

                                </div>

                            )}

                            {patientData.consultationType === 'COMPLETED' && (

                                <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                    <div className="text-base text-gray-300">

                                        Pharmacy Message

                                    </div>

                                    <div className="text-lg">
                                        
                                        {patientData.pharmacyMessage ? (

                                            <span>{patientData.pharmacyMessage}</span>

                                        ): (

                                            <span>No Data</span>

                                        )}

                                    </div>

                                </div>

                            )}

                        </div>

                        {patientData.patientGotApproved && !patientData.forCrossConsultation && (

                            <div className="flex">

                                <div className="ml-10 mt-10">

                                    <button
                                        onClick={fetchImages}
                                        className='cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                    >

                                        Show Prescription

                                    </button>

                                </div>

                                <div className="mx-5 mt-10">

                                    <button
                                        onClick={downloadImage}
                                        className='cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                    >

                                        Download Prescription

                                    </button>

                                </div>

                            </div>

                        )}

                        {fetchedImageVisible && (
                            
                            <div className="absolute top-0 right-0 bottom-0 left-0 flex backdrop-blur-sm">

                                <div className="absolute mx-20 mt-10 text-xl font-semibold">

                                    Preview Mode

                                </div>
                            
                                <div className="mx-20 my-20 grid grid-cols-6 gap-4 overflow-hidden"> 
                                    
                                    {images && images.length > 0 ? images.map((imageSrc, index) => {
                                        
                                        console.log(imageSrc);

                                        return (

                                            <img 
                                                key={index} 
                                                src={imageSrc}
                                                alt={`Prescription ${index + 1}`} 
                                                className='transition-transform duration-300 ease-in-out transform hover:scale-105 h-[400px] w-auto'
                                            />

                                    )}) : (

                                        <div
                                            className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center'
                                        >

                                            <div className="flex items-center space-x-2 text-xl">

                                                <div className="animate-spin">

                                                    <CgLoadbar />

                                                </div>

                                                <div className="animate-pulse">

                                                    Fetching ...

                                                </div>

                                            </div>

                                        </div>

                                    )}

                                        <IoCloseCircle 
                                            className='absolute top-10 right-10 text-2xl hover:opacity-60 active:opacity-40 cursor-pointer'
                                            onClick={() => {
                                                setFetchedImageVisible(false);
                                                setImages([]);
                                            }}
                                            />
                            
                                </div>
                            
                            </div>
                        
                        )} 

                        {!patientData.patientGotApproved && (

                            <>

                               <div className="block mt-5 mx-10 space-y-3">
                               
                                    <label 
                                        className='text-xs'
                                    >Any Message (Optional)</label><br />

                                    <textarea 
                                        className='bg-[#0d1117] custom-scrollbar text-white border-gray-400 border-[.5px] focus:outline-none focus:border-2 rounded-lg h-[80px] px-3 w-[300px] max-sm:w-full'
                                        name='patientAdmitMessage'
                                        value={patientData.patientAdmitMessage}
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setPatientData({...patientData, [e.target.name]: value})

                                        }}
                                    />

                               </div>

                                <div className="mx-10 mb-10 mt-5 space-x-5">

                                    <button
                                        className = {`bg-green-700 px-2 py-1 rounded-lg hover:opacity-60 active:opacity-40`}
                                        onClick = {approveFunction}
                                    > Approve </button>

                                    <button
                                        className = {`bg-red-800 px-2 py-1 rounded-lg hover:opacity-60 active:opacity-40`}
                                        onClick = {rejectFunction}
                                    > Reject </button>

                                </div>

                            </>

                        )}

                        {patientData.forCrossConsultation && (

                            <>

                                <div className="mx-10 my-10 space-x-5">

                                    <button
                                        className = {`bg-green-800 px-2 py-1 rounded-lg hover:opacity-60 active:opacity-40`}
                                        onClick={() => {

                                            setUpdateFormVisible(true);

                                        }}  
                                    > Change Doctor </button>

                                </div>

                                {updateFormVisible && (

                                    <form
                                        className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm'
                                        onSubmit={(e) => formSubmitFunction01(e)}
                                    >

                                        <div className="bg-gray-900 px-10 py-10 rounded-2xl relative">

                                            <GiCancel 
                                                className='absolute top-5 right-5 cursor-pointer'
                                                onClick={() => {

                                                    setUpdateFormVisible(false);

                                                }}
                                            />

                                            <div className="block">

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

                                                <div className="mt-10">

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

                                            </div>

                                            <div className="">

                                                <button
                                                className='bg-[#238636] hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3 mt-7'
                                            > Update Application </button>

                                            </div>

                                        </div>

                                    </form>

                                )}

                            </>

                        )}

                    </div>

                </>

            )}

        </>

    )

}

export default FollowUpProfile