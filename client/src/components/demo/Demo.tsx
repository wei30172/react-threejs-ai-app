import Customizer from '../customizer/Customizer'
import CanvasModel from '../../canvas'

import './Demo.scss'

const Demo: React.FC = () => {
  return (
    <div className='demo'>
      <CanvasModel />
      <Customizer />
    </div>
  )
}

export default Demo