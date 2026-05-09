import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoardCard, BoardColumn } from '@/entities/board'

type BoardState = {
  columns: BoardColumn[]
  cards: Record<string, BoardCard>

  addColumn: (title: string) => void
  renameColumn: (id: string, title: string) => void
  deleteColumn: (id: string) => void
  moveColumn: (columnId: string, targetIndex: number) => void

  addCard: (columnId: string, title: string) => void
  updateCard: (
    id: string,
    patch: Partial<Omit<BoardCard, 'id' | 'createdAt'>>,
  ) => void
  deleteCard: (id: string) => void
  moveCard: (
    cardId: string,
    targetColumnId: string,
    targetIndex: number,
  ) => void

  resetBoard: () => void
}

const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

const now = () => new Date().toISOString()

const buildDefaultBoard = (): {
  columns: BoardColumn[]
  cards: Record<string, BoardCard>
} => {
  const c1: BoardCard = {
    id: uid(),
    title: 'Invite your teammates',
    description:
      'Send invites from the Team page so everyone shows up in tracking.',
    color: 'brand',
    createdAt: now(),
  }
  const c2: BoardCard = {
    id: uid(),
    title: 'Install the desktop app',
    description: 'Roll it out across macOS, Windows, and Linux.',
    color: 'sky',
    createdAt: now(),
  }
  const c3: BoardCard = {
    id: uid(),
    title: 'Review last week’s activity',
    description: 'Spot-check intervals and screenshots before payroll.',
    color: 'amber',
    createdAt: now(),
  }
  const c4: BoardCard = {
    id: uid(),
    title: 'Welcome to your board',
    description:
      'Drag cards between columns. Click a card to edit details, color, or delete it.',
    color: 'violet',
    createdAt: now(),
  }

  const todo: BoardColumn = {
    id: uid(),
    title: 'To do',
    cardIds: [c1.id, c2.id],
  }
  const doing: BoardColumn = {
    id: uid(),
    title: 'In progress',
    cardIds: [c3.id],
  }
  const done: BoardColumn = {
    id: uid(),
    title: 'Done',
    cardIds: [c4.id],
  }

  return {
    columns: [todo, doing, done],
    cards: {
      [c1.id]: c1,
      [c2.id]: c2,
      [c3.id]: c3,
      [c4.id]: c4,
    },
  }
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      ...buildDefaultBoard(),

      addColumn: (title) =>
        set((s) => ({
          columns: [
            ...s.columns,
            { id: uid(), title: title.trim() || 'New column', cardIds: [] },
          ],
        })),

      renameColumn: (id, title) =>
        set((s) => ({
          columns: s.columns.map((c) =>
            c.id === id ? { ...c, title: title.trim() || c.title } : c,
          ),
        })),

      deleteColumn: (id) =>
        set((s) => {
          const col = s.columns.find((c) => c.id === id)
          if (!col) return s
          const cards = { ...s.cards }
          col.cardIds.forEach((cid) => delete cards[cid])
          return {
            columns: s.columns.filter((c) => c.id !== id),
            cards,
          }
        }),

      moveColumn: (columnId, targetIndex) =>
        set((s) => {
          const idx = s.columns.findIndex((c) => c.id === columnId)
          if (idx === -1) return s
          const cols = [...s.columns]
          const [moved] = cols.splice(idx, 1)
          const insertAt = Math.max(0, Math.min(targetIndex, cols.length))
          cols.splice(insertAt, 0, moved)
          return { columns: cols }
        }),

      addCard: (columnId, title) =>
        set((s) => {
          const trimmed = title.trim()
          if (!trimmed) return s
          const id = uid()
          const card: BoardCard = {
            id,
            title: trimmed,
            createdAt: now(),
          }
          return {
            cards: { ...s.cards, [id]: card },
            columns: s.columns.map((c) =>
              c.id === columnId ? { ...c, cardIds: [...c.cardIds, id] } : c,
            ),
          }
        }),

      updateCard: (id, patch) =>
        set((s) => {
          const existing = s.cards[id]
          if (!existing) return s
          return {
            cards: {
              ...s.cards,
              [id]: { ...existing, ...patch },
            },
          }
        }),

      deleteCard: (id) =>
        set((s) => {
          if (!s.cards[id]) return s
          const cards = { ...s.cards }
          delete cards[id]
          return {
            cards,
            columns: s.columns.map((c) => ({
              ...c,
              cardIds: c.cardIds.filter((cid) => cid !== id),
            })),
          }
        }),

      moveCard: (cardId, targetColumnId, targetIndex) =>
        set((s) => {
          const stripped = s.columns.map((c) => ({
            ...c,
            cardIds: c.cardIds.filter((cid) => cid !== cardId),
          }))
          const finalCols = stripped.map((c) => {
            if (c.id !== targetColumnId) return c
            const next = [...c.cardIds]
            const insertAt = Math.max(0, Math.min(targetIndex, next.length))
            next.splice(insertAt, 0, cardId)
            return { ...c, cardIds: next }
          })
          return { columns: finalCols }
        }),

      resetBoard: () => set(buildDefaultBoard()),
    }),
    {
      name: 'worktracker.board',
      version: 1,
    },
  ),
)
