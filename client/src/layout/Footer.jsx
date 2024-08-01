import React from 'react';

import { Place, MailOutline, LocalPhone, LinkedIn, Home, Google } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className='p-8 grid gap-x-16 gap-y-4 md:grid-cols-3'>
      <div>
        <h1 className='font-bold text-3xl uppercase mb-4 tracking-wider'>
          <a href=''>Trace</a>
        </h1>
        <p className='mr-4'>
          This traceability tool enhances automotive project management with comprehensive traceability and efficient document handling, ensuring industry compliance.
        </p>
      </div>
      <div>
        <h2 className='font-bold text-2xl mb-4 tracking-wider'>Useful Links</h2>
        <div className='grid grid-cols-2'>
          <ul>
            <li>
            < Home className='ho' />
              <a href=''>Home</a>
            </li>
            <li>
            < Google className='go' />
              <a href='https://www.cascoauto.com/'>Our website</a>
            </li>
            <li> 
              <LinkedIn className='li' />
              <a href='https://www.linkedin.com/company/62605/'>Our LinkedIN</a> 
              </li>

          </ul>
        </div>
      </div>
      <div>
        <h2 className='font-bold text-2xl mb-4 tracking-wider'>Contact</h2>
        <ul>
          <li>
            <Place className='mr-4' />
            <span>Züricher Strasse 3
              D 60437 Frankfurt am Main
              Germany</span>
          </li>
          <li>
            <LocalPhone className='mr-4' />
            <span>+49 69 50064 100</span>
          </li>
          <li>
            <MailOutline className='mr-4' />
            <span>info@cascoauto.com</span>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
