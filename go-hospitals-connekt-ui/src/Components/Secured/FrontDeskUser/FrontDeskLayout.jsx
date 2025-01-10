import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBarUser from '../NavBar/NavBarUser';
// import LeftNavBar from '../NavBar/LeftNavBar';
import LeftNavBarFrontDesk from './NavBar/LeftNavBarFrontDesk';

const FrontDeskLayout = () => {
    return (
        <>
            <NavBarUser />
            {/* <LeftNavBar /> */}
            <LeftNavBarFrontDesk />
            <div className="pt-16 pl-[457px] mt-10 mr-16">
                <Outlet /> {/* This is where the child components (like ConsultationQueue) will be rendered */}
            </div>
        </>
    );
};

export default FrontDeskLayout;
