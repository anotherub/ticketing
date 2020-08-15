import React from 'react'
import buildClient from '../api/build-client'

const Index = ({ currentUser }) => {
  console.log('current user is ', currentUser)
  return currentUser ? <h1>you are signed in </h1> : <h1>you are not signed in</h1>
}

Index.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/currentuser')

  return data
}

export default Index
// ingress-nginx-controller.ingress-nginx.svc.cluster.local
