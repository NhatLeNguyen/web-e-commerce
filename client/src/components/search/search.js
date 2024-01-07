import styles from './search.module.scss';
import classNames from 'classnames';
import SearchIcon from '@mui/icons-material/Search';

const cx = classNames.bind(styles);

const SearchButton = () => {
  return (
    <div className={cx(styles.search)}>
      <SearchIcon fontSize="small" color="primary" sx={{ m: 1 }} />
      <input className={cx('search-input')} placeholder="Tìm kiếm" onChange={(value) => {}} />
    </div>
  );
};
export default SearchButton;
