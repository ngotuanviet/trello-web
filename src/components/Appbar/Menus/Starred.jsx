import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import StarIcon from '@mui/icons-material/Star'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { getStarredBoards } from '~/utils/boardStorage'

function Starred() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [starredBoards, setStarredBoards] = useState([])
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  const loadStarredBoards = () => {
    if (currentUser?._id) {
      setStarredBoards(getStarredBoards(currentUser._id))
    }
  }

  useEffect(() => {
    loadStarredBoards()
    window.addEventListener('trello_storage_updated', loadStarredBoards)
    return () => {
      window.removeEventListener('trello_storage_updated', loadStarredBoards)
    }
  }, [currentUser?._id])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    loadStarredBoards()
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
        id="basic-button-starred"
        aria-controls={open ? 'basic-menu-starred' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Starred
      </Button>
      <Menu
        id="basic-menu-starred"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-starred'
        }}
        PaperProps={{
          sx: { minWidth: 240, maxHeight: 360 }
        }}
      >
        {starredBoards.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Star your important boards to find them quickly here!
            </Typography>
          </MenuItem>
        ) : (
          starredBoards.map((board) => (
            <MenuItem key={board._id} onClick={() => handleSelectBoard(board._id)}>
              <ListItemIcon>
                <StarIcon fontSize="small" sx={{ color: '#f1c40f' }} />
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

export default Starred
