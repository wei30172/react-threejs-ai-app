import { RouterProvider } from 'react-router-dom'
import router from './Routes'
import { Toast } from './components'
import './styles/_main.scss'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toast /> 
    </>
  )
}

export default App