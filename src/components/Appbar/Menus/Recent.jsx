import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import DashboardIcon from '@mui/icons-material/Dashboard'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { getRecentBoards } from '~/utils/boardStorage'

function Recent() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [recentBoards, setRecentBoards] = useState([])
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  const loadRecentBoards = () => {
    if (currentUser?._id) {
      setRecentBoards(getRecentBoards(currentUser._id))
    }
  }

  useEffect(() => {
    loadRecentBoards()
    window.addEventListener('trello_storage_updated', loadRecentBoards)
    return () => {
      window.removeEventListener('trello_storage_updated', loadRecentBoards)
    }
  }, [currentUser?._id])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    loadRecentBoards()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectBoard = (boardId) => {
    handleClose()
    navigate(`/boards/${boardId}`)
  }

  return (
    <div>
      <Button
        sx={{ color: 'white' }}
        id="basic-button-recent"
        aria-controls={open ? 'basic-menu-recent' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Recent
      </Button>
      <Menu
        id="basic-menu-recent"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-recent'
        }}
        PaperProps={{
          sx: { minWidth: 240, maxHeight: 360 }
        }}
      >
        {recentBoards.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No recent boards
            </Typography>
          </MenuItem>
        ) : (
          recentBoards.map((board) => (
            <MenuItem key={board._id} onClick={() => handleSelectBoard(board._id)}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={board.title}
                primaryTypographyProps={{
                  variant: 'body2',
                  noWrap: true,
                  sx: { fontWeight: 500 }
                }}
              />
              <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', opacity: 0.6 }}>
                {board.type === 'private' ? (
                  <LockIcon sx={{ fontSize: 14 }} />
                ) : (
                  <PublicIcon sx={{ fontSize: 14 }} />
                )}
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  )
}

export default Recent
