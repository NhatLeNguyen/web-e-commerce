import React from 'react';
import classNames from 'classnames/bind';
import styles from './main.module.scss';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { shoesData } from '~/data/shoes';

const cx = classNames.bind(styles);

const Main = () => {
  const trendingData = shoesData.filter((product) => product.categorie === 'Nike').slice(0, 4);
  const nikeShoes = shoesData.filter((product) => product.categorie === 'Nike');
  const adidasShoes = shoesData.filter((product) => product.categorie === 'Adidas');
  const jordanShoes = shoesData.filter((product) => product.categorie === 'Jordan');
  const pumaShoes = shoesData.filter((product) => product.categorie === 'Puma');

  return (
    <div className={cx(styles.main)}>
      <div className={cx(styles.spMoi)}>
        <div className={cx(styles.title)}></div> <h2>New Arrivals</h2>
        <div></div>
      </div>
      <div className={cx(styles.quangCao1)}> Quảng cáo content</div>
      <div className={cx(styles.trending)}>
        <div className={cx(styles.title)}>
          <h2>Top Trending</h2>
        </div>

        <div className={cx(styles.productGrid)}>
          {trendingData.map((product) => (
            <div className={cx(styles.productBox)} key={product.id}>
              <img src={product.img[0]} alt={product.name} />
              <div className={cx(styles.productInfo)}>
                <p className={cx(styles.productName)}>{product.name}</p>
                <p className={cx(styles.productPrice)}>{product.price}</p>
                <div className={cx(styles.productButtons)}>
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
        </div>
      </div>
    </div>
  );
};
export default Main;
