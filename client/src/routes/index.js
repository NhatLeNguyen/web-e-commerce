// // Layouts
import HomePage from '~/pages/HomePage/Home';
import LoginForm from '~/pages/LoginRegister/Login';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// const publicRoutes = [
//   { path: '', component: HomePage, name: 'Home Page' },
//   { path: '/employee', component: EmployeePage, name: 'Employee Page' },
//   { path: '/parcel-tracking', component: ParcelTracking, name: 'Parcel Tracking' },
// ];

const Routes = () => {
  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/login',
      element: <LoginForm />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([...routesForPublic]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
