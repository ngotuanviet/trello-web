import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { ConfirmProvider } from 'material-ui-confirm'
function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails }) {
  const [toggleNewColumn, setToggleNewColumn] = useState(false)
  const [columnTitleNew, setColumnTitleNew] = useState('')
  /**
   * Thằng SortableContext yêu cầu items là một mảng dạng ['id1', 'id2'] chứ không phải [{id: 'id-1},{id: 'id-2}]
   */
  const handleAddNewColumn = () => {
    const dataNewColumn = {
      title: columnTitleNew
    }
    createNewColumn(dataNewColumn)
    setToggleNewColumn(false)
    setColumnTitleNew('')
  }
  return (
    <SortableContext
      items={columns?.map((column) => column._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': {
            m: 2,
          },
        }}
      >
        {/* Column */}

        {columns?.map((column) => (
          <>

            <Column key={column._id} column={column} createNewCard={createNewCard} deleteColumnDetails={deleteColumnDetails} /></>



        ))}

        <Box
          sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
          }}
        >
          {!toggleNewColumn ? <Box>
            <Button
              onClick={() => setToggleNewColumn(!toggleNewColumn)}
              startIcon={<AddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 2.0,
              }}
            >
              Add New Column
            </Button>
          </Box> : <Box sx={{
            mixWidth: '250px',
            maxWidth: '250px',

            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgColor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <TextField
              id="outlined-search"
              label="Enter your Title Column..."
              type="text"
              size="small"
              variant='outlined'
              autoFocus
              value={columnTitleNew}
              onChange={(e) => setColumnTitleNew(e.target.value)}
              sx={{
                width: '100%',
                '& label': {
                  color: 'white',
                },
                '& input': {
                  color: 'white',
                },
                '& label.Mui-focused': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: "center", gap: 1 }}>
              <Button variant='contained' color='success' size='small' sx={{
                boxShadow: 'none',
                border: '0.5px solid',
                borderColor: (theme) => theme.palette.success.main,
                '&:hover': { bgColor: (theme) => theme.palette.success.contrastText.main }
              }} onClick={handleAddNewColumn}>Add Column</Button>
              <CloseIcon onClick={() => setToggleNewColumn(!toggleNewColumn)} fontSize='small' sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: (theme) => theme.palette.warning.light } }} />
            </Box>
          </Box>}

        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns
