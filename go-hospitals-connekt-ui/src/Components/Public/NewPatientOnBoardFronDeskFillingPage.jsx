import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar';
import { Toaster, toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const NewPatientOnBoardFronDeskFillingPage = () => {

    const {frontDeskUserId} = useParams();

    const [patientOnBoardData, setPatientOnBoardData] = useState({
        name: ``,
        age: ``,
        aadharNumber: ``,
        contact: ``
    });

    const handlePatientFunction = (e) => {

        const value = e.target.value;

        setPatientOnBoardData((prevElement) => ({
            ...prevElement, [e.target.name] : value
        }))

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

    // Function to save data into DB
    const saveDataFunction = async (e) => {

        e.preventDefault();

        const name = patientOnBoardData.name;
        const age = patientOnBoardData.age;
        const contact = patientOnBoardData.contact;
        const aadharNumber = patientOnBoardData.aadharNumber;

        if ( name !== `` && name !== null && age !== `` && age !== null  && contact !== `` && contact !== null && aadharNumber !== `` && aadharNumber !== null){

            try{

                const formData = new FormData();

                formData.append(`name`, name);
                formData.append(`age`, age);
                formData.append(`contact`, contact);
                formData.append(`aadharNumber`, aadharNumber)

                const response = await axios.post(`http://localhost:7777/api/v1/public/updateNewPatientOnBoardData/${frontDeskUserId}`, formData);

                if ( response.status === 200 ){

                    const responseData = response.data;

                    console.log(responseData);

                    console.log(patientOnBoardData);

                    setPatientOnBoardData({
                        name: ``,
                        age: ``,
                        aadharNumber: ``,
                        contact: ``
                    });

                    toast.success(`User Successfully Saved`, {
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

                }

            }catch(error){

                handleError(error);

            }

        }else {

            toast.error(`Fill all fields`, {
                duration: 2000
            });

        }

    }

	return (

		<>

			<NavBar />

			<Toaster />
		
            <div 
                className="pt-5 border-t-[1px] border-gray-700 block mb-20"
            >

                <div className="text-left flex">

                    <form 
                        className="mx-10 space-y-5 w-full"
                        onSubmit={saveDataFunction}    
                    >

                        <div className="font-bold text-[50px] mb-20 text-center">

                            Onbording Form

                            <div className="text-gray-400 font-normal text-3xl">

                                Please fill your details

                            </div>

                        </div>

                        <div className="space-y-5 pb-5">

                            <label
                                className='text-2xl'
                            >Full Name <span className='text-red-400'>*</span></label><br />
                                <input 
                                    required
                                    type='text'
                                    className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-[50px] px-3 flex-1 w-full max-sm:w-full mt-2 text-xl'
                                    name='name'
                                    value={patientOnBoardData.name}
                                    onChange={(e) => handlePatientFunction(e)}
                                /> 

                        </div>

                        <div className="space-y-5 pb-5">
                        {/* <span className='text-red-400'>*</span> */}

                            <label
                                className='text-2xl'
                            >Age <span className='text-red-400'>*</span> </label><br />
                            <input 
                                type='text'
                                required
                                maxLength={3}
                                minLength={1}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-[50px] px-3 w-full max-sm:w-full mt-2 text-xl'
                                name='age'
                                value={patientOnBoardData.age}
                                onChange={(e) => handlePatientFunction(e)}
                            /> 

                        </div>

                        <div className="space-y-5 pb-5">

                        {/* <span className='text-red-400'>*</span> */}
                            <label
                                className='text-2xl'
                            >Aadhar Number <span className='text-red-400'>*</span> </label><br />
                            <input 
                                type='text'
                                required
                                maxLength={12}
                                minLength={12}
                                inputMode='numeric'
                                pattern='[0-9]*'
                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-[50px] px-3 w-full max-sm:w-full mt-2 text-xl'
                                name='aadharNumber'
                                value={patientOnBoardData.aadharNumber}
                                onChange={(e) => handlePatientFunction(e)}
                            />  

                        </div>

                        <div className="space-y-5 pb-5">

                        {/* <span className='text-red-400'>*</span> */}
                            <label
                                className='text-2xl'
                            >Contact <span className='text-red-400'>*</span> </label><br />
                            <input 
                                type='text'
                                required
                                maxLength={10}
                                minLength={10}
                                inputMode='numeric'
                                pattern='[0-9]*'
                                className='bg-[#0d1117] text-white border-gray-400 border-[.5px] focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-[50px] px-3 w-full max-sm:w-full mt-2 text-xl'
                                name='contact'
                                value={patientOnBoardData.contact}
                                onChange={(e) => handlePatientFunction(e)}
                            />  

                        </div>

                        <div className="">

                            {/* <button
                                className={`bg-[#238636] hover:opacity-60 active:opacity-80 text-white rounded-lg leading-8 px-3 my-3`}
                                type='submit'
                            > Submit </button> */}

                            <button 
                                className='bg-[#238636] text-white focus:outline-none focus:border-blue-600  focus:border-2 rounded-lg leading-[60px] px-3  max-sm:w-full mt-5 w-full text-2xl'
                                
                            > Submit </button>

                        </div>

                    </form>

                </div>

            </div>
		
		</>

	)

}

export default NewPatientOnBoardFronDeskFillingPage;