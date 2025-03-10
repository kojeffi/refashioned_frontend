'use client';

import { useState } from 'react';
import { FaPaypal, FaRegCreditCard } from 'react-icons/fa6';
import { MdOutlineCreditScore, MdPayment } from 'react-icons/md';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';
import Radio from '@/shared/Radio/Radio';

interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
  authToken: string | null; // Add authToken as a prop
  totalPrice: number; // Add totalPrice as a prop
}

const PaymentMethod: React.FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  authToken,
  totalPrice,
}) => {
  const [methodActive, setMethodActive] = useState<'Credit-Card' | 'PayPal' | 'M-Pesa'>('Credit-Card');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Function to validate authentication before payment
  const checkAuth = () => {
    if (!authToken) {
      alert('Authentication required. Please log in again.');
      console.error('Auth token is missing!');
      return false;
    }
    console.log('Auth Token:', authToken);
    return true;
  };

  // Handle Stripe payment (Credit Card)
  const handleStripePayment = async () => {
    if (!checkAuth()) return;

    try {
      const response = await fetch('https://refashioned.onrender.com/api/payment/stripe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ amount: totalPrice, currency: 'USD' }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Payment successful');
      } else {
        alert(`Payment failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // Handle PayPal payment
  const handlePayPalPayment = async () => {
    if (!checkAuth()) return;

    try {
      const response = await fetch('https://refashioned.onrender.com/api/payment/paypal/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ amount: totalPrice, currency: 'USD' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        alert('Payment successful');
      } else {
        alert(`Payment failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // Handle M-Pesa payment
  const handleMpesaPayment = async () => {
    if (!checkAuth()) return;
  
    // Validate and format the phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number.');
      return;
    }
  
    // Ensure totalPrice is a number (not a string)
    const amount = parseFloat(totalPrice);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount. Please enter a valid amount.');
      return;
    }
  
    // Add country code if missing (e.g., Kenya's code is 254)
    const formattedPhoneNumber = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.substring(1)}`;
  
    console.log('Sending payload:', {
      payment_method: "mpesa",
      phone_number: formattedPhoneNumber,
      amount: amount, // Send as `amount` instead of `total_amount`
    });
  
    try {
      const response = await fetch('https://refashioned.onrender.com/api/mpesa/stk-push/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          payment_method: "mpesa",
          phone_number: formattedPhoneNumber,
          amount: amount, // Send as `amount` instead of `total_amount`
        }),
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Response data:', data);
  
      if (data.success) {
        alert('Payment successful');
      } else {
        alert(`Payment failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing M-Pesa payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  
  // Render Credit Card payment form
  const renderDebitCredit = () => {
    const active = methodActive === 'Credit-Card';
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-3.5"
          name="payment-method"
          id="Credit-Card"
          defaultChecked={active}
          onChange={() => setMethodActive('Credit-Card')}
        />
        <div className="flex-1">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div
              className={`rounded-xl border-2 p-2.5 ${
                active ? 'border-primary' : 'border-neutral-300'
              }`}
            >
              <FaRegCreditCard className="text-3xl" />
            </div>
            <p className="font-medium">Debit / Credit Card</p>
          </div>

          <div
            className={`mb-4 mt-6 space-y-3 sm:space-y-5 ${
              active ? 'block' : 'hidden'
            }`}
          >
            <div className="max-w-lg">
              <FormItem label="Card number">
                <Input
                  autoComplete="off"
                  rounded="rounded-lg"
                  sizeClass="h-12 px-4 py-3"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  type="text"
                />
              </FormItem>
            </div>
            <div className="max-w-lg">
              <FormItem label="Card holder name">
                <Input
                  autoComplete="off"
                  rounded="rounded-lg"
                  sizeClass="h-12 px-4 py-3"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  type="text"
                />
              </FormItem>
            </div>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <div className="sm:w-2/3">
                <FormItem label="Expiration date (MM/YY)">
                  <Input
                    autoComplete="off"
                    rounded="rounded-lg"
                    sizeClass="h-12 px-4 py-3"
                    className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                    placeholder="MM/YY"
                  />
                </FormItem>
              </div>
              <div className="flex-1">
                <FormItem label="CVC">
                  <Input
                    autoComplete="off"
                    rounded="rounded-lg"
                    sizeClass="h-12 px-4 py-3"
                    className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                    placeholder="CVC"
                  />
                </FormItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render PayPal payment form
  const renderPayPal = () => {
    const active = methodActive === 'PayPal';
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-3.5"
          name="payment-method"
          id="PayPal"
          defaultChecked={active}
          onChange={() => setMethodActive('PayPal')}
        />
        <div className="flex-1">
          <div className="flex items-center space-x-4 sm:space-x-6 ">
            <div
              className={`rounded-xl border-2 p-2.5 ${
                active ? 'border-primary' : 'border-neutral-300'
              }`}
            >
              <FaPaypal className="text-3xl" />
            </div>
            <p className="font-medium">PayPal</p>
          </div>
          <div className={`mb-4 mt-6 space-y-6 ${active ? 'block' : 'hidden'}`}>
            <div className="max-w-lg">
              <FormItem label="PayPal email">
                <Input
                  autoComplete="off"
                  rounded="rounded-lg"
                  sizeClass="h-12 px-4 py-3"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  type="text"
                />
              </FormItem>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render M-Pesa payment form
  const renderMpesa = () => {
    const active = methodActive === 'M-Pesa';
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-3.5"
          name="payment-method"
          id="M-Pesa"
          defaultChecked={active}
          onChange={() => setMethodActive('M-Pesa')}
        />
        <div className="flex-1">
          <div className="flex items-center space-x-4 sm:space-x-6 ">
            <div
              className={`rounded-xl border-2 p-2.5 ${
                active ? 'border-primary' : 'border-neutral-300'
              }`}
            >
              <MdPayment className="text-3xl" />
            </div>
            <p className="font-medium">M-Pesa</p>
          </div>
          <div className={`mb-4 mt-6 space-y-6 ${active ? 'block' : 'hidden'}`}>
            <div className="max-w-lg">
              <FormItem label="Phone number">
                <Input
                  autoComplete="off"
                  rounded="rounded-lg"
                  sizeClass="h-12 px-4 py-3"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </FormItem>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-neutral-300 ">
      <div className="flex flex-col items-start p-6 sm:flex-row">
        <span className="hidden sm:block">
          <MdOutlineCreditScore className="text-3xl text-primary" />
        </span>
        <div className="flex w-full items-center justify-between">
          <div className="sm:ml-8">
            <h3 className="uppercase tracking-tight">PAYMENT METHOD</h3>
            <div className="mt-1 text-sm font-semibold">
              <span className="">PayPal</span>
              <span className="ml-3">xxx-xxx-xx55</span>
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
        className={`space-y-6 border-t border-neutral-300 px-6 py-7 ${
          isActive ? 'block' : 'hidden'
        }`}
      >
        {/* Render all payment methods */}
        {renderDebitCredit()}
        {renderPayPal()}
        {renderMpesa()}

        <div className="flex pt-6">
          <ButtonPrimary
            className="w-full max-w-[240px]"
            onClick={() => {
              if (methodActive === 'Credit-Card') {
                handleStripePayment();
              } else if (methodActive === 'PayPal') {
                handlePayPalPayment();
              } else if (methodActive === 'M-Pesa') {
                handleMpesaPayment();
              }
            }}
          >
            Confirm order
          </ButtonPrimary>

          <ButtonSecondary className="ml-3" onClick={onCloseActive}>
            Cancel
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;