import { useState } from 'react'

import { ErrorIcon } from '../icons'
import './FormInput.scss'

export type InputType = {
  label: string
  errorMessage: string
  name: string
  type: string
  placeholder: string
  pattern?: string
  required: boolean
}

interface Props extends InputType {
  value: string
  handleChange: (e: React.FormEvent<HTMLInputElement>) => void
}

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  focused?: boolean
}

export const Input: React.FC<InputProps> = (props: InputProps) => {
  const { focused, ...rest } = props
  return focused ? (
    <input {...rest} className='focused' />
  ) : (
    <input {...rest} />
  )
}

const FormInput: React.FC<Props> = ({
  label,
  errorMessage,
  handleChange,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false)

  const handleBlur = () => {
    setFocused(true)
  }

  return (
    <div className='form-input'>
      <label>{label}</label>
      <br />
      <Input
        {...inputProps}
        onChange={handleChange}
        onBlur={handleBlur}
        focused={focused}
      />
      <span>
        <ErrorIcon />
        {errorMessage}
      </span>
    </div>
  )
}

export default FormInput