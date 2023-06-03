import { FC } from 'react'
import { useSnapshot } from 'valtio'

import designState, { TabType }  from '../../../store/designState'
import './Tab.scss'

interface TabProps {
  tab: TabType
  isFilterTab?: boolean
  isActiveTab?: boolean
  handleClick: () => void
}

const Tab: FC<TabProps> = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const snap = useSnapshot(designState)

  const activeStyles = isFilterTab && isActiveTab
    ? { backgroundColor: snap.color, opacity: 0.5 }
    : { backgroundColor: 'transparent', opacity: 1 }


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