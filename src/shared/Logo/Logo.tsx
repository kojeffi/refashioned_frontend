import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { RiRefreshFill } from 'react-icons/ri';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = 'hidden' }) => {
  return (
    <Link className="flex cursor-pointer items-center gap-2" href="/">
      <RiRefreshFill className="text-3xl text-primary" />
      <span className={`${className} text-2xl font-bold`}>Refashioned</span>
    </Link>
  );
};

export default Logo;
