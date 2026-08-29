import { useForm, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import CancelIcon from '@mui/icons-material/Cancel'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useNavigate } from 'react-router-dom'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { createNewBoardAPI } from '~/apis'

const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

function CreateBoardModal({ isOpen, handleClose, afterCreateNewBoard }) {
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const handleCloseModal = () => {
    reset()
    if (handleClose) handleClose()
  }

  const submitCreateNewBoard = async (data) => {
    try {
      const res = await createNewBoardAPI(data)
      handleCloseModal()
      const newBoardId = res?.createBoard?._id || res?._id
      if (afterCreateNewBoard) {
        afterCreateNewBoard(newBoardId)
      } else if (newBoardId) {
        navigate(`/boards/${newBoardId}`)
      }
    } catch (error) {
      console.error('Error creating board:', error)
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-create-board-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        maxWidth: '90vw',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '20px 30px',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon
            color="error"
            sx={{ '&:hover': { color: 'error.light' } }}
            onClick={handleCloseModal}
          />
        </Box>

        <Box id="modal-create-board-title" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LibraryAddIcon color="primary" />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>Create a new board</Typography>
        </Box>

        <form onSubmit={handleSubmit(submitCreateNewBoard)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                label="Board Title"
                type="text"
                variant="outlined"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AbcIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('title', {
                  required: FIELD_REQUIRED_MESSAGE,
                  minLength: { value: 3, message: 'Min Length is 3 characters' },
                  maxLength: { value: 50, message: 'Max Length is 50 characters' }
                })}
                error={!!errors['title']}
              />
              <FieldErrorAlert errors={errors} fieldName={'title'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Description"
                type="text"
                variant="outlined"
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('description', {
                  required: FIELD_REQUIRED_MESSAGE,
                  minLength: { value: 3, message: 'Min Length is 3 characters' },
                  maxLength: { value: 255, message: 'Max Length is 255 characters' }
                })}
                error={!!errors['description']}
              />
              <FieldErrorAlert errors={errors} fieldName={'description'} />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: 'text.secondary' }}>
                Visibility:
              </Typography>
              <Controller
                name="type"
                defaultValue={BOARD_TYPES.PUBLIC}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    onChange={(event, value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControlLabel
                      value={BOARD_TYPES.PUBLIC}
                      control={<Radio size="small" />}
                      label="Public (Anyone with link can view)"
                    />
                    <FormControlLabel
                      value={BOARD_TYPES.PRIVATE}
                      control={<Radio size="small" />}
                      label="Private (Only board members)"
                    />
                  </RadioGroup>
                )}
              />
            </Box>

            <Box sx={{ alignSelf: 'flex-end', display: 'flex', gap: 1, mt: 1 }}>
              <Button onClick={handleCloseModal} color="inherit">
                Cancel
              </Button>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
              >
                Create
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default CreateBoardModal
