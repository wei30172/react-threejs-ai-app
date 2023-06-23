import { FC, ComponentType, HTMLAttributes } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../../store'
import './Tab.scss'

export type TabType = {
  name: string
  icon: ComponentType<Pick<HTMLAttributes<SVGElement>, 'className'>>
}

interface TabProps {
  tab: TabType
  isFilterTab?: boolean
  isActiveTab?: boolean
  handleClick: () => void
}

const Tab: FC<TabProps> = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const designInfo = useSelector((state: RootState) => state.design)

  const activeStyles = isFilterTab && isActiveTab
    ? { borderColor: designInfo.color, borderWidth: 2 }
    : { borderColor: 'transparent'}


  return (
    <div
      key={tab.name}
      className={
        `tab flex-center cursor-pointer
        ${isFilterTab ? 'filter-tab glassmorphism' : 'editor-tab'}`
      }
      onClick={handleClick}
      style={activeStyles}
    >
      <tab.icon/>
    </div>
  )
}

export default Tab