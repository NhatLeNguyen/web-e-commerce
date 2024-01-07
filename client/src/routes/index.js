// // Layouts
import HomePage from '~/pages/HomePage/Home';
import LoginForm from '~/components/LoginRegister/Login';
import SignUp from '~/components/LoginRegister/Register';
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
