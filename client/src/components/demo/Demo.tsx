import { FC } from 'react'

import Customizer from '../customizer/Customizer'
import './Demo.scss'

const Demo: FC = () => {
  return (
    <div className='demo'>
      <h2>Demo</h2>
      <Customizer/>
    </div>
  )
}

export default Demo