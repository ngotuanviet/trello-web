import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, PointerSensor, TouchSensor } from '../../../lib/DndkitSensors.js'
import { cloneDeep } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef } from 'react'
import Column from './ListColumns/Column/Column'
import CardItem from './ListColumns/Column/ListCards/CardItem/CardItem'
import { generatePlaceholderCard } from '~/utils/Formatters'
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
  
  // Ref để lưu giá trị overId cuối cùng khi kéo thả, tránh hiện tượng giật lag/flicker
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(Board?.columns, Board?.columnOrderIds, '_id'))
  }, [Board])
  
  const findColumnByCardId = (cardId) => {
    // Tìm column chứa card có id là cardId
    return orderedColumns.find(c => c.cards?.map(cd => cd._id)?.includes(cardId))
  }
  
  // Trigger khi bắt đầu hành động kéo (drag start)
  const handleDragStart = (e) => {
    const activeData = e?.active?.data?.current
    if (!activeData) return
    
    // Xác định kiểu đối tượng đang kéo (Column hay Card)
    const dragItemType =
      activeData.type ||
      (activeData.column ? ACTIVE_DRAG_ITEM_TYPE.COLUMN : ACTIVE_DRAG_ITEM_TYPE.CARD)

    // Lưu lại thông tin đối tượng đang kéo vào State
    setActiveDragItemId(e?.active.id)
    setActiveDragItemType(dragItemType)
    setActiveDragItemData(
      dragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ? activeData.column : activeData.card
    )
    
    // Xóa giá trị overId cũ để chuẩn bị cho quá trình phát hiện va chạm mới
    lastOverId.current = null
  }
  
  // Thuật toán phát hiện va chạm tùy chỉnh (custom collision detection strategy) để sửa lỗi kéo thả Card vào Column rỗng.
  // Nếu dùng thuật toán mặc định như closestCorners, khi kéo Card qua một Column rỗng, nó sẽ không thể nhận diện được Column đó
  // do cột rỗng không có card con để tính toán khoảng cách góc.
  const collisionDetectionStrategy = useCallback((args) => {
    // 1. Nếu đang kéo Column (thay vì Card), ta tiếp tục dùng thuật toán closestCorners tiêu chuẩn để sắp xếp các cột.
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners(args)
    }

    // 2. Tìm các va chạm (collisions) dựa vào vị trí con trỏ chuột (pointer coordinates)
    const pointerCollisions = pointerWithin(args)
    
    // 3. Nếu con trỏ chuột không va chạm với bất kỳ vùng droppable nào (ví dụ kéo card ra ngoài rìa board, ngoài màn hình):
    // Ta trả về vùng va chạm cuối cùng đã được lưu (lastOverId) để tránh hiện tượng card bị giật lag hoặc tự động nhảy ngược lại.
    if (!pointerCollisions?.length) {
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    }

    let collisions = pointerCollisions

    // 4. Lấy phần tử va chạm đầu tiên (vùng mà chuột đang đè lên nhiều nhất)
    let overId = getFirstCollision(collisions, 'id')

    if (overId) {
      // 5. Kiểm tra xem overId này có phải là một Column hay không
      const checkColumn = orderedColumns.find(c => c._id === overId)
      
      if (checkColumn) {
        // 6. Nếu overId là một Column (tức là chuột đang đè lên Column hoặc Column rỗng):
        // Ta sẽ chạy thuật toán closestCorners đối với các card con nằm bên trong Column đó.
        // Điều này giúp tìm ra vị trí card gần nhất mà chuột đang hướng tới, giúp việc chèn card mượt mà hơn,
        // không bị mặc định nhảy xuống cuối cột khi di chuột lên phía trên.
        collisions = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            container => container.id !== overId && checkColumn.cardOrderIds?.includes(container.id)
          )
        })
        
        // 7. Nếu sau khi lọc và tính toán lại không tìm thấy card con nào (ví dụ: cột đó thực sự rỗng hoặc chỉ có card placeholder ẩn),
        // ta sẽ trả về chính ID của Column rỗng đó để làm đích đến cho Card được thả vào.
        if (collisions.length === 0) {
          collisions = [{ id: overId }]
        }
      }

      // Lưu lại overId cuối cùng để xử lý khi kéo ra ngoài vùng droppable ở bước 3
      lastOverId.current = overId
      return collisions
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  // Trigger khi người dùng thả chuột (kết thúc quá trình kéo thả)
  const handleDragEnd = (e) => {
    const { active, over } = e

    // Xử lý kéo thả Card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      if (!over) {
        setActiveDragItemId(null)
        setActiveDragItemType(null)
        setActiveDragItemData(null)
        return
      }

      // Tìm cột cũ và cột mới dựa vào các hàm tìm kiếm giống như handleDragOver
      const activeColumn = findColumnByCardId(active.id)
      let overColumn = findColumnByCardId(over.id)
      if (!overColumn) {
        overColumn = orderedColumns.find(c => c._id === over.id)
      }

      // Chỉ xử lý sắp xếp lại nếu kéo thả Card trong cùng một cột
      // (Việc chuyển Card sang cột khác đã được xử lý thời gian thực ở handleDragOver)
      if (activeColumn && overColumn && activeColumn._id === overColumn._id) {
        setOrderedColumns((prev) => {
          const nextColumns = cloneDeep(prev)
          const targetColumn = nextColumns.find(c => c._id === activeColumn._id)
          if (!targetColumn) return prev

          // Tìm vị trí index cũ và vị trí index mới của Card
          const oldIndex = targetColumn.cards.findIndex(c => c._id === active.id)
          const newIndex = targetColumn.cards.findIndex(c => c._id === over.id)
          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev

          // Sắp xếp lại thứ tự các Card trong mảng
          targetColumn.cards = arrayMove(targetColumn.cards, oldIndex, newIndex)
          targetColumn.cardOrderIds = targetColumn.cards.map(c => c._id)
          return nextColumns
        })
      }

      setActiveDragItemId(null)
      setActiveDragItemType(null)
      setActiveDragItemData(null)
      lastOverId.current = null
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
    lastOverId.current = null
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
  // Trigger trong quá trình kéo thả: Khi kéo một Card đi qua một vùng khác (Card khác hoặc Column khác)
  const handleDragOver = (e) => {
    // Chỉ xử lý nếu đối tượng đang được kéo là Card (không phải kéo Column)
    if (activeDragItemType !== ACTIVE_DRAG_ITEM_TYPE.CARD) return

    const { active, over } = e
    if (!active || !over) return

    const activeDragCardId = active.id
    const activeDraggingCardData = active.data?.current?.card
    const overCardId = over.id

    // Tìm cột chứa Card đang được kéo (activeColumn)
    const activeColumn = findColumnByCardId(activeDragCardId)
    
    // Tìm cột chứa đối tượng mà chuột đang đè lên (overColumn)
    let overColumn = findColumnByCardId(overCardId)
    // SỬA LỖI COLUMN RỖNG: Nếu không tìm thấy cột dựa vào ID của Card dưới chuột (ví dụ chuột đang đè trực tiếp lên cột rỗng),
    // ta tìm cột đó trực tiếp bằng cách so sánh ID của vùng đè lên với ID của cột trong danh sách orderedColumns.
    if (!overColumn) {
      overColumn = orderedColumns.find(c => c._id === overCardId)
    }

    if (!activeColumn || !overColumn) return

    // Chỉ xử lý khi di chuyển Card qua các Column khác nhau (khác cột ban đầu)
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prev) => {
        const nextColumns = cloneDeep(prev)
        const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)
        if (!nextActiveColumn || !nextOverColumn) return prev

        // 1. Xóa Card đang kéo ra khỏi danh sách cards của cột cũ (nextActiveColumn)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(cd => cd._id !== activeDragCardId)
        
        // SỬA LỖI COLUMN RỖNG: Nếu cột cũ sau khi bỏ card đi trở thành cột rỗng, 
        // ta tự động thêm một Placeholder Card ẩn vào để dnd-kit vẫn nhận diện cột này là vùng có thể kéo thả vào được.
        if (nextActiveColumn.cards.length === 0) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)

        // 2. SỬA LỖI COLUMN RỖNG: Nếu cột mới đang có Placeholder Card ẩn làm nhiệm vụ "giữ chỗ" cho cột rỗng,
        // ta xóa nó đi trước khi chèn Card thực tế vừa kéo vào.
        if (nextOverColumn.cards.length === 1 && nextOverColumn.cards[0].FE_PlaceholderCard) {
          nextOverColumn.cards = []
        }

        // 3. Tính toán vị trí chèn mới của Card trong cột đích
        const overCardIndex = nextOverColumn.cards.findIndex(cd => cd._id === overCardId)
        // Quyết định xem sẽ chèn phía trên hay phía dưới card đang đè lên (dựa vào tọa độ chuột)
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        const newCardIndex =
          overCardIndex >= 0 ? overCardIndex + modifier : nextOverColumn.cards.length

        // 4. Thêm Card mới kéo vào vị trí vừa tính toán trong cột đích
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
        // Sử dụng chiến lược collisionDetection tùy chỉnh để khi kéo thả card sẽ có trải nghiệm tốt nhất trên column rỗng và không bị flicker
        collisionDetection={collisionDetectionStrategy}
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


