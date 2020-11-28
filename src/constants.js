import { env } from "process";
console.log({NIDE_ENV: env.NODE_ENV})
export default {
    "path": env.NODE_ENV === 'development' ? '/api' : 'https://fynd--imdb.herokuapp.com'
}