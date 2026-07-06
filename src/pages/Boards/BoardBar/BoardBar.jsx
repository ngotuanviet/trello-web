import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import { CapitalizeFirstLetter } from '~/utils/Formatters'

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
          <Button
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
              },
            }}
            variant="outlined"
            startIcon={<PersonAddIcon />}
          >
            Invite
          </Button>
          <AvatarGroup
            sx={{
              gap: '10px',
              '& .MuiAvatar-root': {
                width: 34,
                height: 34,
                fontSize: '16px',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                '&:first-of-type': {
                  bgcolor: '#a4b0be',
                },
              },
            }}
            max={4}
          >
            <Tooltip title="Ngotuanviet">
              <Avatar alt="Ngotuanviet" src="/static/images/avatar/1.jpg" />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </>
  )
}

export default BoardBar
