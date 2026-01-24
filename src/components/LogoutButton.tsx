"use client";

import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@/lib/api/apiSlice";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { deleteCookie } from "@/lib/cookies";

export default function LogoutButton() {
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await logout({}).unwrap();
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      // Clear tokens from cookies
      deleteCookie("accessToken");
      deleteCookie("refreshToken");

      // Clear Redux state
      dispatch(logoutAction());

      // Redirect to login
      window.location.href = "/";
    }
  };

  return (
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
