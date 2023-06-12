import React from "react";

function Spinner() {
  return (
    <div className='flex justify-center items-center'>
      <span className='loading loading-ring loading-xs'></span>
      <span className='loading loading-ring loading-sm'></span>
      <span className='loading loading-ring loading-md'></span>
      <span className='loading loading-ring loading-lg'></span>
    </div>
  );
}

export default Spinner;
