'use client';

import React, { useState, useEffect } from 'react';
import Accordion from '@/components/Accordion';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';

const FAQtab = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);
    
      try {
        const response = await fetch("https://refashioned.onrender.com/api/faqs/");
        
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
    
        const responseData = await response.json();
        console.log("API Response:", responseData);
    
        if (Array.isArray(responseData.data)) {
          setFaqs(responseData.data);
        } else {
          throw new Error("Invalid response format: Expected an array in 'data' property");
        }
      } catch (err) {
        setError(err.message);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFaqs();
  }, []);

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">Error: {error}</p>;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      {/* <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2> */}
      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((faq) => (
          <Accordion key={faq.id} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQtab;