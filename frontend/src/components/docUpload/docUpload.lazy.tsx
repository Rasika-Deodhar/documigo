import React, { lazy, Suspense } from 'react';

const LazydocUpload = lazy(() => import('./docUpload'));

const docUpload = (props: React.ComponentProps<'div'>) => (
  <Suspense fallback={null}>
    <LazydocUpload {...props} />
  </Suspense>
);

export default docUpload;
