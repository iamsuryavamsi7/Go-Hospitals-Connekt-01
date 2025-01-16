import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const FillTheSurgeryForm = () => {

    const {teleSupportUserId} = useParams();

	const {applicationId} = useParams();

    const [allDocuments, setAllDocuments] = useState([]);

    const [panCardDoc, setPanCardDoc] = useState(null);

    const [previewPanCardDoc, setPreviewPanCardDoc] = useState(null);

    const [aadharCardFront, setAadharCardFront] = useState(null);

    const [previewAadharCardFront, setPreviewAadharCardFront] = useState(null);

    const [aadharCardBack, setAadharCardBack] = useState(null);

    const [previewAadharCardBack, setPreviewAadharCardBack] = useState(null);

    const [insuranceCard, setInsuranceCard] = useState([]);

    const [previewInsuraceCard, setPreviewInsuraceCard] = useState(null);

    const [passportCard, setPassportCard] = useState(null);

    const [previewPassportCard, setPreviewPassportCard] = useState(null);

    const [employeeID, setEmployeeID] = useState(null);

    const [previewEmployeeID, setPreviewEmployeeID] = useState(null);

    const [employeeIDBack, setEmployeeIDBack] = useState(null);

    const [previewEmployeeIDBack, setPreviewEmployeeIDBack] = useState(null);

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL; 

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

    const handlePanCardChange = (e) => {

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        
        const files = Array.from(e.target.files);
    
        // Filter files based on valid types
        const filteredFiles = files.filter(file => validTypes.includes(file.type));
    
        if (filteredFiles.length > 0) {

            setPanCardDoc(filteredFiles[0]);

            const blobURL = URL.createObjectURL(filteredFiles[0]);
            setPreviewPanCardDoc(blobURL);

        } else {

            alert('Please upload only images or PDF files.');

        }

    };

    const handleAadharCardFrontChange = (e) => {

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        
        const files = Array.from(e.target.files);
    
        // Filter files based on valid types
        const filteredFiles = files.filter(file => validTypes.includes(file.type));
    
        if (filteredFiles.length > 0) {

            setAadharCardFront(filteredFiles[0]);

            const blobURL = URL.createObjectURL(filteredFiles[0]);
            setPreviewAadharCardFront(blobURL);
            
        } else {

            alert('Please upload only images or PDF files.');

        }

    };

    const handleAadharCardBackChange = (e) => {

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        
        const files = Array.from(e.target.files);
    
        // Filter files based on valid types
        const filteredFiles = files.filter(file => validTypes.includes(file.type));
    
        if (filteredFiles.length > 0) {

            setAadharCardBack(filteredFiles[0]);

            const blobURL = URL.createObjectURL(filteredFiles[0]);
            setPreviewAadharCardBack(blobURL);
            
        } else {

            alert('Please upload only images or PDF files.');

        }

    };

    const handleUploadInsuranceChange = (e) => {

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        
        const files = Array.from(e.target.files);
    
        // Filter files based on valid types
        const filteredFiles = files.filter(file => validTypes.includes(file.type));
    
        if (filteredFiles.length > 0) {

            setInsuranceCard(filteredFiles);

            const blobURL = URL.createObjectURL(filteredFiles[0]);
            setPreviewInsuraceCard(blobURL);
            
        } else {

            alert('Please upload only images or PDF files.');

        }

    };

    const handlePassportPhotoChange = (e) => {

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        
        const files = Array.from(e.target.files);
    
        // Filter files based on valid types
        const filteredFiles = files.filter(file => validTypes.includes(file.type));
    
        if (filteredFiles.length > 0) {

            setPassportCard(filteredFiles[0]);

            const blobURL = URL.createObjectURL(filteredFiles[0]);
            setPreviewPassportCard(blobURL);
            
        } else {

            alert('Please upload only images or PDF files.');

        }

    };

    const handleEmployeeIDChange = (e) => {

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        
        const files = Array.from(e.target.files);
    
        // Filter files based on valid types
        const filteredFiles = files.filter(file => validTypes.includes(file.type));
    
        if (filteredFiles.length > 0) {

            setEmployeeID(filteredFiles[0]);

            const blobURL = URL.createObjectURL(filteredFiles[0]);
            setPreviewEmployeeID(blobURL);
            
        } else {

            alert('Please upload only images or PDF files.');

        }

    };

    const [uploadingActivated, setUploadingActivated] = useState(false);

    const handleEmployeeIDChangeBack = (e) => {

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        
        const files = Array.from(e.target.files);
    
        // Filter files based on valid types
        const filteredFiles = files.filter(file => validTypes.includes(file.type));
    
        if (filteredFiles.length > 0) {

            setEmployeeIDBack(filteredFiles[0]);

            const blobURL = URL.createObjectURL(filteredFiles[0]);
            setPreviewEmployeeIDBack(blobURL);
            
        } else {

            alert('Please upload only images or PDF files.');

        }

    }

	const handleSubmit = async (e) => {
        
        e.preventDefault();

        console.log(`Started`);
    
        if (panCardDoc !== null && aadharCardFront !== null && aadharCardBack !== null && insuranceCard.length > 0 && passportCard !== null && employeeID !== null ) {

            allDocuments.push(panCardDoc);
            allDocuments.push(aadharCardFront);
            allDocuments.push(aadharCardBack);

            insuranceCard.map((ins01) => {

                allDocuments.push(ins01);

            });
            
            allDocuments.push(passportCard);
            allDocuments.push(employeeID);
            
            if ( employeeIDBack !== null ){

                allDocuments.push(employeeIDBack);

            }

            console.log(`added`);

            setUploadingActivated(true);

            if ( allDocuments.length > 5 ){

                // Create FormData object
                const formData = new FormData();

                allDocuments.forEach((file) => {

                    formData.append("imageFile", file);

                });

                try {

                // Send the form data to the backend
                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/public/uploadSurgeryDocuments/${applicationId}/${teleSupportUserId}`, formData, {
                    headers: {
                        'Content-Type': `multipart/form-data`
                    },
                });

                if ( response.status === 200 ){

                    toast.success("Upload Successful", {
                        autoClose: 1000,
                        style: {
                            backgroundColor: '#1f2937', // Tailwind bg-gray-800
                            color: '#fff', // Tailwind text-white
                            fontWeight: '600', // Tailwind font-semibold
                            borderRadius: '0.5rem', // Tailwind rounded-lg
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                            marginTop: '2.5rem' // Tailwind mt-10,
                        },
                        progressStyle: {
                            backgroundColor: '#22c55e' // Tailwind bg-green-400
                        },
                    });

                    setAllDocuments(null);

                    setPanCardDoc(null);
                    setPreviewPanCardDoc(null);

                    setAadharCardFront(null);
                    setPreviewAadharCardFront(null);

                    setAadharCardBack(null);
                    setPreviewAadharCardBack(null);

                    setInsuranceCard([]);
                    setPreviewInsuraceCard(null);

                    setPassportCard(null);
                    setPreviewPassportCard(null);

                    setEmployeeID(null);
                    setPreviewEmployeeID(null);

                    setEmployeeIDBack(null);
                    setPreviewEmployeeIDBack(null);

                    if ( stompClient ){

                        const webSocketNotificationTypeModel = {
                            notificationType: `RefreshTeleSupportNotifications`
                        }

                        stompClient.send(`/app/commonWebSocket`, {}, JSON.stringify(webSocketNotificationTypeModel));

                    }

                    setUploadingActivated(false);

                }

                } catch (error) {
                
                    handleError(error);

                    toast.error("Someting Went Wrong", {
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

                    setAllDocuments([]);
                
                }

            }else {

                console.log(`Its size is less than required files`);

                setUploadingActivated(false);

            }

        }else {

            console.log(`Upload All Files`);

        }

    };

    // State to store stompClient
    const [stompClient, setStompClient] = useState(null);

    // Connect to websockets when the component mounts with useEffect hook
    useEffect(() => {

        const sock = new SockJS(`${goHospitalsAPIBaseURL}/go-hospitals-websocket`);
        const client = Stomp.over(() => sock);

        setStompClient(client);

        client.connect(
            {},
            () => {

                console.log(`WebSocket Connection successfull`);

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

    const [noteActivated, setNoteActivated] = useState(false);

	return (

		<>

			<NavBar />

			<ToastContainer />

            {!noteActivated && (

                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center">

                    <div className="bg-gray-800 px-5 py-5 rounded-lg w-[300px] max-w-[300px]">

                        <div className="mb-5">

                            Note:

                        </div>

                        <div className="text-xs mb-2">

                            Please upload clear photos only without hands or background distractions showing

                        </div>

                        <div className="text-xs mt-5">

                            దయచేసి మీ చేతులు/బ్యాక్ గ్రౌండ్ లో ఇతర వస్తువులు కనిపించకుండా, స్పష్టమైన ఫోటోలును మాత్రమే అప్‌లోడ్ చేయండి.

                        </div>

                        <button
                            className='bg-[#22c55e] px-2 py-1 rounded-lg mt-5 text-xs cursor-pointer'
                            onClick={() => setNoteActivated(true)}
                        >

                            Okay
                            
                        </button>

                    </div>

                </div>

            )}

            {noteActivated && 
            
                <>

                    <div className="text-center mt-5 font-semibold text-lg">

                        Upload Documents

                    </div>
                
                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        className='mt-5 flex flex-col items-center text-center'
                    >
                        
                        {/* Pan Card */}
                        <div 
                            className="px-10 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center"
                            >

                            <label className='text-xs'>Upload Pan Card of Insurance Holder <span className='text-red-400'>*</span></label><br />

                            <div className="h-[200px] w-[200px] mt-5 text-xs bg-gray-800 rounded-lg flex justify-center items-center"> 

                                {panCardDoc === null ? 'No File Uploaded' : (

                                    panCardDoc?.type === 'application/pdf' ? (

                                        // Display PDF using an iframe
                                        <iframe 
                                            src={previewPanCardDoc} 
                                            title="PDF Preview" 
                                            className="h-full w-full rounded-lg" 
                                        ></iframe>

                                    ) : (

                                        // Display Image
                                        <img 
                                            src={previewPanCardDoc} 
                                            alt="Preview" 
                                            className="h-full w-full rounded-lg" 
                                        />

                                    )
                                )}
            
                                
                            </div>

                            <input 
                                type="file"
                                accept="image/*,application/pdf"
                                capture="environment" // opens the camera on mobile devices
                                onChange={(e) => handlePanCardChange(e)}
                                className='mt-2 mb-5 cursor-pointer hidden'
                                id='panCardfileInput'
                            /><br />

                            <label htmlFor="panCardfileInput" className="mt-2 cursor-pointer bg-gray-800 text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                {panCardDoc === null ? 'Upload' : 'Change File'}
                            </label>

                        </div>

                        {/* Aadhar Card Front */}
                        <div 
                            className="px-10 transition-all duration-200 cursor-pointer mt-7 flex flex-col items-center"
                            >

                            <label className='text-xs'>Upload Aadhar Card Front Side of Insurance Holder <span className='text-red-400'>*</span></label><br />

                            <div className="h-[200px] w-[200px] mt-5 flex justify-center items-center text-xs bg-gray-800 rounded-lg"> 

                                {aadharCardFront === null ? 'No File Uploaded' : (

                                    aadharCardFront?.type === 'application/pdf' ? (

                                        // Display PDF using an iframe
                                        <iframe 
                                            src={previewAadharCardFront} 
                                            title="PDF Preview" 
                                            className="h-full w-full rounded-lg" 
                                        ></iframe>

                                    ) : (

                                        // Display Image
                                        <img 
                                            src={previewAadharCardFront} 
                                            alt="Preview" 
                                            className="h-full w-full rounded-lg" 
                                        />

                                    )
                                )}
            
                                
                            </div>

                            <input 
                                type="file"
                                accept="image/*,application/pdf"
                                capture="environment" // opens the camera on mobile devices
                                onChange={(e) => handleAadharCardFrontChange(e)}
                                className='mt-2 mb-5 cursor-pointer hidden'
                                id='aadharCardFrontfileInput'
                            /><br />

                            <label htmlFor="aadharCardFrontfileInput" className="mt-2 cursor-pointer bg-gray-800 text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                {aadharCardFront === null ? 'Upload' : 'Change File'}
                            </label>

                        </div>

                        {/* Aadhar Card Back Side*/}
                        <div 
                            className="px-10 transition-all duration-200 cursor-pointer mt-7 flex flex-col items-center"
                            >

                            <label className='text-xs'>Upload Aadhar Card Back Side of Insurance Holder <span className='text-red-400'>*</span></label><br />

                            <div className="h-[200px] w-[200px] mt-5 flex justify-center items-center text-xs bg-gray-800 rounded-lg"> 

                                {aadharCardBack === null ? 'No File Uploaded' : (

                                    aadharCardBack?.type === 'application/pdf' ? (

                                        // Display PDF using an iframe
                                        <iframe 
                                            src={previewAadharCardBack} 
                                            title="PDF Preview" 
                                            className="h-full w-full rounded-lg" 
                                        ></iframe>

                                    ) : (

                                        // Display Image
                                        <img 
                                            src={previewAadharCardBack} 
                                            alt="Preview" 
                                            className="h-full w-full rounded-lg" 
                                        />

                                    )
                                )}
            
                                
                            </div>

                            <input 
                                type="file"
                                accept="image/*,application/pdf"
                                capture="environment" // opens the camera on mobile devices
                                onChange={(e) => handleAadharCardBackChange(e)}
                                className='mt-2 mb-5 cursor-pointer hidden'
                                id='aadharCardBackfileInput'
                            /><br />

                            <label htmlFor="aadharCardBackfileInput" className="mt-2 cursor-pointer bg-gray-800 text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                {aadharCardBack === null ? 'Upload' : 'Change File'}
                            </label>

                        </div>

                        {/* Multiple Insurance Card */}
                        <div 
                            className="px-10 transition-all duration-200 cursor-pointer mt-7 flex flex-col items-center"
                            >

                            <label className='text-xs'>Upload Insurance Card <span className='text-red-400'>*</span></label><br />

                            <div className="h-[200px] w-[200px] mt-5 flex justify-center items-center text-xs bg-gray-800 rounded-lg"> 

                                {insuranceCard.length === 0 ? 'No File Uploaded' : (

                                    insuranceCard[0]?.type === 'application/pdf' ? (

                                        // Display PDF using an iframe
                                        <iframe 
                                            src={previewInsuraceCard} 
                                            title="PDF Preview" 
                                            className="h-full w-full rounded-lg" 
                                        ></iframe>

                                    ) : (

                                        // Display Image
                                        <img 
                                            src={previewInsuraceCard} 
                                            alt="Preview" 
                                            className="h-full w-full rounded-lg" 
                                        />

                                    )
                                )}
            
                                
                            </div>

                            <input 
                                type="file"
                                accept="image/*,application/pdf"
                                capture="environment" // opens the camera on mobile devices
                                onChange={(e) => handleUploadInsuranceChange(e)}
                                className='mt-2 mb-5 cursor-pointer hidden'
                                id='insurancefileInput'
                            /><br />

                            <label htmlFor="insurancefileInput" className="mt-2 cursor-pointer bg-gray-800 text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                {insuranceCard.length === 0 ? 'Upload' : 'Upload More'}
                            </label>

                        </div>

                        {/* Passport size photo */}
                        <div 
                            className="px-10 transition-all duration-200 cursor-pointer mt-7 flex flex-col items-center"
                            >

                            <label className='text-xs'>Upload Passport Size Photo of Insurance Holder <span className='text-red-400'>*</span></label><br />

                            <div className="h-[200px] w-[200px] mt-5 flex justify-center items-center text-xs bg-gray-800 rounded-lg"> 

                                {passportCard === null ? 'No File Uploaded' : (

                                    passportCard?.type === 'application/pdf' ? (

                                        // Display PDF using an iframe
                                        <iframe 
                                            src={previewPassportCard} 
                                            title="PDF Preview" 
                                            className="h-full w-full rounded-lg" 
                                        ></iframe>

                                    ) : (

                                        // Display Image
                                        <img 
                                            src={previewPassportCard} 
                                            alt="Preview" 
                                            className="h-full w-full rounded-lg" 
                                        />

                                    )
                                )}
            
                                
                            </div>

                            <input 
                                type="file"
                                accept="image/*,application/pdf"
                                capture="environment" // opens the camera on mobile devices
                                onChange={(e) => handlePassportPhotoChange(e)}
                                className='mt-2 mb-5 cursor-pointer hidden'
                                id='passportFileInput'
                            /><br />

                            <label htmlFor="passportFileInput" className="mt-2 cursor-pointer bg-gray-800 text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                {passportCard === null ? 'Upload' : 'Change File'}
                            </label>

                        </div>

                        {/* Employee ID Card Front */}
                        <div 
                            className="px-10 transition-all duration-200 cursor-pointer mt-7 flex flex-col items-center"
                            >

                            <label className='text-xs'>Upload Employee ID Front Side of Insurance Holder <span className='text-red-400'>*</span></label><br />

                            <div className="h-[200px] w-[200px] mt-5 flex justify-center items-center text-xs bg-gray-800 rounded-lg"> 

                                {employeeID === null ? 'No File Uploaded' : (

                                    employeeID?.type === 'application/pdf' ? (

                                        // Display PDF using an iframe
                                        <iframe 
                                            src={previewEmployeeID} 
                                            title="PDF Preview" 
                                            className="h-full w-full rounded-lg" 
                                        ></iframe>

                                    ) : (

                                        // Display Image
                                        <img 
                                            src={previewEmployeeID} 
                                            alt="Preview" 
                                            className="h-full w-full rounded-lg" 
                                        />

                                    )
                                )}
            
                                
                            </div>

                            <input 
                                type="file"
                                accept="image/*,application/pdf"
                                capture="environment" // opens the camera on mobile devices
                                onChange={(e) => handleEmployeeIDChange(e)}
                                className='mt-2 mb-5 cursor-pointer hidden'
                                id='employeeIDfileInput'
                            /><br />

                            <label htmlFor="employeeIDfileInput" className="mt-2 cursor-pointer bg-gray-800 text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                {employeeID === null ? 'Upload' : 'Change File'}
                            </label>

                        </div>

                        {/* Employee ID Card Back */}
                        <div 
                            className="px-10 transition-all duration-200 cursor-pointer mt-7 flex flex-col items-center"
                            >

                            <label className='text-xs'>Upload Employee ID Back Side of Insurance Holder</label><br />

                            <div className="h-[200px] w-[200px] mt-5 flex justify-center items-center text-xs bg-gray-800 rounded-lg relative"> 

                                {employeeIDBack === null ? 'No File Uploaded' : (

                                    employeeIDBack?.type === 'application/pdf' ? (

                                        // Display PDF using an iframe
                                        <iframe 
                                            src={previewEmployeeIDBack} 
                                            title="PDF Preview" 
                                            className="h-full w-full rounded-lg" 
                                        ></iframe>

                                    ) : (

                                        // Display Image
                                        <img 
                                            src={previewEmployeeIDBack} 
                                            alt="Preview" 
                                            className="h-full w-full rounded-lg" 
                                        />

                                    )
                                )}
            
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 absolute right-2 top-2 cursor-pointer hover:opacity-60 active:opacity-80"
                                onClick={() => {

                                    setEmployeeIDBack(null);
                                    setPreviewEmployeeIDBack(null);

                                }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                
                            </div>

                            <input 
                                type="file"
                                accept="image/*,application/pdf"
                                capture="environment" // opens the camera on mobile devices
                                onChange={(e) => handleEmployeeIDChangeBack(e)}
                                className='mt-2 mb-5 cursor-pointer hidden'
                                id='employeeIDfileInputBack'
                            /><br />

                            <label htmlFor="employeeIDfileInputBack" className="mt-2 cursor-pointer bg-gray-800 text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
                                {employeeIDBack === null ? 'Upload' : 'Change File'}
                            </label>

                        </div>

                        <button 
                            className='bg-[#238636] mx-10 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
                            type='submit'
                        >
                            Submit

                        </button>

                    </form>

                    {uploadingActivated && <div className="backdrop-blur-lg fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center animate-none">

                        <div className="animate-pulse inline-block">Uploading Files ...</div>
                            
                    </div>}

                </>
                
            }
		
		</>

	)

}

export default FillTheSurgeryForm