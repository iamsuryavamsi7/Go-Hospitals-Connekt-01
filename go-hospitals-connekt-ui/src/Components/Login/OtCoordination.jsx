import React, { useEffect, useState } from 'react'
import { CgLoadbar } from 'react-icons/cg';
import '../../Style/Login/FrontDesk.css'
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../../Style/HomePage.css'
import Cookies from 'js-cookie';
import axios from 'axios';

const OtCoordination = () => {

    // Use Navigation Hook
    const navigate = useNavigate();

    // State Management
    const [loading, setLoading] = useState(true);

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BadEnd API Cookie Saving Path
    const goHospitalsCookieSavingPath = import.meta.env.VITE_COOKIE_SAVING_PATH;

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Functions
    const handleError = (error) => {

        if ( error.response ){
    
            if ( error.response.status === 403 ){
    
                console.log(error.response);
    
            } else {
    
                console.error(error);
    
            }
    
        }
    
    }

    const handleLoginFormData = (e) => {

        const value = e.target.value;

        setLoginData({...loginData, [e.target.name]: value});

    }

    const formSubmitFunction = async (e) => {

        e.preventDefault();

        try{

            const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/auth/authenticate-ot-coordination`, loginData);

            if ( response.status === 200 ){

                const access_token = response.data.access_token;

                Cookies.remove('access_token')

                Cookies.set('access_token', access_token, {
                    path: '/',
                    domain: goHospitalsCookieSavingPath, 
                    expires: 1,
                    secure: false, // Set to true if using HTTPS
                    sameSite: 'Lax' // Allows sharing across subdomains
                });

                const fetchRole = async () => {

                    const formData = new FormData();

                    formData.append("jwtToken", access_token);

                    try{

                        const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/auth/fetchUserRole`, formData);

                        if ( response.status === 200 ){

                            const fetchedRole = response.data.role;

                            if ( fetchedRole === 'ADMIN' ){

                                navigate('/admin-new-approvals');

                            } else {

                                navigate('/ot-coordination-current-surgeries');

                            }

                        }

                    }catch(error){

                        handleError(error);

                    }

                }

                fetchRole();

            }

        }catch(error){

            handleError(error);

            alert("Invalid Credentials")

            Cookies.remove('access_token');

        }

    }
    
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

                                    Login to Go Work

                                </div>

                            </div>

                            <form
                                className='text-left bg-[#151b23] border-[#3d444d] border-2 px-5 py-5 rounded-xl mb-5'
                                onSubmit={(e) => formSubmitFunction(e)}
                            >

                                <label> E-mail Address</label><br />
                                <input 
                                    type='email'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='email'
                                    value={loginData.email}
                                    onChange={(e) => handleLoginFormData(e)}
                                    onKeyDown={(e) => {

                                        if ( e.key === 'Enter' ){

                                            e.preventDefault();

                                        }

                                    }}
                                /><br /><br />

                                <div className="flex justify-between">

                                    <label> Password</label><br />
                                    <button
                                        className='text-blue-500 text-xs hover:cursor-pointer'
                                    >

                                        Forgot password?

                                    </button>

                                </div>
                                <input 
                                    type='password'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[0.5px] focus:outline-none focus:border-blue-600 focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='password'
                                    value={loginData.password}
                                    onChange={(e) => handleLoginFormData(e)}
                                    onKeyDown={(e) => {

                                        if ( e.key === 'Enter' ){

                                            e.preventDefault();

                                        }

                                    }}
                                /><br /><br />

                                <button
                                    className='bg-[#238636] w-full rounded-lg leading-10 hover:cursor-pointer'
                                    type='submit'
                                >

                                    Login

                                </button>

                            </form>

                            <div
                                className='text-left border-[#3d444d] border-2 px-5 py-4 rounded-xl justify-center items-center'
                            >

                                New to Go Work? 
                                
                                <span 
                                    className='text-blue-500 ml-2 hover:cursor-pointer'
                                    onClick={() => navigate('/ot-coordination-register')}
                                >Create an account</span>

                            </div>

                        </div>

                    </div>

                    <div className="flex-1 loginPageImage5 m-2 max-sm:hidden">

                        {/* Image Area */}

                    </div>
    
                </div>

            )}
        
        </>

    )   

}

export default OtCoordination