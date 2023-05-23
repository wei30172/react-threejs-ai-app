import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

import { Home, MyGigs, AddGig, Orders, Messages, Message, MyImages, AddImage, Register, Login } from './pages'
import { Navbar, Footer } from './components'

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
          path: '/my-gigs',
          element: <MyGigs />
        },
        {
          path: '/add-gig',
          element: <AddGig />
        },
        {
          path: '/orders',
          element: <Orders />
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
          path: '/my-images',
          element: <MyImages />
        },
        {
          path: '/add-image',
          element: <AddImage />
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
    }
  ])

  return <RouterProvider router={router} />
}

export default App