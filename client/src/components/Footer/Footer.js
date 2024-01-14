import classNames from 'classnames/bind';
import styles from './footer.module.scss';
import images from '~/assets/images';
const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <div className={cx(styles.footer)}>
      <img className={cx(styles.logo)} src={images.logo} alt="logo" />
      <div>Đây là footer</div>
    </div>
  );
};

export default Footer;
