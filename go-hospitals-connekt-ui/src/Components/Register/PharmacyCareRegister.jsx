import React, { useEffect, useState } from 'react'
import { CgLoadbar } from 'react-icons/cg';
import '../../Style/Login/FrontDesk.css'
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../../Style/HomePage.css'

const PharmacyCareRegister = () => {

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    
    useEffect(() => {

        setTimeout(() => {

            setLoading(false);

        }, 500);

    });

    return (

        <>
        
            {loading ? (

                <div className="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center space-x-2">

                    <CgLoadbar 
                        className='animate-spin text-2xl'
                    />

                    <p
                        className='animate-pulse text-2xl'
                    >Loading ...</p>

                </div>

            ): (

                <div className="absolute max-sm:relative top-0 bottom-0 left-0 right-0 flex">

                    <div 
                        className="absolute top-10 text-[35px] left-5 cursor-pointer hover:scale-125 transition-all"
                        onClick={() => navigate('/')}    
                    >

                        <MdOutlineKeyboardBackspace />

                    </div>

                    <div className="min-w-[500px] max-sm:min-w-full flex justify-center text-center mt-24 max-sm:mb-20">

                        <div className="">

                            <div className="">

                                <div className="flex justify-center">

                                    <img 
                                        src='/Go-Hospitals-Logo.webp'
                                        className='w-[70px] h-auto'
                                    />

                                </div>

                                <div className="text-[30px] leading-8 mt-10 mb-5 roboto-regular">

                                    Register to Go Work

                                </div>

                            </div>

                            <form
                                className='text-left bg-[#151b23] border-[#3d444d] border-2 px-5 py-5 rounded-xl mb-5'
                            >

                                <label> First Name</label><br />
                                <input 
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                /><br /><br />

                                <label> Last Name</label><br />
                                <input 
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                /><br /><br />

                                <label> E-mail Address</label><br />
                                <input 
                                    type='email'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                /><br /><br />

                                <label> Password</label><br />
                                <input 
                                    type='password'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[0.5px] focus:outline-none focus:border-blue-600 focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                /><br /><br />

                                <label> Confirm Password</label><br />
                                <input 
                                    type='password'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[0.5px] focus:outline-none focus:border-blue-600 focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                /><br /><br />

                                <button
                                    className='bg-[#238636] w-full rounded-lg leading-10 hover:cursor-pointer'
                                >

                                    Login

                                </button>

                            </form>

                            <div
                                className='text-left border-[#3d444d] border-2 px-5 py-4 rounded-xl justify-center items-center'
                            >

                                Already Registered? 
                                <span 
                                    className='text-blue-500 ml-2 hover:cursor-pointer'
                                    onClick={() => navigate('/pharmacy-care-login')}
                                >Login your account</span>

                            </div>

                        </div>

                    </div>

                    <div className="flex-1 loginPageImage4 m-2 max-sm:hidden">

                        {/* Image Area */}

                    </div>
    
                </div>

            )}
        
        </>

    )

}

export default PharmacyCareRegister