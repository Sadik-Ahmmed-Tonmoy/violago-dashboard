"use client";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
 const router = useRouter();
  const token = useAppSelector(selectCurrentToken);
  console.log(token);
  useEffect(() => {
    if (token) {
      router.replace("/dashboard/users");
    }else{
      router.replace("/auth/login");
    }
  }, [token, router]);
  return (
    <>

    </>
  );
};

export default HomePage;
