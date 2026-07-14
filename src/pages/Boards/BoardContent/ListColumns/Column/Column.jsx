import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ContentCut from '@mui/icons-material/ContentCut'
import Tooltip from '@mui/material/Tooltip'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Divider from '@mui/material/Divider'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Cloud from '@mui/icons-material/Cloud'
import { useState } from 'react'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCartIcon from '@mui/icons-material/AddShoppingCart'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import { ConfirmProvider, useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { createNewCardAPI, deleteColumnDetailAPI } from '~/apis'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

function Column({ column }) {
  const confirmDeleteColumn = useConfirm()
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [toggleNewCard, setToggleNewCard] = useState(false)
  const [cardTitleNew, setCardTitleNew] = useState('')

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { type: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN', column },

  })
  const dhdKitColumnStyles = {
    /**
     * TouchAction: 'none', // Dành cho sensor default dạng Pointer sensor
     * Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
     */

    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  }
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleAddNewCard = async () => {


    const { createCard } = await createNewCardAPI({
      boardId: board?._id,
      title: cardTitleNew,
      columnId: column._id
    })
    // Tương tự như hàm createNewColumn phải sử dụng clonedeep
    const newBoard = cloneDeep(board)



    const columnToUpdate = newBoard.columns.find((column) => column._id === createCard.columnId)

    if (columnToUpdate) {
      // SỬA LỖI COLUMN RỖNG: Nếu cột hiện tại đang chỉ chứa duy nhất một Placeholder Card ẩn (tức là cột đang rỗng trên giao diện),
      // ta cần xóa placeholder card này đi và thay thế bằng card thực tế vừa tạo.
      if (columnToUpdate.cards.length === 1 && columnToUpdate.cards[0].FE_PlaceholderCard) {
        columnToUpdate.cards = [createCard]
        columnToUpdate.cardOrderIds = [createCard._id]
      } else {
        // Ngược lại, nếu cột đã có sẵn card thực tế, ta chỉ cần push thêm card mới vào cuối mảng
        columnToUpdate.cards.push(createCard)
        columnToUpdate.cardOrderIds.push(createCard._id)
      }
    }

    dispatch(updateCurrentActiveBoard(newBoard))
    // cập nhật lại state board
    // Phiay ront-end chung ta phai tự lam dung lai state data board (thay vi phải gọi lai api fetchBoardDetailsAPI)
    // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn
    // toan bộ Board du day co la api tạo Column hay Card di chang nua. > Luc nay FE se nhan hon.
    setToggleNewCard(false)
    setCardTitleNew('')
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleDeleteColumn = async () => {
    // xử lý xoá 1 column và cards bên trong nó

    try {
      const { confirmed, reason } = await confirmDeleteColumn({
        title: `Bạn chắc chắn muốn xoá cột tên ${column.title} không?`,
        description: "Nếu bạn xoá cột này thì các dữ liệu bên trong column sẽ bị xoá toàn bộ",
        confirmationText: 'Đồng ý',
        cancellationText: 'Huỷ',
        // dialogProps: { maxWidth: 'xs' },
        // allowClose: false,
        // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
        // cancellationButtonProps: { color: 'inherit' },

      });


      if (confirmed) {

        const newBoard = { ...board }

        newBoard.columns = board.columns.filter((c) => c._id !== column._id)
        const { result } = await deleteColumnDetailAPI(column._id)
        if (result.StatusCode === 200) {
          toast.success(result.deleteResult)
        } else {
          toast.error('Lỗi không xoá đọc column')
        }

        dispatch(updateCurrentActiveBoard(newBoard))


      }

    } catch (error) {
      toast.error('Lỗi xoá cột!')
    }
  }
  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  return (
    <div ref={setNodeRef}
      style={dhdKitColumnStyles}
      {...attributes}
    >
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          minHeight: '300px',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) =>
            `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* Column header */}
        <Box
          sx={{
            height: (theme) => theme.trelloCustom.columnHeaderHeight,
            p: 2,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer',
                }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>

            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-column-dropdown',
                },
              }}
            >
              <MenuItem
                onClick={() => setToggleNewCard(!toggleNewCard)}
                sx={{
                  ':hover': {
                    color: 'success.light',
                    '& .add-forever-icon': {
                      color: 'success.light',
                    }
                  }
                }}>
                <ListItemIcon>
                  <AddCartIcon className='add-forever-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add New Card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />

              <MenuItem sx={{
                ':hover': {
                  color: 'warning.dark',
                  '& .delete-forever-icon': {
                    color: 'warning.dark',
                  }
                }
              }} onClick={handleDeleteColumn}>
                <ListItemIcon>
                  <DeleteOutlineIcon className='delete-forever-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>


              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>

            </Menu>
          </Box>
        </Box>
        {/* Column list card */}
        <ListCards cards={orderedCards} />
        {/* Column footer */}
        <Box
          sx={{
            height: (theme) => theme.trelloCustom.columnFooterHeight,
            p: 2,

          }}
        >
          {!toggleNewCard ? <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%'
          }}>
            <Button onClick={() => setToggleNewCard(!toggleNewCard)} startIcon={<AddCartIcon />}>Add new card</Button>
            <Tooltip title="drag to move">
              <DragHandleIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </Box> : <Box sx={{
            width: '100%',


            borderRadius: '6px',
            height: 'fit-content',
            bgColor: '#ffffff3d',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <TextField
              id="outlined-search"
              label="Enter your Title Card..."
              type="text"
              size="small"
              variant='outlined'
              autoFocus
              value={cardTitleNew}
              onChange={(e) => setCardTitleNew(e.target.value)}
              sx={{
                '& label': { color: 'text.primary' },
                '& input': {
                  color: (theme) => theme.palette.primary.main,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
                },
                '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main },
                },
                '& .MuiOutlinedInput-input': {
                  borderRadius: 1
                }

              }}
            />
            <Box sx={{ display: 'flex', alignItems: "center", gap: 1 }}>
              <Button variant='contained' color='success' size='small' sx={{
                boxShadow: 'none',
                border: '0.5px solid',
                borderColor: (theme) => theme.palette.success.main,
                '&:hover': { bgColor: (theme) => theme.palette.success.contrastText.main }
              }} onClick={handleAddNewCard}>Add</Button>
              <CloseIcon onClick={() => setToggleNewCard(!toggleNewCard)} fontSize='small' sx={{ color: 'white', cursor: 'pointer', color: (theme) => theme.palette.warning.light }} />
            </Box>
          </Box>


          }

        </Box>
      </Box>
    </div>

  )
}

export default Column





