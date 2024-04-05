import React, { useState } from 'react'

const BlogForm = ({ handleCreateBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

  const handleSubmit = (event) => {
    event.preventDefault()
    try {
      handleCreateBlog({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
      })
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  return (
    <div>
      <div style={showWhenVisible}>
        <h2>Create new blog</h2>
      </div>
      <div style={hideWhenVisible}>
        <button style={{ marginBottom: '15px' }} onClick={() => setBlogFormVisible(true)}>New Blog</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={handleSubmit}>
          <div>
            title: <input type="text" value={newBlogTitle} onChange={(e) => setNewBlogTitle(e.target.value)} />
          </div>
          <div>
            author: <input type="text" value={newBlogAuthor} onChange={(e) => setNewBlogAuthor(e.target.value)} />
          </div>
          <div>
            url: <input type="text" value={newBlogUrl} onChange={(e) => setNewBlogUrl(e.target.value)} />
          </div><br />
          <button type="submit" onClick={() => setBlogFormVisible(false)}>Create</button>
          <button type="button" onClick={() => setBlogFormVisible(false)}>Cancel</button>
        </form><br />
      </div>
    </div>
  )
}

export default BlogForm