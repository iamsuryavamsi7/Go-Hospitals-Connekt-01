import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const PendingMedications = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // GoHospitals BASE URL environment variable
    const goHospitalsFRONTENDBASEURL = import.meta.env.VITE_GOHOSPITALS_MAIN_FRONTEND_URL;

    // Use Navigate Hook
    const navigate = useNavigate();

    // State Management
    const [role, setRole] = useState(null);

    const [inCompleteApplications, setInCompleteApplications] = useState([]);

    const [page, setPage] = useState(0); // Track the current page
    
    const pageSize = 10; 

    const [isLastPage, setIsLastPage] = useState(false); // 

    const roles = {
        pharmacy: 'PHARMACYCARE'
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

    const fetchPharmacyApplications = async () => {
        
        try {
            
            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/pharmacy/fetchAllPharmacyMedicationsPaging/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {

                let appointmentsData = response.data;

                if ( appointmentsData.length === 0 ){

                    return false;

                }

                setIsLastPage(appointmentsData.length < pageSize);

                setInCompleteApplications(appointmentsData);

                return true;
    
            }

        } catch (error) {
        
            handleError(error);

            return false;
        }

    };

    const fetchUserRole = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/pharmacy/fetchUserRole`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const userRole = response.data;

                setRole(userRole);

            }

        }catch(error){

            handleError(error);

        }

    }

    const fetchPharmacyApplications2 = async (page) => {
        
        try {
            
            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/pharmacy/fetchAllPharmacyMedicationsPaging/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {

                let appointmentsData = response.data;

                if ( appointmentsData.length === 0 ){

                    return false;

                }

                return true;
    
            }

        } catch (error) {
        
            handleError(error);

            return false;
        }

    };

    const nextPage = async () => {

        if ( !isLastPage ) {

            const hasPage = await fetchPharmacyApplications2(page + 1);

            if ( hasPage ){

                setPage((prevPage) => prevPage + 1);

            }

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

            fetchUserRole();

            fetchPharmacyApplications();

        } else {

            window.open(goHospitalsFRONTENDBASEURL, '_self');

        }

    }, []);

    useEffect(() => {

        fetchPharmacyApplications();

    }, [page]);

    // State to store stompClient
    const [stompClient, setStompClient] = useState(null);

    // Connect to websockets when the component mounts with useEffect hook
    useEffect(() => {

        const sock = new SockJS(`${goHospitalsAPIBaseURL}/go-hospitals-websocket`);
        const client = Stomp.over(() => sock);

        setStompClient(client);

        client.connect(
            {},
            () => {

                client.subscribe(`/common/commonFunction`, (message) => {

                    const messageObject = JSON.parse(message.body);

                    console.log(messageObject);

                    if ( messageObject.notificationType === `PendingMedicationsRefresh` ){

                        fetchPharmacyApplications();

                    }

                });
        
            },
            () => {

                console.error(error);
        
            }
        );

        // Disconnect on page unmount
        return () => {

            if ( client ){

                client.disconnect();

            }

        }

    }, []);

    return (

        <>

            <Toaster />

            {role === roles.pharmacy && (

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
                                        <th>Medical Support User</th>
                                        <th>Status</th>

                                    </tr>

                                </thead>

                                {inCompleteApplications && inCompleteApplications.length === 0 ? (

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

                                        {inCompleteApplications.map((application, index) => (

                                            <tr
                                                key={application.id}
                                                className='text-left leading-10 text-base border-b-[.5px] border-gray-800 text-gray-400'
                                            >

                                                <th>{(page * pageSize) + (index + 1)}</th>

                                                <th>{application.name}</th>
                                                <th>{application.preferredDoctorName}</th>
                                                <th>{application.billNo}</th>
                                                <th>{application.medicalSupportUserName}</th>
                                                <th>
                                                    
                                                    {application.consultationType === 'ONSITETREATMENT' && (

                                                    <span>On Site Treatment</span>

                                                    )}

                                                    {application.consultationType === 'MEDICATIONPLUSFOLLOWUP' && (

                                                    <span>Medication Plus Follow Up</span>

                                                    )}

                                                    {application.consultationType === 'SURGERYCARE' && (

                                                    <span>Surgery Care</span>

                                                    )}

                                                    {application.consultationType === 'PHARMACY' && (

                                                    <span>Pharmacy</span>

                                                    )}

                                                    {application.consultationType === 'PATIENTADMIT' && (

                                                    <span>Patient Admit</span>

                                                    )}

                                                </th>
                                                <th
                                                    className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                                    onClick={(id) => navigate(`/pharmacy-profiles/${application.id}`)}
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

export default PendingMedications