import { render, screen } from '@testing-library/react'
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