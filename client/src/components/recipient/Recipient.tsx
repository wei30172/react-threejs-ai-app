import { FormEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { IOrderState, changeOrderInput } from '../../slices/orderSlice'
import { RootState } from '../../store'
import { FormInput } from '../../components'
import './Recipient.scss'

const Recipient: React.FC = () => {
  const dispatch = useDispatch()

  const orderInfo = useSelector((state: RootState) => state.order)
  
  const formInputs = [
    {
      id: 1,
      label: 'Name',
      errorMessage:
        'User Name is required',
      name: 'name',
      type: 'text',
      placeholder: 'Name',
      required: true
    },
    {
      id: 2,
      label: 'Email',
      errorMessage: 'Email should be a valid email address!',
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      required: true
    },
    {
      id: 3,
      label: 'Address',
      errorMessage: 'Address is required',
      name: 'address',
      type: 'text',
      placeholder: 'Address',
      required: true
    },
    {
      id: 4,
      label: 'Phone',
      errorMessage: 'Phone number should be 10 digits and start with 09',
      name: 'phone',
      type: 'text',
      placeholder: 'Phone',
      required: true
    }
  ]
  
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    dispatch(
      changeOrderInput({
        field: target.name as keyof IOrderState,
        value: target.value
      })
    )
  }

  return (
    <div className='recipient'>
      <h2>Recipient</h2>
      <form>
        {formInputs.map((input) => (
          <div key={input.id}>
            <FormInput
              key={input.id}
              {...input}
              value={(orderInfo[input.name as keyof IOrderState] ?? '').toString()}
              handleChange={handleChange}
            />
          </div>
        ))}
      </form>
    </div>
  )

}

export default Recipient
