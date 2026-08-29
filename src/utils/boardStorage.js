/**
 * Utility helper để lưu trữ danh sách Recent Boards và Starred Boards vào localStorage
 * Theo userId để không bị lẫn lộn giữa các tài khoản khác nhau trên cùng máy
 */

const RECENT_BOARDS_PREFIX = 'trello_recent_boards_'
const STARRED_BOARDS_PREFIX = 'trello_starred_boards_'
const MAX_RECENT_BOARDS = 8

export const getRecentBoards = (userId) => {
  if (!userId) return []
  try {
    const data = localStorage.getItem(`${RECENT_BOARDS_PREFIX}${userId}`)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading recent boards:', error)
    return []
  }
}

export const saveRecentBoard = (userId, board) => {
  if (!userId || !board?._id) return
  try {
    const currentList = getRecentBoards(userId)
    // Lọc bỏ board nếu đã tồn tại để đưa lên đầu
    const filteredList = currentList.filter(item => item._id !== board._id)
    const updatedList = [
      {
        _id: board._id,
        title: board.title,
        type: board.type,
        lastAccessed: Date.now()
      },
      ...filteredList
    ].slice(0, MAX_RECENT_BOARDS)

    localStorage.setItem(`${RECENT_BOARDS_PREFIX}${userId}`, JSON.stringify(updatedList))
    // Phát event để các component lắng nghe cập nhật realtime
    window.dispatchEvent(new Event('trello_storage_updated'))
  } catch (error) {
    console.error('Error saving recent board:', error)
  }
}

export const getStarredBoards = (userId) => {
  if (!userId) return []
  try {
    const data = localStorage.getItem(`${STARRED_BOARDS_PREFIX}${userId}`)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading starred boards:', error)
    return []
  }
}

export const isBoardStarred = (userId, boardId) => {
  if (!userId || !boardId) return false
  const list = getStarredBoards(userId)
  return list.some(item => item._id === boardId)
}

export const toggleStarBoard = (userId, board) => {
  if (!userId || !board?._id) return false
  try {
    const currentList = getStarredBoards(userId)
    const isStarred = currentList.some(item => item._id === board._id)
    let updatedList

    if (isStarred) {
      // Đã star thì bỏ star
      updatedList = currentList.filter(item => item._id !== board._id)
    } else {
      // Chưa star thì thêm vào
      updatedList = [
        {
          _id: board._id,
          title: board.title,
          type: board.type
        },
        ...currentList
      ]
    }

    localStorage.setItem(`${STARRED_BOARDS_PREFIX}${userId}`, JSON.stringify(updatedList))
    // Phát event để các component lắng nghe cập nhật realtime
    window.dispatchEvent(new Event('trello_storage_updated'))
    return !isStarred
  } catch (error) {
    console.error('Error toggling starred board:', error)
    return false
  }
}
