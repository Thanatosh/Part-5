import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setNotification({ message: `Logged in as ${user.name}`, type: 'notification' })
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', type: 'error' })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    setNotification({ message: 'Logged out successfully', type: 'notification'} )
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs([...blogs, createdBlog])
      setNotification({ message: `Blog "${newBlog.title}" added`, type: 'notification' })
    } catch (error) {
      setNotification({ message: 'Please fill all input fields', type: 'error' })
    }
  }

  const blogForm = () => (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in <button type="button" onClick={handleLogout}>Logout</button></p>
      <BlogForm handleCreateBlog={handleCreateBlog} />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )

  return (
    <div>
      {notification && <Notification message={notification} setNotification={setNotification} />}
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && blogForm()}
    </div>
  )
}

export default App