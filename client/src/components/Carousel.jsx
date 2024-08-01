import React, { useState } from 'react';

import { ArrowLeft, ArrowRight } from '@mui/icons-material';


const CAROUSEL_DATA = [
    {
        url: 'https://img.freepik.com/premium-vector/abstract-machine-background_41981-192.jpg',
    },
    {
        url: 'https://s35804.pcdn.co/blog/wp-content/uploads/2023/05/Four-ways-Cloud-is-changing-the-ERP-channel-landscape_900x410.png',
    },
    {
        url: 'https://varteq.com/wp-content/uploads/2019/07/iot_in_automotive-680x360.jpg',
    },
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const incrementIndex = () => {
        setCurrentIndex((currentIndex) => {
            return (currentIndex + 1) % CAROUSEL_DATA.length;
        });
    };

    const decrementIndex = () => {
        setCurrentIndex((currentIndex) => {
            return currentIndex === 0 ? CAROUSEL_DATA.length - 1 : currentIndex - 1;
        });
    };

    return (
        <section className='h-carousel relative bg-red-300'>
            <div
                onClick={decrementIndex}
                className='w-12 h-12 rounded-full bg-gray-100/50 absolute top-1/2 left-4 cursor-pointer z-10'
            >
                <ArrowLeft className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2' />
            </div>
            <img
                src={CAROUSEL_DATA[currentIndex].url}
                className='w-full h-full object-cover z-0'
            />
            <div className='absolute h-full w-full top-0 left-0 bg-black/30'>
                <div className='absolute h-full w-full top-0 left-0 flex flex-col justify-center items-center text-white uppercase px-4 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold mb-8'>Traceability</h1>
                    <p className='tracking-wider mb-16 text-md md:text-xl'>
                        Track Your Project Requirements
                    </p>
                </div>
            </div>
            <div
                onClick={incrementIndex}
                className='w-12 h-12 rounded-full bg-gray-100/50 absolute top-1/2 right-4 cursor-pointer'
            >
                <ArrowRight className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2' />
            </div>
        </section>
    );
};

export default Carousel;