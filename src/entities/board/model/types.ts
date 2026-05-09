export type BoardCardColor =
  | 'slate'
  | 'brand'
  | 'amber'
  | 'rose'
  | 'violet'
  | 'sky'

export type BoardCard = {
  id: string
  title: string
  description?: string
  color?: BoardCardColor
  createdAt: string
}

export type BoardColumn = {
  id: string
  title: string
  cardIds: string[]
}
