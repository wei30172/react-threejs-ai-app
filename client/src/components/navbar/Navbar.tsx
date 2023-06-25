import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useLogoutMutation } from '../../slices/apiSlice/authApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { logout } from '../../slices/authSlice'
import { RootState } from '../../store'
import { useToast } from '../../hooks/useToast'
import Toast from '../toast/Toast'
import { HomeIcon } from '../icons/index'
import './Navbar.scss'

const Navbar: React.FC = () => {
  const [active, setActive] = useState(false)
  const [open, setOpen] = useState(false)

  const { pathname } = useLocation()

  const { showToast, hideToast, toastConfig } = useToast()

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', isActive)
    return () => {
      window.removeEventListener('scroll', isActive)
    }
  }, [])
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/login')
      
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Logout failed'
      showToast(errorMessage, 'error')
    }
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
      <div className={active || pathname !== '/' ? 'navbar active' : 'navbar'}>
        <div className='container flex-between'>
          <div className='logo cursor-pointer' onClick={() => navigate('/')}>
            <HomeIcon />
          </div>
          <div className='links'>
            {userInfo ? (
              <div className='user flex-center cursor-pointer' onClick={() => setOpen(!open)}>
                <img src={userInfo.img || '/img/noavatar.jpg'} alt='avatar' />
                <span>{userInfo?.username}</span>
                {open && (
                  <div className='options'>
                    {userInfo.isSeller && (
                      <>
                        <Link className='link' to='/my-gigs'>
                          My Gigs
                        </Link>
                        <Link className='link' to='/my-gigs/add-gig'>
                          Add New Gig
                        </Link>
                        <Link className='link' to='/posts'>
                          Images Posts
                        </Link>
                        <Link className='link' to='/posts/add-post'>
                          Add New Post
                        </Link>
                      </>
                    )}
                    <Link className='link' to='/profile'>
                      Profile
                    </Link>
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