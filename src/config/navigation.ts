export interface NavItem {
  label: string
  path: string
  shortLabel?: string // 用于移动端显示的短标签
}

export const navigationItems: NavItem[] = [
  {
    label: 'Text Diff',
    shortLabel: 'Text',
    path: '/',
  },
  {
    label: 'Image Diff',
    shortLabel: 'Image',
    path: '/image',
  },
]
