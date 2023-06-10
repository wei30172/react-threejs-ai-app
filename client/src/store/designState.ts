import { ComponentType, HTMLAttributes } from 'react'
import { proxy } from 'valtio'

import { SwatchIcon, FileIcon, LogoShirtIcon, StylishShirtIcon } from '../components/icons'
// import { SwatchIcon, FileIcon, AiIcon, LogoShirtIcon, StylishShirtIcon } from '../components/icons'

// Editor tabs configuration
export type TabType = {
  name: string
  icon: ComponentType<Pick<HTMLAttributes<SVGElement>, 'className'>>
}

export const EditorTabs: TabType[] = [
  {
    name: 'colorpicker',
    icon: SwatchIcon
  },
  {
    name: 'filepicker',
    icon: FileIcon
  }
  // {
  //   name: 'aipicker',
  //   icon: AiIcon
  // }
]

// Filter tabs configuration
export type DecalTypeKey = 'logo' | 'full'
export type ActiveFilterTabKey = 'logoShirt' | 'stylishShirt'
type ActiveFilterTabValue = 'logoDecal' | 'fullDecal'

type FilterTabType = TabType & {
  name: ActiveFilterTabKey
}

export const FilterTabs: FilterTabType[] = [
  {
    name: 'logoShirt',
    icon: LogoShirtIcon
  },
  {
    name: 'stylishShirt',
    icon: StylishShirtIcon
  }
]

// Decal types configuration
type DecalType = {
  [key in DecalTypeKey]: {
    stateProperty: ActiveFilterTabValue
    filterTab: ActiveFilterTabKey
  }
}

export const DecalTypes: DecalType = {
  logo: {
    stateProperty: 'logoDecal',
    filterTab: 'logoShirt'
  },
  full: {
    stateProperty: 'fullDecal',
    filterTab: 'stylishShirt'
  }
}

type IDesign = {
  color: string
  isLogoTexture: boolean
  isFullTexture: boolean
  logoDecal: string
  fullDecal: string
}

const designState: IDesign = proxy({
  color: '#DB8091',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: '/img/design.jpg',
  fullDecal: '/img/design.jpg'
})

export default designState