import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Login'

const router = createBrowserRouter(
  [
    {
      path: '*',
      element: <Login />
    }
  ],
  {
    future: {
      // @ts-expect-error — these aren't typed yet in v6.30
      v7_startTransition: true,
      
      v7_relativeSplatPath: true
    }
  }
)


function App() {
  return <RouterProvider router={router} />
}

export default App
