import React from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import "./UserReviews.scss";

const reviews = [
  {
    name: "Nguyen Ba Hoang Kim",
    role: "Badminton Enthusiast",
    avatar: "https://randomuser.me/api/portraits/men/26.jpg",
    review:
      "The rackets I bought here are top-notch! They improved my game significantly, and the delivery was super fast. Highly recommend this store for badminton gear!",
  },
  {
    name: "Vu Khanh Huyen",
    role: "Amateur Player",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    review:
      "I love the variety of badminton shoes available. The pair I got is so comfortable and stylish. The customer service team was also very helpful!",
  },
  {
    name: "Tran Duy Khanh",
    role: "Professional Player",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "This store has the best selection of badminton accessories. The grips and strings I purchased are of great quality, and the prices are very competitive!",
  },
];

const UserReviews: React.FC = () => {
  return (
    <Container className="reviews-container">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        className="reviews-title"
      >
        What Our Customers Say
      </Typography>
      <Typography
        variant="body1"
        align="center"
        className="reviews-subtitle"
        gutterBottom
      >
        Hear from our happy customers who love our badminton products and
        services.
      </Typography>

      <Grid container spacing={4} className="reviews-grid">
        {reviews.map((review, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card className="review-card">
              <CardContent>
                <Typography variant="body1" className="review-text">
                  "{review.review}"
                </Typography>
                <div className="reviewer-info">
                  <Avatar src={review.avatar} className="reviewer-avatar" />
                  <div>
                    <Typography variant="h6" className="reviewer-name">
                      {review.name}
                    </Typography>
                    <Typography variant="body2" className="reviewer-role">
                      {review.role}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserReviews;
