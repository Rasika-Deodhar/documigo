import React, { lazy, Suspense } from 'react';

const LazydocSummarize = lazy(() => import('./docSummarize'));

const docSummarize = (props: React.ComponentProps<'div'>) => (
  <Suspense fallback={null}>
    <LazydocSummarize {...props} />
  </Suspense>
);

export default docSummarize;
