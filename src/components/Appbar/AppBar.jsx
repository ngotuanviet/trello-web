import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import Box from '@mui/material/Box'
import TrelloIcon from '~/assets/trello.svg?react'
import HelpIcon from '@mui/icons-material/Help'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import WorkSpace from './Menus/Workspace'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Profiles from './Menus/Profiles'
import AddIcon from '@mui/icons-material/Add'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { Link } from 'react-router-dom'
function AppBar() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      <Box
        px={2}
        sx={{
          width: '100%',
          height: (theme) => theme.trelloCustom.appBarHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar-track': {
            m: 2,
          },
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Link to={'/boards'}>
            <Tooltip title='Board list'>
              <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
            </Tooltip>

          </Link>

          <Link to={'/'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SvgIcon
                component={TrelloIcon}
                inheritViewBox
                sx={{
                  color: 'white',
                }}
              />
              <Typography
                variant="span"
                sx={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}
              >
                Trello
              </Typography>
            </Box>
          </Link>

          <Box sx={{ display: { sx: 'none', md: 'flex' }, gap: 1 }}>
            <WorkSpace />
            <Recent />
            <Starred />
            <Templates />
          </Box>

          <Button
            variant="outlined"
            sx={{ color: 'white', border: 'none', '&:hover': 'none' }}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TextField
            id="outlined-search"
            label="Search..."
            type="text"
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <CloseIcon
                    onClick={() => setSearchValue('')}
                    fontSize="small"
                    sx={{ cursor: 'pointer', color: searchValue ? 'white' : 'transparent' }}
                  />
                </InputAdornment>

              ),
            }}
            sx={{
              minWidth: '120px',
              maxWidth: '180px',
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
          <ModeSelect />
          <Tooltip title="Notifications">
            <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
              <NotificationsNoneIcon sx={{ color: 'white' }} />
            </Badge>
          </Tooltip>
          <Tooltip title="Helps">
            <HelpIcon sx={{ cursor: 'pointer', color: 'white' }} />
          </Tooltip>
          <Profiles />
        </Box>
      </Box>
    </>
  )
}
export default AppBar
