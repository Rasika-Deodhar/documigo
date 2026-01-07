import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// Import the required styles for annotations and text layers
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set the worker source for PDF.js (essential for the library to work)
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com{pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;



const PDFViewerCustom: React.FC<{ fileUrl: string; fileName?: string }> = ({ fileUrl, fileName = 'Document' }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1); // Start on the first page
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Failed to load PDF:', error);
    setError(`Failed to load PDF: ${error.message}`);
    setNumPages(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <p style={{ margin: '10px' }}><strong>File: {fileName}</strong></p>
      {error ? (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '5px', margin: '10px' }}>
          {error}
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflow: 'auto', padding: '10px', border: '1px solid #ccc' }}>
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
              <Page pageNumber={pageNumber} />
            </Document>
          </div>
          {numPages && (
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ccc', flexShrink: 0 }}>
              <p style={{ margin: '0' }}>Page {pageNumber} of {numPages}</p>
              <div>
                <button 
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber === 1}
                  style={{ marginRight: '10px', padding: '5px 10px', cursor: pageNumber === 1 ? 'not-allowed' : 'pointer' }}
                >
                  ← Previous
                </button>
                <button 
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber === numPages}
                  style={{ padding: '5px 10px', cursor: pageNumber === numPages ? 'not-allowed' : 'pointer' }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PDFViewerCustom;
