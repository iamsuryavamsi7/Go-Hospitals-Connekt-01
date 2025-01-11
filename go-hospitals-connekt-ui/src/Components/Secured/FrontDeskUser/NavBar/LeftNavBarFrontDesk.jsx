import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { IoPeopleCircleOutline, IoPersonAddSharp } from 'react-icons/io5';
import { SiTicktick } from 'react-icons/si';
import { MdFollowTheSigns } from 'react-icons/md';
import { CgDetailsMore } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom'; 
import { Toaster, toast } from 'react-hot-toast';
import { FaUserDoctor } from 'react-icons/fa6';

const LeftNavBarFrontDesk = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // useNavigate Hook
    const navigate = useNavigate();

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    // State to hold the userData
    const [userData, setUserData] = useState({
        role: ``
    }); 

    const fetchUserObject = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/front-desk/fetchUserRole`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const responseData = response.data;

                setUserData((prevElement) => {

                    const updatedUserData = {...prevElement};

                    updatedUserData.role = responseData;

                    return updatedUserData;

                });

            }

        }catch(error){

            console.error(error);

        }

    }

    // Helper function for toast notifications
    const showToast = (message, isError = false) => {
        toast[isError ? 'error' : 'success'](message, {
            autoClose: 1000,
            style: {
                backgroundColor: '#1f2937',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                marginTop: '2.5rem'
            }
        });
    };

    // Function to copy the link for frontend
    const copyMyLinkFunction = () => {

        const textToCopy = `http://gowork.gohospitals.in:7778/patient-self-filling-page`;

        // Check if `navigator.clipboard` is supported
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showToast("Copied to clipboard!");
                })
                .catch((error) => {
                    console.error("Failed to copy text:", error);
                    showToast("Failed to copy link. Please try again.", true);
                });
        } else {
            // Fallback for older browsers or insecure contexts 
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed"; // Avoid scrolling to bottom
            textArea.style.opacity = 0; // Make it invisible
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999); // For mobile devices

            try {
                document.execCommand("copy");
                showToast("Copied to clipboard!");
            } catch (error) {
                console.error("Failed to copy text:", error);
                showToast("Failed to copy link. Please try again.", true);
            }

            // Remove the temporary text area
            document.body.removeChild(textArea);
        }
    };

    // FrontDesk role type
    const frontDesk = 'FRONTDESK';

    // Performing tasks when the page mounts with useEffect Hook
    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

        }else {

            window.open(`${goHospitalsFRONTENDBASEURL}`, '_self');

        }

    }, []);

    // State to toggle more button
    const [moreButtonActivated, setMoreButtonActivated] = useState(false);

    // FrontDesk Left NavBar Style Management with useState Hook
    const [newPatientRegistration, setNewPatientRegistration] = useState(`text-gray-400`);

    const [newPatientRegistration2, setNewPatientRegistration2] = useState(`text-gray-400`);

    const [pendingConsultations, setPendingConsultations] = useState(`text-gray-400`);

    const [pendingConsultations2, setPendingConsultations2] = useState(`text-gray-400`);

    const [patientApprovals1, setPatientApprovals1] = useState(`text-gray-400`);

    const [patientApprovals2, setPatientApprovals2] = useState(`text-gray-400`);

    const [followUpPatients, setFollowUpPatients] = useState(`text-gray-400`);

    const [followUpPatients2, setFollowUpPatients2] = useState(`text-gray-400`);

    const [moreButtonStyle1, setMoreButtonStyle1] = useState(`text-gray-400`);

    const [moreButtonStyle2, setMoreButtonStyle2] = useState(`text-gray-400`);

    const [crossConsultationApprovals, setCrossConsultationApprovals] = useState(`text-gray-400`);

    const [crossConsultationApprovals2, setCrossConsultationApprovals2] = useState(`text-gray-400`);

    // PathName to have hold on page change with URL's
    const pathName = window.location.pathname;

    useEffect(() => {

        // FRONTDESK LEFTNAVBAR
        if (pathName === '/front-desk-new-patient-on-board') {

            setNewPatientRegistration(`text-sky-500`)

            setNewPatientRegistration2(`bg-sky-500 text-white`)

        } else {

            setNewPatientRegistration(`text-gray-400`)

            setNewPatientRegistration2(`text-gray-400`)

        }

        if ( pathName === `/front-desk-consultation-queue`){

            setPendingConsultations(`text-sky-500`);

            setPendingConsultations2(`bg-sky-500 text-white`);

        }else {

            setPendingConsultations(`text-gray-400`);

            setPendingConsultations2(`text-gray-400`);

        }

        if ( pathName === `/front-desk-patient-approvals` ){

            setPatientApprovals1(`text-sky-500`);

            setPatientApprovals2(`bg-sky-500 text-white`);

        }else {

            setPatientApprovals1(`text-gray-400`);

            setPatientApprovals2(`text-gray-400`);

        }

        if ( pathName === `/front-desk-follow-up`){

            setFollowUpPatients(`text-sky-500`);

            setFollowUpPatients2(`bg-sky-500 text-white`);

        }else {

            setFollowUpPatients(`text-gray-400`);

            setFollowUpPatients2(`text-gray-400`);

        }

        if ( pathName === `/front-desk-cross-consultation-approvals`){

            setCrossConsultationApprovals(`text-sky-500`);

            setCrossConsultationApprovals2(`bg-sky-500 text-white`);

        }else {

            setCrossConsultationApprovals(`text-gray-400`);

            setCrossConsultationApprovals2(`text-gray-400`);

        }

    }, [pathName]);

    useEffect(() => {

        if ( moreButtonActivated ){

            setMoreButtonStyle1(`text-sky-500`);

            setMoreButtonStyle2(`bg-sky-500 text-white`);

        }else {

            setMoreButtonStyle1(`text-gray-400`);

            setMoreButtonStyle2(`text-gray-400`);

        }

    }, [moreButtonActivated]);

    return (

        <>

            <Toaster />

            {userData.role === frontDesk && (

                    <div className="mx-56 w-[233px] flex flex-col text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                        <div 
                            className={`${newPatientRegistration} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/front-desk-new-patient-on-board')}
                        >

                            <div className="">

                                <IoPersonAddSharp 
                                    className={`${newPatientRegistration2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                New Patient Onboarding

                            </div>

                        </div>

                        <div 
                            className={`${pendingConsultations} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/front-desk-consultation-queue')}
                        >

                            <div className="">

                                <IoPeopleCircleOutline 
                                    className={`${pendingConsultations2} text-2xl  leading-8 p-[1px] rounded-md`}
                                />

                            </div>

                            <div className="">

                                Consultations Queue

                            </div>

                        </div>

                        <div 
                            className={`${patientApprovals1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/front-desk-patient-approvals')}
                        >


                            <div className="">

                                <SiTicktick 
                                    className={`${patientApprovals2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                Patient Approvals

                            </div>

                        </div>

                        <div 
                            className={`${followUpPatients} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/front-desk-follow-up')}
                        >


                            <div className="">

                                <MdFollowTheSigns 
                                    className={`${followUpPatients2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                Follow-up Patients

                            </div>

                        </div>

                        <div 
                            className={`${crossConsultationApprovals} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/front-desk-cross-consultation-approvals')}
                        >


                            <div className="">

                                <FaUserDoctor 
                                    className={`${crossConsultationApprovals2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                Cross Consultation Approvals

                            </div>

                        </div>

                        <div 
                            className={`${moreButtonStyle1} font-sans text-base transition-all cursor-pointer mt-auto mb-5 flex items-center space-x-2 relative`}
                            onClick={() => {

                                if ( moreButtonActivated ){

                                    setMoreButtonActivated(false);

                                }else {

                                    setMoreButtonActivated(true);

                                }

                            }}
                        >

                            <div className="">

                                <CgDetailsMore 
                                    className={`${moreButtonStyle2} text-2xl  leading-8 p-[2px] rounded-md`}
                                />

                            </div>

                            <div className="">

                                More

                            </div>

                            {moreButtonActivated && (

                                <div className="absolute w-full top-[-50px] left-[-7px]">

                                    <div 
                                        className="bg-[#334155] text-white text-sm inline-block px-2 py-2 rounded-lg hover:opacity-60 active:opacity-80"
                                        onClick={copyMyLinkFunction}    
                                    >

                                        Duplicate Onboard Link

                                    </div>

                                </div>
                                
                            )}

                        </div>

                    </div>

            )}

        </>

    )

}

export default LeftNavBarFrontDesk