import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import newRequest, { IErrorResponse } from '../../utils/newRequest'
import { IOrder } from '../order/Order'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/toast/Toast'
import { ChatIcon, Loader, ErrorIcon } from '../../components/icons'
import './Orders.scss'

const Orders: FC = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') as string)

  const { showToast, hideToast, toastConfig } = useToast()

  const navigate = useNavigate()

  const { isLoading, error, data } = useQuery<IOrder[]>({
    queryKey: ['orders'],
    queryFn: () =>
      newRequest.get('/orders').then((res) => res.data)
  })

  const fetchConversation = async (order: IOrder) => {
    const { sellerId, buyerId } = order
    const id = sellerId + buyerId

    try {
      const res = await newRequest.get(`/conversations/single/${id}`)
      return res.data.id
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>

      if (axiosError?.response?.status === 404) {
        const res = await newRequest.post('/conversations/', {
          to: currentUser.seller ? buyerId : sellerId
        })
        return res.data.id
      }

      const errorMessage = axiosError.response?.data?.message || 'Fetch Conversation failed'
      showToast(errorMessage, 'error')
    }
  }

  const handleContact = async (order: IOrder) => {
    try {
      const conversationId = await fetchConversation(order)
      navigate(`/message/${conversationId}`)

    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const errorMessage = axiosError.response?.data?.message || 'Upload file(s) failed'
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
      <div className='orders'>
        <div className='container'>
          <div className='title'>
            <h1>Orders</h1>
            <Link to='/gigs'>
              <button className='button button--filled'>Design Your Own</button>
            </Link>
          </div>
          {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
            <>
              {data && data.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((order) => (
                      <tr key={order._id}>
                        <td>{order.createdAt?.slice(0, 10)}</td>
                        <td>
                          <img
                            className='image'
                            src={order.img}
                            alt={order.title} />
                        </td>
                        <td>
                          <Link to={`/orders/${order._id}`} className='link'>
                            {order.title}
                          </Link>
                        </td>
                        <td>{order.price}</td>
                        <td>
                          <button
                            onClick={() => handleContact(order)}
                            className='cursor-pointer'
                          >
                            <ChatIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <h3>Your order history is empty</h3>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Orders