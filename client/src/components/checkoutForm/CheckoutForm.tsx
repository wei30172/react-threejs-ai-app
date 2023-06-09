import { FC, useEffect, useState, FormEvent } from 'react'
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

import { Loader } from '../../components/icons'

const CheckoutForm: FC = () => {
  const stripe = useStripe()
  const elements = useElements()

  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // handle successful or unsuccessful payments
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

  // handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/success' // todo
      }
    })

    if (result.error.type === 'card_error' || result.error.type === 'validation_error') {
      setMessage(result.error.message || 'Card error or validation error')
    } else {
      setMessage('An unexpected error occurred.')
    }

    setIsLoading(false)
  }

  return (
    <form id='payment-form' onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id='link-authentication-element'
        onChange={(event) => {
          setEmail(event.value.email)
        }} />
      <PaymentElement id='payment-element' />
      <button disabled={isLoading || !stripe || !elements} id='submit'>
        {isLoading ? <Loader /> : <span id='button-text'>Pay now</span>}
      </button>
      {message && <div id='payment-message'>{message}</div>}
    </form>
  )
}

export default CheckoutForm