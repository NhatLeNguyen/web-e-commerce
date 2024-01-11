// // Layouts
import HomePage from '~/pages/HomePage/HomePage';
import LoginForm from '~/pages/LoginRegister/Login';
import SignUp from '~/pages/LoginRegister/Register';
const publicRoutes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/login',
    component: LoginForm,
  },
  {
    path: '/register',
    component: SignUp,
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
