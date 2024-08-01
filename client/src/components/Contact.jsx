import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Send } from '@mui/icons-material';
import { Stack,  Button } from '@mui/material';
import { toast } from "react-toastify";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_fhj9m2a', 'template_y4cphtf', form.current, {
        publicKey: '8ODvtrEAlUsBC2lFz',
      })
      .then(
        () => {
          toast.success(`Message Sent successfuly`);
          form.current.reset(); // Clear the form fields
        },
        (error) => {
          console.log('FAILED...', error.text);
          toast.error(`Error Sending Message: ${error.text}`);
        },
      );
  };

  return (
    <section className=' py-32 px-8 '>
   
      <form ref={form} onSubmit={sendEmail} className=' overflow-hidden flex flex-col '>
        <Stack spacing={2} width='100%' maxWidth='400px'>
          <label>Name</label>
          <input type="text" name="user_name" variant='outlined'
            size='small'
            className='px-6 py-2' placeholder='Your name' required />
          <label> Email</label>
          <input type="email" name="user_email" variant='outlined'
            size='small'
            className='px-6 py-2' placeholder='Your Email' required />
          <label>Message</label>
          <textarea name="message" variant='outlined'
            size='small'
            className='px-6 py-2'
            multiline placeholder='Enter Your Message' required />

          <Button
            type="submit"
            startIcon={<Send />}
            sx={{
              bgcolor: 'teal.700',
              color: 'green',
              '&:hover': {
                bgcolor: 'teal.900',
              },
            }}
          >
            Send
          </Button>



        </Stack>
      </form>

    </section>
  );
};

export default Contact;