import React from 'react'
import { Outlet } from 'react-router-dom'
import MedicalSupportUserLeftNavBar from './NavBar/MedicalSupportUserLeftNavBar'
import MedicalSupportUserNavBar from './NavBar/MedicalSupportUserNavBar'

const MedicalSupportLayout = () => {

    return (

        <>
        
            <MedicalSupportUserNavBar />
            <MedicalSupportUserLeftNavBar />
            <div className="pt-16 pl-[457px] mt-10 mr-56">
                <Outlet /> {/* This is where the child components (like ConsultationQueue) will be rendered */}
            </div>
        
        </>

    )

}

export default MedicalSupportLayout