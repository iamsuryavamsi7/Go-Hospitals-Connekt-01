import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftNavBarFrontDesk from './NavBar/LeftNavBarFrontDesk';
import FrontDeskNavBar from './NavBar/FrontDeskNavBar';

const FrontDeskLayout = () => {
    return (
        <>
            <FrontDeskNavBar />
            <LeftNavBarFrontDesk />
            <div className="pt-16 lg:pl-[457px] lg:mt-10 max-sm:mt-5 lg:mr-16">
                <Outlet /> {/* This is where the child components (like ConsultationQueue) will be rendered */}
            </div>
        </>
    );
};

export default FrontDeskLayout;
