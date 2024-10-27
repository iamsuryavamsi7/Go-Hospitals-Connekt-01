import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './Components/HomePage'
import FrontDesk from './Components/Login/FrontDesk'
import MedicalSupport from './Components/Login/MedicalSupport'
import TeleSupport from './Components/Login/TeleSupport'
import PharmacyCare from './Components/Login/PharmacyCare'
import OtCoordination from './Components/Login/OtCoordination'
import DiagnosticsCenter from './Components/Login/DiagnosticsCenter'
import TransportTeam from './Components/Login/TransportTeam'
import FrontDeskRegister from './Components/Register/FrontDeskRegister'
import MedicalSupportRegister from './Components/Register/MedicalSupportRegister'
import TeleSupportRegister from './Components/Register/TeleSupportRegister'
import PharmacyCareRegister from './Components/Register/PharmacyCareRegister'
import OtCoordinationRegister from './Components/Register/OtCoordinationRegister'
import DiagnosticsCenterRegister from './Components/Register/DiagnosticsCenterRegister'
import TransportTeamRegister from './Components/Register/TransportTeamRegister'
import NewPatientOnBoardFrontDesk from './Components/Secured/FrontDeskUser/Components/NewPatientOnBoardFrontDesk'
import ConsulationQueueFrontDesk from './Components/Secured/FrontDeskUser/Components/ConsulationQueueFrontDesk'
import NewApprovals from './Components/Secured/AdminUser/Components/NewApprovals'
import ConsultationQueueProfileMedicalSupport from './Components/Secured/MedicalSupportUser/Components/ConsultationQueueProfileMedicalSupport'
import ConsultationQueueMedicalSupport from './Components/Secured/MedicalSupportUser/Components/ConsultationQueueMedicalSupport'
import ConsultationQueueProfileFrontDesk from './Components/Secured/FrontDeskUser/Components/ConsultationQueueProfileFrontDesk'
import FrontDeskLayout from './Components/Secured/FrontDeskUser/FrontDeskLayout'
import AdminPageLayout from './Components/Secured/AdminUser/AdminPageLayout'
import MedicalSupportLayout from './Components/Secured/MedicalSupportUser/MedicalSupportLayout'
import AdminManagement from './Components/Secured/AdminUser/Components/AdminManagement'
import CurrentJob from './Components/Secured/MedicalSupportUser/Components/CurrentJob'
import MyJobsConsulationProfileMedicalSupport from './Components/Secured/MedicalSupportUser/Components/MyJobsConsulationProfileMedicalSupport'
import OnSiteTreatement from './Components/Secured/MedicalSupportUser/Components/OnSiteTreatement'
import MedicationPlusFollowUp from './Components/Secured/MedicalSupportUser/Components/MedicationPlusFollowUp'
import SurgeryCare from './Components/Secured/MedicalSupportUser/Components/SurgeryCare'
import Pharmacy from './Components/Secured/MedicalSupportUser/Components/Pharmacy'
import CrossConsulation from './Components/Secured/MedicalSupportUser/Components/CrossConsulation'
import PatientAdmit from './Components/Secured/MedicalSupportUser/Components/PatientAdmit'
import OnSiteTreatmentProfile from './Components/Secured/MedicalSupportUser/Components/OnSiteTreatmentProfile'
import PharmacyPageLayout from './Components/Secured/PharmacyUser/PharmacyPageLayout'
import PendingMedications from './Components/Secured/PharmacyUser/Components/PendingMedications'
import CompletedMedications from './Components/Secured/PharmacyUser/Components/CompletedMedications'
import PharmacyProfiles from './Components/Secured/PharmacyUser/Components/PharmacyProfiles'
import FrontDeskForgetPassword from './Components/ForgetPassword/FrontDeskForgetPassword'
import MedicalSupportForgetPassword from './Components/ForgetPassword/MedicalSupportForgetPassword'
import PharmacyCareForgetPassword from './Components/ForgetPassword/PharmacyCareForgetPassword'
import MedicalPlusFollowUpProfile from './Components/Secured/MedicalSupportUser/Components/MedicalPlusFollowUpProfile'
import SurgeryCareProfile from './Components/Secured/MedicalSupportUser/Components/SurgeryCareProfile'
import PharmacyProfile from './Components/Secured/MedicalSupportUser/Components/PharmacyProfile'
import PatientAdmitProfile from './Components/Secured/MedicalSupportUser/Components/PatientAdmitProfile'
import FollowUp from './Components/Secured/FrontDeskUser/Components/FollowUp'
import FollowUpProfile from './Components/Secured/FrontDeskUser/Components/FollowUpProfile'
import PatientApprovals from './Components/Secured/FrontDeskUser/Components/PatientApprovals'

