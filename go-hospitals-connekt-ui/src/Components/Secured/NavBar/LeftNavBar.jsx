import React, { useEffect, useState } from 'react'
import { IoPeopleCircleOutline, IoPersonAddSharp } from 'react-icons/io5';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdFollowTheSigns, MdManageAccounts } from 'react-icons/md';
import { FaBriefcaseMedical, FaHospitalUser, FaStethoscope, FaTasks } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { LiaExchangeAltSolid } from 'react-icons/lia';
import { TbExchange } from 'react-icons/tb';
import { SiTicktick } from 'react-icons/si';

const LeftNavBar = () => {

// UseNavigation Hook
    const navigate = useNavigate();

// JWT Token
    const access_token = Cookies.get('access_token');

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const roles = {
        admin: 'ADMIN',
        frontDesk: 'FRONTDESK',
        medicalSupport: 'MEDICALSUPPORT',
        teleSupport: 'TELESUPPORT',
        pharmacyCare: 'PHARMACYCARE',
        otCoordination: 'OTCOORDINATION',
        diagnosticsCenter: 'DIAGNOSTICSCENTER',
        transportTeam: 'TRANSPORTTEAM'
    }

    const [consulationQueueMedical1, setConsulationQueueMedical1] = useState(`text-gray-400`);

    const [consulationQueueMedical2, setConsulationQueueMedical2] = useState(`text-gray-400`);

    const [newApprovals, setNewApprovals] = useState(`text-gray-400`);

    const [newApprovals2, setNewApprovals2] = useState(`text-gray-400`);

    const [newPatientRegistration, setNewPatientRegistration] = useState(`text-gray-400`);

    const [newPatientRegistration2, setNewPatientRegistration2] = useState(`text-gray-400`);

    const [pendingConsultations, setPendingConsultations] = useState(`text-gray-400`);

    const [pendingConsultations2, setPendingConsultations2] = useState(`text-gray-400`);

    const [followUpPatients, setFollowUpPatients] = useState(`text-gray-400`);

    const [followUpPatients2, setFollowUpPatients2] = useState(`text-gray-400`);

    const [adminmanagement1, setAdminmanagement1] = useState(`text-gray-400`);

    const [adminmanagement2, setAdminmanagement2] = useState(`text-gray-400`);

    const [myJobsMedical1, setMyJobsMedical1] = useState(`text-gray-400`);

    const [myJobsMedical2, setMyJobsMedical2] = useState(`text-gray-400`);

    const [onSiteTreatment1, setOnSiteTreatment1] = useState(`text-gray-400`);

    const [onSiteTreatment2, setOnSiteTreatment2] = useState(`text-gray-400`);

    const [medicationPlusFollowUp1, setMedicationPlusFollowUp1] = useState(`text-gray-400`);

    const [medicationPlusFollowUp2, setMedicationPlusFollowUp2] = useState(`text-gray-400`);

    const [surgeryCare1, setSurgeryCare1] = useState(`text-gray-400`);

    const [surgeryCare2, setSurgeryCare2] = useState(`text-gray-400`);

    const [pharmacy1, setPharmacy1] = useState(`text-gray-400`);

    const [pharmacy2, setPharmacy2] = useState(`text-gray-400`);

    const [crossConsultation1, setCrossConsultation1] = useState(`text-gray-400`);

    const [crossConsultation2, setCrossConsultation2] = useState(`text-gray-400`);

    const [patientAdmit1, setPatientAdmit1] = useState(`text-gray-400`);

    const [patientAdmit2, setPatientAdmit2] = useState(`text-gray-400`);

    const [pendingMedications1, setPendingMedications1] = useState(`text-gray-400`);

    const [pendingMedications2, setPendingMedications2] = useState(`text-gray-400`);

    const [completedMedication1, setCompletedMedications1] = useState(`text-gray-400`);

    const [completedMedication2, setCompletedMedications2] = useState(`text-gray-400`);

    const [patientApprovals1, setPatientApprovals1] = useState(`text-gray-400`);

    const [patientApprovals2, setPatientApprovals2] = useState(`text-gray-400`);

    const pathName = window.location.pathname;

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

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

        }else {

            console.log("Jwt Token Not Available");

        }

        // ADMIN LEFTNAVBAR
        if ( pathName === '/admin-new-approvals'){

            setNewApprovals(`text-sky-500`)

            setNewApprovals2(`bg-sky-500 text-white`)

        } else {

            setNewApprovals(`text-gray-400`)

            setNewApprovals2(`text-gray-400`)

        }

        if ( pathName === '/admin-management'){

            setAdminmanagement1(`text-sky-500`)

            setAdminmanagement2(`bg-sky-500 text-white`)

        } else {

            setAdminmanagement1(`text-gray-400`)

            setAdminmanagement2(`text-gray-400`)

        }

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

        if ( pathName === `/medical-support-pharmacy`){

            setPharmacy1(`text-sky-500`);

            setPharmacy2(`bg-sky-500 text-white`);

        } else {

            setPharmacy1(`text-gray-400`);

            setPharmacy2(`text-gray-400`);            

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

        // PHARMACY LEFTNAVBAR
        if ( pathName === `/pharmacy-pending-medications`){

            setPendingMedications1(`text-sky-500`);

            setPendingMedications2(`bg-sky-500 text-white`);

        } else {

            setPendingMedications1(`text-gray-400`);

            setPendingMedications2(`text-gray-400`);            

        }

        if ( pathName === `/pharmacy-completed-medications`){

            setCompletedMedications1(`text-sky-500`);

            setCompletedMedications2(`bg-sky-500 text-white`);

        } else {

            setCompletedMedications1(`text-gray-400`);

            setCompletedMedications2(`text-gray-400`);            

        }

    }, [pathName]);

    return (

        <>

            {role === roles.admin && (

                <>
                
                    <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                        <div 
                            className={`${newApprovals} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/admin-new-approvals')}
                        >

                            <div className="">

                                <IoPersonAddSharp 
                                    className={`${newApprovals2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                New Approvals

                            </div>

                        </div>

                        <div 
                            className={`${adminmanagement1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/admin-management')}
                        >

                            <div className="">

                                <MdManageAccounts 
                                    className={`${adminmanagement2} text-[28px]  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                Management

                            </div>

                        </div>

                    </div>

                </>

            )}

            {role === roles.frontDesk && (

                <>

                    <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

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

                    </div>

                </>

            )}

            {role === roles.medicalSupport && (

                <>

                    <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                        <div 
                            className={`${consulationQueueMedical1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/medical-support-consulation-queue')}
                        >

                            <div className=""> 

                                <IoPersonAddSharp 
                                    className={`${consulationQueueMedical2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                Consulation Queue

                            </div>

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

                                My Jobs

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

                                Surgery Care

                            </div>

                        </div>

                        <div 
                            className={`${pharmacy1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/medical-support-pharmacy')}
                        >

                            <div className="">

                                <GiMedicines 
                                    className={`${pharmacy2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                Pharmacy

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

                </>

            )}

            {role === roles.pharmacyCare && (

                <>

                    <div className="mx-56 w-[233px] text-left bottom-0 fixed top-20 border-r-[1px] border-gray-800">

                        <div 
                            className={`${pendingMedications1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/pharmacy-pending-medications')}
                        >

                            <div className="">

                                <IoPersonAddSharp 
                                    className={`${pendingMedications2} text-2xl  leading-8 p-1 rounded-md`}
                                />

                            </div>

                            <div className="">

                                Pending Medications

                            </div>

                        </div>

                        <div 
                            className={`${completedMedication1} font-sans text-base transition-all mt-5 cursor-pointer flex items-center space-x-3`}
                            onClick={() => navigate('/pharmacy-completed-medications')}
                        >

                            <div className="">

                                <IoPeopleCircleOutline 
                                    className={`${completedMedication2} text-2xl  leading-8 p-[1px] rounded-md`}
                                />

                            </div>

                            <div className="">

                                Completed Medications

                            </div>

                        </div>

                    </div>

                </>

            )}

        </>

    )

}

export default LeftNavBar