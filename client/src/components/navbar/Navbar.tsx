import { FC, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HomeIcon } from '../icons/index'
import Toast, { ToastProps } from '../toast/Toast'
import getCurrentUser from '../../utils/getCurrentUser'
import newRequest from '../../utils/newRequest'
import './Navbar.scss'

const Navbar: FC = () => {
  const [active, setActive] = useState(false)
  const [open, setOpen] = useState(false)

  const { pathname } = useLocation()

  const [toastConfig, setToastConfig] = useState<ToastProps>({
    message: '',
    isVisible: false
  })

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', isActive)
    return () => {
      window.removeEventListener('scroll', isActive)
    }
  }, [])
  const navigate = useNavigate()

  const currentUser = getCurrentUser()

  const handleLogout = async () => {
    try {
      await newRequest.post('/auth/logout')
      localStorage.setItem('currentUser', '')
      navigate('/')
    } catch (error) {
      setToastConfig({
        message: `Error: ${error}`,
        isVisible: true,
        type: 'error'
      })
    }
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={() => setToastConfig({isVisible: false, message: ''})}
      />
      <div className={active || pathname !== '/' ? 'navbar active' : 'navbar'}>
        <div className='container flex-between'>
          <div className='logo' onClick={() => navigate('/')}>
            <HomeIcon />
          </div>
          <div className='links'>
            {currentUser ? (
              <div className='user flex-center cursor-pointer' onClick={() => setOpen(!open)}>
                <img src={currentUser.img || '/img/noavatar.jpg'} alt='avatar' />
                <span>{currentUser?.username}</span>
                {open && (
                  <div className='options'>
                    {currentUser.isSeller && (
                      <>
                        <Link className='link' to='/my-gigs'>
                          My Gigs
                        </Link>
                        <Link className='link' to='/add-gig'>
                          Add New Gig
                        </Link>
                      </>
                    )}
                    <Link className='link' to='/orders'>
                    Orders
                    </Link>
                    <Link className='link' to='/messages'>
                      Messages
                    </Link>
                    <button onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to='/login' className='link'>Sign in</Link>
                <Link className='link' to='/register'>
                  <button className='button'>Join</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar