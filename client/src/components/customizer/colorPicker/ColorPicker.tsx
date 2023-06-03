import { FC } from 'react'
import { SketchPicker, ColorResult } from 'react-color'
import { useSnapshot } from 'valtio'

import designState from '../../../store/designState'
import './ColorPicker.scss'

const ColorPicker: FC = () => {
  const snap = useSnapshot(designState)

  const handleChange = (color: ColorResult) => {
    designState.color = color.hex
  }

  return (
    <div className="color-picker">
      <SketchPicker 
        color={snap.color}
        disableAlpha
        onChange={handleChange}
      />
    </div>
  )
}

export default ColorPicker