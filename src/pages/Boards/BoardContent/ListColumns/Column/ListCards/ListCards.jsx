import Box from '@mui/material/Box'
import CardItem from './CardItem/CardItem'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

function ListCards({ cards }) {
  return (
    <SortableContext
      items={cards?.map((card) => card._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          p: '0 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) =>
            `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(5)}- ${theme.trelloCustom.columnHeaderHeight} - ${theme.trelloCustom.columnFooterHeight})`,
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ced0da',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#bfc2cf',
          },
        }}
      >
        {cards && cards.map((card) => <CardItem key={card._id} card={card} />)}
      </Box>
    </SortableContext>
  )
}

export default ListCards
