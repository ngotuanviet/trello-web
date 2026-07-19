import axios from "axios";
import { toast } from "react-toastify";
import { API_ROOT } from "~/utils/constants";
import { interceptorLoadingElements } from "~/utils/Formatters";
import { refreshTokenAPI } from './index'
import { loginUserAPI, logoutUserAPI } from '~/redux/user/userSlice'
/**
 * Không the import { store ) from '~/redux/store' theo cách thông thường ở đầy
* Giai pháp: Inject store: là kỹ thuật khi cần sử dụng biền redux store o các file ngoài phạm vi component
nhu file config hiện tại
* Hiều đơn giản: khi ứng dụng bắt đầu chạy tên, code sẽ chạy vào main.jsx đầu tiền, từ bên đó chúng ta gọi
ham injectStore ngay lập tức đe gan bien mainStore vao bien axiosReduxStore cuc bộ trong file này.
* https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */
let axiosReduxStore

export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}
export const api = axios.create({
  baseURL: API_ROOT

})


// Khoi tạo một đồi tượng Axios (authorizedAxiosInstance) mục dích đề custom và cầu hình chung cho dự án. I
// Thời gian cho toi da cua 1 reqquest: dề 10 phút
api.defaults.timeout = 1000 * 60 * 10
// withCredentials: Se cho phép axios tự dộng gừi cookie trong mồi request lên BE (phục vụ việc chúng ta sẽ
// luu JWT tokens(refresh & access) vao trong httpOnly Cookie cua trinh duyet)
api.defaults.withCredentials = true
/**
 *  Cầu hinh Interceptors (Bộ đanh chặn vào giữa mọi Request & Response)
 *  https://axios-http.com/docs/interceptors
 */
//Interceptor Request can thiệp vào giữa nhưng cái requestAPI
api.interceptors.request.use(
  (config) => {




    // Ký thuật chận spam click (xem ký mô tà ở file formatters chứa function)
    interceptorLoadingElements(true)

    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
);


// Khoi tạo một cái promise cho việc goi api refresh_token
// Mục dích tạo Promise này đề khi nào gọi api refresh_token xong xuối thì mói retry lại nhiều api
//bi toi truoc do.
// https://stackoverflow.com/questions/77310559/automatically-refreshing-access-token-by-axios-interceptor-request
let refreshTokenPromise = null


//Interceptor Response can thiệp vào giữa nhưng cái response nhận về
api.interceptors.response.use(
  (response) => {



    // Ký thuật chận spam click (xem ký mô tà ở file formatters chứa function)
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    // Ký thuật chận spam click (xem ký mô tà ở file formatters chứa function)
    interceptorLoadingElements(false)

    // Quan trọng: Xử lý Refresh Token tự động
    // Trường hợp 1: Nều như nhận mã 401 từ BE, thì gọi api đăng xuất luôn
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }
    // Trường hợp 2: Nều như nhận mã 410 từ BE, thì sẽ gọi api refresh token đề làm mới lại accessToken
    // Đầu tiền lầy dược các request API đang bị lồi thông qua error.config
    const originalRequests = error.config
    console.log("🚀 ~ originalRequests:", originalRequests)
    if (error.response?.status === 410 && !originalRequests._retry) {
      // Gần thêm một giá trị _retry luôn = teu trong khoảng thời gian chờ, đảm bảo việc refresh token này chỉ luôn gọi 1 lần tạo 1 thời điểm (nhìn lại điều kiện if ngay phía trên)
      originalRequests._retry = true
      // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện việc gọi api refresh_token đồng thời gán vào cho cái refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then(data => {
            // đồng thời accessToken đã nằm trong httpOnly cookie (xử lý phía BE)
            return data?.accessToken
          })
          .catch((_error) => {
            // Nếu nhật bất kì lỗi nào từ api refresh token thì cứ logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            // Do API có ok hay lỗi thì vẫn gắn lại cái refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null
          })
      }
      // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây
      return refreshTokenPromise.then(accessToken => {
        /**
         *  Bước 1: Đồi với Trường hợp nều dự án cần lưu accessToken vào localstorage hoặc đầu đó thì sẽ viết
            thêm code xử lý ở đây.
         * Hiện tại ở đầy không cần bước 1 này vì chúng ta đã dưa accessToken vào cookie (xử lý từ phía BE)
            sau khi api refreshToken dược gọi thành công.
         */

        // Bước 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests đề gọi lại những api ban đầu bị tõi
        return api(originalRequests)
      })
    }



    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    /* Moi må http status code nåm ngoài khoảng 200 - 299 se là error và roi vào đầy */
    // Xu lý tập trung phần hien thị thong bao loi tra ve tu moi API o day(viet code một tan: Clean Code)
    // console.log error ra là se thầy cầu trúc data dẫn toi message toi như dưới đây

    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
      // Dùng toastify dề hien thị bắt ke mọi ma toi ten man hinh - Ngoai tru ma 410 - GONE phuc vụ viec tự
      //dong refresh lai token.

    }
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
);
