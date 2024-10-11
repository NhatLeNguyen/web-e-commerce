import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  SelectChangeEvent,
  Box,
  CircularProgress,
} from "@mui/material";
import Slider from "react-slick";
import axios from "axios";
import "./productDetail.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AppAppBar from "../../appBar/AppBar";
import ReviewList from "./reviewList";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/stores";
import { addItemToCart, fetchCart } from "../../../../../redux/cart/cartThunks";
import { addItem } from "../../../../../redux/cart/cartSlice";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  rating: number;
  reviews: number;
  brand: string;
  category: string;
  stock: number;
  racketDetails?: {
    flexibility: string;
    frameMaterial: string;
    shaftMaterial: string;
    weight: string;
    gripSize: string;
    maxTension: string;
    balancePoint: string;
    color: string;
    madeIn: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        if (response.headers["content-type"]?.includes("application/json")) {
          setProduct(response.data as Product);
        } else {
          setError("Expected JSON but got a different response.");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        dispatch(fetchCart({ userId: user._id }));
      }
    }
  }, [user, dispatch]);

  const handleSizeChange = (event: SelectChangeEvent<string>) => {
    setSelectedSize(event.target.value as string);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate(`/login?redirect=/products/${id}`);
    } else {
      navigate(`/place-orders`);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate(`/login?redirect=/products/${id}`);
    } else {
      if (product) {
        const token = localStorage.getItem("accessToken");
        if (token) {
          console.log("Token: " + token);

          dispatch(
            addItemToCart({
              userId: user._id,
              item: {
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity,
                size: selectedSize,
                imageUrl: product.images[0],
              },
            })
          );
          dispatch(
            addItem({
              productId: product._id,
              name: product.name,
              price: product.price,
              quantity,
              size: selectedSize,
              imageUrl: product.images[0],
            })
          );
          alert("Added to cart");
        } else {
          console.error("No token found");
        }
      }
    }
  };

  if (loading) {
    return (
      <Container className="loading-container">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="error-container">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="no-product-container">
        <Typography>No product found.</Typography>
      </Container>
    );
  }

  const settings = {
    customPaging: function (i: number) {
      return (
        <a>
          <img src={product.images[i]} alt={`thumbnail-${i}`} />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <AppAppBar />
      <Container className="product-detail-container">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Slider {...settings}>
              {product.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`product-${index}`}
                    className="product-image"
                    onError={(e) => {
                      console.error(`Error loading image: ${image}`);
                      (e.target as HTMLImageElement).src =
                        "path/to/placeholder/image.jpg";
                    }}
                  />
                </div>
              ))}
            </Slider>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent className="product-content">
              <Typography variant="h4" className="product-name">
                {product.name}
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body2" className="product-brand">
                  Brand: {product.brand}
                </Typography>
                <Typography variant="body2" className="product-stock">
                  Stock: {product.stock}
                </Typography>
              </Box>
              <Typography variant="h5" className="product-price">
                ${product.price}
              </Typography>
              <Typography variant="body2" className="product-description">
                {product.description}
              </Typography>
              {product.racketDetails && (
                <Box className="racket-details">
                  <Typography variant="h6">Racket Details:</Typography>
                  <Typography variant="body2">
                    Flexibility: {product.racketDetails.flexibility}
                  </Typography>
                  <Typography variant="body2">
                    Frame Material: {product.racketDetails.frameMaterial}
                  </Typography>
                  <Typography variant="body2">
                    Shaft Material: {product.racketDetails.shaftMaterial}
                  </Typography>
                  <Typography variant="body2">
                    Weight: {product.racketDetails.weight}
                  </Typography>
                  <Typography variant="body2">
                    Grip Size: {product.racketDetails.gripSize}
                  </Typography>
                  <Typography variant="body2">
                    Max Tension: {product.racketDetails.maxTension}
                  </Typography>
                  <Typography variant="body2">
                    Balance Point: {product.racketDetails.balancePoint}
                  </Typography>
                  <Typography variant="body2">
                    Color: {product.racketDetails.color}
                  </Typography>
                  <Typography variant="body2">
                    Made In: {product.racketDetails.madeIn}
                  </Typography>
                </Box>
              )}
              {product.category === "shoes" && (
                <FormControl fullWidth className="product-size" margin="normal">
                  <InputLabel>Size</InputLabel>
                  <Select value={selectedSize} onChange={handleSizeChange}>
                    {Array.from({ length: 12 }, (_, i) => i + 34).map(
                      (size) => (
                        <MenuItem key={size} value={size.toString()}>
                          {size}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              )}
              {["shorts", "shirt", "skirt"].includes(product.category) && (
                <FormControl fullWidth className="product-size" margin="normal">
                  <InputLabel>Size</InputLabel>
                  <Select value={selectedSize} onChange={handleSizeChange}>
                    {["M", "L", "XL", "XXL"].map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1 }}
                fullWidth
                className="product-quantity"
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className="buy-now"
                sx={{ mt: 2 }}
                onClick={handleBuyNow}
              >
                Mua ngay
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                className="add-to-cart"
                sx={{ mt: 2 }}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            </CardContent>
          </Grid>
        </Grid>
        <ReviewList />
      </Container>
    </>
  );
};

export default ProductDetail;
