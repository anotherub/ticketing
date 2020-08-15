import React, { useState } from 'react'
import useRequest from '../../hooks/use=request'
import Router from 'next/router'
function signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => {
      Router.push('/')
    }
  })
  const onSubmit = async (event) => {
    event.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>signin</h1>
      <div
        className='form-group'
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      >
        <label>Email Address</label>
        <input className='form-control' />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          type='password'
          className='form-control'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </div>
      {errors}

      <button className='btn btn-primary'>Sign In</button>
    </form>
  )
}

export default signin
