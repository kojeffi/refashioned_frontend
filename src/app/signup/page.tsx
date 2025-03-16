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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const closeMessage = () => {
    setError(null);
    setSuccess(null);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : 'Invalid email address';

  const validatePassword = (password) => {
    if (password.length < 8) return 'At least 8 characters required';
    if (!/[A-Z]/.test(password)) return 'Include an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Include a lowercase letter';
    if (!/[0-9]/.test(password)) return 'Include a number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Include a special character';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError) return setEmailError(emailValidationError);
    if (passwordValidationError) return setPasswordError(passwordValidationError);
    if (password !== confirm_password) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const response = await fetch("https://refashioned.onrender.com/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, password, confirm_password })
      });

      if (!response.ok) throw new Error('Signup failed. Please try again.');

      setSuccess('Signup successful! Check your email to verify.');
      setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nc-PageSignUp flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">Create an Account</h2>

        {success && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-green-100 p-3 text-green-700">
            <span>{success}</span>
            <button onClick={closeMessage}><FaTimes /></button>
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-red-100 p-3 text-red-700">
            <span>{error}</span>
            <button onClick={closeMessage}><FaTimes /></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormItem label="First Name">
            <Input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} required />
          </FormItem>
          <FormItem label="Last Name">
            <Input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} required />
          </FormItem>
          <FormItem label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          </FormItem>
          <FormItem label="Password">
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          </FormItem>
          <FormItem label="Confirm Password">
            <Input type={showPassword ? "text" : "password"} value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </FormItem>

          <ButtonPrimary type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing up...' : 'Sign Up'}
          </ButtonPrimary>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-primary">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default PageSignUp;