function GoWorkRouter() {

	return (

		<>

				<Routes>

					{/* BASE ROUTING */}
					<Route index element={<HomePage />} />
					<Route path='/' element={<HomePage />} />

					{/* REGISTER ROUTING */}
					<Route path='/front-desk-register' element={<FrontDeskRegister />} />
					<Route path='/medical-support-register' element={<MedicalSupportRegister />} />
					<Route path='/tele-support-register' element={<TeleSupportRegister />} />
					<Route path='/pharmacy-care-register' element={<PharmacyCareRegister />} />
					<Route path='/ot-coordination-register' element={<OtCoordinationRegister />} />
					<Route path='/diagnostics-center-register' element={<DiagnosticsCenterRegister />} />
					<Route path='/transport-team-register' element={<TransportTeamRegister />} />

					{/* LOGIN ROUTING */}
					<Route path='/front-desk-login' element={<FrontDesk />} />
					<Route path='/medical-support-login' element={<MedicalSupport />} />
					<Route path='/tele-support-login' element={<TeleSupport />} />
					<Route path='/pharmacy-care-login' element={<PharmacyCare />} />
					<Route path='/ot-coordination-login' element={<OtCoordination />} />
					<Route path='/diagnostics-center-login' element={<DiagnosticsCenter />} />
					<Route path='/transport-team-login' element={<TransportTeam />} />

					{/* FORGET PASSWORD ROUTING */}
					<Route path='/front-desk-forget' element={<FrontDeskForgetPassword />}/>
					<Route path='/medical-support-forget' element={<MedicalSupportForgetPassword />}/>
					<Route path='/pharmacy-care-forget' element={<PharmacyCareForgetPassword />}/>

					{/* ADMIN ROUTING */}
					<Route element={<AdminPageLayout />}>
						<Route path='/admin-new-approvals' element={<NewApprovals />}/>
						<Route path='/admin-management' element={<AdminManagement />}/>
					</Route>

					{/* FRONTDESK ROUTING */} 
					<Route element={<FrontDeskLayout />}>
						<Route path="/front-desk-new-patient-on-board" element={<NewPatientOnBoardFrontDesk />} />
						<Route path="/front-desk-consultation-queue" element={<ConsulationQueueFrontDesk />} />
						<Route path="/front-desk-consultation-queue/:id" element={<ConsultationQueueProfileFrontDesk />} />
						<Route path="/front-desk-follow-up" element={<FollowUp />} />
						<Route path="/front-desk-follow-up-profile/:id" element={<FollowUpProfile />} />
						<Route path='/front-desk-patient-approvals' element={<PatientApprovals />}/>
					</Route>

					{/* MEDICALSUPPORT ROUTING */}
					<Route element={<MedicalSupportLayout />}>
						<Route path='/medical-support-consulation-queue' element={<ConsultationQueueMedicalSupport />}/>
						<Route path="/medical-support-consultation-queue/:id" element={<ConsultationQueueProfileMedicalSupport />} />
						<Route path='/medical-support-current-job' element={<CurrentJob />} />
						<Route path='/medical-support-consultation-queue-current-job/:id' element={<MyJobsConsulationProfileMedicalSupport />} />
						<Route path='/medical-support-on-site-treatement' element={<OnSiteTreatement />}/>
						<Route path='/medical-support-medication-plus-follow-up' element={<MedicationPlusFollowUp />}/>
						<Route path='/medical-support-surgery-care' element={<SurgeryCare />}/>
						<Route path='/medical-support-pharmacy' element={<Pharmacy />}/>
						<Route path='/medical-support-cross-consultation' element={<CrossConsulation />}/>
						<Route path='/medical-support-patient-admit' element={<PatientAdmit />}/>
						<Route path='/medical-support-onsite-treatment-profile/:id' element={<OnSiteTreatmentProfile />}/>
						<Route path='/medical-support-medical-plus-follow-up-profile/:id' element={<MedicalPlusFollowUpProfile />}/>
						<Route path='/medical-support-surgery-care-profile/:id' element={<SurgeryCareProfile />}/>
						<Route path='/medical-support-pharmacy-profile/:id' element={<PharmacyProfile />}/>
						<Route path='/medical-support-patient-admit-profile/:id' element={<PatientAdmitProfile />}/>
					</Route>

					{/* PHARMACYPAGE LAYOUT */}
					<Route element={<PharmacyPageLayout />}>
						<Route path='/pharmacy-pending-medications' element={<PendingMedications />}/>
						<Route path='/pharmacy-completed-medications' element={<CompletedMedications />}/>
						<Route path='/pharmacy-profiles/:id' element={<PharmacyProfiles />}/>
					</Route>

				</Routes>
			
		</>
	
	)

}

export default GoWorkRouter
