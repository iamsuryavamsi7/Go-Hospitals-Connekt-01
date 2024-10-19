import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';

const UserPage = () => {

// JWT Token
    const access_token = Cookies.get('access_token');

// State Management
    const [role, setRole] = useState(null);

    const [userObject, setUserObject] = useState(null);

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

                console.log(userObject);

                setRole(userObject.role);

                setUserObject(userObject);

            }

        }catch(error){

            handleError(error);

        }

    }

    useEffect(() => {

        !access_token ? console.log("jwtToken not available") : console.log(access_token);

        fetchUserObject();

    }, []);

    return (

        <>
        
            {role === roles.frontDesk && (

                <div className="">

                    This is Front Desk User

                </div>

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