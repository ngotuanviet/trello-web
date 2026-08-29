import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddBoxIcon from '@mui/icons-material/AddBox'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function WorkSpaces({ onOpenCreateBoardModal }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleGoToBoards = () => {
    handleClose()
    navigate('/boards')
  }

  const handleOpenCreateModal = () => {
    handleClose()
    if (onOpenCreateBoardModal) onOpenCreateBoardModal()
  }

  const handleGoToSettings = () => {
    handleClose()
    navigate('/settings/account')
  }

  return (
    <div>
      <Button
        sx={{ color: 'white' }}
        id="basic-button-workspaces"
        aria-controls={open ? 'basic-menu-workspaces' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        WorkSpaces
      </Button>
      <Menu
        id="basic-menu-workspaces"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-workspaces'
        }}
        PaperProps={{
          sx: { minWidth: 260 }
        }}
      >
        <MenuItem disabled sx={{ opacity: '1 !important', pb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary' }}>
            Current Workspace
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleGoToBoards}>
          <ListItemIcon>
            <PersonIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={`${currentUser?.displayName || currentUser?.username || 'User'}'s Workspace`}
            secondary="Free Workspace"
            primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 600 } }}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleGoToBoards}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View all boards" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem onClick={handleOpenCreateModal}>
          <ListItemIcon>
            <AddBoxIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText primary="Create a board" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleGoToSettings}>
          <ListItemText primary="Workspace Settings" primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
        </MenuItem>
      </Menu>
    </div>
  )
}

export default WorkSpaces
