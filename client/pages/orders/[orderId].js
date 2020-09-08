import React, { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'

import useRequest from '../../hooks/use-request'
function OrderShow({ order, currentUser }) {
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: (order) => {
      // alert('done')
      Router.push('/orders')
    }
  })
  const [timeLeft, setTimeLeft] = useState(0)
  useEffect(() => {
    const findTimeLeft = () => {
      setTimeLeft(Math.floor((new Date(order.expiresAt) - new Date()) / 1000))
    }
    findTimeLeft()
    setInterval(findTimeLeft, 1000)
    const timerId = setInterval(findTimeLeft, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [order])
  if (timeLeft < 0) return <h1>order has expired</h1>
  return (
    <div>
      Time left to pay:{timeLeft} seconds
      <StripeCheckout
        name='Ticketing'
        description='Buy ticket'
        amount={order.ticket.price * 100}
        token={(id) => {
          doRequest({ token: id })
        }}
        email={currentUser.email}
        stripeKey='pk_test_51GwXx4DA6WipXJWrhZjXR5kJ84ZtErZ1zaKWbchbugTL61s8OVlRkqh7zFrSLQ8XrHWdlyj66fNFn0fjo7HL9pBO0092oHW1XY'
      ></StripeCheckout>
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)
  return { order: data }
}

export default OrderShow
