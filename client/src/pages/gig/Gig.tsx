import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useGetSingleGigQuery } from '../../slices/apiSlice/gigsApiSlice'
import { useCreateOrderMutation } from '../../slices/apiSlice/ordersApiSlice'
import { changeOrderInput } from '../../slices/orderSlice'
import { ApiError } from '../../slices/apiSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import { Carousel, Demo, Recipient, UploadPreview } from '../../components'
// import { Carousel, Demo, Recipient, Seller, Reviews, UploadPreview } from '../../components'
import { Loader, ErrorIcon, CheckIcon } from '../../components/icons'
import './Gig.scss'

const Gig: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { pathname } = useLocation()

  const [showCheckOut, setShowCheckOut] = useState(false)

  const { gigId } = useParams()
 
  const { isLoading, error, data } = useGetSingleGigQuery(gigId)

  const orderInfo = useSelector((state: RootState) => state.order)
  const designInfo = useSelector((state: RootState) => state.design)
  const { userInfo } = useSelector((state: RootState) => state.auth)
  
  useEffect(() => {
    if (gigId) dispatch(changeOrderInput({field: 'gigId', value: gigId}))
  }, [gigId, dispatch])

  const [createOrder, { isLoading: isCreatingOrder, isSuccess }] = useCreateOrderMutation()

  const handleCheckout = useCallback(async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()

    try {
      await createOrder({...orderInfo, ...designInfo}).unwrap()

      setShowCheckOut(false)

      dispatch(showToast({
        message: 'Created order successfully, To the Order page in 3 seconds...',
        type: 'success'
      }))
      
      setTimeout(() => {
        navigate('/orders')
      }, 3000)

    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Update gig failed'

      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }))
    }
  }, [createOrder, orderInfo, designInfo, navigate, dispatch])

  return (
    <section className='gig'>
      {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
        <div className='container'>
          <div className='gig__left'>
            <h1>{data?.title}</h1>
            <h2>About</h2>
            <p>{data?.desc}</p>
            {data?.gigPhotos && <Carousel carouselImages={data?.gigPhotos} />}
            <Demo />
            {/* {data && <Seller gigData={data} />} */}
            {/* {gigId && <Reviews gigId={gigId} />} */}
          </div>
          <div className='gig__right'>
            <div className='gig__price'>
              <h2>$ {data?.price}</h2>
            </div>
            <p>{data?.shortDesc}</p>
            <div className='gig__features'>
              {data?.features.map((feature: string) => (
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
            <span className='success-message'>
              {isSuccess ? 'Order created successfully ' : ''}
            </span>
            {showCheckOut && gigId &&  !isCreatingOrder &&
              <>
                {userInfo 
                  ? <>
                    <Recipient />
                    <UploadPreview handleCheckout={handleCheckout}/>
                  </>
                  : 
                  <div className='gig__navigation'>
                    <p>Please <Link to='/login' state={{from: pathname}}>
                      <button className='cursor-pointer'>
                        Login
                      </button>
                    </Link> to proceed with your order.</p>
                  </div>
                }
              </>
            }
            {isCreatingOrder && <Loader />}
          </div>
        </div>
      )}
    </section>
  )
}

export default Gig