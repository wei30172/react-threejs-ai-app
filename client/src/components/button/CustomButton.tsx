import { MouseEventHandler } from 'react'

type CustomButtonProps = {
  type: 'filled' | 'outline'
  title: string
  handleClick?: MouseEventHandler<HTMLButtonElement>
}

const CustomButton: React.FC<CustomButtonProps> = ({ type, title, handleClick }) => {
  return (
    <button
      className={`button button--${type}`}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton