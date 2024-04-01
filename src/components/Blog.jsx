import React, { useEffect, useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  useEffect(() => {
    setLikes(blog.likes)
  }, [blog.likes])

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = { ...blog, likes: likes + 1 }
      await blogService.update(blog.id, updatedBlog)
      setLikes(likes + 1)
    } catch (error) {
      console.log('Error liking blog:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Do you wish to remove: "${blog.title}"?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (error) {
        console.log('Error deleting blog:', error)
      }
    }
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
          <p>Likes: {likes} <button style={{ marginLeft: '6px' }} onClick={handleLike}>Like</button></p>
          <p>Added by: {blog.user.name}</p>
          <button id="remove-button" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  )
}

export default Blog