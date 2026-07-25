import { configureStore } from "@reduxjs/toolkit";
import activeBoardReducer from "./activeBoard/activeBoardSlice"
import userReducer from "~/redux/user/userSlice";
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // default là localstorage
import { activeCardReducer } from "~/redux/activeCard/activeCardSlice";
import { notificationsReducer } from "~/redux/notifications/notificationsSlice";
/**
 * Cầu hinh redux-persist
* https://www.npmjs.com/package/redux-persist
* Bai viet huong dan nay de hieu hon:
* https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */
// Cấu hình persist
const rootPersistConfig = {
  key: 'root', // key của cái persist do chúng ta chỉ định, cứ để mặc định là root
  storage: storage, // Biến storage ở trên ~ lưu trữ vào localstorage
  whitelist: ['user'] // định nghĩa các slice không được phép duy trì qua mỗi lần f5 trình duyệt
  // blacklist: ['user'] // định nghĩa các slice không được phép duy trì qua mỗi lần f5 trình duyệt
}
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer,
})
// thực hiện persist Reducer
const persistReducers = persistReducer(rootPersistConfig, reducers)
export const store = configureStore({
  reducer: persistReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})