import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'

test('renders app title', () => {
  render(<App />)
  const el = screen.getByText(/Land your dream job/i)
  expect(el).toBeInTheDocument()
})
