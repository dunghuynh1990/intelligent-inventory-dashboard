import { Component, type ErrorInfo, type ReactNode } from 'react'
import type { Logger } from '../observability/logger'

type AppErrorBoundaryProps = {
  children: ReactNode
  logger: Logger
}

type AppErrorBoundaryState = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.logger.error('ui.render.failed', {
      error: error.message,
      componentStack: info.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-fatal-error" role="alert">
          <h1>Dashboard unavailable</h1>
          <p>An unexpected display error occurred. Refresh the page to try again.</p>
        </main>
      )
    }

    return this.props.children
  }
}
