import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConsultationQueueMedicalSupport = () => {


// JWT Token
const access_token = Cookies.get('access_token');

// Use Navigate Hook
    const navigate = useNavigate();

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const [inCompleteAppointments, setInCompleteAppointments] = useState([]);

    const roles = {
        admin: 'ADMIN',
        frontDesk: 'FRONTDESK',
        medicalSupport: 'MEDICALSUPPORT',
        teleSupport: 'TELESUPPORT',
        pharmacyCare: 'PHARMACYCARE',
        otCoordination: 'OTCOORDINATION',
        diagnosticsCenter: 'DIAGNOSTICSCENTER',
        transportTeam: 'TRANSPORTTEAM'
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

    const fetchIncompleteAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:7777/api/v1/appointments/getAllBookingsByNotComplete', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {
                const appointmentsData = response.data;

                // Step 1: Filter the data (optional, if needed for specific filtering)
                const filteredAppointments = appointmentsData.filter(appointment => {
                    return true; // No filtering, return all appointments
                });
    
                // Step 2: Convert appointmentOn (date and time string) to Date object and sort by date and time in ascending order
                const sortedAppointments = filteredAppointments.sort((a, b) => {
                    const dateA = new Date(a.appointmentOn); // Convert string to Date object
                    const dateB = new Date(b.appointmentOn); // Convert string to Date object
    
                    // Compare the dates for sorting
                    return dateA - dateB;
                });
    
                // Step 3: Format the appointmentOn field to 'dd/mm/yyyy hh:mm AM/PM' for each appointment
                const formattedAppointments = sortedAppointments.map(appointment => ({
                    ...appointment,
                    appointmentOn: formatAppointmentDate(appointment.appointmentOn) // Format date and time here
                }));
    
                // Step 4: Update the state with sorted and formatted data
                setInCompleteAppointments(formattedAppointments);
    
            }
        } catch (error) {
            handleError(error);
        }
    };
    
    
    const formatAppointmentDate = (dateString) => {
        const dateObj = new Date(dateString); // Convert the string to a Date object
    
        // Format date as 'dd/mm/yyyy'
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', dateOptions);
    
        // Format time as 'hh:mm AM/PM'
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);
    
        return `${formattedDate} ${formattedTime}`; // Combine date and time
    };
    
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

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            fetchIncompleteAppointments();

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    return (

        <>

            <div className="">

                <div className="mx-10 mr-56">

                    <table
                        className='w-full'
                    >

                        <thead>

                            <tr
                                className='text-left leading-10'
                            >

                                <th>S.No</th>
                                <th>Patient Name</th>
                                <th>Doctors Name</th>
                                <th>Consultation Date</th>

                            </tr>

                        </thead>

                        {inCompleteAppointments && inCompleteAppointments === 0 ? (

                            <tbody>

                            <tr
                                className='text-left'
                            >

                                <th>No Data</th>
                                <th>No Data</th>
                                <th>No Data</th>
                                <th>No Data</th>

                            </tr>

                            </tbody>

                        ) : (

                            <tbody>

                                {inCompleteAppointments.map((appointment, index) => (

                                    <tr
                                        key={appointment.id}
                                        className='text-left text-gray-500 leading-10 text-base'
                                    >

                                        <th>{index + 1}</th>
                                        <th>{appointment.name}</th>
                                        <th>{appointment.preferredDoctorName}</th>
                                        <th>{appointment.appointmentOn}</th>
                                        <th
                                            className='hover:opacity-60 active:opacity-80 cursor-pointer inline-block'
                                            onClick={(id) => navigate(`/medical-support-consultation-queue/${appointment.id}`)}
                                        >View Full Profile</th>

                                    </tr>

                                ))}

                            </tbody>

                        )}

                    </table>

                </div>

            </div>

        </>

    )

}

export default ConsultationQueueMedicalSupport