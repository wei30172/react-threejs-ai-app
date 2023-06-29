import { useEffect, useState, FormEvent } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

import { Loader } from '../../components/icons'
import './CheckoutForm.scss'

const RETURN_URL = `${import.meta.env.VITE_APP_CLIENT_URL as string}/success` || 'http://localhost:5173/success'

const CheckoutForm: React.FC = () => {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
      case 'succeeded':
        setMessage('Payment succeeded!')
        break
      case 'processing':
        setMessage('Your payment is processing.')
        break
      case 'requires_payment_method':
        setMessage('Your payment was not successful, please try again.')
        break
      default:
        setMessage('Something went wrong.')
        break
      }
    })
  }, [stripe])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: RETURN_URL
      }
    })

    if (error) {
      switch (error.type) {
      case 'card_error':
        setMessage('There was an error with your card. Please check your information and try again.')
        break
      case 'validation_error':
        setMessage('Validation error. Please check your information and try again.')
        break
      default:
        setMessage('An unexpected error occurred. Please try again later.')
      }
    }

    setIsLoading(false)
  }

  return (
    <form id='payment-form' onSubmit={handleSubmit}>
      <PaymentElement id='payment-element' />
      <button disabled={isLoading || !stripe || !elements} id='submit'>
        {isLoading ? <Loader /> : <span id='button-text'>Pay now</span>}
      </button>
      {message && <div id='payment-message' className='error-message'>{message}</div>}
    </form>
  )
}

export default CheckoutForm