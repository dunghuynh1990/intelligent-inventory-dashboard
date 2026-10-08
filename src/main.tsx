import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MockInventoryService } from './services/mock-inventory-service'
import './index.css'
import App from './App.tsx'

const inventoryService = new MockInventoryService()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App inventoryService={inventoryService} />
  </StrictMode>,
)
