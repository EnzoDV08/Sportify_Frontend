import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';
import Signup from './SignUp';
import Home from './Home';
import AllEvents from './AllEvents';
import SingleEvent from './SingleEvent';
import CreateEvent from './CreateEvent';
import AdminDashboard from './AdminDashboard';
import MainLayout from './MainLayout';
import MyEvents from './MyEvents';
import EditEvent from './EditEvent';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Login /> 
    },
    {
      path: '/signup',
      element: <Signup />
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
        },
        {
          path: '/events',
          element: <AllEvents />
        },
        {
          path: '/events/:id',
          element: <SingleEvent />
        },
        {
          path: '/add-event',
          element: <CreateEvent />
        },
        {
          path: '/my-events',
          element: <MyEvents />
        },
        {
          path: '/edit-event/:id',
          element: <EditEvent />
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


