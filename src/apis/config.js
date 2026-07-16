import axios from "axios";
import { toast } from "react-toastify";
import { API_ROOT } from "~/utils/constants";
import { interceptorLoadingElements } from "~/utils/Formatters";



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
    if (error.response?.status != 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
);
