import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { consoleLogger } from './observability/logger'
import { MockInventoryService } from './services/mock-inventory-service'
import { withLogging } from './services/logging-inventory-service'
import './index.css'
import App from './App.tsx'

const inventoryService = withLogging(new MockInventoryService())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary logger={consoleLogger}>
      <App inventoryService={inventoryService} />
    </AppErrorBoundary>
  </StrictMode>,
)
