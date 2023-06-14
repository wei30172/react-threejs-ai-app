import { FC, useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import newRequest from '../../utils/newRequest'
import { CheckoutForm } from '../../components'
import { Loader } from '../../components/icons'
import './Pay.scss'

const stripePromise = loadStripe(
  'pk_test_51KykAtE716I4o6870hC0eNpkyizQWX4lJ8OoyxPZzpZt0Hd2ayUxAJslUbQCs79tOEVo51gAcALHR9ALYgwr9eCr00TMhZylCr'
)

const Pay: FC = () => {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()

  const makeRequest = useCallback(async () => {
    try {
      const res = await newRequest.post(`/orders/create-payment-intent/${id}`)
      setClientSecret(res.data.clientSecret)
    } catch (err) {
      setError('An error occurred while creating the payment intent.')
    }
  }, [id])

  useEffect(() => {
    makeRequest()
  }, [makeRequest])

  const options = {
    clientSecret
  }

  return (
    <div className='pay'>
      <div className='container'>
        {error ? (
          <p>{error}</p>
        ) : clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  )
}

export default Pay