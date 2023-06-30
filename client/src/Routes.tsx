import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components'

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
import { PrivateRoute, AdminRoute } from './components'

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
        element: <AdminRoute />,
        children: [
          {
            path: '',
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


export default router
