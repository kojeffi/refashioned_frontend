"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { FaGoogle, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';

const PageSignUp = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const closeMessage = () => {
    setError(null);
    setSuccess(null);
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character.';
    }
    return null;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const passwordValidationError = validatePassword(password);
    const emailValidationError = validateEmail(email);

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (password !== confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const requestBody = JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        confirm_password,
      });

      console.log("📤 Sending Request:", requestBody);

      const response = await fetch("https://refashioned.onrender.com/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      console.log("📥 Response Status:", response.status);

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorMessage = "Signup failed.";

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("❌ Error Response JSON:", errorData);
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          const errorText = await response.text();
          console.error("❌ Error Response Text:", errorText);
          errorMessage = "Server error. Please try again.";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Success Response:", data);

      setSuccess("Signup successful! Please check your email to verify your account.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nc-PageSignUp relative" data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold md:text-5xl">
          Signup
        </h2>
        <div className="mx-auto max-w-md">
          <div className="space-y-6">
            <ButtonSecondary className="flex w-full items-center gap-3 border-2 border-primary text-primary">
              <FaGoogle className="text-2xl" /> Continue with Google
            </ButtonSecondary>
            <div className="relative text-center">
              <span className="relative z-10 inline-block rounded-full bg-gray px-4 text-sm font-medium">OR</span>
              <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border border-neutral-300" />
            </div>

            {/* Success Message */}
            {success && (
              <div className="fixed top-5 left-1/2 z-50 w-96 -translate-x-1/2 rounded-lg bg-green-100 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-green-700">{success}</p>
                  <button onClick={closeMessage} className="text-green-700 hover:text-green-900">
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="fixed top-5 left-1/2 z-50 w-96 -translate-x-1/2 rounded-lg bg-red-100 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-red-700">{error}</p>
                  <button onClick={closeMessage} className="text-red-700 hover:text-red-900">
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              <FormItem label="First Name">
                <Input
                  type="text"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  placeholder="John"
                  required
                />
              </FormItem>
              <FormItem label="Last Name">
                <Input
                  type="text"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  placeholder="Doe"
                  required
                />
              </FormItem>

              <FormItem label="Email address">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(validateEmail(e.target.value));
                  }}
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  placeholder="example@example.com"
                  required
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </FormItem>

              <FormItem label="Password">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(validatePassword(e.target.value));
                    }}
                    rounded="rounded-full"
                    sizeClass="h-12 px-4 py-3"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </FormItem>

              <FormItem label="Confirm Password">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirm_password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    rounded="rounded-full"
                    sizeClass="h-12 px-4 py-3"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </FormItem>

              <ButtonPrimary type="submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Continue'}
              </ButtonPrimary>
            </form>
            <span className="block text-center text-sm text-neutral-500">
              Already have an account?{' '}
              <Link href="/login" className="text-primary">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;