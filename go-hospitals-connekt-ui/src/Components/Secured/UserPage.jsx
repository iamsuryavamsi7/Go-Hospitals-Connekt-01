import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import NavBarUser from '../NavBar/NavBarUser';
import LeftNavBar from '../NavBar/LeftNavBar';
import { FiRefreshCw } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const UserPage = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

    const [lockedUsers, setLockedUsers] = useState([]);

    const [refreshButtonStyle, setRefreshButtonStyle] = useState(null);

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

    // Function to fetch LockedUsers
    const lockedUsersFunction = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/user/fetchUnlockedUsers', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const lockedUsers = response.data;

                setLockedUsers(lockedUsers);

                return true;

            }

        }catch(error){

            handleError(error);

        }

    }

    //Function for refreshButton
    const refreshButtonFunction = async () => {

        setRefreshButtonStyle(`opacity-[1] animate-spin`);

        const response = await lockedUsersFunction();

        if (response) {
            
            setTimeout(() => {
                setRefreshButtonStyle(null);
            }, 2000);
        
        } else {
        
            setRefreshButtonStyle(null); 
        
        }

    }

    // Function to rejectUsers
    const rejectUserFunction = async (e, id) => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/user/deleteUserRequest/' + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                lockedUsersFunction();

            }

        }catch(error){

            handleError(error);

        }
    
    }

    // Function to rejectUsers
    const acceptUserFunction = async (e, id) => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/user/acceptUserRequest/' + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                lockedUsersFunction();

            }

        }catch(error){

            handleError(error);

        }
    
    }

    // State to hold the selected date
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [avaiableSlots, setAvaiableSlots] = useState([]);

    const handleDateChange = async (date) => {
        
        // Format the date to 'yyyy-MM-dd' without converting to UTC
        const isoDate = date.getFullYear() + '-' + 
                        String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(date.getDate()).padStart(2, '0');

        setSelectedDate(isoDate);
    
        try {
            const response = await axios.get(`http://localhost:7777/api/v1/frontDesk/fetchBookedSlots/${isoDate}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            if (response.status === 200) {
    
                const bookedSlots = response.data.map(slot => slot.time);
    
                const allSlots = generateSlots();
                const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot.time));
    
                setAvaiableSlots(availableSlots);

            }
        } catch (error) {
            handleError(error);
        }
    };
    
    const [selectedAppointment, setSelectedAppointment] = useState({
        date: null,
        time: null
    });

    const handleDateFunction = (e, slotTime) => {
        // Update selectedAppointment state with the selected date and time
        setSelectedAppointment({
            date: selectedDate, // Store the currently selected date
            time: slotTime      // Store the time from the clicked button
        });

        console.log(`Selected Appointment: ${selectedDate} at ${slotTime}`);
    };

    const generateSlots = () => {
        const slots = [];
        const start = new Date();
        start.setHours(9, 0, 0); // Start at 9:00 AM
    
        const end = new Date();
        end.setHours(18, 0, 0); // End at 6:00 PM
    
        while (start <= end) {
            const slotTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            slots.push({ time: slotTime, booked: false });
            start.setMinutes(start.getMinutes() + 30); // Increment by 30 minutes
        }
    
        return slots;
    };

    const [patientOnBoardData, setPatientOnBoardData] = useState({
        name: '',
        age: '',
        contact: '',
        address: '',
        medicalHistory: '',
        reason: '',
        preferredDoctor: ''
    });

    const [gender, setGender] = useState();
    
    const handlePatientFunction = (e) => {

        const value = e.target.value;

        setPatientOnBoardData({...patientOnBoardData, [e.target.name]: value});

    }

    const bookAnAppointment = (e) => {

        e.preventDefault();

        console.log(patientOnBoardData);

        console.log(gender);

        console.log(selectedAppointment);

    }

    useEffect(() => {

        if ( access_token ){

            fetchUserObject();

            lockedUsersFunction();  

        } else {

            console.log("Jwt Token is not avaiable");

        }

    }, []);

    return (

        <>

            <style>{`
                /* Custom styles for the DatePicker */
                .react-datepicker {
                    width: 100%; /* Full width */
                    border: 1px solid #d1d5db; /* Tailwind gray-300 */
                    border-radius: 0.5rem; /* Tailwind rounded-lg */
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Tailwind shadow-md */
                }
                .react-datepicker__header {
                    background-color: #3b82f6; /* Tailwind blue-500 */
                    color: white;
                }
                .react-datepicker__day {
                    color: #374151; /* Tailwind gray-800 */
                }
                .react-datepicker__day--today {
                    background-color: #93c5fd; /* Tailwind blue-300 */
                }
                .react-datepicker__day:hover {
                    background-color: #dbeafe; /* Tailwind blue-200 */
                }
                .react-datepicker__triangle {
                    display: none; /* Optional: hide the triangle if you don't want it */
                }
            `}</style>

            {role === roles.admin && (

                <>

                    <NavBarUser 
                        userObject = {userObject} 
                    />

                    <LeftNavBar />

                    <div className=" pt-16 pl-[457px]">

                        <div className="mr-56 flex mt-20 relative">

                            <FiRefreshCw 
                                className={`text-xl opacity-60 absolute right-20 top-[-40px] cursor-pointer ${refreshButtonStyle}`}
                                onClick={refreshButtonFunction}
                            />

                            <table
                                className='mx-10 w-full text-left'
                            >

                                <thead>

                                    <tr
                                        className='h-[60px]'
                                    >

                                        <th
                                            className='px-12'
                                        >Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th
                                            className='text-center'
                                        >Take Action</th>

                                    </tr>

                                </thead>

                                {lockedUsers && lockedUsers.length > 0 ? (

                                    <tbody>

                                        {lockedUsers.map((lockedUser) => {

                                            return (

                                                <tr
                                                className='leading-10 border-b-[.5px] border-gray-800 text-gray-400'
                                                key={lockedUser.id}
                                                >

                                                    <td
                                                        className='px-12'
                                                    >{lockedUser.firstName} {lockedUser.lastName}</td>
                                                    <td>{lockedUser.email}</td>
                                                    <td>{lockedUser.role}</td>
                                                    <td
                                                        className='space-x-10 text-center'
                                                    >

                                                        <button
                                                            className='hover:text-green-400 transition-all'
                                                            onClick={(e, id) => acceptUserFunction(e, lockedUser.id)}
                                                        >

                                                            Accept

                                                        </button>

                                                        <button
                                                            className='hover:text-red-400 transition-all'
                                                            onClick={(e, id) => rejectUserFunction(e, lockedUser.id)}
                                                        >

                                                            Reject

                                                        </button>

                                                    </td>

                                                </tr>

                                            );

                                        })}

                                    </tbody>

                                    ) : (

                                    <tbody>

                                        <tr
                                        className='leading-10 border-b-[.5px] border-gray-800'
                                        >

                                            <td
                                                className='px-12'
                                            > No Data </td>
                                            <td> No Data  </td>
                                            <td> No Data </td>
                                            <td
                                                className='space-x-10 text-center'
                                            >

                                                <button
                                                    className='hover:text-green-400 transition-all'
                                                >

                                                    No Data 

                                                </button>

                                                <button
                                                    className='hover:text-red-400 transition-all'
                                                >

                                                    No Data 

                                                </button>

                                            </td>

                                        </tr>

                                    </tbody>

                                    )}

                            </table>

                        </div>

                    </div>

                </>

            )}

        
            {role === roles.frontDesk && (

            <>

                <NavBarUser 
                    userObject = {userObject} 
                />

                <LeftNavBar />

                <div className=" pt-16 pl-[457px] flex justify-center space-x-36 mt-10">

                    <form
                        className='block'
                    >

                        <div className="grid grid-cols-2 gap-x-10 gap-y-7">

                            <div className="">

                                <label>Name</label><br />
                                <input 
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='name'
                                    value={patientOnBoardData.name}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                            </div>

                            <div className="">

                                <label>Age</label><br />
                                <input 
                                    type='number'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='age'
                                    value={patientOnBoardData.age}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                            </div>

                            <div className="">

                                <label>Contact</label><br />
                                <input 
                                    type='number'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='contact'
                                    value={patientOnBoardData.contact}
                                    onChange={(e) => handlePatientFunction(e)}
                                />  

                            </div>

                            <div className="">

                                <label>Address</label><br />
                                <input 
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='address'
                                    value={patientOnBoardData.address}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                            </div>

                            <div className="">

                            <label>Gender</label><br />
                                <select
                                        className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg h-[35px] px-3 w-[300px] max-sm:w-full mt-2'
                                        onChange={(e) => {

                                            setGender(e.target.value);

                                        }}
                                >

                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>

                                </select>

                            </div>

                            <div className="">

                                <label>Medical history</label><br />
                                <input 
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='medicalHistory'
                                    value={patientOnBoardData.medicalHistory}
                                    onChange={(e) => handlePatientFunction(e)}
                                />  

                            </div>

                            <div className="">

                                <label>Reason for visit</label><br />
                                <input 
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='reason'
                                    value={patientOnBoardData.reason}
                                    onChange={(e) => handlePatientFunction(e)}
                                />  

                            </div>

                            <div className="">

                                <label>Appointment on</label><br />
                                <div
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                >  {selectedAppointment.date} : {selectedAppointment.time} </div>      

                            </div>

                            <div className="">

                                <label>Preferred Doctor</label><br />
                                <input 
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-8 px-3 w-[300px] max-sm:w-full mt-2'
                                    name='preferredDoctor'
                                    value={patientOnBoardData.preferredDoctor}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                            </div>

                        </div>

                        <div className="">

                            <button
                            className='bg-[#238636] hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3 mt-7'
                            onClick={bookAnAppointment}
                        > Book an appointment </button>

                        </div>

                    </form>

                    <div className="relative px-36 flex justify-center">

                            <div
                                className=''
                            >

                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                className="text-black"
                                dateFormat="dd-MM-yyyy"  // Local display format
                                inline  // Keeps the calendar always visible
                            />

                            <div className="text-center text-xl mt-5">

                                Available Slots

                            </div>

                            <div className="grid grid-cols-3 my-5 gap-x-3 gap-y-4 absolute right-28">
                                
                                {avaiableSlots.map((slot, index) => (
                                
                                    <div
                                        key={index} // Use a unique key if available
                                        className='bg-[#212830] px-3 py-2 text-sm rounded-lg text-white cursor-pointer border-[1px] border-[#3d444d] hover:opacity-60 active:opacity-80'
                                        onClick={(e, id) => handleDateFunction(e, slot.time)} // Adjust this based on your slot structure
                                    >
                                    
                                        {slot.time}
                                    
                                    </div>
                                
                                ))}
                            
                            </div>

                        </div>

                    


                    </div>

                </div>

            </>

            )}

            {role === roles.medicalSupport && (

            <div className="">

                This is Medical Support User

            </div>

            )}

            {role === roles.teleSupport && (

            <div className="">

                This is Tele Support User

            </div>

            )}  

            {role === roles.pharmacyCare && (

            <div className="">

                This is Pharmacy Care User

            </div>

            )}

            {role === roles.otCoordination && (

            <div className="">

                This is Ot Coordination User

            </div>

            )}

            {role === roles.diagnosticsCenter && (

            <div className="">

                This is Diagnostics Center User

            </div>

            )}

            {role === roles.transportTeam && (

            <div className="">

                This is Transport Team User

            </div>

            )}

        </>

    )

}

export default UserPage