import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Avatar from '@mui/material/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import {
  updateCurrentActiveBoard,
  selectFilterCriteria,
  setFilterCriteria,
  clearFilterCriteria
} from '~/redux/activeBoard/activeBoardSlice'
import { updateBoardDetailsAPI } from '~/apis'
import { CapitalizeFirstLetter } from '~/utils/Formatters'
import BoardUserGroup from '~/pages/Boards/BoardBar/BoardUserGroup'
import InviteBoardUser from '~/pages/Boards/BoardBar/InviteBoardUser'
import { isBoardStarred, toggleStarBoard } from '~/utils/boardStorage'
import { toast } from 'react-toastify'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ Board }) {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const filterCriteria = useSelector(selectFilterCriteria)

  // Star state
  const [starred, setStarred] = useState(false)

  useEffect(() => {
    if (currentUser?._id && Board?._id) {
      setStarred(isBoardStarred(currentUser._id, Board._id))
    }
  }, [currentUser?._id, Board?._id])

  const handleToggleStar = () => {
    if (!currentUser?._id || !Board?._id) return
    const newStatus = toggleStarBoard(currentUser._id, Board)
    setStarred(newStatus)
    toast.success(newStatus ? 'Board added to Starred' : 'Board removed from Starred')
  }

  // Visibility Popover State
  const [visibilityAnchorEl, setVisibilityAnchorEl] = useState(null)
  const isVisibilityOpen = Boolean(visibilityAnchorEl)

  const handleOpenVisibility = (event) => {
    setVisibilityAnchorEl(event.currentTarget)
  }

  const handleCloseVisibility = () => {
    setVisibilityAnchorEl(null)
  }

  const handleChangeVisibility = async (event) => {
    const newType = event.target.value
    const isOwner = Board.ownerIds?.some(id => (id._id || id)?.toString() === currentUser?._id?.toString())

    if (!isOwner) {
      toast.warning('Only board owners can change board visibility!')
      return
    }

    try {
      await updateBoardDetailsAPI(Board._id, { type: newType })
      dispatch(updateCurrentActiveBoard({ ...Board, type: newType }))
      toast.success(`Board visibility changed to ${newType}`)
      handleCloseVisibility()
    } catch (error) {
      console.error('Failed to change board visibility:', error)
    }
  }

  // Filters Popover State
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const isFilterOpen = Boolean(filterAnchorEl)

  const handleOpenFilter = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleCloseFilter = () => {
    setFilterAnchorEl(null)
  }

  const handleKeywordChange = (e) => {
    dispatch(setFilterCriteria({ keyword: e.target.value }))
  }

  const handleMemberChange = (e) => {
    dispatch(setFilterCriteria({ memberId: e.target.value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilterCriteria())
  }

  const activeFiltersCount = (filterCriteria?.keyword ? 1 : 0) + (filterCriteria?.memberId ? 1 : 0)

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
            m: 2
          },
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Board Title */}
          <Tooltip title={Board?.description || Board?.title}>
            <Chip
              sx={MENU_STYLES}
              clickable
              icon={<DashboardIcon />}
              label={Board?.title}
            />
          </Tooltip>

          {/* Star Button */}
          <Tooltip title={starred ? 'Starred (click to unstar)' : 'Star this board'}>
            <IconButton onClick={handleToggleStar} size="small" sx={{ color: 'white' }}>
              {starred ? (
                <StarIcon sx={{ color: '#f1c40f' }} fontSize="small" />
              ) : (
                <StarBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Board Visibility (Private / Public) */}
          <Tooltip title="Change visibility">
            <Chip
              sx={MENU_STYLES}
              clickable
              onClick={handleOpenVisibility}
              icon={Board?.type === 'private' ? <LockIcon /> : <PublicIcon />}
              label={CapitalizeFirstLetter(Board?.type || 'public')}
            />
          </Tooltip>

          {/* Popover đổi Private / Public */}
          <Popover
            open={isVisibilityOpen}
            anchorEl={visibilityAnchorEl}
            onClose={handleCloseVisibility}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ p: 2, width: 280 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Change Board Visibility
              </Typography>
              <RadioGroup
                value={Board?.type || 'public'}
                onChange={handleChangeVisibility}
              >
                <FormControlLabel
                  value="public"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Public</Typography>
                      <Typography variant="caption" color="text.secondary">Anyone with the link can view</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="private"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Private</Typography>
                      <Typography variant="caption" color="text.secondary">Only members of this board can view</Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>
          </Popover>

          {/* Add to drive (chưa cần làm - hiển thị tooltip coming soon) */}
          <Tooltip title="Add to Google Drive (Coming soon)">
            <Chip
              sx={{ ...MENU_STYLES, opacity: 0.7 }}
              clickable
              icon={<AddToDriveIcon />}
              label="Add to drive"
            />
          </Tooltip>

          {/* Automation (chưa cần làm - hiển thị tooltip coming soon) */}
          <Tooltip title="Automation (Coming soon)">
            <Chip
              sx={{ ...MENU_STYLES, opacity: 0.7 }}
              clickable
              icon={<BoltIcon />}
              label="Automation"
            />
          </Tooltip>

          {/* Filters */}
          <Tooltip title="Filter cards">
            <Chip
              sx={{
                ...MENU_STYLES,
                bgcolor: activeFiltersCount > 0 ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                fontWeight: activeFiltersCount > 0 ? 600 : 'normal'
              }}
              clickable
              onClick={handleOpenFilter}
              icon={<FilterAltIcon />}
              label={activeFiltersCount > 0 ? `Filters (${activeFiltersCount})` : 'Filters'}
            />
          </Tooltip>

          {/* Popover Filters */}
          <Popover
            open={isFilterOpen}
            anchorEl={filterAnchorEl}
            onClose={handleCloseFilter}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ p: 2.5, width: 320, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Filter Cards</Typography>
                {activeFiltersCount > 0 && (
                  <Button size="small" onClick={handleClearFilters} sx={{ textTransform: 'none', p: 0 }}>
                    Clear all
                  </Button>
                )}
              </Box>

              {/* Keyword Search */}
              <TextField
                size="small"
                label="Search by card title..."
                variant="outlined"
                value={filterCriteria?.keyword || ''}
                onChange={handleKeywordChange}
                fullWidth
              />

              {/* Member Filter */}
              <FormControl size="small" fullWidth>
                <InputLabel id="filter-member-label">Filter by member</InputLabel>
                <Select
                  labelId="filter-member-label"
                  label="Filter by member"
                  value={filterCriteria?.memberId || ''}
                  onChange={handleMemberChange}
                >
                  <MenuItem value="">
                    <em>All members</em>
                  </MenuItem>
                  {currentUser && (
                    <MenuItem value={currentUser._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={currentUser.avatar} sx={{ width: 22, height: 22 }} />
                        <Typography variant="body2">Assigned to me</Typography>
                      </Box>
                    </MenuItem>
                  )}
                  {Board?.FE_allUsers?.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={user.avatar} sx={{ width: 22, height: 22 }} />
                        <Typography variant="body2">{user.displayName || user.username}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Popover>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Mời user vào làm thành viên của board */}
          <InviteBoardUser boardId={Board._id} />
          {/* Danh sách thành viên của board */}
          <BoardUserGroup boardUsers={Board?.FE_allUsers} />
        </Box>
      </Box>
    </>
  )
}

export default BoardBar
