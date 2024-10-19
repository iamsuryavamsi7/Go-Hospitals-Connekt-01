import React from 'react';
import '../../Style/NavBarUser.css';
import { HiOutlineLogout } from 'react-icons/hi';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const NavBarUser = ({userObject}) => {

// Jwt Token
    const access_token = Cookies.get('access_token');

// useNavigate Hook
    const navigate = useNavigate();

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

    const logoutFunction = async () => {

        try{

            const response = await axios.post('http://localhost:7777/api/v1/logout',{}, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                Cookies.remove('access_token', { path: '/', domain: '.gohospitals.in' });

                navigate('/');

            }

        }catch(error){

            handleError(error);

        }

    }

    return (

        <div className="h-16 flex items-center justify-between border-[1px] border-gray-800 fixed top-0 left-0 right-0">

            <div className="ml-56 flex items-center">

                <div className="">

                    <img
                        src='/Go-Hospitals-Logo.webp'
                        alt='Go Hospitals'
                        className='h-6 w-auto'
                    />

                </div>

                <div className="leading-8 text-[30px] font-semibold mx-2 josefin-sans-navBarUser">

                    works

                </div>

            </div>

            <div className="mr-56 flex items-center space-x-3">

                <div className="border-x-[1px] border-gray-800 px-3">

                    {userObject.firstName}

                </div>

                <div className="">

                    <HiOutlineLogout 
                        className='text-2xl opacity-60 hover:opacity-80 active:opacity-40'
                        onClick={logoutFunction}
                    />

                </div>

            </div>


        </div>

    )

}

export default NavBarUser