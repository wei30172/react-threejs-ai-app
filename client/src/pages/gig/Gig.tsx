import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useGetSingleGigQuery } from '../../slices/apiSlice/gigsApiSlice'
import { useCreateOrderMutation } from '../../slices/apiSlice/ordersApiSlice'
import { changeOrderInput } from '../../slices/orderSlice'
import { RootState } from '../../store'
import { ApiError } from '../../slices/apiSlice'
import { useToast } from '../../hooks/useToast'
import { Carousel, Demo, Recipient, UploadPreview, Toast } from '../../components'
// import { Carousel, Demo, Recipient, Seller, Reviews, UploadPreview, Toast } from '../../components'
import { Loader, ErrorIcon, CheckIcon } from '../../components/icons'
import './Gig.scss'

const Gig: React.FC = () => {
  const [showCheckOut, setShowCheckOut] = useState(false)

  const { gigId } = useParams()
 
  const { isLoading, error, data } = useGetSingleGigQuery(gigId)

  const orderInfo = useSelector((state: RootState) => state.order)
  const designInfo = useSelector((state: RootState) => state.design)

  const { showToast, hideToast, toastConfig } = useToast()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (gigId) dispatch(changeOrderInput({field: 'gigId', value: gigId}))
  }, [gigId, dispatch])

  const [createOrder, { isLoading: isCreatingOrder, isSuccess }] = useCreateOrderMutation()

  const handleCheckout = useCallback(async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()

    try {
      await createOrder({...orderInfo, ...designInfo}).unwrap()
      setShowCheckOut(false)
      showToast('Created order successfully, To the Order page in 5 seconds...', 'success')
      
      setTimeout(() => {
        navigate('/orders')
      }, 5000)

    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Update gig failed'
      showToast(errorMessage, 'error')
    }
  }, [createOrder, orderInfo, designInfo, navigate, showToast])

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
              <h1>{data?.title}</h1>
              <h2>About</h2>
              <p>{data?.desc}</p>
              {data?.images && <Carousel carouselImages={data?.images} />}
              <Demo />
              {/* {data && <Seller gigData={data} />} */}
              {/* {gigId && <Reviews gigId={gigId} />} */}
            </div>
            <div className='right'>
              <div className='price'>
                <h2>$ {data?.price}</h2>
              </div>
              <p>{data?.shortDesc}</p>
              <div className='features'>
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
                  <Recipient />
                  <UploadPreview handleCheckout={handleCheckout}/>
                </>
              }
              {isCreatingOrder && <Loader />}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Gig