import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { IoPersonAddSharp } from 'react-icons/io5';
import { FaBriefcaseMedical, FaHospitalUser, FaStethoscope, FaTasks } from 'react-icons/fa';
import { TbExchange } from 'react-icons/tb';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const MedicalSupportUserLeftNavBar = () => {

    // UseNavigation Hook
    const navigate = useNavigate();
    
    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    // State to store the role
    const [role, setRole] = useState(``);

    // Nurse Variable value
    const medicalSupportUser = 'MEDICALSUPPORT'

    // Function to fetch user role
    const setUserRole = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/medical-support/fetchUserRole`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const userRole = response.data;

                setRole(userRole);

            }

        }catch(error){

            handleError(error);

        }

    }

    // Pathname to get the hold on page change
    const pathName = window.location.pathname;

    // Running required functions when the component mounts
    useEffect(() => {

        if ( access_token ){

            setUserRole();

            if ( pathName !== `/medical-support-consulation-queue` ){

                checkWaitingPatientsAreAvailableOrNot();

            }

        }else {

            window.open(`${goHospitalsFRONTENDBASEURL}`, '_self');

        }

    }, []);

    // States to manage left nav bar style
    const [consulationQueueMedical1, setConsulationQueueMedical1] = useState(`text-gray-400`);

    const [consulationQueueMedical2, setConsulationQueueMedical2] = useState(`text-gray-400`);

    const [myJobsMedical1, setMyJobsMedical1] = useState(`text-gray-400`);

    const [myJobsMedical2, setMyJobsMedical2] = useState(`text-gray-400`);

    const [onSiteTreatment1, setOnSiteTreatment1] = useState(`text-gray-400`);

    const [onSiteTreatment2, setOnSiteTreatment2] = useState(`text-gray-400`);

    const [medicationPlusFollowUp1, setMedicationPlusFollowUp1] = useState(`text-gray-400`);

    const [medicationPlusFollowUp2, setMedicationPlusFollowUp2] = useState(`text-gray-400`);

    const [surgeryCare1, setSurgeryCare1] = useState(`text-gray-400`);

    const [surgeryCare2, setSurgeryCare2] = useState(`text-gray-400`);

    const [crossConsultation1, setCrossConsultation1] = useState(`text-gray-400`);

    const [crossConsultation2, setCrossConsultation2] = useState(`text-gray-400`);

    const [patientAdmit1, setPatientAdmit1] = useState(`text-gray-400`);

    const [patientAdmit2, setPatientAdmit2] = useState(`text-gray-400`);

    useEffect(() => {

        // MEDICALSUPPORT LEFTNAVBAR
        if ( pathName === `/medical-support-consulation-queue`){

            setConsulationQueueMedical1(`text-sky-500`);

            setConsulationQueueMedical2(`bg-sky-500 text-white`);

        }else {

            setConsulationQueueMedical1(`text-gray-400`);

            setConsulationQueueMedical2(`text-gray-400`);

        }

        if ( pathName === `/medical-support-current-job`){

            setMyJobsMedical1(`text-sky-500`);

            setMyJobsMedical2(`bg-sky-500 text-white`);

        }else {

            setMyJobsMedical1(`text-gray-400`);

            setMyJobsMedical2(`text-gray-400`);

        }

        if ( pathName === `/medical-support-on-site-treatement`){

            setOnSiteTreatment1(`text-sky-500`);

            setOnSiteTreatment2(`bg-sky-500 text-white`);

        } else {

            setOnSiteTreatment1(`text-gray-400`);

            setOnSiteTreatment2(`text-gray-400`);            

        }

        if ( pathName === `/medical-support-medication-plus-follow-up`){

            setMedicationPlusFollowUp1(`text-sky-500`);

            setMedicationPlusFollowUp2(`bg-sky-500 text-white`);

        } else {

            setMedicationPlusFollowUp1(`text-gray-400`);

            setMedicationPlusFollowUp2(`text-gray-400`);            

        }

        if ( pathName === `/medical-support-surgery-care`){

            setSurgeryCare1(`text-sky-500`);

            setSurgeryCare2(`bg-sky-500 text-white`);

        } else {

            setSurgeryCare1(`text-gray-400`);

            setSurgeryCare2(`text-gray-400`);            

        }

        if ( pathName === `/medical-support-cross-consultation`){

            setCrossConsultation1(`text-sky-500`);

            setCrossConsultation2(`bg-sky-500 text-white`);

        } else {

            setCrossConsultation1(`text-gray-400`);

            setCrossConsultation2(`text-gray-400`);            
 
        }

        if ( pathName === `/medical-support-patient-admit`){

            setPatientAdmit1(`text-sky-500`);

            setPatientAdmit2(`bg-sky-500 text-white`);

        } else {

            setPatientAdmit1(`text-gray-400`);

            setPatientAdmit2(`text-gray-400`);            

        }

    }, [pathName]);

    // State to handle incomplete work status
    const [leftNavBarRedBall, setLeftNavBarRedBall] = useState({
        waitingPatients: false,
    });

    // Function to run when new notification received
    const checkWaitingPatientsAreAvailableOrNot = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/medical-support/checkWaitingPatientsAreAvailableOrNot`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const booleanValue = response.data;

                if ( booleanValue ){

                    setLeftNavBarRedBall((prevElement) => {

                        const updatedData = {...prevElement};

                        updatedData.waitingPatients = true;

                        return updatedData;

                    });

                }

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to run when the new notification received
    const newNotificationFunction = (message) => {

        const messageobject = JSON.parse(message.body);

        if ( messageobject.notificationType === `WaitingPatientsRefreshLeftNavBar` || messageobject.notificationType === `FollowUpPatientCame` ){

            if ( pathName !== `/medical-support-consulation-queue` ){

                checkWaitingPatientsAreAvailableOrNot();

            }

        }

    }

    // useEffect Hook to handle websockets
    useEffect(() => {

        const socket = new SockJS(`${goHospitalsAPIBaseURL}/go-hospitals-websocket`);
        const client = Stomp.over(() => socket);

        client.connect(
            {},
            () => {

                client.subscribe(`/common/commonFunction`, (message) => newNotificationFunction(message));

            },
            (error) => {

                console.error(error);

            }
        );

        return () => {

            client.disconnect();

        }

    }, []);

    return (

        <>

            {role === medicalSupportUser && (

                <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                    <div 
                        className={`${consulationQueueMedical1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3 relative`}
                        onClick={() => {

                            setLeftNavBarRedBall((prevElement) => {

                                const updatedData = {...prevElement};

                                updatedData.waitingPatients = false;

                                return updatedData;

                            });

                            navigate('/medical-support-consulation-queue')

                        }}
                    >

                        <div className=""> 

                            <IoPersonAddSharp 
                                className={`${consulationQueueMedical2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            Waiting Patients

                        </div>

                        {leftNavBarRedBall.waitingPatients && <div className="bg-red-500 h-2 w-2 rounded-[50%] absolute left-[-30px] top-2 animate-pulse"></div>}

                    </div>

                    <div 
                        className={`${myJobsMedical1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                        onClick={() => navigate('/medical-support-current-job')}
                    >

                        <div className="">

                            <FaTasks 
                                className={`${myJobsMedical2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            My Patients

                        </div>

                    </div>

                    <div 
                        className={`${onSiteTreatment1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                        onClick={() => navigate('/medical-support-on-site-treatement')}
                    >

                        <div className="">

                            <FaStethoscope 
                                className={`${onSiteTreatment2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            On site treatment

                        </div>

                    </div>

                    <div 
                        className={`${medicationPlusFollowUp1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                        onClick={() => navigate('/medical-support-medication-plus-follow-up')}
                    >

                        <div className="">

                            <FaBriefcaseMedical 
                                className={`${medicationPlusFollowUp2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            Medication + Follow Up

                        </div>

                    </div>

                    <div 
                        className={`${surgeryCare1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                        onClick={() => navigate('/medical-support-surgery-care')}
                    >

                        <div className="">

                            <FaHospitalUser 
                                className={`${surgeryCare2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            Surgery

                        </div>

                    </div>

                    <div 
                        className={`${crossConsultation1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                        onClick={() => navigate('/medical-support-cross-consultation')}
                    >

                        <div className="">

                            <TbExchange 
                                className={`${crossConsultation2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            Cross Consultation

                        </div>

                    </div>

                    <div 
                        className={`${patientAdmit1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                        onClick={() => navigate('/medical-support-patient-admit')}
                    >

                        <div className="">

                            <FaHospitalUser 
                                className={`${patientAdmit2} text-2xl  leading-8 p-1 rounded-md`}
                            />

                        </div>

                        <div className="">

                            Patient Admit

                        </div>

                    </div>

                </div>

            )}

        </>
    );

}

export default MedicalSupportUserLeftNavBar