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

function GoWorkRouter() {

	return (

		<>

				<Routes>

					<Route index element={<HomePage />} />
					<Route path='/' element={<HomePage />} />
					<Route path='/front-desk-login' element={<FrontDesk />} />
					<Route path='/medical-support-login' element={<MedicalSupport />} />
					<Route path='/tele-support-login' element={<TeleSupport />} />
					<Route path='/pharmacy-care-login' element={<PharmacyCare />} />
					<Route path='/ot-coordination-login' element={<OtCoordination />} />
					<Route path='/diagnostics-center-login' element={<DiagnosticsCenter />} />
					<Route path='/transport-team-login' element={<TransportTeam />} />

					<Route path='/front-desk-register' element={<FrontDeskRegister />} />
					<Route path='/medical-support-register' element={<MedicalSupportRegister />} />
					<Route path='/tele-support-register' element={<TeleSupportRegister />} />
					<Route path='/pharmacy-care-register' element={<PharmacyCareRegister />} />
					<Route path='/ot-coordination-register' element={<OtCoordinationRegister />} />
					<Route path='/diagnostics-center-register' element={<DiagnosticsCenterRegister />} />
					<Route path='/transport-team-register' element={<TransportTeamRegister />} />

					{/* ADMIN ROUTING */}
					<Route element={<AdminPageLayout />}>
						<Route path='/admin-new-approvals' element={<NewApprovals />}/>
					</Route>

					{/* FRONTDESK ROUTING */}
					<Route element={<FrontDeskLayout />}>
						<Route path="/front-desk-new-patient-on-board" element={<NewPatientOnBoardFrontDesk />} />
						<Route path="/front-desk-consultation-queue" element={<ConsulationQueueFrontDesk />} />
						<Route path="/front-desk-consultation-queue/:id" element={<ConsultationQueueProfileFrontDesk />} />
					</Route>

					{/* MEDICALSUPPORT ROUTING */}
					<Route element={<MedicalSupportLayout />}>
						<Route path='/medical-support-consulation-queue' element={<ConsultationQueueMedicalSupport />}/>
						<Route path="/medical-support-consultation-queue/:id" element={<ConsultationQueueProfileMedicalSupport />} />
					</Route>

				</Routes>
			
		</>
	
	)

}

export default GoWorkRouter
