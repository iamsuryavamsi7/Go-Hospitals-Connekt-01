import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { format } from 'date-fns';

const FutureSurgeries = () => {

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
        pharmacy: 'OTCOORDINATION'
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

    const fetchAllFutureSurgeries = async () => {
        
        try {
            
            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/ot-coordination/fetchAllFutureSurgeries/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {

                const appointmentsData = response.data;

                console.log(appointmentsData);

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

    const fetchAllFutureSurgeries2 = async (page) => {
        
        try {
            
            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/pharmacy/fetchAllFutureSurgeries/${page}/${pageSize}`, {
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

            const pageNumber = page + 1;

            const hasPage = await fetchAllFutureSurgeries2(pageNumber);

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

            fetchAllFutureSurgeries();

        } else {

            window.open(goHospitalsFRONTENDBASEURL, '_self');

        }

    }, []);

    useEffect(() => {

        fetchAllFutureSurgeries();

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

                        fetchAllFutureSurgeries();

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
                                        <th>Surgery Date</th>
                                        <th>Nurse</th>
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
                                                <th>{format(application.surgeryDate, 'MMMM dd yyyy')}</th>
                                                <th>{application.medicalSupportUserName}</th>
                                                <th>
                                                    
                                                    {application.consultationType === 'NOTASSIGNED' && 'Waiting for Nurse'}
                                    
                                                    {application.consultationType === 'WAITING' && 'Waiting for DMO'}

                                                    {application.consultationType === 'DMOCARECOMPLETED' && 'Waiting for Consultation'}

                                                    {application.consultationType === 'ONSITREVIEWPATIENTDRESSING' && 'Onsite - Review Patient Dressing'}

                                                    {application.consultationType === 'ONSITEVASCULARINJECTIONS' && 'Onsite - Vascular Injection'}

                                                    {application.consultationType === 'ONSITEQUICKTREATMENT' && 'Onsite - Quick Treatment'}

                                                    {application.consultationType === 'ONSITECASCUALITYPATIENT' && 'Onsite - Casuality Patient'}

                                                    {application.consultationType === 'MEDICATIONPLUSFOLLOWUP' && 'Medical Plus Follow UP'}

                                                    {application.consultationType === 'SURGERYCARE' && 'Surgery Care'}

                                                    {application.consultationType === 'CROSSCONSULTATION' && 'Cross Consultation'}
                                                    
                                                    {application.consultationType === 'FOLLOWUPCOMPLETED' && 'Follow-Up Scheduled'}

                                                    {application.consultationType === 'CASECLOSED' && 'Case Closed'}                    

                                                </th>
                                                <th
                                                    className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                                    onClick={(id) => navigate(`/ot-coordination-profiles/${application.id}`)}
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

export default FutureSurgeries