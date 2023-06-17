import { FC, CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import newRequest from '../../utils/newRequest'
import getContrastingColor from '../../utils/getContrastingColor'
import { Loader, ErrorIcon } from '../../components/icons'
import './Order.scss'

export interface IOrder {
  _id: string
  gigId: string
  img: string
  title: string
  price: number
  sellerId: string
  buyerId: string
  createdAt: string
  isPaid: boolean
  payment_intent: string
  name: string
  email: string
  address: string
  phone: string
  color: string
  isLogoTexture: boolean
  isFullTexture: boolean
  logoDecal: string
  fullDecal: string
  url: string
}

const Order: FC = () => { 
  const { orderId } = useParams<{orderId: string}>()

  const { isLoading, error, data } = useQuery<IOrder, Error>({
    queryKey: ['order'],
    queryFn: () => newRequest.get(`/orders/single/${orderId}`).then((res) => res.data)
  })

  const style: CSSProperties = {
    backgroundColor: data?.color || '',
    color: getContrastingColor(data?.color || '#000000')
  }

  return (
    <div className='order'>
      <div className='container'>
        <div className='title'>
          <h1>Order</h1>
          <Link to='/orders'>
            <button className='button button--filled'>All Orders</button>
          </Link>
        </div>
        {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
          <>
            <div className="order_info">
              <h2>Order Info:</h2>
              <h4>Order Id: {orderId}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Pay</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{data.createdAt?.slice(0, 10)}</td>
                    <td>{data?.title}</td>
                    <td>{data?.price}</td>
                    <td>
                      {data?.isPaid ? 'Yes' : (
                        <Link to={`/pay/${orderId}`}>
                          <button className='button button--outline'>Pay Now</button>
                        </Link>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="order_info">
              <h2>Shipping Info:</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{data?.name}</td>
                    <td>{data?.email}</td>
                    <td>{data?.phone}</td>
                  </tr>
                </tbody>
              </table>
              <table>
                <thead>
                  <tr>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{data?.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="order_info">
              <h2>Customization Info:</h2>
              <h4 style={style} className='order_info_color'>Color: {data?.color}</h4>
              <table>
                <thead>
                  <tr>
                    <th>My Design</th>
                    <th>Logo Texture: {data?.isLogoTexture ? 'Yes' : 'No'}</th>
                    <th>Full Texture: {data?.isFullTexture ? 'Yes' : 'No'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img
                        className='image'
                        src={data?.url}
                        alt='customization'
                      />
                    </td>
                    <td>
                      {data?.logoDecal !== '' && <img
                        className='image'
                        src={data?.logoDecal}
                        alt='logoDecal'
                      />}
                    </td>
                    <td>
                      {data?.fullDecal !== '' && <img
                        className='image'
                        src={data?.fullDecal}
                        alt='logoDecal'
                      />}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Order