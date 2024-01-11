// // Layouts
import HomePage from '~/pages/HomePage/HomePage';
import UserLoginScreen from '~/pages/UserLoginRegister/Login';
import UserSignUp from '~/pages/UserLoginRegister/Register';
import AdminLoginScreen from '~/pages/EmployeePage/Login';
import AdminSignUp from '~/pages/EmployeePage/Register';

const publicRoutes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/user-login',
    component: UserLoginScreen,
  },
  {
    path: '/user-register',
    component: UserSignUp,
  },
  {
    path: '/admin-login',
    component: AdminLoginScreen,
  },
  {
    path: '/admin-register',
    component: AdminSignUp,
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
