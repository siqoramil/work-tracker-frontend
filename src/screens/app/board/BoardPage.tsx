'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import { useBoardStore } from '@/features/board'
import type { BoardCard, BoardCardColor, BoardColumn } from '@/entities/board'

const CARD_COLORS: { id: BoardCardColor; bar: string; chip: string }[] = [
  {
    id: 'slate',
    bar: 'bg-slate-400 dark:bg-slate-500',
    chip: 'bg-slate-200 dark:bg-slate-700',
  },
  {
    id: 'brand',
    bar: 'bg-brand-500',
    chip: 'bg-brand-200 dark:bg-brand-500/40',
  },
  {
    id: 'amber',
    bar: 'bg-amber-400',
    chip: 'bg-amber-200 dark:bg-amber-500/40',
  },
  {
    id: 'rose',
    bar: 'bg-rose-400',
    chip: 'bg-rose-200 dark:bg-rose-500/40',
  },
  {
    id: 'violet',
    bar: 'bg-violet-400',
    chip: 'bg-violet-200 dark:bg-violet-500/40',
  },
  {
    id: 'sky',
    bar: 'bg-sky-400',
    chip: 'bg-sky-200 dark:bg-sky-500/40',
  },
]

const colorBar = (color?: BoardCardColor) =>
  CARD_COLORS.find((c) => c.id === color)?.bar ??
  'bg-slate-200 dark:bg-slate-700'

const DRAG_TYPE = 'application/x-board-card'

export default function BoardPage() {
  const { t } = useTranslation()
  const columns = useBoardStore((s) => s.columns)
  const cards = useBoardStore((s) => s.cards)
  const addColumn = useBoardStore((s) => s.addColumn)
  const resetBoard = useBoardStore((s) => s.resetBoard)

  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [creatingColumn, setCreatingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  const totalCards = useMemo(() => Object.keys(cards).length, [cards])
  const activeCard = activeCardId ? cards[activeCardId] : null

  const onAddColumn = (e: FormEvent) => {
    e.preventDefault()
    const title = newColumnTitle.trim()
    if (!title) {
      setCreatingColumn(false)
      return
    }
    addColumn(title)
    setNewColumnTitle('')
    setCreatingColumn(false)
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
            {t('board.kicker')}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {t('board.title')}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t('board.subtitle')}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
            {t('board.summary', {
              columns: columns.length,
              cards: totalCards,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => setConfirmReset(true)}
            leadingIcon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
            }
          >
            {t('board.reset')}
          </Button>
          <Button
            onClick={() => setCreatingColumn(true)}
            leadingIcon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            }
          >
            {t('board.addColumn')}
          </Button>
        </div>
      </div>

      <div className="-mx-3 flex gap-4 overflow-x-auto px-3 pb-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {columns.map((col) => (
          <ColumnView
            key={col.id}
            column={col}
            cards={col.cardIds
              .map((id) => cards[id])
              .filter((c): c is BoardCard => Boolean(c))}
            onOpenCard={setActiveCardId}
          />
        ))}

        <div className="flex w-72 shrink-0 sm:w-80">
          {creatingColumn ? (
            <form
              onSubmit={onAddColumn}
              className="flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <Input
                placeholder={t('board.columnNamePlaceholder')}
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {t('board.add')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setCreatingColumn(false)
                    setNewColumnTitle('')
                  }}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setCreatingColumn(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white/40 px-4 py-6 text-sm font-medium text-slate-500 transition hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5 dark:hover:text-brand-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t('board.addColumn')}
            </button>
          )}
        </div>
      </div>

      {activeCard && (
        <CardEditor card={activeCard} onClose={() => setActiveCardId(null)} />
      )}

      {confirmReset && (
        <ConfirmDialog
          title={t('board.confirmResetTitle')}
          message={t('board.confirmResetMessage')}
          confirmLabel={t('board.reset')}
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            resetBoard()
            setConfirmReset(false)
          }}
        />
      )}
    </div>
  )
}

type ColumnViewProps = {
  column: BoardColumn
  cards: BoardCard[]
  onOpenCard: (id: string) => void
}

