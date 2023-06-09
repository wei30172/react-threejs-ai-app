import { FC, useState, useEffect  } from 'react'
import { useParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import newRequest from '../../utils/newRequest'
import { CheckoutForm } from '../../components'
import './Pay.scss'

const stripePromise = loadStripe(
  'pk_test_51KykAtE716I4o6870hC0eNpkyizQWX4lJ8OoyxPZzpZt0Hd2ayUxAJslUbQCs79tOEVo51gAcALHR9ALYgwr9eCr00TMhZylCr'
)

const Pay: FC = () => {
  const [clientSecret, setClientSecret] = useState<string>('')
  const { id } = useParams()

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(`/orders/create-payment-intent/${id}`)
        setClientSecret(res.data.clientSecret)
      } catch (err) {
        console.error(err)
      }
    }

    makeRequest()
  }, [id])

  const options = {
    clientSecret
  }

  return (
    <div className='pay'>
      <div className='container'>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  )
}

export default Pay