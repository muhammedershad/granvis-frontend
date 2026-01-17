"use client";

import Loading from "@/app/loading";
import { getCookie } from "@/lib/cookies";
import { getAuthDetails } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const isAuthenticated = useSelector(getAuthDetails);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const isAuth = isAuthenticated && accessToken;

    if (isAuth) {
      router.push("/dashboard");
    }

    setIsChecking(false);
  }, [isAuthenticated, router]);

  if (isChecking) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
