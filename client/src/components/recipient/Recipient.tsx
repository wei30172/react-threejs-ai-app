import { FC, useState, FormEvent } from 'react'
import { useSnapshot } from 'valtio'

import designState from '../../store/designState'
import { OrderState, OrderAction, OrderActionType } from '../../reducers/orderReducer'
import { uploadCanvasImage } from '../../utils/handleCanvasImage'
import { FormInput } from '../../components'
import './Recipient.scss'

interface RecipientProps {
  state: OrderState
  dispatch: React.Dispatch<OrderAction>
  handleCheckout: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const Recipient: FC<RecipientProps> = ({ state, dispatch, handleCheckout }) => {
  const snap = useSnapshot(designState)
  const [url, setUrl] = useState('')

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
      pattern: '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
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

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    const url = await uploadCanvasImage()
    if(url) setUrl(url)
    dispatch({
      type: OrderActionType.CHANGE_INPUT,
      payload: {...snap, url}
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
      <button
        disabled={!state.name || !state.email || !state.address || !state.phone}
        className='button button--outline'
        onClick={handleUpload}
      >
        Upload my design
      </button>
      {url && <div  className="my-design">
        <img src={url} />
      </div>}
      <button
        disabled={
          !state.name || !state.email || !state.address || !state.phone || !state.url
        }
        className='button button--filled'
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </div>
  )

}

export default Recipient
