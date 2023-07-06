import { useState, CSSProperties, useEffect, useCallback, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { IOrder } from '../../slices/apiSlice/ordersApiSlice'
import { useGetSingleConversationQuery, useCreateConversationMutation } from '../../slices/apiSlice/conversationsApiSlice'
import { useGetSingleOrderQuery } from '../../slices/apiSlice/ordersApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import getContrastingColor from '../../utils/getContrastingColor'
import { ChatIcon, Loader, ErrorIcon } from '../../components/icons'
import './Order.scss'

const Order: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { orderId } = useParams<{orderId: string}>()
  const [conversationId, setConversationId] = useState<string | undefined>(undefined)

  const { userInfo } = useSelector((state: RootState) => state.auth)

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

  const fetchConversation = useCallback(async (order: IOrder) => {
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
          to: userInfo.isAdmin ? buyerId : sellerId
        }).unwrap()
        return newConversation.id

      } else {
        throw error
      }
    }
  }, [createConversation, conversation, refetchSingleConversation, userInfo.isAdmin])

  const handleContact = useCallback(async (order: IOrder) => {
    try {
      const conversationId = await fetchConversation(order)
      navigate(`/messages/${conversationId}`)

    } catch (error) {
      const errorMessage = 'Create Conversation failed'
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }))
    }
  }, [fetchConversation, navigate, dispatch])

  const style: CSSProperties = useMemo(() => ({
    backgroundColor: data?.color || '',
    color: getContrastingColor(data?.color || '#000000')
  }), [data?.color])

  return (
    <section className='order'>
      <div className='container'>
        <div className='title'>
          <h1>Order</h1>
          <Link to='/orders'>
            <button className='button button--filled'>All Orders</button>
          </Link>
        </div>
        {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
          <>
            <div className='order__info'>
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
            <div className='order__info'>
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
            <div className='order__info'>
              <h2>Customization Info:</h2>
              <h4 style={style} className='order__color'>Color: {data?.color}</h4>
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
                        className='order__image'
                        src={data?.designPhoto}
                        alt='customization'
                      />
                    </td>
                    <td>
                      {data?.logoDecalPhoto !== '' && <img
                        className='order__image'
                        src={data?.logoDecalPhoto}
                        alt='logoDecal'
                      />}
                    </td>
                    <td>
                      {data?.fullDecalPhoto !== '' && <img
                        className='order__image'
                        src={data?.fullDecalPhoto}
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
    </section>
  )
}

export default Order