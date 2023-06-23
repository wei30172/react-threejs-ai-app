import Customizer from '../customizer/Customizer'
import CanvasModel from '../../canvas'

import './Demo.scss'

const Demo: React.FC = () => {
  return (
    <div className='demo'>
      <h2>Demo</h2>
      <CanvasModel />
      <Customizer />
    </div>
  )
}

export default Demo