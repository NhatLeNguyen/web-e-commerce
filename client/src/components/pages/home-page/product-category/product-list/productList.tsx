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
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Drawer,
  Slider,
  TextField,
  Button,
  Divider,
  Skeleton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import "./productList.scss";
import { formatPrice } from "../../../../utils/formatPrice";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  brand: string;
  weight?: string;
  stiffness?: string;
}

const ProductList = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState<number[]>([0, 15000000]);
  const [brandFilter, setBrandFilter] = useState("all");
  const [weightFilter, setWeightFilter] = useState("all");
  const [stiffnessFilter, setStiffnessFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://web-e-commerce-xi.vercel.app/api/products?category=${category}`
        );
        if (response.headers["content-type"]?.includes("application/json")) {
          const fetchedProducts = Array.isArray(response.data)
            ? response.data.map((product: Product) => ({
                ...product,
                weight:
                  product.weight ||
                  ["light", "medium", "heavy"][Math.floor(Math.random() * 3)],
                stiffness:
                  product.stiffness ||
                  ["flexible", "medium", "stiff"][
                    Math.floor(Math.random() * 3)
                  ],
              }))
            : [];
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
        } else {
          console.error("Expected JSON but got:", response.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching products:", error.message);
        } else {
          console.error("Error fetching products:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  useEffect(() => {
    let updatedProducts = [...products];

    updatedProducts = updatedProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (brandFilter !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) => product.brand.toLowerCase() === brandFilter.toLowerCase()
      );
    }

    if (weightFilter !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.weight?.toLowerCase() === weightFilter.toLowerCase()
      );
    }

    if (stiffnessFilter !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.stiffness?.toLowerCase() === stiffnessFilter.toLowerCase()
      );
    }

    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "price-asc") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(updatedProducts);
    setPage(1);
  }, [
    sortOption,
    priceRange,
    brandFilter,
    weightFilter,
    stiffnessFilter,
    searchQuery,
    products,
  ]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleClearFilters = () => {
    setPriceRange([0, 15000000]);
    setBrandFilter("all");
    setWeightFilter("all");
    setStiffnessFilter("all");
    setSearchQuery("");
    setSortOption("default");
    setProductsPerPage(8);
    setPage(1);
  };

  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const startIndex = (page - 1) * productsPerPage + 1;
  const endIndex = Math.min(page * productsPerPage, filteredProducts.length);
  const totalProducts = filteredProducts.length;

  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const weights = Array.from(new Set(products.map((p) => p.weight)));
  const stiffnesses = Array.from(new Set(products.map((p) => p.stiffness)));

  return (
    <Container className="product-list-container">
      <Button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
        sx={{ display: { xs: "block", md: "none" }, mb: 2 }}
      >
        <MenuIcon />
        Filters
      </Button>

      <Box className="main-content">
        <Box
          className="sidebar"
          sx={{
            display: { xs: "none", md: "block" },
            width: 250,
          }}
        >
          <Box className="sidebar-content">
            <Typography variant="h6" className="sidebar-title">
              Filters
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              label="Search Products"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={false}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&:hover fieldset": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4B6A88",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666",
                  "&.Mui-focused": {
                    color: "#4B6A88",
                  },
                },
              }}
            />

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={(_e, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatPrice(value)}
                min={0}
                max={15000000}
                step={100000}
                sx={{ color: "#4B6A88" }}
              />
              <Typography variant="caption" color="textSecondary">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </Typography>
            </Box>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Brand
              </InputLabel>
              <Select
                value={brandFilter}
                label="Brand"
                onChange={(e) => setBrandFilter(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value="all">All Brands</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand.toLowerCase()}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Weight
              </InputLabel>
              <Select
                value={weightFilter}
                label="Weight"
                onChange={(e) => setWeightFilter(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value="all">All Weights</MenuItem>
                {weights.map((weight) => (
                  <MenuItem key={weight} value={weight?.toLowerCase()}>
                    {weight}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Stiffness
              </InputLabel>
              <Select
                value={stiffnessFilter}
                label="Stiffness"
                onChange={(e) => setStiffnessFilter(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value="all">All Stiffnesses</MenuItem>
                {stiffnesses.map((stiffness) => (
                  <MenuItem key={stiffness} value={stiffness?.toLowerCase()}>
                    {stiffness}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Sort By
              </InputLabel>
              <Select
                value={sortOption}
                label="Sort By"
                onChange={(e) => setSortOption(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="name-asc">Name: A to Z</MenuItem>
                <MenuItem value="name-desc">Name: Z to A</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Per Page
              </InputLabel>
              <Select
                value={productsPerPage}
                label="Per Page"
                onChange={(e) => {
                  setProductsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={16}>16</MenuItem>
                <MenuItem value={24}>24</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleClearFilters}
              sx={{
                mt: 2,
                borderColor: "#4B6A88",
                color: "#4B6A88",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#3B536E",
                  backgroundColor: "rgba(75, 106, 136, 0.05)",
                },
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>

        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box" },
          }}
        >
          <Box className="sidebar-content">
            <Typography variant="h6" className="sidebar-title">
              Filters
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              label="Search Products"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={false}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&:hover fieldset": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4B6A88",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666",
                  "&.Mui-focused": {
                    color: "#4B6A88",
                  },
                },
              }}
            />

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={(_e, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatPrice(value)}
                min={0}
                max={15000000}
                step={100000}
                sx={{ color: "#4B6A88" }}
              />
              <Typography variant="caption" color="textSecondary">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </Typography>
            </Box>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Brand
              </InputLabel>
              <Select
                value={brandFilter}
                label="Brand"
                onChange={(e) => setBrandFilter(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value="all">All Brands</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand.toLowerCase()}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Weight
              </InputLabel>
              <Select
                value={weightFilter}
                label="Weight"
                onChange={(e) => setWeightFilter(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value="all">All Weights</MenuItem>
                {weights.map((weight) => (
                  <MenuItem key={weight} value={weight?.toLowerCase()}>
                    {weight}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Stiffness
              </InputLabel>
              <Select
                value={stiffnessFilter}
                label="Stiffness"
                onChange={(e) => setStiffnessFilter(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value="all">All Stiffnesses</MenuItem>
                {stiffnesses.map((stiffness) => (
                  <MenuItem key={stiffness} value={stiffness?.toLowerCase()}>
                    {stiffness}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Sort By
              </InputLabel>
              <Select
                value={sortOption}
                label="Sort By"
                onChange={(e) => setSortOption(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="name-asc">Name: A to Z</MenuItem>
                <MenuItem value="name-desc">Name: Z to A</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel
                sx={{ color: "#666", "&.Mui-focused": { color: "#4B6A88" } }}
              >
                Per Page
              </InputLabel>
              <Select
                value={productsPerPage}
                label="Per Page"
                onChange={(e) => {
                  setProductsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                sx={{
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A88",
                  },
                }}
              >
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={16}>16</MenuItem>
                <MenuItem value={24}>24</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleClearFilters}
              sx={{
                mt: 2,
                borderColor: "#4B6A88",
                color: "#4B6A88",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#3B536E",
                  backgroundColor: "rgba(75, 106, 136, 0.05)",
                },
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Drawer>

        <Box className="products-content">
          <Typography variant="h4" gutterBottom className="category-title">
            {category
              ? category.charAt(0).toUpperCase() + category.slice(1)
              : "Category"}{" "}
            Products
          </Typography>

          <Typography variant="body2" className="results-count" sx={{ mb: 2 }}>
            Showing {startIndex}-{endIndex} of {totalProducts} products
          </Typography>

          {loading ? (
            <Grid container spacing={2}>
              {[...Array(productsPerPage)].map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rectangular" height={300} />
                  <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              <Grid container spacing={3}>
                {displayedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product._id}>
                    <Card
                      className="product-card"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <CardMedia
                        component="img"
                        className="product-image"
                        image={product.images[0]}
                        alt={product.name}
                        onError={(e) => {
                          console.error(
                            `Error loading image: ${product.images[0]}`
                          );
                          (e.target as HTMLImageElement).src =
                            "path/to/placeholder/image.jpg";
                        }}
                      />
                      <CardContent className="product-content">
                        <Typography variant="h6" className="product-name">
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="product-description"
                        >
                          {product.description}
                        </Typography>
                        <Typography variant="body2" className="product-price">
                          {formatPrice(product.price)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(filteredProducts.length / productsPerPage)}
                page={page}
                onChange={handlePageChange}
                className="pagination"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "8px",
                    color: "#4B6A88",
                    fontWeight: 500,
                    "&.Mui-selected": {
                      backgroundColor: "#4B6A88",
                      color: "#fff",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(75, 106, 136, 0.1)",
                    },
                  },
                }}
              />
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductList;
