import React, { useEffect, useRef } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Container,
} from "@mui/material";
import "./productCategory.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "../../../../redux/products/categorySlice";
import SearchBar from "./search-bar/searchBar";
interface Category {
  title: string;
  slug: string;
  image: string;
}

const categories: Category[] = [
  {
    title: "Racket",
    slug: "racket",
    image: "thumbnail/racket.png",
  },
  {
    title: "Shoes",
    slug: "shoes",
    image: "thumbnail/shoes.jpg",
  },
  {
    title: "Backpack",
    slug: "backpack",
    image: "thumbnail/backpack.png",
  },
  {
    title: "Racket Bag",
    slug: "racket-bag",
    image: "thumbnail/racket-bag.jpg",
  },
  {
    title: "Shorts",
    slug: "shorts",
    image: "thumbnail/short.png",
  },
  {
    title: "Shirt",
    slug: "shirt",
    image: "thumbnail/shirt.png",
  },
  {
    title: "Skirt",
    slug: "skirt",
    image: "thumbnail/skirt.png",
  },
  {
    title: "Accessory",
    slug: "accessory",
    image: "thumbnail/accessories.png",
  },
];

const ProductCategory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  const handleCategoryClick = (category: Category) => {
    dispatch(setSelectedCategory(category.slug));
    navigate(`/product/${category.slug}`);
  };

  return (
    <Container className="product-container">
      <SearchBar />

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        className="product-categories-title"
      >
        Product Categories
      </Typography>

      <Grid container spacing={4} className="product-categories">
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              ref={(el) => (cardRefs.current[index] = el)}
              className={`category-card ${index % 2 === 0 ? "even" : "odd"}`}
              onClick={() => handleCategoryClick(category)}
              style={{ cursor: "pointer" }}
            >
              <CardMedia
                component="img"
                image={category.image}
                alt={category.title}
              />
              <CardContent>
                <Typography variant="h6">{category.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductCategory;
