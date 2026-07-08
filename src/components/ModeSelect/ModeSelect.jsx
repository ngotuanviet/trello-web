import WbSunnyIcon from '@mui/icons-material/WbSunny'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Box, useColorScheme } from '@mui/material'
export default function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  return (
    <>
      <FormControl size="small" sx={{ minWidth: '120px' }}>
        <InputLabel
          id="select-dark-light-mode"
          sx={{
            color: 'white',
            '&.Mui-focused': {
              color: 'white',
            },
          }}
        >
          Nền
        </InputLabel>
        <Select
          labelId="select-dark-light-mode"
          id="select-dark-light-mode"
          value={mode || ''}
          sx={{
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '.MuiSvgIcon-root': {
              color: 'white',
            },
          }}
          label="Mode"
          onChange={(e) => setMode(e.target.value)}
        >
          <MenuItem value="">
            <em>Chọn chế độ</em>
          </MenuItem>
          <MenuItem value={'system'}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Hệ thống </Box>
          </MenuItem>
          <MenuItem value={'light'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WbSunnyIcon fontSize="small" /> Sáng
            </Box>
          </MenuItem>
          <MenuItem value={'dark'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DarkModeIcon fontSize="small" /> Tối{' '}
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </>
  )
}
