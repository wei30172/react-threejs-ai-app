import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import { useIntentMutation } from '../../slices/apiSlice/ordersApiSlice'
import { CheckoutForm } from '../../components'
import './Pay.scss'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string)

const Pay: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>('')
  const { id } = useParams<{ id: string }>()

  const [intent, { isLoading: isCreatingIntent, error: createIntentError }] = useIntentMutation()

  const makeRequest = useCallback(async () => {
    try {
      const clientSecretResult = await intent(id).unwrap()
      setClientSecret(clientSecretResult.clientSecret)
    } catch (error) {
      console.error(error)
    }
  }, [id, intent])

  useEffect(() => {
    makeRequest()
  }, [makeRequest])

  const options = {
    clientSecret
  }

  return (
    <div className='pay'>
      <div className='container'>
        {isCreatingIntent? 'Loading...'
          : createIntentError? 'Failed to confirm payment. Please try again later.'
            : clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )
        }
      </div>
    </div>
  )
}

export default Pay