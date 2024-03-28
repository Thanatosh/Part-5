import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

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
    console.log('logging in with', username, password)

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
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
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
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        username 
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password 
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
    return (
      <div>
        <h2>Blogs</h2>
        <p>{user.name} logged in <button type="button" onClick={handleLogout}>logout</button></p>
        <h2>Create new blog</h2>
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
          <button type="submit">create</button>
        </form><br />

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App