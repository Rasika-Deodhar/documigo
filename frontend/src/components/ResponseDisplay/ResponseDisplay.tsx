import { FC, useState } from 'react';

const ResponseDisplay: FC<{ response: string }> = ({ response }) => {

  return (
    <div className='container'>
      Response would be shown here!
      {response}
    </div>
  );
};

export default ResponseDisplay;
