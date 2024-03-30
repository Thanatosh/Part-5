import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: `Logged in as ${user.name}`, type: 'notification'} )
      clearNotification()
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', type: 'error'} )
      clearNotification()
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    setNotification({ message: 'Logged out successfully', type: 'notification'} )
    clearNotification()
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
      }

      const createdBlog = await blogService.create(newBlog)
      setBlogs([...blogs, createdBlog])
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      setNotification({ message: `Blog "${newBlog.title}" added`, type: 'notification' })
      clearNotification()
    } catch (error) {
      setNotification({ message: 'Please fill all input fields', type: 'error' })
      clearNotification()
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        username: 
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password: 
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div><br />
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <h2>Blogs</h2>
        <p>{user.name} logged in <button type="button" onClick={handleLogout}>Logout</button></p>
        <div style={showWhenVisible}>
          <h2>Create new blog</h2>
        </div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>New Blog</button>
        </div>
        <div style={showWhenVisible}>
          <form onSubmit={handleCreateBlog}>
            <div>
              title: <input type="text" value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)} />
            </div>
            <div>
              author: <input type="text" value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)} />
            </div>
            <div>
              url: <input type="text" value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)} />
            </div><br />
            <button type="submit" onClick={() => setLoginVisible(false)}>Create</button>
            <button type="button" onClick={() => setLoginVisible(false)}>Cancel</button>
          </form><br />
        </div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  const clearNotification = () => {
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <div>
      {notification && <Notification message={notification} />}
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

const Notification = ({ message }) => {
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

export default App