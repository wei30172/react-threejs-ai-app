import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
  Register,
  Login,
  Profile,
  Pay,
  Success,
  NotFound
} from './pages'
import { Navbar, Footer } from './components'
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

  const queryClient = new QueryClient()
  
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
          element: <MyGigs />
        },
        {
          path: '/add-gig',
          element: <AddGig />
        },
        {
          path: '/edit-gig/:gigId',
          element: <EditGig />
        },
        {
          path: '/orders',
          element: <Orders />
        },
        {
          path: '/orders/:orderId',
          element: <Order />
        },
        {
          path: '/messages',
          element: <Messages />
        },
        {
          path: '/message/:id',
          element: <Message />
        },
        {
          path: '/profile',
          element: <Profile />
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
      path: '/pay/:id',
      element: <Pay />
    },
    {
      path: '/success',
      element: <Success />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App