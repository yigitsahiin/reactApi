import axios from "axios";

let BASEURL_HACKERRANK_API = `https://jsonmock.hackerrank.com/api/`;
let BASEURL_JSON_PLACEHOLDER_API = `https://jsonplaceholder.typicode.com/`;
export const hackerrankAPI = axios.create({ baseURL: BASEURL_HACKERRANK_API });
export const jsonPlaceholderAPI=axios.create({baseURL:BASEURL_JSON_PLACEHOLDER_API})
// export const jasonPlaceholderAPI = axios.get(BASEURL_JSON_PLACEHOLDER_API);