import React, { useEffect } from 'react'

const Notification = ({ message, setNotification }) => {
  useEffect(() => {
    if (message !== null) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message, setNotification])

  if (message === null) {
    return null
  }
  if (message && message.type && message.message) {
    const className = message.type === 'error' ? 'error' : 'notification'
    return (
      <div className={className}>
        {message.message}
      </div>
    )
  }
}

export default Notification