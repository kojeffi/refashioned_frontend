"use client";

import React, { useState } from 'react';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';
import Textarea from '@/shared/TextArea/TextArea';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
  
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('https://refashioned.onrender.com/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });
  
      // Check if the response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON. Possible API error.');
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }
  
      setSuccess('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <FormItem label="Name">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            type="text"
            className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
          />
        </FormItem>
        <FormItem label="Email Address">
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            type="email"
            className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
          />
        </FormItem>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FormItem label="Phone Number">
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            type="text"
            className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
          />
        </FormItem>
        <FormItem label="Subject">
          <Input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Shoe care"
            type="text"
            className="border-neutral-300 bg-white placeholder:text-neutral-500 focus:border-primary"
          />
        </FormItem>
      </div>
      <FormItem label="Message">
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Enter your message here!"
          className="border border-neutral-300 bg-white p-4 placeholder:text-neutral-500 focus:border-primary"
          rows={6}
        />
      </FormItem>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <ButtonPrimary type="submit" disabled={loading} className="self-center">
        {loading ? 'Submitting...' : 'Submit'}
      </ButtonPrimary>
    </form>
  );
};

export default ContactForm;