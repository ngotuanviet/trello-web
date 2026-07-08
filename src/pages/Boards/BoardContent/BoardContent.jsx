import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,

  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { MouseSensor, PointerSensor, TouchSensor } from '../../../customLibraties/DndkitSensors'
import { cloneDeep } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import CardItem from './ListColumns/Column/ListCards/CardItem/CardItem'
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
}
function BoardContent({ Board, createNewColumn, createNewCard }) {

  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event. fix trường hợp click bị gọi event
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Nhấn giữ 250ms và dung sai của cảm ứng (dễ hiểu là di chuyển/chênh lệch 5px ) thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  })
  // ưu tiên sử dụng kết hợp 2 loại sensors là MouseSensor và TouchSensor để có trải nghiệm trên moblide tốt nhất, không bị bug
  const sensors = useSensors(pointerSensor, mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  useEffect(() => {
    setOrderedColumns(mapOrder(Board?.columns, Board?.columnOrderIds, '_id'))
  }, [Board])
  const findColumnByCardId = (cardId) => {
    // Tìm column chứa card có id là cardId
    return orderedColumns.find(c => c.cards?.map(cd => cd._id)?.includes(cardId))
  }
  const handleDragStart = (e) => {
    const activeData = e?.active?.data?.current
    if (!activeData) return
    const dragItemType =
      activeData.type ||
      (activeData.column ? ACTIVE_DRAG_ITEM_TYPE.COLUMN : ACTIVE_DRAG_ITEM_TYPE.CARD)

    setActiveDragItemId(e?.active.id)
    setActiveDragItemType(dragItemType)
    setActiveDragItemData(
      dragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ? activeData.column : activeData.card
    )
  }
  const handleDragEnd = (e) => {
    const { active, over } = e

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      if (!over) {
        setActiveDragItemId(null)
        setActiveDragItemType(null)
        setActiveDragItemData(null)
        return
      }

      const activeColumn = findColumnByCardId(active.id)
      const overColumn = findColumnByCardId(over.id)

      // Reorder within the same column on drop
      if (activeColumn && overColumn && activeColumn._id === overColumn._id) {
        setOrderedColumns((prev) => {
          const nextColumns = cloneDeep(prev)
          const targetColumn = nextColumns.find(c => c._id === activeColumn._id)
          if (!targetColumn) return prev

          const oldIndex = targetColumn.cards.findIndex(c => c._id === active.id)
          const newIndex = targetColumn.cards.findIndex(c => c._id === over.id)
          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev

          targetColumn.cards = arrayMove(targetColumn.cards, oldIndex, newIndex)
          targetColumn.cardOrderIds = targetColumn.cards.map(c => c._id)
          return nextColumns
        })
      }

      setActiveDragItemId(null)
      setActiveDragItemType(null)
      setActiveDragItemData(null)
      return
    }

    if (!over) {
      setActiveDragItemId(null)
      setActiveDragItemType(null)
      setActiveDragItemData(null)
      return
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id) // lấy vị trí cũ
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id) // lấy vị trí cũ
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      // Dùng arrayMove cua thang dnd-kit đe sap xep lại mang Columns ban đầu
      // Code cua arrayMove o day: dnd-kit/paciges/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
      // 2 cái console. log du lieu nay sau dùng de xử ly gọi API
      // console.log('dndOrderedColumns: ', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)

    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  // Animation khi drop item
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      }
    })
  }
  // trigger trong quá trình kéo thả, khi item đang được kéo đi qua một item khác sẽ trigger sự kiện này, dùng để xử lý khi muốn kéo thả card vào giữa 2 card khác
  const handleDragOver = (e) => {
    if (activeDragItemType !== ACTIVE_DRAG_ITEM_TYPE.CARD) return

    const { active, over } = e
    if (!active || !over) return

    const activeDragCardId = active.id
    const activeDraggingCardData = active.data?.current?.card
    const overCardId = over.id

    // Find columns containing the active and over cards
    const activeColumn = findColumnByCardId(activeDragCardId)
    const overColumn = findColumnByCardId(overCardId)
    if (!activeColumn || !overColumn) return

    // Only handle when moving across different columns
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prev) => {
        const nextColumns = cloneDeep(prev)
        const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)
        if (!nextActiveColumn || !nextOverColumn) return prev

        // Remove from old column
        nextActiveColumn.cards = nextActiveColumn.cards.filter(cd => cd._id !== activeDragCardId)
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)

        // Compute new index in target column
        const overCardIndex = nextOverColumn.cards.findIndex(cd => cd._id === overCardId)
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        const newCardIndex =
          overCardIndex >= 0 ? overCardIndex + modifier : nextOverColumn.cards.length

        // Insert into new column
        nextOverColumn.cards = nextOverColumn.cards.filter(cd => cd._id !== activeDragCardId)
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)

        return nextColumns
      })
    }
  }
  return (
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        // Sử dụng chiến lược collisionDetection là closestCorners để khi kéo thả card sẽ có trải nghiệm tốt nhất, dễ dàng hơn trong việc sắp xếp card vào giữa 2 card khác
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}>
        <Box
          sx={{
            backgroundColor: 'primary.main',
            width: '100%',
            display: 'flex',
            height: (theme) => theme.trelloCustom.boardContentHeight,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
            overflowX: 'auto',
            overflowY: 'hidden',
            p: '10px 0',
          }}
        >
          <ListColumns columns={orderedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard} />
          <DragOverlay dropAnimation={dropAnimation}>
            {(!activeDragItemType) && null}
            {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
            {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <CardItem card={activeDragItemData} />}
          </DragOverlay>
        </Box>
      </DndContext>
    </>
  )
}

export default BoardContent


