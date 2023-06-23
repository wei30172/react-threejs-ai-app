import { FC } from 'react'
import { SketchPicker, ColorResult } from 'react-color'
import { useSelector, useDispatch } from 'react-redux'

import { setDesign } from '../../../slices/designSlice'
import { RootState } from '../../../store'
import './ColorPicker.scss'

const ColorPicker: FC = () => {
  const dispatch = useDispatch()
  
  const designInfo = useSelector((state: RootState) => state.design)

  const handleChange = (color: ColorResult) => {
    dispatch(setDesign({field: 'color', value: color.hex}))
  }

  return (
    <div className='color-picker'>
      <SketchPicker 
        color={designInfo.color}
        disableAlpha
        onChange={handleChange}
      />
    </div>
  )
}

export default ColorPicker