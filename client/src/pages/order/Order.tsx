import { useState, CSSProperties, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { IOrder } from '../../slices/apiSlice/ordersApiSlice'
import { useGetSingleConversationQuery, useCreateConversationMutation } from '../../slices/apiSlice/conversationsApiSlice'
import { useGetSingleOrderQuery } from '../../slices/apiSlice/ordersApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { RootState } from '../../store'
import getContrastingColor from '../../utils/getContrastingColor'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/toast/Toast'
import { ChatIcon, Loader, ErrorIcon } from '../../components/icons'
import './Order.scss'

const Order: React.FC = () => { 
  const { orderId } = useParams<{orderId: string}>()
  const [conversationId, setConversationId] = useState<string | undefined>(undefined)

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const { showToast, hideToast, toastConfig } = useToast()

  const navigate = useNavigate()

  const { isLoading, error, data } = useGetSingleOrderQuery(orderId)

  useEffect(() => {
    if (data) {
      const newConversationId = data.sellerId + data.buyerId
      setConversationId(newConversationId)
    }
  }, [data])

  const {
    isLoading: isLoadingConversation,
    data: conversation,
    refetch: refetchSingleConversation
  } = useGetSingleConversationQuery(conversationId)

  const [createConversation, { isLoading: isCreatingConversation }] = useCreateConversationMutation()
  
  const fetchConversation = async (order: IOrder) => {
    const { sellerId, buyerId } = order
    const newConversationId = sellerId + buyerId
    setConversationId(newConversationId)
    
    try {
      await refetchSingleConversation().unwrap()
      return conversation?.id
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.data?.message === 'Conversation not found') {
        const newConversation = await createConversation({
          to: userInfo.isSeller ? buyerId : sellerId
        }).unwrap()
        return newConversation.id
      } else {
        throw error
      }
    }
  }
  
  const handleContact = async (order: IOrder) => {
    try {
      const conversationId = await fetchConversation(order)
      navigate(`/messages/${conversationId}`)
    } catch (error) {
      const errorMessage = 'Create Conversation failed'
      showToast(errorMessage, 'error')
    }
  }

  const style: CSSProperties = {
    backgroundColor: data?.color || '',
    color: getContrastingColor(data?.color || '#000000')
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
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
                <h4>
                  Order Id: {orderId}
                  <button
                    onClick={() => data && handleContact(data)}
                    className='cursor-pointer'
                    disabled={isLoadingConversation || isCreatingConversation}
                  >
                    <ChatIcon />
                    {(isLoadingConversation || isCreatingConversation) && <Loader />}
                  </button>
                </h4>
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
                      <td>{data?.createdAt?.slice(0, 10)}</td>
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
    </>
  )
}

export default Order