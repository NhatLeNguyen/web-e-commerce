import { Box, Typography, Rating } from "@mui/material";

interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewItemProps {
  review: Review;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <Box className="review">
      <Typography variant="body1" fontWeight="bold">
        {review.user}
        <Typography variant="caption" color="textSecondary">
          {new Date(review.date).toLocaleDateString()}
        </Typography>
      </Typography>
      <Rating value={review.rating} readOnly />
      <Typography variant="body2">{review.comment}</Typography>
    </Box>
  );
};

export default ReviewItem;
