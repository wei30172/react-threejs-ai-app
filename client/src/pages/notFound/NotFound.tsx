import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import './NotFound.scss'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const toHomePage = () => {
      navigate('/')
    }

    const timeoutId = setTimeout(toHomePage, 10000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [navigate])

  return (
    <section className='not-found'>
      <div className='container'>
        <p>
          Page not found. You are being redirected to the home page in 10 seconds. Click <Link to='/'>here</Link> to go to the home page.
        </p>
      </div>
    </section>
  )
}

export default NotFound