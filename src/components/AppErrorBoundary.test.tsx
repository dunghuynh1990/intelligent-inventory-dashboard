import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Logger } from '../observability/logger'
import { AppErrorBoundary } from './AppErrorBoundary'

function BrokenDashboard(): never {
  throw new Error('Render failed')
}

describe('AppErrorBoundary', () => {
  it('logs a render error and presents a recoverable page-level message', () => {
    const logger: Logger = {
      info: vi.fn(),
      error: vi.fn(),
    }

    render(
      <AppErrorBoundary logger={logger}>
        <BrokenDashboard />
      </AppErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Dashboard unavailable')
    expect(screen.getByRole('alert')).toHaveTextContent('Refresh the page to try again')
    expect(logger.error).toHaveBeenCalledWith(
      'ui.render.failed',
      expect.objectContaining({ error: 'Render failed' }),
    )
  })
})
