// // Layouts
import HomePage from '~/pages/HomePage/HomePage';
import UserLoginScreen from '~/pages/UserPage/UserLoginRegister/Login';
import UserSignUp from '~/pages/UserPage/UserLoginRegister/Register';
import AdminLoginScreen from '~/pages/EmployeePage/AdminLoginRegister/Login';
import AdminSignUp from '~/pages/EmployeePage/AdminLoginRegister/Register';
import UserHomePage from '~/pages/UserPage/HomePage/UserHomePage';
const publicRoutes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/user',
    component: UserHomePage,
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
