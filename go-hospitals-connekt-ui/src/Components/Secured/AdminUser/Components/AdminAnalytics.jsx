import React, { useEffect, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    defaults,
    Legend 
} from 'chart.js'
import { TbDeviceAnalytics } from 'react-icons/tb';
import axios from 'axios';
import Cookies from 'js-cookie';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getDate, getTime, isBefore, subDays, subMonths } from 'date-fns';

// registries required for the chat.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

// default values for chat.js
defaults.maintainAspectRatio = false;

defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const AdminAnalytics = () => {

    // JWT Token
    const access_token = Cookies.get('access_token');

    // GoHospitals BackEnd API environment variable
    const goHospitalsAPIBaseURL = import.meta.env.VITE_GOHOSPITALS_API_BASE_URL;

    // State to select required button
    const [selected, setSelected] = useState('today');

    // variable with function embedded to get correct style
    const getButtonStyle = (currentOption) => selected === currentOption ? 'bg-sky-500 text-white pointer-events-none' : 'bg-gray-200 text-black';

    const todaysDate = new Date();

    // Function to run when today button selected
    const todayFunction = async () => {

        setSelected('today');

        fetchMainAnalytics();

    }

    // Function to run when the page mounts
    const fetchMainAnalytics = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchMainAnalytics`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(responseData);

                setMainAnalytics(responseData);

                console.log(`fetchMainAnalytics Function completed`);

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to run when oneMonth button selected
    const oneWeekFunction = () => {

        setSelected('oneWeek');

        fetchOneWeekAnaylytics();

    }

    // Function to fetch one week analytics
    const fetchOneWeekAnaylytics = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchOneWeekAnalytics`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(responseData);

                setMainAnalytics(responseData);

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to run when oneMonth button selected
    const oneMonthFunction = () => {

        setSelected('oneMonth');

        fetchOneMonthAnaylytics();

    }

    // Function to fetch one week analytics
    const fetchOneMonthAnaylytics = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchOneMonthAnalytics`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(responseData);

                setMainAnalytics(responseData);

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to run when threeMonths button selected
    const threeMonthsFunction = () => {

        setSelected('threeMonths');

        fetchThreeMonthsAnalytics();

    }

    // Function to fetch one week analytics
    const fetchThreeMonthsAnalytics = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchThreeMonthsAnalytics`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(responseData);

                setMainAnalytics(responseData);

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to run when sixMonths button selected
    const sixMonthsFunction = () => {

        setSelected('sixMonths');

        fetchSixMonthsAnalytics();

    }

    // Function to fetch one week analytics
    const fetchSixMonthsAnalytics = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchSixMonthsAnalytics`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(responseData);

                setMainAnalytics(responseData);

            }

        }catch(error){

            console.error(error);

        }

    }

    // Function to run when oneYear button selected
    const oneYearFunction = () => {

        setSelected('oneYear');

        fetchOneYearAnalytics();

    }

    // Function to fetch one week analytics
    const fetchOneYearAnalytics = async () => {

        try{

            const response = await axios.get(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchOneYearAnalytics`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(responseData);

                setMainAnalytics(responseData);

            }

        }catch(error){

            console.error(error);

        }

    }

    const [fetchAnalyticsDates, setFetchAnalyticsDates] = useState({
        startDate: ``,
        endDate: ``
    });

    const fetchAnalyticsByDates = async () => {

        if ( fetchAnalyticsDates.startDate !== '' && fetchAnalyticsDates.endDate !== '' && isBefore(fetchAnalyticsDates.startDate, new Date()) && isBefore(fetchAnalyticsDates.endDate, new Date()) && isBefore(fetchAnalyticsDates.startDate, fetchAnalyticsDates.endDate) ){
        
            try{

                setSelected('');

                const formData = new FormData();

                formData.append(`startDate`, fetchAnalyticsDates.startDate);
                formData.append(`endDate`, fetchAnalyticsDates.endDate)

                const response = await axios.post(`${goHospitalsAPIBaseURL}/api/v1/admin/fetchAnalyticsByDates`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                if ( response.status === 200 ){

                    const responseData = response.data;

                    console.log(responseData);

                    setMainAnalytics(responseData);

                }

            }catch(error){

                console.error(error);

            }

        } else {

            console.log('Select Correct Date');

        }

    }

    // State to store the main analytics data
    const [mainAnalytics, setMainAnalytics] = useState({
        opsCount: ``,
        waitingForDMOCare: ``,
        waitingForDoctorConsultation: ``,
        onSiteReviewPatientDressingCount: ``,
        onSiteVascularInjectionsCount: ``,
        onSiteQuickTreatmentCount: ``,
        onSiteCasualityPatientsCount: ``,
        patientAdmitsCount: ``,
        followUpPatientsCount: ``,
        crossConsultationCount: ``,
        surgeriesCompletedCount: ``,
        closedCasesCount: ``,
        patientDropOutCount: ``
    });

    // useEffect to run when the page mounts
    useEffect(() => {

        if ( access_token ){

            fetchMainAnalytics();

        }

    }, []);

    // state to store the websocket client for future use
    const [stompClient, setStompClient] = useState(null);

    // Connect to websockets when the component mounts with useEffect hook
    useEffect(() => {

        const sock = new SockJS(`${goHospitalsAPIBaseURL}/go-hospitals-websocket`);
        const client = Stomp.over(() => sock);

        setStompClient(client);

        client.connect(
            {},
            () => {

                client.subscribe(`/admin/adminAnalyticsWebSocket`, (message) => {

                    const messageBody = JSON.parse(message.body);

                    console.log(`Received Message Body : ${messageBody}`);

                    if ( messageBody.analyticsModelRefreshType === 'RefreshAdminMainAnalytics' ){

                        if ( selected === 'today' ){

                            fetchMainAnalytics();

                        }

                        if ( selected === 'oneWeek' ){

                            fetchOneWeekAnaylytics();

                        }

                        if ( selected === 'oneMonth' ){

                            fetchOneMonthAnaylytics();

                        }

                        if ( selected === 'threeMonths' ){

                            fetchThreeMonthsAnalytics();

                        }

                        if ( selected === 'sixMonths' ){

                            fetchSixMonthsAnalytics();

                        }

                        if ( selected === 'oneYear' ){

                            fetchOneYearAnalytics();

                        }

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

        <div className="">

            <div className="mx-10 mb-10 text-xl flex items-center">

                <TbDeviceAnalytics 
                    className='mr-2'
                /> Analytics

            </div>

            <div className="mx-10 mb-10">

                <div className="flex items-center">

                    <div 
                        className={` ${getButtonStyle('today')} mr-2 px-2 rounded-md hover:opacity-60 active:opacity-80 cursor-pointer transition-all duration-200`}
                        onClick={todayFunction}
                    >Today</div>
                    <div 
                        className={` ${getButtonStyle('oneWeek')} mr-2 px-2 rounded-md hover:opacity-60 active:opacity-80 cursor-pointer transition-all duration-200`}
                        onClick={oneWeekFunction}
                    >1 Week</div>
                    <div 
                        className={` ${getButtonStyle('oneMonth')} mr-2 px-2 rounded-md hover:opacity-60 active:opacity-80 cursor-pointer transition-all duration-200`}
                        onClick={oneMonthFunction}
                    >1 Month</div>
                    <div 
                        className={` ${getButtonStyle('threeMonths')} mr-2 px-2 rounded-md hover:opacity-60 active:opacity-80 cursor-pointer transition-all duration-200`}
                        onClick={threeMonthsFunction}    
                    >3 Months</div>
                    <div 
                        className={` ${getButtonStyle('sixMonths')} mr-2 px-2 rounded-md hover:opacity-60 active:opacity-80 cursor-pointer transition-all duration-200`}
                        onClick={sixMonthsFunction}    
                    >6 Months</div>
                    <div 
                        className={` ${getButtonStyle('oneYear')} mr-2 px-2 rounded-md hover:opacity-60 active:opacity-80 cursor-pointer transition-all duration-200`}
                        onClick={oneYearFunction}    
                    >12 Months</div>

                    <div className="flex items-center ml-10">

                        <div className="">

                            <label className='font-semibold text-sm'>From</label>

                            <input 
                                type='date'
                                className='text-black rounded-md ml-3 pl-2'
                                onChange={(e) => {

                                    const value = e.target.value;

                                    const dateValue = new Date(value)

                                    setFetchAnalyticsDates((prevElement) => ({
                                        ...prevElement,
                                        startDate: dateValue
                                    }));

                                }}
                            />

                        </div>

                        <div className="ml-5">

                            <label className='font-semibold text-sm'>To</label>

                            <input 
                                type='date'
                                className='text-black rounded-md ml-3 pl-2'
                                onChange={(e) => {

                                    const value = e.target.value;

                                    const dateValue = new Date(value)

                                    setFetchAnalyticsDates((prevElement) => ({
                                        ...prevElement,
                                        endDate: dateValue
                                    }));

                                }}
                            />

                        </div>
                        
                        <button
                            className='bg-sky-500 rounded-md px-2 py-1 ml-5 hover:opacity-60 active:opacity-80'
                            onClick={fetchAnalyticsByDates}
                        >Fetch</button>

                    </div>

                </div>

            </div>

            <div className="ml-10 mb-10 border-gray-200 border-l-[1px] border-r-[1px] border-t-[1px] rounded-md rounded-b-none py-2 px-2">

                <table
                    className='w-full text-left'
                >

                    <thead
                        className=''
                    >

                        <tr
                            className='border-b-gray-200 border-b-[1px] h-[50px]'
                        >

                            <th
                                className='w-[70px]'
                            >S.NO</th>
                            <th
                                className=''
                            >Topic</th>
                            <th
                                className=''
                            >Value</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >1</td>
                            <td>Op's</td>
                            <td>{mainAnalytics.opsCount !== '' ? (

                                <span>{mainAnalytics.opsCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >2</td>
                            <td>Waiting for DMO Care </td>
                            <td>{mainAnalytics.waitingForDMOCare !== '' ? (

                                <span>{mainAnalytics.waitingForDMOCare}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >3</td>
                            <td>Waiting for Doctor Consultation </td>
                            <td>{mainAnalytics.waitingForDoctorConsultation !== '' ? (

                                <span>{mainAnalytics.waitingForDoctorConsultation}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >4</td>
                            <td>Onsite Review Patient Dressing </td>
                            <td>{mainAnalytics.onSiteReviewPatientDressingCount !== '' ? (

                                <span>{mainAnalytics.onSiteReviewPatientDressingCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >5</td>
                            <td>Onsite Vascular Injections </td>
                            <td>{mainAnalytics.onSiteVascularInjectionsCount !== '' ? (

                                <span>{mainAnalytics.onSiteVascularInjectionsCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >6</td>
                            <td>Onsite Quicktreatment </td>
                            <td>{mainAnalytics.onSiteQuickTreatmentCount !== '' ? (

                                <span>{mainAnalytics.onSiteQuickTreatmentCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >7</td>
                            <td>Onsite Casuality Patients </td>
                            <td>{mainAnalytics.onSiteCasualityPatientsCount !== '' ? (

                                <span>{mainAnalytics.onSiteCasualityPatientsCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >8</td>
                            <td>Patient Admits</td>
                            <td>{mainAnalytics.patientAdmitsCount !== '' ? (

                                <span>{mainAnalytics.patientAdmitsCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >9</td>
                            <td>Follow Up Patients</td>
                            <td>{mainAnalytics.followUpPatientsCount !== '' ? (

                                <span>{mainAnalytics.followUpPatientsCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >10</td>
                            <td>Cross Consultations</td>
                            <td>{mainAnalytics.crossConsultationCount !== '' ? (

                                <span>{mainAnalytics.crossConsultationCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >11</td>
                            <td>Surgeries Completed</td>
                            <td>{mainAnalytics.surgeriesCompletedCount !== '' ? (

                                <span>{mainAnalytics.surgeriesCompletedCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >12</td>
                            <td>Closed Cases</td>
                            <td>{mainAnalytics.closedCasesCount !== '' ? (

                                <span>{mainAnalytics.closedCasesCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >13</td>
                            <td>Patient Drop Outs</td>
                            <td>{mainAnalytics.patientDropOutCount !== '' ? (

                                <span>{mainAnalytics.patientDropOutCount}</span>

                            ): (

                                <AiOutlineLoading3Quarters 
                                    className = 'animate-spin'
                                />

                            )}</td>

                        </tr>

                    </tbody>

                </table>

            </div>

            <div className="flex mb-10 mx-10">

                <div className="w-[50%] h-[300px] flex justify-center">

                    <Bar
                        data={{
                            labels: ['Total', 'Expenditure', 'Revenue'],
                            datasets: [
                                {
                                    label: "Total",
                                    data: [400, 300, 200],
                                    backgroundColor: [
                                        "rgb(177 125 160)",
                                        "rgb(13 211 255)",
                                        "orange"
                                    ],
                                    borderRadius: 5
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: {
                                    text: 'Revenue Sources',
                                    color: 'white'
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        // Format the tooltip value with 'INR'
                                        return tooltipItem.formattedValue + ' INR'
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    ticks: {
                                        callback: function(value) {
                                            // Append 'INR' to the Y-axis values
                                            return value + ' INR';
                                        }
                                    }
                                }
                            }
                        }}
                    />                

                </div>

                <div className="w-[50%] h-[300px]">

                    <Doughnut
                        className='w-full h-full'
                        data={{
                            labels: ['Total', 'Expenditure', 'Revenue'],
                            datasets: [
                                {
                                    label: "Revenue",
                                    data: [200, 300, 400],
                                    backgroundColor: [
                                        "rgb(177 125 160)",
                                        "rgb(13 211 255)",
                                        "orange"
                                    ],
                                    borderColor: [
                                        "rgb(177 125 160)",
                                        "rgb(13 211 255)",
                                        "orange"
                                    ]
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: {
                                    text: 'Revenue Sources',
                                    color: 'white'
                                }
                            },
                        }}
                    />    

                </div>  

            </div>

            <div className="w-full h-[300px] mx-10 mb-20">

                <Line
                    data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [
                            {
                                label: "Total",
                                data: [65000, 28181, 18183, 19284, 19103, 17264, 29128, 47565, 19384, 29283, 57573, 29101],
                                borderColor: [
                                    "red",
                                ]
                            },
                            {
                                label: "Expenditure",
                                data: [28191, 37282, 85948, 14253, 96969, 47382, 58593, 27283, 59693, 61527, 48382, 19282],
                                borderColor: [
                                    "rgb(13 211 255)",
                                ]
                            },
                            {
                                label: "Revenue",
                                data: [22812, 17181, 37281, 11128, 36271, 24133, 27192, 19282, 29192, 38291, 38291, 12321],
                                borderColor: [
                                    "green",
                                ]
                            },
                        ],
                    }}
                    options={{
                        elements: {
                            line: {
                                tension: 0.5
                            }
                        },
                        plugins: {
                            title: {
                                text: 'Revenue Sources Per Annually',
                                color: 'white',
                            }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    callback: function(value) {
                                        // Append 'INR' to the Y-axis values
                                        return value + ' INR';
                                    }
                                }
                            }
                        }
                    }}
                />    

            </div>

        </div>

    )

}

export default AdminAnalytics