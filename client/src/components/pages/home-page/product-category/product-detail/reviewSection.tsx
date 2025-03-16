// components/ReviewSection.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/stores";
import axiosInstance from "../../../../../axios/axiosInstance";
import { setReviews } from "../../../../../redux/reviews/reviewSlice";
import { submitReview } from "../../../../../redux/reviews/reviewThunks";
import { useNavigate } from "react-router-dom";

interface Review {
  userId?: string | null;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductResponse {
  reviews: Review[];
  averageRating: number;
}

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <Box sx={{ mb: 2, p: 2, borderBottom: "1px solid #e0e0e0" }}>
      <Typography variant="body1" fontWeight="bold">
        {review.username}
        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
          {new Date(review.date).toLocaleDateString()}
        </Typography>
      </Typography>
      <Rating value={review.rating} readOnly />
      <Typography variant="body2">{review.comment}</Typography>
    </Box>
  );
};

const ReviewSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { reviews, averageRating, loading, error } = useSelector(
    (state: RootState) => state.reviews
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      try {
        const response = await axiosInstance.get<ProductResponse>(
          `/products/${id}`
        );
        dispatch(
          setReviews({
            reviews: response.data.reviews,
            averageRating: response.data.averageRating,
          })
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id, dispatch]);

  const handleSubmitReview = async () => {
    if (!user) {
      alert("Please log in to submit a review.");
      navigate("/login");
      return;
    }
    if (rating === null || rating === 0 || !comment) {
      alert("Please provide a rating and comment.");
      return;
    }

    if (id) {
      try {
        const result = await dispatch(
          submitReview({ productId: id, rating, comment })
        ).unwrap();
        if (result) {
          alert("Review submitted successfully!");
          setRating(0);
          setComment("");
        }
      } catch (err) {
        alert("Failed to submit review: " + err);
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        User Reviews
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">
          Average Rating: {averageRating.toFixed(1)}/5
        </Typography>
        <Rating value={averageRating} readOnly sx={{ ml: 1 }} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Write a Review</Typography>
        <Rating
          value={rating}
          onChange={(_event, newValue) => setRating(newValue)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Your Comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitReview}
            disabled={loading}
            sx={{
              backgroundColor: "#e91e63",
              color: "#fff",
              borderRadius: 8,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#d81b60",
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Review"}
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>

      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ReviewItem key={index} review={review} />
        ))
      ) : (
        <Typography>No reviews yet.</Typography>
      )}
    </Box>
  );
};

export default ReviewSection;
