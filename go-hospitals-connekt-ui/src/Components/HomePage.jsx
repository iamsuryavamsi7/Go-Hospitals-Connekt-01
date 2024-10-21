import React from 'react'
import '../Style/HomePage.css'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar';

const HomePage = () => {

    const navigate = useNavigate();

    return (

        <>
        
            <NavBar />

            <div className="h-auto w-full">

                <div className="mt-10 max-sm:mt-5 text-center">

                    <div className="text-[50px] max-lg:text-[40px] max-sm:text-[30px] max-sm:mx-5 roboto-regular">

                        Welcome To Go Hospitals Staff Portal

                    </div>

                    <div
                        className='text-gray-400 text-lg max-lg:text-base max-sm:text-xs max-sm:mx-10'
                    >
                        
                        Select Your Department to access essential tools, resources, and team collaboration features
                        
                    </div>

                </div>

                <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 mx-56 max-lg:mx-24 max-sm:mx-14 gap-x-5 gap-y-5 mt-10 text-center mb-10">

                    <div 
                        className="h-40 w-auto flex items-center justify-center bg-gray-800 rounded-xl hover:scale-105 transition-all cursor-pointer"
                        onClick={() => navigate('/front-desk-login')}    
                    >

                        <div className="">

                            <div className="text-[40px] max-lg:text-[30px]">

                                Front Desk

                            </div>

                            <div className="text-gray-400 max-sm:max-w-[200px] text-md max-lg:text-xs">

                                Manage appointments and schedules 

                            </div>

                        </div>

                    </div>

                    <div 
                        className="h-40 w-auto flex items-center justify-center bg-gray-800 rounded-xl hover:scale-105 transition-all cursor-pointer"
                        onClick={() => navigate('/medical-support-login')}    
                    >

                        <div className="">

                            <div className="text-[40px] max-lg:text-[30px]">

                                Medical Support

                            </div>

                            <div className="text-gray-400 max-sm:max-w-[200px] text-md max-lg:text-xs">

                                From consultation to co-ordination 

                            </div>

                        </div>

                    </div>

                    <div 
                        className="h-40 w-auto flex items-center justify-center bg-gray-800 rounded-xl hover:scale-105 transition-all cursor-pointer"
                        onClick={() => navigate('/tele-support-login')}
                    >

                        <div className="">

                            <div className="text-[40px] max-lg:text-[30px]">

                                Tele Support

                            </div>

                            <div className="text-gray-400 text-md max-lg:text-xs max-w-[300px] max-sm:max-w-[200px]">

                                 Bridging communication between doctor and patient

                            </div>

                        </div>

                    </div>

                    <div 
                        className="h-40 w-auto flex items-center justify-center bg-gray-800 rounded-xl hover:scale-105 transition-all cursor-pointer"
                        onClick={() => navigate('/pharmacy-care-login')}
                    >

                        <div className="">

                            <div className="text-[40px] max-lg:text-[30px]">

                                Pharmacy care

                            </div>

                            <div className="text-gray-400 text-md max-lg:text-xs max-w-[300px] max-sm:max-w-[200px]">

                                To ensure medications reach patients smoothly 

                            </div>

                        </div>

                    </div>

                    <div 
                        className="h-40 w-auto flex items-center justify-center bg-gray-800 rounded-xl hover:scale-105 transition-all cursor-pointer"
                        onClick={() => navigate('/ot-coordination-login')}
                    >

                        <div className="">

                            <div className="text-[40px] max-lg:text-[30px]">

                                OT Coordination

                            </div>

                            <div className="text-gray-400 text-md max-lg:text-xs max-sm:max-w-[200px]">

                                Managing operation theatre 

                            </div>

                        </div>

                    </div>

                    <div 
                        className="h-40 w-auto flex items-center justify-center bg-gray-800 rounded-xl hover:scale-105 transition-all cursor-pointer"
                        onClick={() => navigate('/diagnostics-center-login')}    
                    >

                        <div className="">

                            <div className="text-[40px] max-lg:text-[30px] max-sm:max-w-[200px]">

                                Diagnostics Center

                            </div>

                            <div className="text-gray-400 text-md max-lg:text-xs max-sm:max-w-[200px]">

                                Expertly manage diagnostic needs

                            </div>

                        </div>

                    </div>

                    <div 
                        className="h-40 w-auto flex items-center justify-center bg-gray-800 rounded-xl hover:scale-105 transition-all cursor-pointer"
                        onClick={() => navigate('/transport-team-login')}
                    >

                        <div className="">

                            <div className="text-[40px] max-lg:text-[30px]">

                                Transport Team

                            </div>

                            <div className="text-gray-400 text-md max-lg:text-xs max-w-[300px] max-sm:max-w-[200px]">

                                Connecting departments with timely transport

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}

export default HomePage