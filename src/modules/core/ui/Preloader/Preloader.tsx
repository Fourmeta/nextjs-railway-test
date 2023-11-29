import React from 'react';

import classNames from 'classnames';

const Preloader = () => (
  <div className='fixed right-0 top-0 z-50 flex h-screen w-screen items-center justify-center'>
    <div
      className={classNames(
        'h-20 w-20 animate-spin rounded-full',
        'border border-solid border-primary-700 border-t-transparent',
      )}
    />
  </div>
);

export default Preloader;
