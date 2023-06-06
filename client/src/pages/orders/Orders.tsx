import { FC } from 'react'
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

  const handleContact = async (order: Order) => {
    const { sellerId, buyerId } = order

    console.log( sellerId, buyerId )
  }

  return (
    <div className='orders'>
      {isLoading
        ? <Loader /> 
        : error
          ? <ErrorIcon />
          : 
          <div className='container'>
            <div className='title'>
              <h1>Orders</h1>
            </div>
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
          </div>}
    </div>
  )
}

export default Orders