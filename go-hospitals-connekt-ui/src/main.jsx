import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import GoWorkRouter from './GoWorkRouter';
import { Provider } from 'react-redux';
import store from './Components/Secured/ReduxToolkit/Store/store';

createRoot(document.getElementById('root')).render(

	<Provider
		store={store}
	>

		<BrowserRouter>
			<GoWorkRouter />
		</BrowserRouter>

	</Provider>

)
