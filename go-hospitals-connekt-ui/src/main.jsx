import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { getApp } from '../Utils/helpers';
import GoWorkRouter from './GoWorkRouter';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from './Components/Secured/ReduxToolkit/Store/store';

const App = () => {

	const CurrentApp = getApp();

	return (

		<Provider
			store={store}
		>

			<BrowserRouter>
			
				<CurrentApp />
			
			</BrowserRouter>

		</Provider>

	)

}

createRoot(document.getElementById('root')).render(

	// <BrowserRouter>
	// 	<GoWorkRouter />
	// </BrowserRouter>
		<App />

)
