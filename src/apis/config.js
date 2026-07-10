import axios from "axios";
import { API_ROOT } from "~/utils/constants";



export const api = axios.create({
  baseURL: API_ROOT
})