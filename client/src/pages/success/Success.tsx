import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import newRequest from '../../utils/newRequest'
import './Success.scss'

const Success: FC = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const paymentIntent = params.get('payment_intent')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const makeRequest = async () => {

      if (!paymentIntent) {
        setErrorMessage('Payment intent not found.')
        return
      }

      try {
        await newRequest.put('/orders', { payment_intent: paymentIntent })
      } catch (err) {
        setErrorMessage('Failed to process the order.')
      } finally {
        setTimeout(() => {
          navigate('/orders')
        }, 3000)
      }
    }

    makeRequest()
  }, [navigate, paymentIntent])

  return (
    <div className='success'>
      <div className='container'>
        {errorMessage 
          ? <p>{errorMessage} You are being redirected to the orders page. Please do not close the page.</p> 
          : <p>Payment successful. You are being redirected to the orders page. Please do not close the page.</p>
        }
      </div>
    </div>
  )
}

export default Success
