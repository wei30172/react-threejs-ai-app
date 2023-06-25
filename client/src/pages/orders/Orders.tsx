import { Link } from 'react-router-dom'

import { useGetOrdersQuery } from '../../slices/apiSlice/ordersApiSlice'
import { Loader, ErrorIcon } from '../../components/icons'
import './Orders.scss'

const Orders: React.FC = () => {
  const { isLoading, error, data } = useGetOrdersQuery()

  return (
    <section className='orders'>
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
                    <th>isPaid</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((order) => (
                    <tr key={order._id}>
                      <td>{order.createdAt?.slice(0, 10)}</td>
                      <td>
                        <img
                          className='image'
                          src={order.url}
                          alt={order.title} />
                      </td>
                      <td>
                        <Link to={`/orders/${order._id}`} className='link'>
                          {order.title}
                        </Link>
                      </td>
                      <td>{order.price}</td>
                      <td>{order.isPaid ? 'Yes' : 'No'}</td>
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
    </section>
  )
}

export default Orders