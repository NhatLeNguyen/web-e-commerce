import { useEffect, useState } from "react";

interface User {
  id?: string; // id có thể không tồn tại
  fullName: string;
  email: string;
  role: "admin" | "user" | "guest";
  avatar?: string;
  _id?: string; // _id có thể không tồn tại
}

interface AuthState {
  userId: string | null;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user: User = JSON.parse(userData);
        // Đảm bảo userId là string | null
        const userId = user.id || user._id || null;
        return {
          userId,
          isAdmin: user.role === "admin",
          user,
          loading: false,
        };
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
    return {
      userId: null,
      isAdmin: false,
      user: null,
      loading: false,
    };
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user: User = JSON.parse(userData);
          const userId = user.id || user._id || null;
          setAuthState({
            userId,
            isAdmin: user.role === "admin",
            user,
            loading: false,
          });
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          setAuthState({
            userId: null,
            isAdmin: false,
            user: null,
            loading: false,
          });
        }
      } else {
        setAuthState({
          userId: null,
          isAdmin: false,
          user: null,
          loading: false,
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return authState;
};
