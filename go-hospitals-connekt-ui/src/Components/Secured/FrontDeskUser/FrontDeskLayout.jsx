import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftNavBarFrontDesk from './NavBar/LeftNavBarFrontDesk';
import FrontDeskNavBar from './NavBar/FrontDeskNavBar';

const FrontDeskLayout = () => {
    return (
        <>
            <FrontDeskNavBar />
            <LeftNavBarFrontDesk />
            <div className="pt-16 pl-[457px] mt-10 mr-16">
                <Outlet /> {/* This is where the child components (like ConsultationQueue) will be rendered */}
            </div>
        </>
    );
};

export default FrontDeskLayout;
