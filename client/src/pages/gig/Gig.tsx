import { FC, useState, useReducer, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { orderReducer, INITIAL_STATE, OrderState } from '../../reducers/orderReducer'
import { IGig } from '../../reducers/gigReducer'
import getCurrentUser from '../../utils/getCurrentUser'
import newRequest, { AxiosError } from '../../utils/newRequest'
// import { IUser } from '../register/Register'
import { useToast } from '../../hooks/useToast'
import { Carousel, Demo, Recipient, UploadPreview, Toast } from '../../components'
// import { Carousel, Demo, Recipient, Seller, Reviews } from '../../components'
import { Loader, ErrorIcon, CheckIcon } from '../../components/icons'
import './Gig.scss'

const Gig: FC = () => {
  const [showCheckOut, setShowCheckOut] = useState(false)

  const { gigId } = useParams()
 
  const { isLoading, error, data } = useQuery<IGig, Error>({
    queryKey: ['gig'],
    queryFn: () => newRequest.get(`/gigs/single/${gigId}`).then((res) => res.data)
  })

  const currentUser = getCurrentUser()
  const [state, dispatch] = useReducer(orderReducer, {
    ...INITIAL_STATE,
    buyerId: currentUser?._id || null,
    gigId: gigId || '',
    name: currentUser?.username || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    phone: currentUser?.phone || ''
  })

  const { showToast, hideToast, toastConfig } = useToast()

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const orderMutation = useMutation({
    mutationFn: (order: OrderState) => {
      return newRequest.post('/orders', order)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    }
  })

  const { isLoading: isLoadingOrders } = orderMutation

  const handleCheckout = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    orderMutation.mutate(state, {
      onSuccess: () => {
        setShowCheckOut(false)
        showToast('Created order successfully, To the Order page in 5 seconds...', 'success')
        setTimeout(() => {
          navigate('/orders')
        }, 5000)
      },
      onError: (error: unknown) => {
        const axiosError = error as AxiosError
        const errorMessage = axiosError.response?.data?.message || 'Update gig failed'
        showToast(errorMessage, 'error')
      }
    })
  }, [orderMutation, state, navigate, showToast])

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
      <div className='gig'>
        {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
          <div className='container'>
            
            <div className='left'>
              <h1>{data.title}</h1>
              <h2>About</h2>
              <p>{data.desc}</p>
              <Carousel carouselImages={data.images} />
              <Demo />
              {/* {isLoadingUser ? (
                'loading'
              ) : errorUser ? (
                'Something went wrong!'
              ) : (
                <Seller dataUser={dataUser} data={data} />
              )} */}
              {/* {gigId && <Reviews gigId={gigId} />} */}
            </div>
            <div className='right'>
              <div className='price'>
                <h2>$ {data.price}</h2>
              </div>
              <p>{data.shortDesc}</p>
              <div className='features'>
                {data.features.map((feature) => (
                  <div className='item' key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                className='button button--filled'
                onClick={() => setShowCheckOut(true)}
              >
                Proceed
              </button>
              {showCheckOut && gigId &&  !isLoadingOrders &&
                <>
                  <Recipient
                    state={state}
                    dispatch={dispatch}
                  />
                  <UploadPreview
                    state={state}
                    dispatch={dispatch}
                    handleCheckout={handleCheckout}
                  />
                </>
              }
              {isLoadingOrders && <Loader />}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Gig