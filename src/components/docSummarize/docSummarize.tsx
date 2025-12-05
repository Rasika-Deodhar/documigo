import React, { FC } from 'react';
import styles from './docSummarize.module.css';

interface docSummarizeProps {}

const docSummarize: FC<docSummarizeProps> = () => (
  <div className={styles.docSummarize} data-testid="docSummarize">
    docSummarize Component
  </div>
);

export default docSummarize;
