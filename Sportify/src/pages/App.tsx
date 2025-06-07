import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';
import Signup from './SignUp';
import Home from './Home';
import AllEvents from './AllEvents';
import SingleEvent from './SingleEvent';
import CreateEvent from './CreateEvent';
import AdminDashboard from './AdminDashboard';
import MainLayout from './MainLayout';
import Profile from './Profile';
// import ViewProfile from './ViewProfile';
import EditProfile from './EditProfile';
import MyEvents from './MyEvents';
import OrganizationSignupPage from './OrganizationSignupPage'; 
import EditEvent from './EditEvent';
import InvitedEvents from './InvitedEvents';

import { NotificationProvider } from '../context/NotificationContext'; // ✅ make sure this file exists
import NotificationToast from '../Components/NotificationToast'; // ✅ make sure this file exists

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
      path: '/org-signup', // ✅ NEW
      element: <OrganizationSignupPage />
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
          path: '/profile',
          element: <Profile />
        },
        // {
        //   path: '/view-profile',
        //   element: <ViewProfile />
        // },
        {
          path: '/edit-profile',
          element: <EditProfile />
        },
        {
          path: '/my-events',
          element: <MyEvents />
        },
        {
          path: '/edit-event/:id',
          element: <EditEvent />
        },
        {
          path: '/notifications',
          element: <InvitedEvents />
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
  return (
    <NotificationProvider>
      <NotificationToast /> {/* ✅ Global toast alert component */}
      <RouterProvider router={router} />
    </NotificationProvider>
  );
}

export default App;
