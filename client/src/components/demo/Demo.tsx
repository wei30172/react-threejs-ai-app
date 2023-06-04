import { FC } from 'react'

import Customizer from '../customizer/Customizer'
import CanvasModel from '../../canvas'

import './Demo.scss'

const Demo: FC = () => {
  return (
    <div className='demo'>
      <h2>Demo</h2>
      <CanvasModel />
      <Customizer />
    </div>
  )
}

export default Demo