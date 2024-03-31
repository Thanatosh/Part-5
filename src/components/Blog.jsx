import React, { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className="blog-container">
      <div>
        <strong>{blog.title}</strong> by {blog.author}
        <button style={{ marginLeft: '10px' }} onClick={toggleDetails}>{showDetails ? 'Hide' : 'View'}</button>
      </div>
      {showDetails && (
        <div>
          <p>Url: {blog.url}</p>
          <p>Likes: {blog.likes}</p>
          <p>Added by: {blog.user.name}</p>
        </div>
      )}
    </div>
  )
}

export default Blog