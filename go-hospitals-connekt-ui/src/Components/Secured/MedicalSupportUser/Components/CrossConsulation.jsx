import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Toaster, toast } from 'react-hot-toast';

const CrossConsulation = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const [onCrossConnection, setOnCrossConnection] = useState([]);

    const [page, setPage] = useState(0); // Track the current page
    
    const pageSize = 25; 

    const [isLastPage, setIsLastPage] = useState(false); // 

    const roles = {
        medicalSupport: 'MEDICALSUPPORT'
    }


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

    const fetchUserObject = async () => {

        const formData = new FormData();

        formData.append("jwtToken", access_token);

        try{

            const response = await axios.post('http://localhost:7777/api/v1/user/fetchUserObject', formData, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const userObject = response.data;

                setRole(userObject.role);

                setUserObject(userObject);

            }

        }catch(error){

            handleError(error);

        }

    }

    const fetchCrossConnection = async () => {

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/medical-support/fetchAllCrossConsultationPaging/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const userObject = response.data;

                if ( userObject.length === 0 ){

                    setIsLastPage(true);

                    return false;

                }

                setOnCrossConnection(userObject);

                return true;

            }

        }catch(error){

            handleError(error);

            return false;

        }

    }

    const nextPage = async () => {

        if ( !isLastPage ) {

            const hasPage = await fetchCrossConnection();

            if ( hasPage ){

                setPage((prevPage) => prevPage + 1);

            }

        } else {

            toast.error("No Page Available", {
                duration: 1000,
                style: {
                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    color: '#fff', // Tailwind text-white
                    fontWeight: '600', // Tailwind font-semibold
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    marginTop: '2.5rem' // Tailwind mt-10,
                },
                position: 'top-right'
            });

        }

    }

    const prevPage = () => {

        if ( page > 0 ) {

            setPage((prevPage) => prevPage - 1);

            setIsLastPage(false);

        } 

    }


    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    useEffect(() => {

        fetchCrossConnection();

    }, [page]);

    return (

        <>

            <Toaster />
        
            {role === roles.medicalSupport && (

                <>
                
                    <div className="">

                        <div className="mx-10">

                            <table
                                className='w-full'
                            >

                                <thead>

                                    <tr
                                        className='text-left leading-10 border-b-[.5px] border-gray-800 px-10'
                                    >

                                        <th>S.No</th>
                                        <th>Patient Name</th>
                                        <th>Doctors Name</th>
                                        <th>Bill No</th>

                                    </tr>

                                </thead>

                                {onCrossConnection && onCrossConnection.length === 0 ? (

                                    <tbody>

                                    <tr
                                        className='text-left border-b-[.5px] border-gray-800 text-gray-400'
                                    >

                                        <th>No Data</th>
                                        <th>No Data</th>
                                        <th>No Data</th>
                                        <th>No Data</th>

                                    </tr>

                                    </tbody>

                                ) : (

                                    <tbody>

                                        {onCrossConnection.map((application, index) => (

                                            <tr
                                                key={application.id}
                                                className='text-left leading-10 text-base border-b-[.5px] border-gray-800 text-gray-400'
                                            >

                                                <th>{index + 1}</th>

                                                <th>{application.name}</th>
                                                <th>{application.preferredDoctorName}</th>
                                                <th>{application.billNo}</th>
                                                <th
                                                    className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                                    onClick={(id) => navigate(`/medical-support-cross-consultation-profile/${application.id}`)}
                                                >View Full Profile</th>

                                            </tr>

                                        ))}

                                    </tbody>

                                )}

                            </table>

                        </div>

                        <div className="space-x-5 text-center mx-10 mt-5">
                            
                            <button 
                                onClick={prevPage} 
                                disabled={page === 0}
                                className='bg-gray-800 cursor-pointer px-2 py-2 text-xs rounded-md hover:opacity-60 active:opacity-40'
                            >Previous</button>
                            
                            <span className='bg-gray-800 px-2 py-2 text-sm rounded-md cursor-pointer'>Page {page + 1}</span>
                            
                            <button 
                                onClick={nextPage}
                                className='bg-gray-800 cursor-pointer px-2 py-2 text-xs rounded-md hover:opacity-60 active:opacity-40'
                            >Next</button>
                        
                        </div>

                    </div>

                </>

            )}
        
        </>

    )

}

export default CrossConsulation