function ColumnView({ column, cards, onOpenCard }: ColumnViewProps) {
  const { t } = useTranslation()
  const moveCard = useBoardStore((s) => s.moveCard)
  const addCard = useBoardStore((s) => s.addCard)
  const renameColumn = useBoardStore((s) => s.renameColumn)
  const deleteColumn = useBoardStore((s) => s.deleteColumn)

  const [renaming, setRenaming] = useState(false)
  const [draftTitle, setDraftTitle] = useState(column.title)
  const [menuOpen, setMenuOpen] = useState(false)
  const [composing, setComposing] = useState(false)
  const [composerText, setComposerText] = useState('')
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const composerRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (renaming) {
      setDraftTitle(column.title)
    }
  }, [renaming, column.title])

  useEffect(() => {
    if (composing) composerRef.current?.focus()
  }, [composing])

  const onColumnDragOver = (e: DragEvent) => {
    if (!e.dataTransfer.types.includes(DRAG_TYPE)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (hoverIndex === null) setHoverIndex(cards.length)
  }

  const onColumnDrop = (e: DragEvent) => {
    e.preventDefault()
    const cardId = e.dataTransfer.getData(DRAG_TYPE)
    if (!cardId) return
    const targetIdx = hoverIndex ?? cards.length
    moveCard(cardId, column.id, targetIdx)
    setHoverIndex(null)
  }

  const onCardDragOver = (idx: number) => (e: DragEvent) => {
    if (!e.dataTransfer.types.includes(DRAG_TYPE)) return
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const after = e.clientY - rect.top > rect.height / 2
    setHoverIndex(after ? idx + 1 : idx)
  }

  const onAddCard = (e: FormEvent) => {
    e.preventDefault()
    const title = composerText.trim()
    if (!title) {
      setComposing(false)
      return
    }
    addCard(column.id, title)
    setComposerText('')
  }

  const submitRename = () => {
    const next = draftTitle.trim()
    if (next && next !== column.title) renameColumn(column.id, next)
    setRenaming(false)
  }

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 sm:w-80 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
        {renaming ? (
          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitRename()
              if (e.key === 'Escape') {
                setRenaming(false)
                setDraftTitle(column.title)
              }
            }}
            autoFocus
            className="min-w-0 flex-1 rounded-md border border-brand-300 bg-white px-2 py-1 text-sm font-semibold text-slate-900 outline-none ring-2 ring-brand-100 dark:border-brand-500/60 dark:bg-slate-800 dark:text-slate-100 dark:ring-brand-500/30"
          />
        ) : (
          <button
            type="button"
            onClick={() => setRenaming(true)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-0.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {column.title}
            </span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {cards.length}
            </span>
          </button>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t('board.columnMenu')}
            className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="19" cy="12" r="1.6" />
            </svg>
          </button>
          {menuOpen && (
            <div
              onMouseLeave={() => setMenuOpen(false)}
              className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40"
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  setRenaming(true)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {t('board.rename')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  setConfirmDelete(true)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
              >
                {t('board.deleteColumn')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        onDragOver={onColumnDragOver}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return
          setHoverIndex(null)
        }}
        onDrop={onColumnDrop}
        className="flex flex-1 flex-col gap-2 px-3 py-3"
      >
        {cards.length === 0 && hoverIndex === null && (
          <p className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {t('board.emptyColumn')}
          </p>
        )}

        {cards.map((card, idx) => (
          <div key={card.id} className="relative">
            {hoverIndex === idx && (
              <div className="mb-2 h-1 rounded-full bg-brand-500/70 dark:bg-brand-400/80" />
            )}
            <CardItem
              card={card}
              onDragOver={onCardDragOver(idx)}
              onOpen={() => onOpenCard(card.id)}
            />
          </div>
        ))}
        {hoverIndex !== null && hoverIndex >= cards.length && (
          <div className="h-1 rounded-full bg-brand-500/70 dark:bg-brand-400/80" />
        )}

        {composing ? (
          <form
            onSubmit={onAddCard}
            className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800"
          >
            <textarea
              ref={composerRef}
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onAddCard(e as unknown as FormEvent)
                }
                if (e.key === 'Escape') {
                  setComposing(false)
                  setComposerText('')
                }
              }}
              placeholder={t('board.cardPlaceholder')}
              rows={2}
              className="w-full resize-none rounded-md border border-transparent bg-transparent px-1 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-300 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500/60"
            />
            <div className="mt-2 flex gap-2">
              <Button type="submit" className="flex-1">
                {t('board.add')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setComposing(false)
                  setComposerText('')
                }}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="mt-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t('board.addCard')}
          </button>
        )}
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title={t('board.confirmDeleteColumnTitle')}
          message={t('board.confirmDeleteColumnMessage', {
            count: cards.length,
            title: column.title,
          })}
          confirmLabel={t('board.deleteColumn')}
          danger
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteColumn(column.id)
            setConfirmDelete(false)
          }}
        />
      )}
    </div>
  )
}

