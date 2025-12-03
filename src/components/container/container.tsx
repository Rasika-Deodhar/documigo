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

        {/* <div className={styles.filePreview} data-testid="file-preview">
          <div className={styles.fileCard}>
            <div className={styles.fileMeta}>
              <div className={styles.fileIcon}>PDF</div>
              <div>
                <div className={styles.fileName}>Annual Report 2024.pdf</div>
                <div className={styles.fileInfo}>2.4 MB • 24 pages</div>
              </div>
            </div>
            <div className={styles.fileSummary}>
              <strong>Executive Summary</strong>
              <p>
                This annual report presents our company's financial performance and strategic
                initiatives for the fiscal year 2024. Our revenue increased by 23% compared to
                the previous year, driven by strong growth in our digital transformation
                services.
              </p>
            </div>
          </div>
        </div> */}
      </aside>

      <main className={styles.rightColumn} data-testid="right-column">
        <section className={styles.actionsSection} data-testid="actions-section">
          <h3 className={styles.sectionTitle}>AI Document Assistant</h3>
          <div className={styles.actionButtons}>
            <button className={styles.btnPrimary} onClick={handleSummarize}>Summarize Document</button>
            <button className={styles.btnAccent}>Extract Key Points</button>
            <button className={styles.btnPurple}>Ask Questions</button>
            <button className={styles.btnOrange}>Analyze Data</button>
            <button className={styles.btnDanger}>Find Issues</button>
            <button className={styles.btnMuted}>Translate</button>
          </div>
        </section>

        <section className={styles.responseSection} data-testid="response-section">
          <div className={styles.chatHeader}>
            <div className={styles.botIntro}>Hello! I've analyzed your Annual Report 2024.pdf. I can help you summarize content, extract key insights, answer questions, or analyze specific sections.</div>
          </div>

          <div className={styles.chatArea} aria-live="polite">
            <div className={styles.assistantBubble}>Hello! I've analyzed your Annual Report 2024.pdf. I can help you summarize content, extract key insights, answer questions, or analyze specific sections. What would you like to explore?</div>
            {response && <div className={styles.userBubble}>{response}</div>}
          </div>

          <div className={styles.inputArea}>
            <textarea placeholder="Ask anything about your document..." className={styles.textarea} />
            <div className={styles.inputActions}>
              <button className={styles.sendBtn} onClick={handleSummarize}>Send</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Container;
