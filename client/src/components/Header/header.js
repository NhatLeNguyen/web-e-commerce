import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginRegisterClick = () => {
    navigate('/user-login');
  };
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cx({ [styles.scrolled]: isScrolled })}>
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
            <a href="/collections/giaybongro" title=" Quần áo">
              Quần áo
            </a>
            <ul className={cx(styles.subMenu)}>
              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/nba" title="NBA">
                  NBA
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/vba" title="VBA">
                  VBA
                </a>
              </li>
            </ul>
          </li>
          <li className={cx(styles.menutem)}>
            <a href="/collections/giaybongro" title=" Bóng rổ">
              Bóng rổ
            </a>
            <ul className={cx(styles.subMenu)}>
              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/bong-outdoor" title="Outdoor">
                  Outdoor
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/bong-indoor" title="Indoor">
                  Indoor
                </a>
              </li>
            </ul>
          </li>
          <li className={cx(styles.menutem)}>
            <a href="/collections/giaybongro" title=" Phụ kiện">
              Phụ kiện
            </a>
            <ul className={cx(styles.subMenu)}>
              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/phu-kien" title="Bảo vệ">
                  Bảo vệ <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/dung-cu" title="Hỗ trợ tập luyện">
                  Hỗ trợ tập luyện <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/vo-chan" title="Vớ chân">
                  Vớ chân
                </a>
              </li>
              <li className={cx(styles.subMenuItem)}>
                <a href="/products/bo-do-choi-bang-ro-mini" title="Bảng rổ mini">
                  Bảng rổ mini
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/products/baller-band-by-nba-store" title="Vòng tay NBA">
                  Vòng tay NBA
                </a>
              </li>

              <li className={cx(styles.subMenuItem)}>
                <a href="/collections/vanh-ro" title="Vành Rổ">
                  Vành Rổ
                </a>
              </li>
            </ul>
          </li>
          <li className={cx(styles.menutem)}>
            <a href="/collections/giaybongro" title=" blog">
              Blog
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
          {location.pathname === '/user' ? (
            <div className={cx(styles.userDropdown)}>
              <div className={cx(styles.userAvatar)}>
                {/* Replace this with your actual user avatar */}
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
                <a href="/">
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
