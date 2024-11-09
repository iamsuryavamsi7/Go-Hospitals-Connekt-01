import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const FillTheSurgeryForm = () => {

    const {teleSupportUserId} = useParams();

	const {applicationId} = useParams();

    const [image, setImage] = useState([]);

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

	const handleCapture = (e) => {
        
        const files = Array.from(e.target.files);
        
        setImage(
            (prevFiles) => [...prevFiles, ...files]
        );
    
    };

	const handleSubmit = async (e) => {
        
        e.preventDefault();
    
        // Create FormData object
        const formData = new FormData();

        image.forEach((file) => {

            formData.append("imageFile", file);

        });

        try {

          // Send the form data to the backend
          const response = await axios.post(`http://localhost:7777/api/v1/public/uploadSurgeryDocuments/${applicationId}/${teleSupportUserId}`, formData, {
            headers: {
                'Content-Type': `multipart/form-data`
            },
          });

          if ( response.status === 200 ){

            toast.success("Upload Successful", {
                autoClose: 1000,
                style: {
                    backgroundColor: '#1f2937', // Tailwind bg-gray-800
                    color: '#fff', // Tailwind text-white
                    fontWeight: '600', // Tailwind font-semibold
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-lg
                    marginTop: '2.5rem' // Tailwind mt-10,
                },
                progressStyle: {
                    backgroundColor: '#22c55e' // Tailwind bg-green-400
                },
            });

            setImage([]);

          }

        } catch (error) {
        
            handleError(error);

            toast.error("Someting Went Wrong", {
                autoClose: 2000,
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

            setImage([]);
        
        }

    };

	return (

		<>

			<NavBar />

			<ToastContainer />
		
			<form
				onSubmit={(e) => handleSubmit(e)}
			>

				<div 
					className="px-10 transition-all duration-200 cursor-pointer"
				>

					<label className='text-xs'>Upload the documents <span className='text-red-400'>*</span></label><br />

					<input 
						type="file"
						accept="image/*"
						capture="environment" // opens the camera on mobile devices
						onChange={(e) => handleCapture(e)}
						multiple // Allows multiple file selection
						className='mt-2 mb-5 cursor-pointer'
						id='fileInput'
					/><br />

					<label htmlFor="fileInput" className="mt-2 cursor-pointer bg-gray-800 text-white py-2 px-4 rounded-lg hover:opacity-60 active:opacity-40">
						Add More
					</label>

				</div>

				<button 
					className='bg-[#238636] mx-10 my-10 px-2 rounded-lg leading-10 cursor-pointer hover:opacity-60 active:opacity-40 inline-block'
					type='submit'
				>
					Submit

				</button>

			</form>
		
		</>

	)

}

export default FillTheSurgeryForm