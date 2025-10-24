import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LoginPage from './pages/login'
import Note from './pages/note'
import Dashboard from './pages/dashboard'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/note/:id",
    element: <Note />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
