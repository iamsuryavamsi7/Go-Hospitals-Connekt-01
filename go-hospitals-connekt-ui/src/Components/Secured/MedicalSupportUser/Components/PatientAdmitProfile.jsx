import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { Toaster, toast } from 'react-hot-toast';

const PatientAdmitProfile = () => {

// JWT Token
    const access_token = Cookies.get('access_token');
    
// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const [image, setImage] = useState([]);

    const {id} = useParams();

    const [treatMentDoneVisible, setTreatMentDoneVisible] = useState(false);

    const [treatmentDone, steTreatmentDone] = useState(``);

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
        appointmentFinished: ''
    });

    const [consulationDoneisVisible, setConsulationDoneisVisible] = useState(false);

    const roles = {
        medicalSupport: 'MEDICALSUPPORT',
    }

    // Your patient data
    const patientCreatedOn = {
    appointmentCreatedOn: "2024-10-20T09:36:33.702+00:00",
    // other data...
    };
  
    // Convert to Date object
    const appointmentDate = new Date(patientData.appointmentCreatedOn);
    
    // Format the date and time (example: MM/DD/YYYY, HH:MM AM/PM)
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true // for AM/PM format
    };
    
    const formattedDate = appointmentDate.toLocaleString('en-US', options);
    

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

    const fetchAppointmentData = async () => {

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/medical-support/fetchApplicationById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const appointmentData = response.data;

                setPatientData(appointmentData);

                console.log(appointmentData);

            }

        }catch(error){

            handleError(error);

        }

    }

    const handleCapture = (e) => {
        
        const files = Array.from(e.target.files);
        
        setImage(
            (prevFiles) => [...prevFiles, ...files]
        );
    
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        const applicationId = id;
    
        // Create FormData object
        const formData = new FormData();

        image.forEach((file) => {

            formData.append("imageFile", file);

        });

        formData.append("prescriptionMessage", treatmentDone);

        try {

          // Send the form data to the backend
          const response = await axios.post(`http://localhost:7777/api/v1/medical-support/uploadPrescription/${applicationId}`, formData, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': `multipart/form-data`
            },
          });

          if ( response.status === 200 ){

            toast.success("Treatment Completed", {
                duration: 1000,
                style: {
                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    color: '#fff', // Tailwind text-white
                    fontWeight: '600', // Tailwind font-semibold
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    marginTop: '2.5rem' // Tailwind mt-10,
                },
                position: 'top-right'
            });

            steTreatmentDone(``);

            setImage([]);

            setTreatMentDoneVisible(false);

            fetchAppointmentData();

          }

        } catch (error) {
        
            handleError(error);

            toast.error("File size exceeded", {
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

            setImage([]);
        
        }

    };

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, [id]);

    return (

        <>

            <Toaster />

            {role === roles.medicalSupport && (

                <>

                    <div 
                        className=""
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

                                    Nurse

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
                                    
                                    {patientData.consultationType === 'NOTASSIGNED' && 'Waiting for Nurse'}
                                    
                                    {patientData.consultationType === 'WAITING' && 'Waiting for DMO'}

                                    {patientData.consultationType === 'DMOCARECOMPLETED' && 'Waiting for Consultation'}

                                    {patientData.consultationType === 'ONSITREVIEWPATIENTDRESSING' && 'Onsite - Review Patient Dressing'}

                                    {patientData.consultationType === 'ONSITEVASCULARINJECTIONS' && 'Onsite - Vascular Injection'}

                                    {patientData.consultationType === 'ONSITEQUICKTREATMENT' && 'Onsite - Quick Treatment'}

                                    {patientData.consultationType === 'ONSITECASCUALITYPATIENT' && 'Onsite - Casuality Patient'}

                                    {patientData.consultationType === 'MEDICATIONPLUSFOLLOWUP' && 'Medical Plus Follow UP'}

                                    {patientData.consultationType === 'SURGERYCARE' && 'Surgery Care'}

                                    {patientData.consultationType === 'CROSSCONSULTATION' && 'Cross Consultation'}
                                    
                                    {patientData.consultationType === 'FOLLOWUPCOMPLETED' && 'Follow-Up Scheduled'}

                                    {patientData.consultationType === 'CASECLOSED' && 'Case Closed'}

                                </div>

                            </div>

                            <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                <div className="text-base text-gray-300">

                                    Treatment Status

                                </div>

                                <div className="text-lg">
                                    
                                    {patientData.treatmentDone ? (

                                        <div className="text-base text-gray-300">

                                            Completed

                                        </div>

                                    ) : (

                                        <div className="text-lg">

                                            Not Completed

                                        </div>

                                    )}

                                </div>

                            </div>
                            

                        </div>

                        {!patientData.treatmentDone && patientData.patientGotApproved && (

                            <div
                                className='bg-[#238636] mx-10 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                onClick={() => {

                                    setTreatMentDoneVisible(true);

                                }}
                            >

                                Treatment Done

                            </div>

                        )}

                        {!patientData.patientGotApproved && (

                            <div
                                className='bg-red-900 mx-10 my-10 px-2 rounded-lg leading-10 cursor-pointer inline-block'
                            >

                                Get Approved from Front Desk

                            </div>

                        )}

                        {treatMentDoneVisible && (

                            <div 
                                className="absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-sm"
                            >

                                <form 
                                    className="block relative bg-gray-900 text-xl rounded-2xl border-[1px] border-gray-800"
                                    onSubmit={handleSubmit}
                                >
                                
                                    <div 
                                        className="py-5 px-10 transition-all duration-200 cursor-pointer rounded-t-2xl block"
                                    >
                                        
                                        <label className='text-xs'>Write any feed (Optional)</label><br />

                                        <textarea 
                                            type='text'
                                            className='bg-[#0d1117] min-h-[100px] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] mt-2 text-sm'
                                            value={treatmentDone}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                steTreatmentDone(value);

                                            }}
                                        />
                                    
                                    </div>

                                    <div 
                                        className="px-10 transition-all duration-200 cursor-pointer"
                                    >

                                        <label className='text-xs'>Upload the prescription <span className='text-red-400'>*</span></label><br />

                                        <input 
                                            type="file"
                                            accept="image/*"
                                            capture="environment" // opens the camera on mobile devices
                                            onChange={(e) => handleCapture(e)}
                                            multiple // Allows multiple file selection
                                            className='mt-2 mb-5 cursor-pointer'
                                            id='fileInput'
                                        /><br />

                                        <label htmlFor="fileInput" className="mt-2 cursor-pointer bg-gray-800 text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                            Add More
                                        </label>

                                    </div>

                                    <button 
                                        className='bg-[#238636] mx-10 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                                        type='submit'
                                    >
                                        Submit

                                    </button>

                                    <IoCloseCircleSharp 
                                        className='absolute z-50 top-5 right-5 cursor-pointer'
                                        onClick={() => {

                                            setTreatMentDoneVisible(false);

                                        }}
                                    />

                                </form>

                            </div>

                        )}

                    </div>

                </>

            )}

        </>

    )

}

export default PatientAdmitProfile