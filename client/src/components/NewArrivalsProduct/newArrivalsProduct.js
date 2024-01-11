import React from 'react';
import classNames from 'classnames/bind';
import styles from './newArrivalsProduct.module.scss';
import images from '~/assets/images';
const cx = classNames.bind(styles);

const NewArrivalsProduct = () => {
  return (
    <div className={cx(styles.newArrivals)}>
      <div className={cx(styles.title)}></div> <h2>New Arrivals</h2>
      <div className={cx(styles.arrivalsContainer)}>
        <div className={cx(styles.row)}>
          <div className={cx(styles.col)}>
            <div className={cx(styles.categoriesBox)}>
              <div className={cx(styles.categoriesImageWrap)}>
                <img
                  className={cx(styles.lazyloadLoaded)}
                  src={images.arrival1}
                  alt="NIKE KYRIE LOW 4"
                  data-ll-status="loaded"
                />
              </div>
              <div className={cx(styles.categoriesContent)}>
                <div className={cx(styles.categoriesCaption)}>
                  <h6 className={cx(styles.normal)}>NIKE KYRIE LOW 4 </h6>
                </div>
              </div>
            </div>
          </div>

          <div className={cx(styles.col)}>
            <div className={cx(styles.categoriesBox)}>
              <div className={cx(styles.categoriesImageWrap)}>
                <img
                  className={cx(styles.lazyloadLoaded)}
                  src={images.arrival2}
                  alt="NIKE PG5"
                  data-ll-status="loaded"
                />
              </div>
              <div className={cx(styles.categoriesContent)}>
                <div className={cx(styles.categoriesCaption)}>
                  <h6 className={cx(styles.normal)}> NIKE PG5</h6>
                </div>
              </div>
            </div>
          </div>

          <div className={cx(styles.col)}>
            <div className={cx(styles.categoriesBox)}>
              <div className={cx(styles.categoriesImageWrap)}>
                <img
                  className={cx(styles.lazyloadLoaded)}
                  src={images.arrival3}
                  alt="NIKE COSMIC UNITY"
                  data-ll-status="loaded"
                />
              </div>
              <div className={cx(styles.categoriesContent)}>
                <div className={cx(styles.categoriesCaption)}>
                  <h6 className={cx(styles.normal)}>NIKE COSMIC UNITY</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NewArrivalsProduct;
