import React from 'react';
import classNames from 'classnames/bind';
import styles from './main.module.scss';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { shoesData } from '~/data/shoes';
import InfiniteCarousel from 'react-leaf-carousel';
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

      <div className={cx(styles.quangCao1)}> Quảng cáo content</div>

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

      <div className={cx(styles.quangCao2)}>Quảng cáo content</div>
    </div>
  );
};
export default Main;
