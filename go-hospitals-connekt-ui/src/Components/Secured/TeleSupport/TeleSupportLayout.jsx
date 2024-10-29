import React from 'react'
import NavBarUser from '../NavBar/NavBarUser'
import LeftNavBar from '../NavBar/LeftNavBar'
import { Outlet } from 'react-router-dom'

const TeleSupportLayout = () => {

    return (

        <>

            <NavBarUser />
            <LeftNavBar />

            <div className="pt-16 pl-[457px] mt-10 mr-56">

                <Outlet />

            </div>

        </>

    )

}

export default TeleSupportLayout