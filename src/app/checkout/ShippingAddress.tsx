'use client';

import { useState, useEffect } from 'react';
import { TbTruckDelivery } from 'react-icons/tb';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';
import Radio from '@/shared/Radio/Radio';
import Select from '@/shared/Select/Select';

interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
  authToken: string | null; // Add authToken as a prop
}

interface ShippingAddressType {
  id: number;
  first_name: string;
  last_name: string;
  street: string;
  street_number: string;
  city: string;
  country: string;
  zip_code: string;
  phone: string;
  current_address: boolean;
}

const ShippingAddress: React.FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  authToken, // Destructure authToken from props
}) => {
  const [addresses, setAddresses] = useState<ShippingAddressType[]>([]);
  const [newAddress, setNewAddress] = useState({
    first_name: '',
    last_name: '',
    street: '',
    street_number: '',
    city: '',
    country: 'United States',
    zip_code: '',
    phone: '',
    current_address: false,
  });

  // Fetch shipping addresses from the API
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('https://refashioned.onrender.com/api/shipping-addresses/', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include authToken in headers
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }
        const data = await response.json();
        setAddresses(data);

        // If there's a default address, pre-fill the form with it
        const defaultAddress = data.find((addr: ShippingAddressType) => addr.current_address);
        if (defaultAddress) {
          setNewAddress({
            first_name: defaultAddress.first_name || '',
            last_name: defaultAddress.last_name || '',
            street: defaultAddress.street || '',
            street_number: defaultAddress.street_number || '',
            city: defaultAddress.city || '',
            country: defaultAddress.country || 'United States',
            zip_code: defaultAddress.zip_code || '',
            phone: defaultAddress.phone || '',
            current_address: defaultAddress.current_address || false,
          });
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    if (authToken) {
      fetchAddresses(); // Fetch addresses only if authToken is available
    }
  }, [authToken]); // Re-fetch when authToken changes

  // Save new shipping address
  const saveAddress = async () => {
    try {
      const response = await fetch('https://refashioned.onrender.com/api/shipping-addresses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Include authToken in headers
        },
        body: JSON.stringify(newAddress),
      });
      if (!response.ok) {
        throw new Error('Failed to save address');
      }
      const data = await response.json();
      setAddresses([...addresses, data]);
      onCloseActive();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="rounded-xl border border-neutral-300 ">
      <div className="flex flex-col items-start p-6 sm:flex-row">
        <span className="hidden sm:block">
          <TbTruckDelivery className="text-3xl text-primary" />
        </span>

        <div className="flex w-full items-center justify-between">
          <div className="sm:ml-8">
            <span className="uppercase">SHIPPING ADDRESS</span>
            <div className="mt-1 text-sm font-semibold">
              <span className="">
                {addresses.length > 0
                  ? `${addresses[0].street}, ${addresses[0].city}, ${addresses[0].country}`
                  : 'No address saved'}
              </span>
            </div>
          </div>
          <ButtonSecondary
            sizeClass="py-2 px-4"
            className="border-2 border-primary text-primary"
            onClick={onOpenActive}
          >
            Edit
          </ButtonSecondary>
        </div>
      </div>
      <div
        className={`space-y-4 border-t border-neutral-300 px-6 py-7 sm:space-y-6 ${
          isActive ? 'block' : 'hidden'
        }`}
      >
        {/* Render form fields for address */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div>
            <FormItem label="First name">
              <Input
                name="first_name"
                value={newAddress.first_name}
                onChange={handleInputChange}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="Last name">
              <Input
                name="last_name"
                value={newAddress.last_name}
                onChange={handleInputChange}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              />
            </FormItem>
          </div>
        </div>

        <div className="space-y-4 sm:flex sm:space-x-3 sm:space-y-0">
          <div className="flex-1">
            <FormItem label="Street">
              <Input
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              />
            </FormItem>
          </div>
          <div className="sm:w-1/3">
            <FormItem label="Street number">
              <Input
                name="street_number"
                value={newAddress.street_number}
                onChange={handleInputChange}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              />
            </FormItem>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div>
            <FormItem label="City">
              <Input
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="Country">
              <Select
                name="country"
                value={newAddress.country}
                onChange={handleInputChange}
                sizeClass="h-12 px-4 py-3"
                className="rounded-lg border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
                <option value="Kenya">Kenya</option>
                <option value="France">France</option>
                <option value="Germany">Germany</option>
              </Select>
            </FormItem>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div>
            <FormItem label="Zip code">
              <Input
                name="zip_code"
                value={newAddress.zip_code}
                onChange={handleInputChange}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="Phone">
              <Input
                name="phone"
                value={newAddress.phone}
                onChange={handleInputChange}
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              />
            </FormItem>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="current_address"
            checked={newAddress.current_address}
            onChange={(e) =>
              setNewAddress((prev) => ({
                ...prev,
                current_address: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label className="text-sm">Set as default address</label>
        </div>

        <ButtonPrimary className="shadow-none sm:!px-7" onClick={saveAddress}>
          Save and go to Payment
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default ShippingAddress;