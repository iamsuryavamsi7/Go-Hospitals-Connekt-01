import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { getApp } from '../Utils/helpers';
import GoWorkRouter from './GoWorkRouter';

const App = () => {

	const CurrentApp = getApp();

	return (

		<BrowserRouter>
		
			<CurrentApp />
		
		</BrowserRouter>

	)

}

createRoot(document.getElementById('root')).render(

	<BrowserRouter>
		<GoWorkRouter />
	</BrowserRouter>

	// <App />

)
