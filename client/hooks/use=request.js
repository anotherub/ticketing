import axios from 'axios'
import { useState } from 'react'
export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)
  const doRequest = async (params) => {
    try {
      const response = await axios[method](url, body)
      if (onSuccess) {
        onSuccess(response.data)
      }
      return response.data
    } catch (error) {
      console.log('---', error.response)
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
