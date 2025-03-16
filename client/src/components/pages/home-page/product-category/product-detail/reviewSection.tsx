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
import { AppDispatch } from "../../../../../redux/stores";
import { RootState } from "../../../../../redux/stores";
import axiosInstance from "../../../../../axios/axiosInstance";
import { setReviews } from "../../../../../redux/reviews/reviewSlice";
import { submitReview } from "../../../../../redux/reviews/reviewThunks";

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
  const { reviews, averageRating, loading, error } = useSelector(
    (state: RootState) => state.reviews
  );

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

  const handleSubmitReview = () => {
    if (rating === null || rating === 0 || !comment) {
      alert("Please provide a rating and comment.");
      return;
    }

    if (id) {
      dispatch(submitReview({ productId: id, rating, comment }));
      setRating(0);
      setComment("");
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitReview}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Review"}
        </Button>
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
