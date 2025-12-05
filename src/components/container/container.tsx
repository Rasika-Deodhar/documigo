import React, { FC, useState } from 'react';
import styles from './container.module.css';
import DocUpload from '../docUpload/docUpload';
import DocSummarize from '../docSummarize/docSummarize';
import FileUploader from '../fileUpload/fileUploader';

interface ContainerProps {}

const Container: FC<ContainerProps> = () => {
  const [response, setResponse] = useState<string>('');

  const handleSummarize = () => {
    // Placeholder behavior: in the real app this would trigger processing
    setResponse('Summary result will appear here. (placeholder)');
  };

  const handleClear = () => {
    setResponse('');
  };

  return (
    <div className={styles.container} data-testid="container">
      <aside className={styles.leftColumn} data-testid="left-column">
        <div className={styles.uploadSection} data-testid="upload-section">
          <h3 className={styles.sectionTitle}>Document</h3>
          <FileUploader />
        </div>
      </aside>

      <main className={styles.rightColumn} data-testid="right-column">
        <section className={styles.actionsSection} data-testid="actions-section">
          <h3 className={styles.sectionTitle}>AI Document Assistant</h3>
          <div className={styles.actionButtons}>
            <button className={styles.btnPrimary} onClick={handleSummarize}>Summarize Document</button>
            {/* <button className={styles.btnAccent}>Extract Key Points</button>
            <button className={styles.btnPurple}>Ask Questions</button>
            <button className={styles.btnOrange}>Analyze Data</button>
            <button className={styles.btnDanger}>Find Issues</button>
            <button className={styles.btnMuted}>Translate</button> */}
          </div>
        </section>

        <section className={styles.responseSection} data-testid="response-section">

          <div className={styles.chatArea} aria-live="polite">
            {response && <div className={styles.btnAccent}>{response}</div>}
          </div>

          {/* <div className={styles.inputArea}>
            <textarea placeholder="Ask anything about your document..." className={styles.textarea} />
            <div className={styles.inputActions}>
              <button className={styles.sendBtn} onClick={handleSummarize}>Send</button>
            </div>
          </div> */}
        </section>
      </main>
    </div>
  );
};

export default Container;
