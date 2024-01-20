import React, { useState } from 'react';
import UserLoginScreen from '~/pages/UserPage/UserLoginRegister/Login';
import Header from '~/components/Header/header';
import Banner from '../../components/Banner/Banner';
import Main from './Main/main';
import Footer from '~/components/Footer/Footer';

const HomePage = () => {
  return (
    <div>
      <Header />
      <Banner />
      <Main />
      <Footer />
    </div>
  );
};

export default HomePage;
