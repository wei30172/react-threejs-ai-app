import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useConfirmMutation } from '../../slices/apiSlice/ordersApiSlice'
import './Success.scss'

const Success: React.FC = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const paymentIntent = params.get('payment_intent')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [confirm, { isLoading: isConfirmingPayment }] = useConfirmMutation()

  useEffect(() => {
    const makeRequest = async () => {

      if (!paymentIntent) {
        setErrorMessage('Payment intent not found.')
        return
      }

      try {
        await confirm({ payment_intent: paymentIntent }).unwrap()

      } catch (error) {
        setErrorMessage('Failed to confirm payment. Please try again later.')
        
      } finally {
        setTimeout(() => {
          navigate('/orders')
        }, 3000)
      }
    }

    makeRequest()
  }, [navigate, paymentIntent, confirm])

  return (
    <section className='success'>
      <div className='container'>
        <p>
          {isConfirmingPayment? 'Loading...'
            : errorMessage? errorMessage
              : 'Payment successful. You are being redirected to the orders page. Please do not close the page.'}
        </p>
      </div>
    </section>
  )
}

export default Success
