import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './Components/HomePage'

function App() {

	return (

		<>

			<BrowserRouter>
			
				<Routes>

					<Route index element={<HomePage />} />
					<Route path='/' element={<HomePage />} />

				</Routes>
			
			</BrowserRouter>
		
		</>
	
	)

}

export default App
