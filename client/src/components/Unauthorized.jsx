import React from 'react'

const Unauthorized = () => {
  return (

<div
      className='px-6 w-full h-screen flex justify-center items-center'
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <form className='border bg-white p-6 flex flex-col items-center min-w-[17rem] sm:min-w-[22rem] md:min-w-[35rem] max-w-[25rem] flex-1'
      >
         <img src="https://help.corsair.com/hc/article_attachments/4419099562381/lcd_-_general_fault_error_icon.png"
                  alt="unauthorized" />
        <h1 className='uppercase text-xl mb-4 font-bold'>You are not authorized to access this page</h1>
        <div className='flex flex-col mb-4 w-full'>
          
        </div>
      </form>
    </div>

  )
}

export default Unauthorized