import { Box, Typography } from "@mui/material";
import ReviewItem from "./reviewItem";

interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

const reviews: Review[] = [
  {
    user: "Hehe",
    rating: 5,
    comment: "Great product! Highly recommend.",
    date: "2023-10-01",
  },
  {
    user: "Keke",
    rating: 4,
    comment: "Very good quality, but a bit expensive.",
    date: "2023-09-25",
  },
  {
    user: "Lele",
    rating: 3,
    comment: "Average product, nothing special.",
    date: "2023-09-20",
  },
];

const ReviewList = () => {
  return (
    <Box className="reviews-section" mt={4}>
      <Typography variant="h5" mb={2}>
        User Reviews
      </Typography>
      {reviews.map((review, index) => (
        <ReviewItem key={index} review={review} />
      ))}
    </Box>
  );
};

export default ReviewList;
