"use client"


import { useState } from 'react';
import Link from 'next/link';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';
import { useRouter } from "next/navigation"; // ✅ Import correctly for App Router

const PageForgotPass = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // ✅ Initialize Next.js router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const res = await fetch('https://refashioned.onrender.com/api/password_reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      // Redirect to success page
      router.push('/password-reset-done');
    } else {
      setError(data.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mb-24 lg:mb-32">
      <header className="mx-auto mb-14 max-w-2xl text-center sm:mb-16 lg:mb-20">
        <h2 className="mt-20 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
          Forgot password
        </h2>
      </header>

      <div className="mx-auto max-w-md space-y-6">
        <form onSubmit={handleSubmit}>
          <FormItem label="Email address">
            <Input
              type="email"
              rounded="rounded-full"
              sizeClass="h-12 px-4 py-3"
              placeholder="example@example.com"
              className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormItem>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-white"
          >
            Send Reset Link
          </button>
        </form>

        <span className="block text-center text-neutral-500">
          Go back for{' '}
          <Link href="/login" className="text-primary">
            Sign in
          </Link>
          {' / '}
          <Link href="/signup" className="text-primary">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default PageForgotPass;
