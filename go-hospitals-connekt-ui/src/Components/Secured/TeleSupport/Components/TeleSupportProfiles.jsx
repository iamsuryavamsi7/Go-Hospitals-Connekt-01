import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../../../Style/secured/navbar/navbaruser.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { CgLoadbar } from 'react-icons/cg';
import { IoCloseCircle } from 'react-icons/io5';

const TeleSupportProfiles = () => {

    // JWT Token
    const access_token = Cookies.get('access_token'); 

    // useNavigate Hook for url change
    const navigate = useNavigate();

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL; 

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

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
        appointmentFinished: ''
    });

    const roles = {
        teleSupport: 'TELESUPPORT',
    }

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

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/tele-support/fetchApplicationById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const appointmentData = response.data;

                setPatientData(appointmentData);

                console.log(response.data);

            }

        }catch(error){

            handleError(error);

            setPatientData([]);

        }

    }

    const fetchUserObject = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/tele-support/fetchUserObject`, {
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

    const takeJobFunction = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/tele-support/assign-tele-support-user/${id}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                toast.success("Job Taken", {
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

                    navigate(`/telesupport-MyJobs`);

                }, 1600);

            }

        }catch(error){

            handleError(error);

            toast.error("Something went wrong", {
                autoClose: 2000,
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

    const [fetchedImageVisible, setFetchedImageVisible] = useState(false);

    const [images, setImages] = useState([])

    const fetchImages = async () => {

        const imageSrc = patientData.surgeryDocumentsUrls;

        setFetchedImageVisible(true);
    
        const imagePromises = imageSrc.map(async (imgSrc) => {

            const imageSrc1 = imgSrc.surgeryDocumentsUrl;
    
            console.log("Started...");
    
            try {
                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/files/display/` + imageSrc1, {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
    
                const value = response.data;
                const mimeType = response.headers['content-type'];
                const blobUrl = URL.createObjectURL(value);
    
                console.log("Finished...");
    
                return { blobUrl, mimeType };
    
            } catch (error) {
                handleError(error);
            }
        });
    
        const blobs = await Promise.all(imagePromises);
    
        setImages(
            (prevImages) => [...prevImages, ...blobs.filter((blob) => blob !== null)]
        );
        
    };
    

    const downloadImage = async () => {

        const fileName = patientData.surgeryDocumentsUrls;

        fileName.map( async (file1) => {
            
            const fileName1 = file1.surgeryDocumentsUrl;

            console.log("Started");

            try{

                const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/files/download/${fileName1}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                    responseType: 'blob'
                })

                if ( response.status === 200 ){

                    fetchAppointmentData();

                    const url = window.URL.createObjectURL(new Blob([response.data]));

                    const link = document.createElement('a');

                    link.href = url;

                    link.setAttribute('download', fileName1);
                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    console.log("Finished");

                }

            }catch(error){

                handleError(error);

                toast.error("Download Error", {
                    autoClose: 2000,
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

        });

    }

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchAppointmentData();

        } else {

            window.open(goHospitalsFRONTENDBASEURL, '_self');

        }

    }, [id]);

    return (

        <>

            <ToastContainer />

            {role === roles.teleSupport && (

                <>

                    {patientData && patientData.length === 0 ? (

                        <div className="relative h-[500px]">

                            <div className="absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center">

                                No Data Available

                            </div>

                        </div>

                    ): (

                        <>

                        <div 
                            className="mb-10"
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

                                        Patient ID

                                    </div>

                                    <div className="text-lg">
                                        
                                        {patientData.patientId}

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

                                        Gender

                                    </div>

                                    <div className="text-lg">
                                        
                                        {patientData.gender}

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

                                            <span> Done </span>

                                        ) : (

                                            <span> Not Done </span>

                                        )}

                                    </div>

                                </div>

                                {patientData.teleSupportUserName && (

                                    <div className="block items-start bg-gray-800 px-5 py-3 rounded-lg">

                                        <div className="text-base text-gray-300">

                                            Tele Support User

                                        </div>

                                        <div className="text-lg">
                                            
                                            {patientData.teleSupportUserName}

                                        </div>

                                    </div>

                                )}

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

                            </div>

                            {!patientData.teleSupportUserName && (

                                <button
                                    className='bg-green-800 px-2 py-1 rounded-md mx-10 my-10 hover:opacity-60 active:opacity-40'
                                    onClick={takeJobFunction}
                                >Take Job</button>

                            )}

                        </div>

                        {patientData.surgeryDocumentsUrls && patientData.surgeryDocumentsUrls.length > 0 && (

                            <>

                                <div className="flex">

                                    <div className="ml-10">

                                        <button
                                            onClick={fetchImages}
                                            className='cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                        >

                                            Show Documents

                                        </button>

                                    </div>

                                    <div className="mx-5">

                                        <button
                                            onClick={downloadImage}
                                            className='cursor-pointer bg-gray-800 px-2 py-2 rounded-lg hover:opacity-60 active:opacity-40'
                                        >

                                            Download Documents

                                        </button>

                                    </div>

                                </div>

                                {fetchedImageVisible && (
                                        
                                    <div className="absolute top-0 right-0 bottom-0 left-0 flex backdrop-blur-sm z-50">
                                    
                                        <div className="absolute mx-20 mt-10 text-xl font-semibold">Preview Mode</div>

                                        <div className="mx-20 my-20 grid grid-cols-6 gap-4 overflow-hidden">

                                            {images && images.length > 0 ? images.map(({ blobUrl, mimeType }, index) => {

                                                return mimeType === 'application/pdf' ? (
                                                    <object
                                                        key={index}
                                                        data={blobUrl}
                                                        type="application/pdf"
                                                        width="100%"
                                                        height="400px"
                                                        aria-label={`Prescription PDF ${index + 1}`}
                                                        className='transition-transform duration-300 ease-in-out transform'
                                                    >
                                                        <p>PDF Preview Not Available</p>
                                                    </object>
                                                ) : (
                                                    <img
                                                        key={index}
                                                        src={blobUrl}
                                                        alt={`Prescription ${index + 1}`}
                                                        className='transition-transform duration-300 ease-in-out transform hover:scale-105 h-[400px] w-auto'
                                                    />
                                                );
                                            }) : (
                                    
                                                <div className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center'>
                                                
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

                            </>

                        )}

                    </>

                    )}

                </>

            )}

        </>

    )

}

export default TeleSupportProfiles