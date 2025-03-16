import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { submitReview } from "./reviewThunks";

interface Review {
  userId?: string | null;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewResponse {
  message: string;
  review: Review;
}

interface ReviewState {
  reviews: Review[];
  averageRating: number;
  loading: boolean;
  error: string | null | undefined;
}

interface SetReviewsPayload {
  reviews: Review[];
  averageRating: number;
}

const initialState: ReviewState = {
  reviews: [],
  averageRating: 0,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<SetReviewsPayload>) => {
      state.reviews = action.payload.reviews;
      state.averageRating = action.payload.averageRating;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        submitReview.fulfilled,
        (state, action: PayloadAction<ReviewResponse>) => {
          state.loading = false;
          state.reviews.push(action.payload.review);
        }
      )
      .addCase(
        submitReview.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
