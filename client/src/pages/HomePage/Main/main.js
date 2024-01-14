import React from 'react';
import classNames from 'classnames/bind';
import styles from './main.module.scss';
import InfiniteCarousel from 'react-leaf-carousel';

//mui
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RefreshIcon from '@mui/icons-material/Refresh';
import HeadphonesIcon from '@mui/icons-material/Headphones';

//data
import { shoesData } from '~/data/shoes';

import images from '~/assets/images';

import NewArrivalsProduct from '~/components/NewArrivalsProduct/newArrivalsProduct';

const cx = classNames.bind(styles);

const Main = () => {
  // const nikeShoes = shoesData.filter((product) => product.categorie === 'Nike');
  // const adidasShoes = shoesData.filter((product) => product.categorie === 'Adidas');
  // const jordanShoes = shoesData.filter((product) => product.categorie === 'Jordan');
  // const pumaShoes = shoesData.filter((product) => product.categorie === 'Puma');

  return (
    <div className={cx(styles.main)}>
      <NewArrivalsProduct />

      <div className={cx(styles.trending)}>
        <div className={cx(styles.title)}>
          <h2>Top Trending</h2>
        </div>

        <InfiniteCarousel
          breakpoints={[
            {
              breakpoint: 500,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
              },
            },
          ]}
          dots={false}
          showSides={true}
          sidesOpacity={0.2}
          sideSize={0.3}
          slidesToScroll={1}
          slidesToShow={4}
          scrollOnDevice={true}
        >
          {shoesData.map((product) => (
            <div className={cx(styles.productBox)} key={product.id}>
              <img alt={product.name} src={product.img[0]} />
              <div className={cx(styles.productInfo)}>
                <p className={cx(styles.productName)}>{product.name}</p>

                <p className={cx(styles.productPrice)}>{product.price}</p>
                <div className={cx(styles.productPrice)}>
                  <button className={cx('viewDetails')}>
                    <ZoomInIcon />
                  </button>
                  <button className={cx('addToCart')}>
                    <AddShoppingCartIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </InfiniteCarousel>
      </div>

      <div className={cx(styles.quangCao1)}>
        <div>
          <h2>About Lee Basketball </h2>
        </div>
        <div className={cx(styles.greyBg)}>
          <div className={cx(styles.content)}>
            <ul className={cx(styles.row)}>
              <li className={cx(styles.active1)}>
                <LocalShippingIcon sx={{ margin: '0px', fontSize: '60px', color: '#4cb9f8' }} />
                <strong>Miễn phí vận chuyển</strong>
                Miễn phí vận chuyển mọi đơn hàng trị giá trên 2.500.000 VNĐ trên toàn quốc
              </li>
              <li className={cx(styles.active2)}>
                <RefreshIcon sx={{ margin: '0px', fontSize: '60px', color: '#4cb9f8' }} />
                <strong>Chính sách đổi trả </strong>
                Đổi trả hàng nhanh trong 24 giờ với các sản phẩm lỗi từ nhà sản xuất
              </li>
              <li className={cx(styles.active3)}>
                <HeadphonesIcon sx={{ margin: '0px', fontSize: '60px', color: '#4cb9f8' }} />
                <strong>Hỗ trợ miễn phí 24/7</strong>
                Gọi theo đường dây nóng 0123456789 để được tư vấn hỗ trợ
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;
