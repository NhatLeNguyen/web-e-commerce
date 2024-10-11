import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Pagination,
} from "@mui/material";
import axios from "axios";
import "./ProductList.scss";
import AppAppBar from "../../appBar/AppBar";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

const ProductList = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const productsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products?category=${category}`
        );
        if (response.headers["content-type"]?.includes("application/json")) {
          setProducts(Array.isArray(response.data) ? response.data : []);
        } else {
          console.error("Expected JSON but got:", response.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching products:", error.message);
        } else {
          console.error("Error fetching products:", error);
        }
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  const displayedProducts = products.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <>
      <AppAppBar />
      <Container className="product-list-container">
        <Typography variant="h4" gutterBottom>
          {category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : "Category"}{" "}
          Products
        </Typography>
        <Grid container spacing={4}>
          {displayedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <Card
                className="product-card"
                onClick={() => handleProductClick(product._id)}
              >
                <CardMedia
                  component="img"
                  image={product.images[0]}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    console.error(`Error loading image: ${product.images[0]}`);
                    (e.target as HTMLImageElement).src =
                      "path/to/placeholder/image.jpg";
                  }}
                />
                <CardContent className="product-content">
                  <Typography variant="h6" className="product-name">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" className="product-description">
                    {product.description}
                  </Typography>
                  <Typography variant="body2" className="product-price">
                    ${product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={Math.ceil(products.length / productsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          className="pagination"
        />
      </Container>
    </>
  );
};

export default ProductList;
