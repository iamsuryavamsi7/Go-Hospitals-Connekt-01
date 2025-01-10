import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar';
import { Toaster, toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const NewPatientOnBoardFronDeskFillingPage = () => {

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // State to store the patient data
    const [patientOnBoardData, setPatientOnBoardData] = useState({
        name: ``,
        age: ``,
        aadharNumber: ``,
        contact: ``,
        location: ``
    });

    // Function to update patientOnBoardData State values
    const handlePatientFunction = (e) => {

        const value = e.target.value;

        setPatientOnBoardData((prevElement) => ({
            ...prevElement, [e.target.name] : value
        }))

    }

    const [stompClient, setStompClient] = useState(null);

    // Function to save data into DB
    const saveDataFunction = async (e) => {

        e.preventDefault();

        console.log(patientOnBoardData);

        const name = patientOnBoardData.name;
        const age = patientOnBoardData.age;
        const contact = patientOnBoardData.contact;
        const aadharNumber = patientOnBoardData.aadharNumber;
        const location = patientOnBoardData.location;

        const patientOnBoardDetailsModel = {
            newPatientOnBoardName: name,
            newPatientOnBoardAge: age,
            newPatientOnBoardContact: contact,
            newPatientOnBoardAadharNumber: aadharNumber,
            newPatientOnBoardLocation: location
        }

        if ( name !== `` && name !== null && age !== `` && age !== null  && contact !== `` && contact !== null && aadharNumber !== `` && aadharNumber !== null && location !== null && location !== `` && stompClient !== null){

            // Send the patient details to websocket
            stompClient.send(`/app/public-page-frontDesk-onboard`, {}, JSON.stringify(patientOnBoardDetailsModel));

            // Show toast message for success
            toast.success('Submit Success', {
                duration: 1000,
                style: {
                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    color: '#fff', // Tailwind text-white
                    fontWeight: '600', // Tailwind font-semibold
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    marginTop: '2.5rem' // Tailwind mt-10,
                }
            });

            // After successfull patient onboard clear the input fields
            setPatientOnBoardData({
                name: ``,
                age: ``,
                aadharNumber: ``,
                contact: ``,
                location: ``
            });

        }else {

            toast.error('Something went wrong', {
                duration: 2000,
            });

        }

    }

    // Connect to websockets when the component mounts with useEffect hook
    useEffect(() => {

        const sock = new SockJS(`${goHospitalsAPIBaseURL}/go-hospitals-websocket`);
        const client = Stomp.over(() => sock);

        setStompClient(client);

        client.connect(
            {},
            () => {

                console.log(`Websockets are connected successfully`);
        
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

			<NavBar />

			<Toaster />
		
            <div 
                className="pt-5 border-t-[1px] border-gray-700 block mb-20"
            >

                <div className="text-left flex justify-center">

                    <form 
                        className="mx-10 max-lg:space-y-5 max-lg:w-full"
                        onSubmit={saveDataFunction}    
                    >

                        <div className="font-bold text-2xl max-lg:text-[50px] mb-20 max-lg:mt-10 text-center">

                            Onbording Form

                            <div className="text-gray-400 font-normal text-base max-lg:text-3xl mt-3 max-lg:mt-5">

                                Please fill your details

                            </div>

                        </div>

                        <div className="space-y-5 pb-5">

                            <label
                                className='text-base max-lg:text-2xl'
                            >Full Name <span className='text-red-400'>*</span></label><br />
                                <input 
                                    required
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-10 max-lg:leading-[50px] px-3 flex-1 w-[500px] max-lg:w-full mt-2 text-sm max-lg:text-xl'
                                    name='name'
                                    value={patientOnBoardData.name}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                        </div>

                        <div className="space-y-5 pb-5">

                            <label
                                className='text-base max-lg:text-2xl'
                            >Age <span className='text-red-400'>*</span> </label><br />
                            <input 
                                type='text'
                                required
                                maxLength={3}
                                minLength={1}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-10 max-lg:leading-[50px] px-3 w-[500px] max-lg:w-full mt-2 text-sm max-lg:text-xl'
                                name='age'
                                value={patientOnBoardData.age}
                                onChange={(e) => handlePatientFunction(e)}
                            /> 

                        </div>

                        <div className="space-y-5 pb-5">

                            <label
                                className='text-base max-lg:text-2xl'
                            >Aadhar Number <span className='text-red-400'>*</span> </label><br />
                            <input 
                                type='text'
                                required
                                maxLength={12}
                                minLength={12}
                                inputMode='numeric'
                                pattern='[0-9]*'
                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-10 max-lg:leading-[50px] px-3 w-[500px] max-lg:w-full mt-2 text-sm max-lg:text-xl'
                                name='aadharNumber'
                                value={patientOnBoardData.aadharNumber}
                                onChange={(e) => handlePatientFunction(e)}
                            />  

                        </div>

                        <div className="space-y-5 pb-5">

                            <label
                                className='text-base max-lg:text-2xl'
                            >Contact <span className='text-red-400'>*</span> </label><br />
                            <input 
                                type='text'
                                required
                                maxLength={10}
                                minLength={10}
                                inputMode='numeric'
                                pattern='[0-9]*'
                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-10 max-lg:leading-[50px] px-3 w-[500px] max-lg:w-full mt-2 text-sm max-lg:text-xl'
                                name='contact'
                                value={patientOnBoardData.contact}
                                onChange={(e) => handlePatientFunction(e)}
                            />  

                        </div>

                        <div className="space-y-5 pb-5">

                            <label
                                className='text-base max-lg:text-2xl'
                            >Location <span className='text-red-400'>*</span> </label><br />
                            <input 
                                type='text'
                                required
                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-10 max-lg:leading-[50px] px-3 w-[500px] max-lg:w-full mt-2 text-sm max-lg:text-xl'
                                name='location'
                                value={patientOnBoardData.location}
                                onChange={(e) => handlePatientFunction(e)}
                            />  

                        </div>

                        <div className="">

                            <button 
                                className='bg-[#238636] text-white focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-10 max-lg:leading-[60px] px-3 mt-5 w-[500px] max-lg:w-full text-base max-lg:text-2xl'
                                
                            > Submit </button>

                        </div>

                    </form>

                </div>

            </div>
		
		</>

	)

}

export default NewPatientOnBoardFronDeskFillingPage;