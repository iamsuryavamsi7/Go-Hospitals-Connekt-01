import React, { useEffect, useState } from 'react'
import { CgLoadbar } from 'react-icons/cg';
import '../../Style/Login/FrontDesk.css'
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../../Style/HomePage.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const FrontDeskForgetPassword = () => {

// Use Navigation Hook
    const navigate = useNavigate();

// State Management
    const [loading, setLoading] = useState(true);

    const [otpVerified, setOtpVerified] = useState(false);

    const [loginData, setLoginData] = useState({
        password: '',
        conformPassword: ''
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

    const [otpFormSubmit1Email, setOtpFormSubmit1Email] = useState('');

    const formSubmitFunction = async (e) => {

        e.preventDefault();

        if ( loginData.password === loginData.conformPassword ){

            const email = otpFormSubmit1Email;
        
            const password = loginData.password;

            const formData = new FormData();

            formData.append('userEmail', email);
            formData.append('password', password);

            try{

                const response = await axios.post('http://localhost:7777/api/v1/auth/updatePassword', formData);

                if ( response.status  === 200 ){

                    toast.success("Password Updated", {
                        autoClose: 1000,
                        style: {
                            backgroundColor: '#1f2937', // Tailwind bg-gray-800
                            color: '#fff', // Tailwind text-white
                            fontWeight: '600', // Tailwind font-semibold
                            borderRadius: '0.5rem', // Tailwind rounded-lg
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                            marginTop: '2.5rem' // Tailwind mt-10,
                        },
                        position: 'top-center'
                    });

                    setTimeout(() => {

                        navigate('/front-desk-login');

                    }, 1600);

                }

            }catch(error){

                handleError(error);

            }

        }else{

            toast.error("Passwords Not Matched", {
                autoClose: 2000,
                style: {
                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    color: '#fff', // Tailwind text-white
                    fontWeight: '600', // Tailwind font-semibold
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    marginTop: '2.5rem' // Tailwind mt-10,
                },
                progressStyle: {
                    backgroundColor: 'red' // Tailwind bg-green-400
                },
                position: 'top-center'
            });

        }

    }

    const [otpFormSubmit1EmailStyle, setOtpFormSubmit1EmailStyle] = useState(null);

    const otpFormSubmit1 = async (e) => {

        e.preventDefault();

        if ( otpFormSubmit1Email != '' && otpFormSubmit1Email != null ){

            const formData = new FormData();

            formData.append('userEmail', otpFormSubmit1Email);

            try{

                const response = await axios.post('http://localhost:7777/api/v1/auth/generateOTP', formData);

                if ( response.status === 200 ){

                    const responseData = response.data;
                    
                    console.log(responseData);

                    setOtpFormSubmit1EmailStyle(`pointer-events-none`)

                    toast.success("OTP Generated Successfull", {
                        autoClose: 1000,
                        style: {
                            backgroundColor: '#1f2937', // Tailwind bg-gray-800
                            color: '#fff', // Tailwind text-white
                            fontWeight: '600', // Tailwind font-semibold
                            borderRadius: '0.5rem', // Tailwind rounded-lg
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                            marginTop: '2.5rem' // Tailwind mt-10,
                        },
                        position: 'top-center'
                    });

                }

            }catch(error){

                handleError(error);

                toast.error("Invalid Email", {
                    autoClose: 2000,
                    style: {
                        backgroundColor: '#1f2937', // Tailwind bg-gray-800
                        color: '#fff', // Tailwind text-white
                        fontWeight: '600', // Tailwind font-semibold
                        borderRadius: '0.5rem', // Tailwind rounded-lg
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                        marginTop: '2.5rem' // Tailwind mt-10,
                    },
                    progressStyle: {
                        backgroundColor: 'red' // Tailwind bg-green-400
                    },
                    position: 'top-center'
                });

            }

        }else {

            toast.error("Enter Your Email", {
                        autoClose: 2000,
                        style: {
                            backgroundColor: '#1f2937', // Tailwind bg-gray-800
                            color: '#fff', // Tailwind text-white
                            fontWeight: '600', // Tailwind font-semibold
                            borderRadius: '0.5rem', // Tailwind rounded-lg
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                            marginTop: '2.5rem' // Tailwind mt-10,
                        },
                        progressStyle: {
                            backgroundColor: 'red' // Tailwind bg-green-400
                        },
                        position: 'top-center'
                    });

        }

    }

    const [otpData, setOtpData] = useState('');

    const otpFormSubmit2 = async (e) => {

        e.preventDefault();

        if ( otpData != '' && otpData != null ){

            const formData = new FormData();

            formData.append('userEmail', otpFormSubmit1Email);
            formData.append('otp', otpData)

            try{

                const response = await axios.post('http://localhost:7777/api/v1/auth/checkOTP', formData);

                if ( response.status === 200 ){

                    toast.success("Verification Success", {
                        autoClose: 1000,
                        style: {
                            backgroundColor: '#1f2937', // Tailwind bg-gray-800
                            color: '#fff', // Tailwind text-white
                            fontWeight: '600', // Tailwind font-semibold
                            borderRadius: '0.5rem', // Tailwind rounded-lg
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                            marginTop: '2.5rem' // Tailwind mt-10,
                        },
                        position: 'top-center'
                    });

                    setTimeout(() => {

                        setOtpVerified(true);

                    }, 1600);

                }

            }catch(error){

                handleError(error);

                toast.error("Invalid OTP", {
                    autoClose: 2000,
                    style: {
                        backgroundColor: '#1f2937', // Tailwind bg-gray-800
                        color: '#fff', // Tailwind text-white
                        fontWeight: '600', // Tailwind font-semibold
                        borderRadius: '0.5rem', // Tailwind rounded-lg
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                        marginTop: '2.5rem' // Tailwind mt-10,
                    },
                    progressStyle: {
                        backgroundColor: 'red' // Tailwind bg-green-400
                    },
                    position: 'top-center'
                });

            }

        }else {

            toast.error("Enter OTP", {
                        autoClose: 2000,
                        style: {
                            backgroundColor: '#1f2937', // Tailwind bg-gray-800
                            color: '#fff', // Tailwind text-white
                            fontWeight: '600', // Tailwind font-semibold
                            borderRadius: '0.5rem', // Tailwind rounded-lg
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                            marginTop: '2.5rem' // Tailwind mt-10,
                        },
                        progressStyle: {
                            backgroundColor: 'red' // Tailwind bg-green-400
                        },
                        position: 'top-center'
                    });

        }

    }
    
    useEffect(() => {

        setTimeout(() => {

            setLoading(false);

        }, 500);

    });

    return (

        <>

            {otpVerified && (

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

                        <ToastContainer />

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

                                            Update Password

                                        </div>

                                    </div>

                                    <form
                                        className='text-left bg-[#151b23] border-[#3d444d] border-2 px-5 py-5 rounded-xl mb-5'
                                        onSubmit={(e) => formSubmitFunction(e)}
                                    >

                                        <label> Password</label><br />
                                        <input 
                                            type='password'
                                            className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                            name='password'
                                            value={loginData.password}
                                            onChange={(e) => handleLoginFormData(e)}
                                        /><br /><br />

                                        <label>Conform Password</label><br />
                                        <input 
                                            type='password'
                                            className='bg-[#0d1117] text-white border-gray-400 border-[0.5px] focus:outline-none focus:border-blue-600 focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                            name='conformPassword'
                                            value={loginData.conformPassword}
                                            onChange={(e) => handleLoginFormData(e)}
                                        /><br /><br />

                                        <button
                                            className='bg-[#238636] w-full rounded-lg leading-10 hover:cursor-pointer'
                                            type='submit'
                                        >

                                            Update

                                        </button>

                                    </form>

                                    <div
                                        className='text-left border-[#3d444d] border-2 px-5 py-4 rounded-xl justify-center items-center'
                                    >

                                        New to Go Work? 
                                        
                                        <span 
                                            className='text-blue-500 ml-2 hover:cursor-pointer'
                                            onClick={() => navigate('/front-desk-register')}
                                        >Create an account</span>

                                    </div>

                                </div>

                            </div>

                            <div className="flex-1 loginPageImage m-2 max-sm:hidden">

                                {/* Image Area */}

                            </div>
            
                        </div>

                    )}

                </>

            )}

            {!otpVerified && (

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

                    <ToastContainer />

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

                                        OTP Vertification

                                    </div>

                                </div>

                                <form
                                    className={`text-left bg-[#151b23] border-[#3d444d] border-2 px-5 py-5 rounded-xl mb-10 ${otpFormSubmit1EmailStyle}`}
                                    onSubmit={(e) => otpFormSubmit1(e)}
                                >

                                    <label>Enter Your Email</label><br />
                                    <input 
                                        type='email'
                                        className={`bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2`}
                                        value={otpFormSubmit1Email}
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setOtpFormSubmit1Email(value);

                                        }}
                                    /><br /><br />

                                    <button
                                        className='bg-[#238636] w-full rounded-lg leading-10 hover:cursor-pointer'
                                        type='submit'
                                    >

                                        Send OTP

                                    </button>

                                </form>

                                <form
                                    className='text-left bg-[#151b23] border-[#3d444d] border-2 px-5 py-5 rounded-xl mb-5'
                                    onSubmit={(e) => otpFormSubmit2(e)}
                                >

                                    <label>Enter OTP</label><br />
                                    <input 
                                        type='text'
                                        className='bg-[#0d1117] text-white border-gray-400 border-[0.5px] focus:outline-none focus:border-blue-600 focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                        value={otpData}
                                        onChange={(e) => {

                                            const value = e.target.value;

                                            setOtpData(value);

                                        }}
                                    /><br /><br />

                                    <button
                                        className='bg-[#238636] w-full rounded-lg leading-10 hover:cursor-pointer'
                                        type='submit'
                                    >

                                        Submit

                                    </button>

                                </form>

                                <div
                                    className='text-left border-[#3d444d] border-2 px-5 py-4 rounded-xl justify-center items-center'
                                >

                                    New to Go Work? 
                                    
                                    <span 
                                        className='text-blue-500 ml-2 hover:cursor-pointer'
                                        onClick={() => navigate('/front-desk-register')}
                                    >Go To Login</span>

                                </div>

                            </div>

                        </div>

                        <div className="flex-1 loginPageImage m-2 max-sm:hidden">

                            {/* Image Area */}

                        </div>

                    </div>

                )}

            </>

            )}
        
        </>

    )

}

export default FrontDeskForgetPassword