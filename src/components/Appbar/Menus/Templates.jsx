import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import CancelIcon from '@mui/icons-material/Cancel'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import CodeIcon from '@mui/icons-material/Code'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createNewBoardAPI, createNewColumnAPI } from '~/apis'

const TEMPLATE_LIST = [
  {
    id: 'kanban',
    title: 'Basic Kanban',
    description: 'Simple workflow: To Do, In Progress, Done',
    icon: <ViewKanbanIcon fontSize="small" color="primary" />,
    defaultColumns: ['To Do', 'In Progress', 'Done']
  },
  {
    id: 'scrum',
    title: 'Agile Sprint Planning',
    description: 'Software development: Backlog, In Progress, Review, Done',
    icon: <CodeIcon fontSize="small" color="success" />,
    defaultColumns: ['Backlog', 'In Progress', 'Code Review', 'Done']
  },
  {
    id: 'tasks',
    title: 'Personal Task Tracker',
    description: 'Track daily personal goals: Planned, Doing, Finished',
    icon: <AssignmentTurnedInIcon fontSize="small" color="warning" />,
    defaultColumns: ['Planned', 'Doing', 'Finished']
  }
]

function Templates() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [boardTitle, setBoardTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setBoardTitle(template.title)
    handleClose()
  }

  const handleCloseModal = () => {
    setSelectedTemplate(null)
    setBoardTitle('')
  }

  const handleCreateFromTemplate = async () => {
    if (!boardTitle.trim()) {
      toast.error('Please enter a board title')
      return
    }
    setIsLoading(true)
    try {
      // 1. Tạo board mới
      const resBoard = await createNewBoardAPI({
        title: boardTitle.trim(),
        description: `Created from ${selectedTemplate.title} template`,
        type: 'public'
      })
      const newBoardId = resBoard?.createBoard?._id || resBoard?._id

      // 2. Tạo các cột mặc định cho template
      if (newBoardId && selectedTemplate.defaultColumns?.length > 0) {
        for (const colTitle of selectedTemplate.defaultColumns) {
          await createNewColumnAPI({
            boardId: newBoardId,
            title: colTitle
          })
        }
      }

      handleCloseModal()
      if (newBoardId) {
        navigate(`/boards/${newBoardId}`)
      }
    } catch (error) {
      console.error('Error creating board from template:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Button
        sx={{ color: 'white' }}
        id="basic-button-templates"
        aria-controls={open ? 'basic-menu-templates' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Templates
      </Button>
      <Menu
        id="basic-menu-templates"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-templates'
        }}
        PaperProps={{
          sx: { minWidth: 280 }
        }}
      >
        <MenuItem disabled sx={{ opacity: '1 !important', pb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary' }}>
            Popular Templates
          </Typography>
        </MenuItem>
        {TEMPLATE_LIST.map((template) => (
          <MenuItem key={template.id} onClick={() => handleSelectTemplate(template)}>
            <ListItemIcon>{template.icon}</ListItemIcon>
            <ListItemText
              primary={template.title}
              secondary={template.description}
              primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 600 } }}
              secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Modal xác nhận tạo board từ template */}
      <Modal
        open={Boolean(selectedTemplate)}
        onClose={handleCloseModal}
        aria-labelledby="modal-template-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 480,
          maxWidth: '90vw',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: '8px',
          padding: '20px 24px',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
        }}>
          <Box sx={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}>
            <CancelIcon color="error" onClick={handleCloseModal} />
          </Box>

          <Typography id="modal-template-title" variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Create board from &quot;{selectedTemplate?.title}&quot;
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will create a board with default columns: <strong>{selectedTemplate?.defaultColumns?.join(', ')}</strong>
          </Typography>

          <TextField
            fullWidth
            label="Board Title"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            variant="outlined"
            autoFocus
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseModal} color="inherit" disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateFromTemplate}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Board'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default Templates
