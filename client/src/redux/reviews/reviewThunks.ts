import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

interface SubmitReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

interface ReviewResponse {
  message: string;
  review: Review;
}

interface Review {
  userId?: string | null;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export const submitReview = createAsyncThunk<
  ReviewResponse,
  SubmitReviewPayload,
  { rejectValue: string }
>(
  "reviews/submitReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ReviewResponse>(
        `/products/${productId}/reviews`,
        { rating, comment }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);
