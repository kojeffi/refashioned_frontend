"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const uidb64 = searchParams.get("uidb64");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!uidb64 || !token) {
      setStatus("error");
      setMessage("Invalid or missing verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const apiUrl = `https://refashioned.onrender.com/api/activate/${uidb64}/${token}/`;
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl, { method: "GET" });

        if (!response.ok) {
          throw new Error("Verification failed. Please try again.");
        }

        const responseData = await response.json();
        setStatus("success");
        setMessage(responseData.message || "Email verified successfully!");

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [uidb64, token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-md text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <FaSpinner className="text-blue-500 text-3xl animate-spin mb-2" />
            <p>Verifying your email...</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-2" />
            <p className="text-green-600">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        )}
        {status === "error" && (
          <div>
            <FaTimesCircle className="text-red-500 text-3xl mx-auto mb-2" />
            <p className="text-red-600">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
