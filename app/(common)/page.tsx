"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
 const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/users");
  }, []);
  return (
    <>

    </>
  );
};

export default HomePage;
