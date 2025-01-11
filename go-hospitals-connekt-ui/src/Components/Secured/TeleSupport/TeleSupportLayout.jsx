import React from 'react'
import { Outlet } from 'react-router-dom'
import TeleSupportNavBar from './NavBar/TeleSupportNavBar'
import TeleSupportLeftNavBar from './NavBar/TeleSupportLeftNavBar'

const TeleSupportLayout = () => {

    return (

        <>

            <TeleSupportNavBar /> 
            <TeleSupportLeftNavBar />
            <div className="pt-16 pl-[457px] mt-10 mr-56">

                <Outlet />

            </div>

        </>

    )

}

export default TeleSupportLayout