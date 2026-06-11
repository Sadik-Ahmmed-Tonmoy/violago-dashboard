"use client";

import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
    const router = useRouter();
    const token = useAppSelector(selectCurrentToken);
    console.log(token);
    useEffect(() => {
        if (token) {
            router.replace("/dashboard/users");
        } else {
            router.replace("/auth/login");
        }
    }, [token, router]);


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-2xl font-bold">
           Loading...
        </div>
    );
};

export default DashboardPage;