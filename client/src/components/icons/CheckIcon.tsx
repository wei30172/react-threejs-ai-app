import { FC, HTMLAttributes } from 'react'
import './Icon.scss'

const Icon: FC<Pick<HTMLAttributes<SVGElement>, 'className'>> = ({ className }) => (
  <svg
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={'check-icon'}
  >
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
    />
  </svg>
)

export default Icon