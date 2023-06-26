import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

import {
  Home,
  Gigs,
  Gig,
  MyGigs,
  AddGig,
  EditGig,
  Orders,
  Order,
  Messages,
  Message,
  AddPost,
  Posts,
  Register,
  Login,
  Profile,
  Pay,
  Success,
  NotFound
} from './pages'
import { Navbar, Footer, PrivateRoute, AdminRoute } from './components'
import './styles/_main.scss'

function App() {
  const Layout = () => {
    return (
      <div className='app'>
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    )
  }
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/gigs',
          element: <Gigs />
        },
        {
          path: '/gig/:gigId',
          element: <Gig />
        },
        {
          path: '/my-gigs',
          element: <PrivateRoute />,
          children: [
            {
              path: '',
              element: <MyGigs />
            },
            {
              path: 'add-gig',
              element: <AddGig />
            },
            {
              path: 'edit-gig/:gigId',
              element: <EditGig />
            }
          ]
        },
        {
          path: '/orders',
          element: <PrivateRoute />,
          children: [
            {
              path: '',
              element: <Orders />
            },
            {
              path: ':orderId',
              element: <Order />
            }
          ]
        },
        {
          path: '/messages',
          element: <PrivateRoute />,
          children: [
            {
              path: '',
              element: <Messages />
            },
            {
              path: ':id',
              element: <Message />
            }
          ]
        },
        {
          path: '/posts',
          element: <PrivateRoute />,
          children: [
            {
              path: '',
              element: <Posts />
            },
            {
              path: 'add-post',
              element: <AdminRoute />,
              children: [
                {
                  path: '',
                  element: <AddPost />
                }
              ]
            }
          ]
        },
        {
          path: '/profile',
          element: <PrivateRoute />,
          children: [
            {
              path: '',
              element: <Profile />
            }
          ]
        }
      ]
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: 'pay/:id',
      element: <PrivateRoute />,
      children: [
        {
          path: '',
          element: <Pay />
        }
      ]
    },
    {
      path: 'success',
      element: <PrivateRoute />,
      children: [
        {
          path: '',
          element: <Success />
        }
      ]
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App