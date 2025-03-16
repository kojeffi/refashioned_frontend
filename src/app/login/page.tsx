"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import FormItem from "@/shared/FormItem";
import Input from "@/shared/Input/Input";

const PageLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("https://refashioned.onrender.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("authToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nc-PageLogin flex items-center justify-center min-h-screen" data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-10 flex items-center justify-center text-3xl font-semibold md:text-5xl">
          Login
        </h2>
        <div className="mx-auto max-w-md bg-white shadow-lg rounded-2xl p-6">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg flex justify-between">
                <span>{error}</span>
                <FaTimes className="cursor-pointer" onClick={() => setError(null)} />
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg flex justify-between">
                <span>{success}</span>
                <FaTimes className="cursor-pointer" onClick={() => setSuccess(null)} />
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid gap-6">
              <FormItem label="Email address">
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  placeholder="example@example.com"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  required
                />
              </FormItem>
              <FormItem label="Password">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    rounded="rounded-full"
                    sizeClass="h-12 px-4 py-3"
                    className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </FormItem>
              <ButtonPrimary type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Continue"}
              </ButtonPrimary>
            </form>
            <div className="flex flex-col items-center justify-center gap-2">
              <Link href="/forgot-pass" className="text-sm text-primary">
                Forgot password
              </Link>
              <span className="block text-center text-sm text-neutral-500">
                Don&apos;t have an account? {" "}
                <Link href="/signup" className="text-primary">
                  Signup
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
