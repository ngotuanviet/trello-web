import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import Tooltip from '@mui/material/Tooltip'
import { CapitalizeFirstLetter } from '~/utils/Formatters'
import BoardUserGroup from '~/pages/Boards/BoardBar/BoardUserGroup'
import InviteBoardUser from '~/pages/Boards/BoardBar/InviteBoardUser'
const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white',
  },
  '&:hover': {
    bgcolor: 'primary.50',
  },
}
function BoardBar({ Board }) {

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: (theme) => theme.trelloCustom.boardBarHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          paddingX: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar-track': {
            m: 2,
          },

          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={Board?.description}>
            <Chip
              sx={MENU_STYLES}
              clickable
              onClick={() => { }}
              icon={<DashboardIcon />}
              label={Board?.title}
            />
          </Tooltip>
          <Chip
            sx={MENU_STYLES}
            clickable
            onClick={() => { }}
            icon={<VpnLockIcon />}
            label={CapitalizeFirstLetter(Board?.type)}
          />
          <Chip
            sx={MENU_STYLES}
            clickable
            onClick={() => { }}
            icon={<AddToDriveIcon />}
            label="Add to drive "
          />
          <Chip
            sx={MENU_STYLES}
            clickable
            onClick={() => { }}
            icon={<BoltIcon />}
            label="Automation"
          />
          <Chip
            sx={MENU_STYLES}
            clickable
            onClick={() => { }}
            icon={<FilterAltIcon />}
            label="Filters"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Xử lý mời user vào làm thành viên của board */}
          <InviteBoardUser boardId={Board._id} />
          {/* Xử lý hiện thị danh sách thành viên của board */}
          <BoardUserGroup boardUsers={Board?.FE_allUsers} />
        </Box>
      </Box>
    </>
  )
}

export default BoardBar
