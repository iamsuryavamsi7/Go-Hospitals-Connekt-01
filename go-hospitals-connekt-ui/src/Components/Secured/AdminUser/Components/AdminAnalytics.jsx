import React, { useState } from 'react'
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const AdminAnalytics = () => {

    const [selected, setSelected] = useState('today');

    const getButtonStyle = (currentOption) => selected === currentOption ? 'bg-sky-500 text-white' : 'bg-gray-200 text-black';

    const todayFunction = () => {

        setSelected('today');

    }

    const oneMonthFunction = () => {

        setSelected('oneMonth');

    }

    const threeMonthsFunction = () => {

        setSelected('threeMonths');

    }

    const sixMonthsFunction = () => {

        setSelected('sixMonths');

    }

    const oneYearFunction = () => {

        setSelected('oneYear');

    }

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
                            />

                        </div>

                        <div className="ml-5">

                            <label className='font-semibold text-sm'>To</label>

                            <input 
                                type='date'
                                className='text-black rounded-md ml-3 pl-2'
                            />

                        </div>
                        
                        <button
                            className='bg-sky-500 rounded-md px-2 py-1 ml-5 hover:opacity-60 active:opacity-80'
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
                            <td>77</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >2</td>
                            <td>Onsite Treatment</td>
                            <td>178</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >3</td>
                            <td>Patient Admits</td>
                            <td>178</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >4</td>
                            <td>Follow Up Patients</td>
                            <td>178</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >5</td>
                            <td>Cross Consultations</td>
                            <td>178</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >6</td>
                            <td>Surgeries Completed</td>
                            <td>178</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >7</td>
                            <td>Closed Cases</td>
                            <td>178</td>

                        </tr>

                        <tr
                            className='border-b-gray-200 border-b-[1px]'
                        >

                            <td
                                className='w-[70px] h-[50px]'
                            >8</td>
                            <td>Patient Drop Outs</td>
                            <td>127</td>

                        </tr>

                    </tbody>

                </table>

            </div>

            <div className="flex mb-10 mx-10">

                <div className="w-[50%] h-[300px] flex justify-center">

                    <Bar
                        data={{
                            labels: ['A', 'B', 'C'],
                            datasets: [
                                {
                                    label: "Revenue",
                                    data: [200, 300, 400],
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
                            }
                        }}
                    />                

                </div>

                <div className="w-[50%] h-[300px]">

                    <Doughnut
                        className='w-full h-full'
                        data={{
                            labels: ['A', 'B', 'C'],
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
                            }
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
                                label: "Revenue",
                                data: [65000, 28181, 18183, 19284, 19103, 17264, 29128, 47565, 19384, 29283, 57573, 29101],
                                backgroundColor: [
                                    "rgb(177 125 160)",
                                    "rgb(13 211 255)",
                                    "orange"
                                ],
                                borderColor: [
                                    "rgb(13 211 255)",
                                ]
                            },
                            {
                                label: "Cost",
                                data: [28191, 37282, 85948, 14253, 96969, 47382, 58593, 27283, 59693, 61527, 48382, 19282],
                                backgroundColor: [
                                    "rgb(177 125 160)",
                                    "rgb(13 211 255)",
                                    "orange"
                                ],
                                borderColor: [
                                    "red",
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
                        }
                    }}
                />    

            </div>

        </div>

    )

}

export default AdminAnalytics