type CardItemProps = {
  card: BoardCard
  onDragOver: (e: DragEvent) => void
  onOpen: () => void
}

function CardItem({ card, onDragOver, onOpen }: CardItemProps) {
  const [dragging, setDragging] = useState(false)

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData(DRAG_TYPE, card.id)
        setDragging(true)
      }}
      onDragEnd={() => setDragging(false)}
      onDragOver={onDragOver}
      onClick={onOpen}
      className={`group cursor-grab overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30 dark:hover:shadow-black/50 ${
        dragging ? 'opacity-40' : ''
      }`}
    >
      <div className={`h-1 w-full ${colorBar(card.color)}`} />
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {card.title}
        </p>
        {card.description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {card.description}
          </p>
        )}
      </div>
    </div>
  )
}

type CardEditorProps = {
  card: BoardCard
  onClose: () => void
}

function CardEditor({ card, onClose }: CardEditorProps) {
  const { t } = useTranslation()
  const updateCard = useBoardStore((s) => s.updateCard)
  const deleteCard = useBoardStore((s) => s.deleteCard)
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setTitle(card.title)
    setDescription(card.description ?? '')
  }, [card.id, card.title, card.description])

  const commitTitle = () => {
    const next = title.trim()
    if (next && next !== card.title) updateCard(card.id, { title: next })
    if (!next) setTitle(card.title)
  }
  const commitDescription = () => {
    const next = description.trim()
    if (next !== (card.description ?? '')) {
      updateCard(card.id, { description: next || undefined })
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm dark:bg-black/70"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/60"
      >
        <div className={`h-1.5 w-full ${colorBar(card.color)}`} />
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  ;(e.currentTarget as HTMLInputElement).blur()
                }
              }}
              className="min-w-0 flex-1 rounded-lg bg-transparent text-lg font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:bg-slate-50 focus:px-2 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path
                  d="M6 6l12 12M6 18L18 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('board.description')}
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={commitDescription}
              rows={4}
              placeholder={t('board.descriptionPlaceholder')}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400 dark:focus:ring-brand-900/40"
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('board.color')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => updateCard(card.id, { color: undefined })}
                aria-label={t('board.colorNone')}
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
                  !card.color
                    ? 'border-slate-900 dark:border-slate-100'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <path d="M4 20L20 4" strokeLinecap="round" />
                </svg>
              </button>
              {CARD_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateCard(card.id, { color: c.id })}
                  aria-label={c.id}
                  className={`h-7 w-7 rounded-full border transition ${c.bar} ${
                    card.color === c.id
                      ? 'ring-2 ring-offset-2 ring-slate-900 ring-offset-white dark:ring-slate-100 dark:ring-offset-slate-900'
                      : 'border-transparent hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {t('board.createdAt', {
              date: new Date(card.createdAt).toLocaleString(),
            })}
          </p>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              </svg>
              {t('board.deleteCard')}
            </button>
            <Button onClick={onClose}>{t('common.close')}</Button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title={t('board.confirmDeleteCardTitle')}
          message={t('board.confirmDeleteCardMessage', { title: card.title })}
          confirmLabel={t('board.deleteCard')}
          danger
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteCard(card.id)
            setConfirmDelete(false)
            onClose()
          }}
        />
      )}
    </div>
  )
}

type ConfirmDialogProps = {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  danger,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 dark:bg-black/70"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/60"
      >
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            className={
              danger
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-200 dark:bg-rose-500 dark:hover:bg-rose-400 dark:focus-visible:ring-rose-900'
                : ''
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
