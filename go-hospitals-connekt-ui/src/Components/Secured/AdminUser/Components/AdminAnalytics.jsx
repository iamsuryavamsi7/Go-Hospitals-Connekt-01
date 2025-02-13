import React from 'react'
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const AdminAnalytics = () => {

    return (

        <div className="">

            <div className="w-full h-[300px] mb-20 mx-10">

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

        <div className="flex mt-10 mx-10">

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

        </div>

    )

}

export default AdminAnalytics