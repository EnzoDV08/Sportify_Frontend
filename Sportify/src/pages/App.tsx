import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import AdminDashboard from './AdminDashboard';
import MainLayout from './MainLayout';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Login /> 
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
      path: '/',
      element: <Login /> 
        },
        {
          path: '/home',
          element: <Home />
        },
        
        {
          path: '/dashboard',
          element: <AdminDashboard />
        }
      ]
    },
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
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;


