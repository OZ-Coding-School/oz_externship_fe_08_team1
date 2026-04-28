import { useState } from 'react'
import { indexToLetter } from '@/utils/indexToLetter'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface OrderingQuestionProps {
  options: string[]
  answer: string[]
  onChange: (answer: string[]) => void
}

type DragData =
  | { type: 'source'; item: string }
  | { type: 'slot'; item: string; slotIndex: number }

function SourceItem({
  item,
  label,
  isPlaced,
}: {
  item: string
  label: string
  isPlaced: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `source::${item}`,
      data: { type: 'source', item } satisfies DragData,
      disabled: isPlaced,
    })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'flex items-center gap-2',
        isPlaced
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-grab active:cursor-grabbing',
        isDragging ? 'opacity-0' : '',
      ].join(' ')}
      {...(!isPlaced ? { ...listeners, ...attributes } : {})}
    >
      <div className="bg-primary-100 flex h-8 w-8 shrink-0 items-center justify-center rounded">
        <span
          className={[
            'text-base leading-normal font-semibold',
            isPlaced ? 'text-gray-350' : 'text-primary',
          ].join(' ')}
        >
          {label}
        </span>
      </div>
      <span
        className={[
          'flex-1 text-base leading-normal tracking-[-0.03em]',
          isPlaced ? 'text-gray-350' : 'text-gray-800',
        ].join(' ')}
      >
        {item}
      </span>
    </div>
  )
}

function SlotItem({
  item,
  slotIndex,
  label,
  onRemove,
}: {
  item: string
  slotIndex: number
  label: string
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `slot::${slotIndex}`,
      data: { type: 'slot', item, slotIndex } satisfies DragData,
    })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={onRemove}
      aria-label={`슬롯 ${slotIndex + 1}: ${item} 제거`}
      className={[
        'bg-primary-100 flex h-[62px] w-[62px] cursor-grab items-center justify-center rounded transition-opacity active:cursor-grabbing',
        isDragging ? 'opacity-0' : '',
      ].join(' ')}
      {...listeners}
      {...attributes}
    >
      <span className="text-primary text-[18px] font-semibold">{label}</span>
    </button>
  )
}

function DropSlot({
  slotIndex,
  children,
}: {
  slotIndex: number
  children?: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `dropslot::${slotIndex}` })

  return (
    <div
      ref={setNodeRef}
      className={[
        'flex h-[62px] w-[62px] items-center justify-center rounded border-2 transition-colors duration-150',
        isOver
          ? 'border-primary bg-primary-100 border-dashed'
          : 'bg-bg-muted border-transparent',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function OrderingQuestion({
  options,
  answer,
  onChange,
}: OrderingQuestionProps) {
  const [activeData, setActiveData] = useState<{ label: string } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  )

  // 항상 options.length 크기의 배열 유지, 빈 슬롯은 ''
  const slots: string[] = [
    ...answer,
    ...Array(Math.max(0, options.length - answer.length)).fill(''),
  ].slice(0, options.length)

  const placed = new Set(slots.filter(Boolean))

  const getLetter = (item: string) => {
    const idx = options.indexOf(item)
    return idx >= 0 ? indexToLetter(idx) : '?'
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current as DragData
    setActiveData({ label: getLetter(data.item) })
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveData(null)
    if (!over) return

    const overId = over.id as string
    if (!overId.startsWith('dropslot::')) return

    const targetSlot = parseInt(overId.replace('dropslot::', ''), 10)
    const data = active.data.current as DragData
    const next = [...slots]

    if (data.type === 'source') {
      if (placed.has(data.item)) return
      next[targetSlot] = data.item
    } else if (data.type === 'slot') {
      const fromSlot = data.slotIndex
      if (fromSlot === targetSlot) return // 두 슬롯 swap
      ;[next[fromSlot], next[targetSlot]] = [next[targetSlot], next[fromSlot]]
    }

    onChange(next)
  }

  const handleRemoveSlot = (slotIndex: number) => {
    const next = [...slots]
    next[slotIndex] = ''
    onChange(next)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-5">
        {/* 선택지 목록 */}
        <div className="bg-bg-prompt max-w-[648px] rounded px-4 py-5">
          <div className="flex flex-col gap-5">
            {options.map((item, i) => (
              <SourceItem
                key={item}
                item={item}
                label={indexToLetter(i)}
                isPlaced={placed.has(item)}
              />
            ))}
          </div>
        </div>

        {/* 순서 슬롯 */}
        <div className="flex gap-[10px]">
          {slots.map((placedItem, i) => (
            <DropSlot key={i} slotIndex={i}>
              {placedItem ? (
                <SlotItem
                  item={placedItem}
                  slotIndex={i}
                  label={getLetter(placedItem)}
                  onRemove={() => handleRemoveSlot(i)}
                />
              ) : null}
            </DropSlot>
          ))}
        </div>
      </div>

      {/* 드래그 중 미리보기 */}
      <DragOverlay>
        {activeData && (
          <div className="bg-primary-100 flex h-[62px] w-[62px] cursor-grabbing items-center justify-center rounded opacity-90 shadow-lg">
            <span className="text-primary text-[18px] font-semibold">
              {activeData.label}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
