import React from 'react';
import { contactSection } from '@/data/content';
import Heading from '@/shared/Heading/Heading';

import ContactForm from './ContactForm';

const page = () => {
  return (
    <div className="container">
      <div className="mb-32 mt-20">
        <Heading isMain isCenter>
          {contactSection.heading}
        </Heading>

        <div className="mx-auto max-w-3xl rounded-3xl bg-gray p-5 md:p-10 lg:p-16">
          <ContactForm />
        </div>
      </div>

    </div>
  );
};

export default page;
