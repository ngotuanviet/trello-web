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

import Tooltip from '@mui/material/Tooltip'
import Profiles from './Menus/Profiles'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Notifications from '~/components/AppBar/Notifications/Notifications'
import AutoCompleteSearchBoard from '~/components/AppBar/SearchBoards/AutoCompleteSearchBoard'
import CreateBoardModal from '~/components/Modal/CreateBoard/CreateBoardModal'

function AppBar() {
  const navigate = useNavigate()
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)


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

          <Box onClick={() => navigate(-1)}>
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
          </Box>

          <Box sx={{ display: { sx: 'none', md: 'flex' }, gap: 1 }}>
            <WorkSpace onOpenCreateBoardModal={() => setIsOpenCreateModal(true)} />
            <Recent />
            <Starred />
            <Templates />
          </Box>

          <Button
            variant="outlined"
            onClick={() => setIsOpenCreateModal(true)}
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
          {/* Tìm kiếm nhanh 1 hoặc nhiều cái board */}
          <AutoCompleteSearchBoard />
          {/* Dark - light mode */}
          <ModeSelect />
          {/* Xử lý hiện thị các thông báo - notifications */}
          <Notifications />
          <Tooltip title="Helps">
            <HelpIcon sx={{ cursor: 'pointer', color: 'white' }} />
          </Tooltip>
          <Profiles />
        </Box>
      </Box>
      <CreateBoardModal
        isOpen={isOpenCreateModal}
        handleClose={() => setIsOpenCreateModal(false)}
      />
    </>
  )
}
export default AppBar
