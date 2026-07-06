import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

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

function Column({ column }) {
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
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
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-column-dropdown',
                },
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCartIcon fontSize="small" />
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
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <DeleteOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button startIcon={<AddCartIcon />}>Add new card</Button>
          <Tooltip title="drag to move">
            <DragHandleIcon sx={{ cursor: 'pointer' }} />
          </Tooltip>
        </Box>
      </Box>
    </div>

  )
}

export default Column





