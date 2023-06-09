import { FC, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import newRequest from '../../utils/newRequest'
import './Success.scss'

const Success: FC = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const payment_intent = params.get('payment_intent')

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await newRequest.put('/orders', { payment_intent })
        setTimeout(() => {
          navigate('/orders')
        }, 5000)
      } catch (err) {
        console.log(err)
      }
    }

    if (payment_intent) {
      makeRequest()
    }
  }, [navigate, payment_intent])

  return (
    <div className='success'>
      <div className='container'>
        Payment successful. You are being redirected to the orders page. Please do
        not close the page
      </div>
    </div>
  )
}

export default Success
