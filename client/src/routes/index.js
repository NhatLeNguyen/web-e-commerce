// // Layouts
import HomePage from '~/pages/HomePage/HomePage';
import UserLoginScreen from '~/pages/UserPage/UserLoginRegister/Login';
import UserSignUp from '~/pages/UserPage/UserLoginRegister/Register';
import AdminLoginScreen from '~/pages/EmployeePage/AdminLoginRegister/Login';
import AdminSignUp from '~/pages/EmployeePage/AdminLoginRegister/Register';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const Routes = () => {
  const publicRoutes = [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/user-login',
      element: <UserLoginScreen />,
    },
    {
      path: '/user-register',
      element: <UserSignUp />,
    },
    {
      path: '/admin-login',
      element: <AdminLoginScreen />,
    },
    {
      path: '/admin-register',
      element: <AdminSignUp />,
    },
  ];
  const privateRoutes = [];

  const router = createBrowserRouter([...publicRoutes]);

  return <RouterProvider router={router} />;
};

export default Routes;
