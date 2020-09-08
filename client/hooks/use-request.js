import axios from 'axios'
import { useState } from 'react'
const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)
  const doRequest = async (props = {}) => {
    try {
      const response = await axios[method](url, { ...body, ...props })
      if (onSuccess) {
        onSuccess(response.data)
      }
      return response.data
    } catch (error) {
      console.log(error)
      setErrors(
        <div className='alert alert-danger'>
          <h4>Ooops...</h4>
          <ul className='my-0'>
            {error.response.data.errors.map((err, index) => (
              <li key={index}>{err.message} </li>
            ))}
          </ul>
        </div>
      )
    }
  }
  return { doRequest, errors }
}
export default useRequest
