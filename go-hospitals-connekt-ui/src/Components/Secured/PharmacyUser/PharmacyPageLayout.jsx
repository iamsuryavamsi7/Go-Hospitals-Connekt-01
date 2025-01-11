import React from 'react'
import { Outlet } from 'react-router-dom'
import PharmacyLeftNavBar from './NavBar/PharmacyLeftNavBar'
import PharmacyNavBar from './NavBar/PharmacyNavBar'

const PharmacyPageLayout = () => {

    return (

        <>
        
            <PharmacyNavBar />
            <PharmacyLeftNavBar />
            <div className="pt-16 pl-[457px] mt-10 mr-56">
                <Outlet /> {/* This is where the child components (like ConsultationQueue) will be rendered */}
            </div>
        
        </>

    )

}

export default PharmacyPageLayout