import { FC, HTMLAttributes } from 'react'
import './Icon.scss'

const Icon: FC<Pick<HTMLAttributes<SVGElement>, 'className'>> = ({ className }) => (
  <svg
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={'close-icon'}
  >
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
    />
  </svg>
)

export default Icon