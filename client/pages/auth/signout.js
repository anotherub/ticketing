import React, { useEffect } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'
function signout() {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    onSuccess: () => {
      Router.push('/')
    }
  })

  useEffect(() => {
    doRequest()
  }, [])
  return <div>Signing you out....</div>
}

export default signout
