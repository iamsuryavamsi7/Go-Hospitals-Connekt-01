import React from 'react'
import { Outlet } from 'react-router-dom'
import OtCoordinationLeftNavBar from './NavBar/OtCoordinationLeftNavBar'
import OtCoordinationNavBar from './NavBar/OtCoordinationNavBar'

const OtCoordinationPageLayout = () => {

    return (

        <>
        
            <OtCoordinationNavBar />
            <OtCoordinationLeftNavBar />
            <div className="pt-16 pl-[457px] mt-10 mr-56">
                <Outlet /> {/* This is where the child components (like ConsultationQueue) will be rendered */}
            </div>
        
        </>

    )

}

export default OtCoordinationPageLayout