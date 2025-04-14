import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CartContext from './conText/cartContext.tsx'
import { AuthProvider } from './conText/authContext.tsx'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <CartContext>
              <AuthProvider>
                <App />
              </AuthProvider>
          </CartContext>
        </QueryClientProvider>
      </BrowserRouter>
  </React.StrictMode>,
)
