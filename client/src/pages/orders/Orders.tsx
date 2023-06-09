import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import newRequest, { IErrorResponse } from '../../utils/newRequest'
import { ChatIcon, Loader, ErrorIcon } from '../../components/icons'
import './Orders.scss'

interface Order {
  _id: string
  sellerId: string
  buyerId: string
  img: string
  title: string
  price: number
}

const Orders: FC = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') as string)

  const navigate = useNavigate()

  const { isLoading, error, data } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () =>
      newRequest.get('/orders').then((res) => {
        return res.data
      })
  })

  const fetchConversation = async (order: Order) => {
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

      throw error
    }
  }

  const handleContact = async (order: Order) => {
    try {
      const conversationId = await fetchConversation(order)
      navigate(`/message/${conversationId}`)
    } catch (error) {
      // Handle error
      console.error(error)
    }
  }

  return (
    <div className='orders'>
      <div className='container'>
        <div className='title'>
          <h1>Orders</h1>
          <Link to='/gigs'>
            <button className='button button--filled'>Design Your Own</button>
          </Link>
        </div>
        {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img className='image' src={order.img} alt='' />
                  </td>
                  <td>{order.title}</td>
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
        )}
      </div>
    </div>
  )
}

export default Orders