"use client"

import Link from 'next/link';

const PasswordResetDone = () => {
  return (
    <div className="container mx-auto mt-20 max-w-2xl text-center">
      <h2 className="text-3xl font-semibold md:text-5xl">Check Your Email</h2>
      <p className="mt-6 text-lg text-neutral-600">
        If an account exists with the provided email, a password reset link has been sent.
      </p>
      <p className="mt-4">
        <Link href="/login" className="text-primary">
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default PasswordResetDone;
