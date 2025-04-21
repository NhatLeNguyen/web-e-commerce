import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  IconButton,
  Autocomplete,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/stores";
import { fetchProducts } from "../../../../../redux/products/productsThunk";
import useDebounce from "../../../../../hooks/useDebounce";

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
}

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(
    (state: RootState) => state.products.items as Product[]
  );
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const debouncedInputValue = useDebounce(inputValue, 1000);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (debouncedInputValue) {
      const filteredSuggestions = Array.isArray(products)
        ? products.filter(
            (product) =>
              product.name &&
              product.name
                .toLowerCase()
                .includes(debouncedInputValue.toLowerCase())
          )
        : [];
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedInputValue, products]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionSelect = (
    _event: React.SyntheticEvent,
    value: string | Product | null
  ) => {
    if (value && typeof value !== "string") {
      navigate(`/products/${value._id}`);
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      onChange={handleSuggestionSelect}
      renderOption={(props, option) => (
        <ListItem {...props} key={option._id}>
          <ListItemAvatar>
            <Avatar src={option.images[0]} alt={option.name} />
          </ListItemAvatar>
          <ListItemText
            primary={option.name}
            secondary={`Price: ${formatCurrency(option.price)}`}
          />
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          placeholder="Search"
          onChange={handleInputChange}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchBar;
