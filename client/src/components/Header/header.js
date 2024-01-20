import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
//mui
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchButton from '~/components/Search/search';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Avatar } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './header.module.scss';
import images from '~/assets/images';
import LogoutIcon from '@mui/icons-material/Logout';

const cx = classNames.bind(styles);
//header

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLoginRegisterClick = () => {
    navigate('/user-login');
  };

  const handleLoginSuccess = () => {
    // Thực hiện các hành động sau khi đăng nhập thành công (nếu cần)
  };

  const handleLogout = () => {
    // Thực hiện các hành động khi đăng xuất (nếu cần)
  };

  return (
    <header>
      <img className={cx(styles.logo)} src={images.logo} alt="logo" />

      <div className={cx(styles.mainHeaderMenu)}>
        <nav className={cx(styles.deskMenu)}>
          <li className={cx(styles.menutem)}>
            <a href="/" title="Trang chủ">
              Trang chủ
            </a>
          </li>

          <li className={cx(styles.menutem)}>
            <a href="/collections/giaybongro" title="Giày bóng rổ">
              Giày bóng rổ
            </a>
            <ul className={cx(styles.subMenu)}>
              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/nike" title="Nike">
                  Nike
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/adidas" title="adidas">
                  Adidas
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/jordan" title="Jordan">
                  Jordan
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/puma" title="Puma">
                  Puma
                </a>
              </li>
            </ul>
          </li>
          <li className={cx(styles.menutem)}>
            <a href="/collections/quanao" title=" Quần áo">
              Quần áo
            </a>
          </li>
          <li className={cx(styles.menutem)}>
            <a href="/collections/bongro" title=" Bóng rổ">
              Bóng rổ
            </a>
          </li>
          <li className={cx(styles.menutem)}>
            <a href="/collections/phukien" title=" Phụ kiện">
              Phụ kiện
            </a>
            <ul className={cx(styles.subMenu)}>
              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/tat-bong-ro" title="Tất bóng rổ">
                  Tất bóng rổ <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/balo" title="Balo">
                  Balo <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/headband" title="HEADBAND">
                  Headband
                </a>
              </li>
            </ul>
          </li>
          <li className={cx(styles.menutem)}>
            <a href=" Contact" title="  Contact">
              Contact
            </a>
          </li>
        </nav>
      </div>

      <div className={cx(styles.searchLogin)}>
        <SearchButton />

        <div>
          <ShoppingCartIcon
            fontSize="large"
            color="primary"
            sx={{ marginTop: '0.8rem', marginLeft: '10px', marginRight: '10px' }}
          />
        </div>
        <div>
          {isLoggedIn ? (
            <div className={cx(styles.userDropdown)}>
              <div className={cx(styles.userAvatar)}>
                <Avatar alt="User Avata" src={images.arrival1} />
              </div>
              <div className={cx(styles.dropdownContent)}>
                <a href="/user-info">
                  <PersonIcon fontSize="mall" sx={{ marginRight: '5px' }} />
                  Thông tin
                </a>
                <a href="/order-history">
                  <ShoppingBagIcon fontSize="mall" sx={{ marginRight: '5px' }} />
                  Đơn hàng
                </a>
                <a href="/" onClick={handleLogout}>
                  <LogoutIcon fontSize="mall" sx={{ marginRight: '5px' }} />
                  Đăng xuất
                </a>
              </div>
            </div>
          ) : (
            <div className={cx(styles.loginRegister)}>
              <button onClick={handleLoginRegisterClick}>
                <LoginIcon fontSize="small" sx={{ m: 1 }} />
                Đăng ký / Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
