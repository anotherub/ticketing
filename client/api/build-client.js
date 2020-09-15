import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    //running on server
    return axios.create({
      baseURL: 'www.ticketing.umeshbhat.in',
      headers: req.headers
    })
  } else {
    //running on browser
    return axios.create({
      baseURL: '/'
    })
  }
}

export default buildClient
