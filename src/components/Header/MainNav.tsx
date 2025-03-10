'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaRegBell } from 'react-icons/fa6';
import { RiSearch2Line } from 'react-icons/ri';

import ButtonCircle3 from '@/shared/Button/ButtonCircle3';
import Input from '@/shared/Input/Input';
import Logo from '@/shared/Logo/Logo';

import CartSideBar from '../CartSideBar';
import MenuBar from './MenuBar';

const MainNav = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('https://refashioned.onrender.com/api/profile/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Unauthorized');

        const data = await response.json();
        if (data.profile) setProfile(data.profile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile');
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setProfile(null);
    router.push('/login');
  };

  const getProfileImage = () => {
    return profile?.profile_image
      ? `https://res.cloudinary.com/dnqsiqqu9/${profile.profile_image}`
      : '/images/avatar.png';
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://refashioned.onrender.com/api/products/search/?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error('Failed to fetch search results');

      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container flex items-center justify-between py-4">
      <div className="flex-1 lg:hidden">
        <MenuBar />
      </div>
      <div className="flex items-center gap-5 lg:basis-[60%]">
        <Logo />
        <div className="hidden w-full max-w-2xl items-center gap-5 rounded-full border border-neutral-300 py-1 pr-3 lg:flex">
          <Input
            type="text"
            className="border-transparent bg-white placeholder:text-neutral-500 focus:border-transparent"
            placeholder="try 'Nike Air Jordan'"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <RiSearch2Line className="text-2xl text-neutral-500" />
        </div>
      </div>

      {searchQuery && (
        <div className="absolute left-0 right-0 top-16 z-50 mx-auto mt-2 w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
          {isSearching ? (
            <div className="p-4 text-center">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-100"
                >
                  <Image
                      src={
                        product.images?.[0]?.image
                          ? `https://res.cloudinary.com/dnqsiqqu9/${product.images[0].image}`
                          : '/images/placeholder.png'
                      }
                      alt={product.product_name}
                      width={50}
                      height={50}
                      className="rounded-lg"
                    />

                  <div>
                    <p className="font-semibold">{product.product_name}</p>
                    <p className="text-sm text-neutral-500">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">No results found.</div>
          )}
        </div>
      )}

      <div className="flex flex-1 items-center justify-end gap-5">
        <div className="relative hidden lg:block">
          <span className="absolute -top-1/4 left-3/4 aspect-square w-3 rounded-full bg-red-600" />
          <FaRegBell className="text-2xl" />
        </div>

        <div className="flex items-center divide-x divide-neutral-300">
          <CartSideBar />
          <div className="flex items-center gap-2 pl-5">
            <Link href="/profile">
              <ButtonCircle3 className="overflow-hidden bg-gray cursor-pointer" size="w-10 h-10">
                {loading ? (
                  <div className="w-10 h-10 animate-pulse bg-gray-300 rounded-full"></div>
                ) : (
                  <Image
                    src={getProfileImage()}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover object-center rounded-full"
                  />
                )}
              </ButtonCircle3>
            </Link>
            {loading ? (
              <p>Loading...</p>
            ) : error || !profile ? (
              <Link href="/login" className="text-sm lg:block">
                Login
              </Link>
            ) : (
              <div className="flex flex-col">
                <span className="hidden text-sm lg:block">
                  {profile.user?.first_name} {profile.user?.last_name}
                </span>
                <button onClick={handleLogout} className="text-xs text-red-500">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
