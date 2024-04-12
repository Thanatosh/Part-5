import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('Renders content', () => {
  const blog = {
    title: 'React-testing',
    author: 'Joni Hostikka',
  }

  render(<Blog title={blog.title} blog={blog} user={blog.author} />)

  const titleElement = screen.getByText(new RegExp(blog.title, 'i'))
  expect(titleElement).toBeDefined()
  const authorElement = screen.getByText(new RegExp(blog.author, 'i'))
  expect(authorElement).toBeDefined()
})

test('Clicking the view button shows user, url and likes', async () => {
  const blog = {
    user: {
      name: 'Joni Hostikka'
    },
    url: 'TestURL',
    likes: 12
  }

  render(<Blog blog={blog} user={blog.user} url={blog.url} likes={blog.likes} />)

  const event = userEvent.setup()
  const button = screen.getByText('View')
  await event.click(button)

  const userElement = screen.getByText(new RegExp(blog.user.name, 'i'))
  expect(userElement).toBeDefined()
  const urlElement = screen.getByText(new RegExp(blog.url, 'i'))
  expect(urlElement).toBeDefined()
  const likesElement = screen.getByText(new RegExp(blog.likes, 'i'))
  expect(likesElement).toBeDefined()
})