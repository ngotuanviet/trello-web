import Box from '@mui/material/Box'

import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
function ListColumns({ columns }) {
  /**
   * Thằng SortableContext yêu cầu items là một mảng dạng ['id1', 'id2'] chứ không phải [{id: 'id-1},{id: 'id-2}]
   */
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
          <Column key={column._id} column={column} />
        ))}

        <Box
          sx={{
            minWidth: '200px',
            maxWidth: '200px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
          }}
        >
          <Button
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
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns
