import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the dashboard heading in the page header', () => {
    render(<App />)

    expect(screen.getByRole('banner')).toContainElement(
      screen.getByRole('heading', { name: 'Intelligent Inventory' }),
    )
    expect(screen.getByText('Dealership vehicle overview')).toBeInTheDocument()
  })

  it('renders the main dashboard content landmark', () => {
    render(<App />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
