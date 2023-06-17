import { FC, FormEvent } from 'react'

import { OrderState, OrderAction, OrderActionType } from '../../reducers/orderReducer'
import { FormInput } from '../../components'
import './Recipient.scss'

interface RecipientProps {
  state: OrderState
  dispatch: React.Dispatch<OrderAction>
}

const Recipient: FC<RecipientProps> = ({ state, dispatch }) => {
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
      placeholder: '09xxxxxxxx',
      pattern: '^09[0-9]{8}$',
      required: true
    }
  ]
  
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    dispatch({
      type: OrderActionType.CHANGE_INPUT,
      payload: { [target.name]: target.value }
    })
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
              value={(state[input.name as keyof OrderState] ?? '').toString()}
              handleChange={handleChange}
            />
          </div>
        ))}
      </form>
    </div>
  )

}

export default Recipient
