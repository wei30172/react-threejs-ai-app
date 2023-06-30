import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useLogoutMutation } from '../../slices/apiSlice/authApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { logout } from '../../slices/authSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import { HomeIcon } from '../icons/index'
import './Navbar.scss'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { pathname } = useLocation()

  const { userInfo } = useSelector((state: RootState) => state.auth)
  
  const [active, setActive] = useState(false)
  const [open, setOpen] = useState(false)

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', isActive)
    return () => {
      window.removeEventListener('scroll', isActive)
    }
  }, [])

  const [logoutApiCall] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/')
      
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Logout failed'
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }))
    }
  }

  return (
    <div className={active || pathname !== '/' ? 'navbar active' : 'navbar'}>
      <div className='container flex-between'>
        <div className='navbar__logo cursor-pointer' onClick={() => navigate('/')}>
          <HomeIcon />
        </div>
        <div className='navbar__links'>
          {userInfo ? (
            <div className='navbar__user flex-center cursor-pointer' onClick={() => setOpen(!open)}>
              <img src={userInfo.user_photo || '/img/noavatar.jpg'} alt='avatar' />
              <span>{userInfo?.username}</span>
              {open && (
                <div className='navbar__options'>
                  <Link className='link' to='/profile'>
                    Profile
                  </Link>
                  <Link className='link' to='/orders'>
                  Orders
                  </Link>
                  <Link className='link' to='/messages'>
                    Messages
                  </Link>
                  <Link className='link' to='/posts'>
                    Images Posts
                  </Link>
                  {userInfo.isAdmin && (
                    <>
                      <Link className='link' to='/my-gigs'>
                        My Gigs
                      </Link>
                      {<Link className='link' to='/posts/add-post'>
                        Add New Post
                      </Link>}
                      <Link className='link' to='/my-gigs/add-gig'>
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to='/login'
                state={{from: pathname}}
                className='link'
              >
                Log in
              </Link>
              <Link
                to='/register'
                state={{from: pathname}}
                className='link btn'
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar