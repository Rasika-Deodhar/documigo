import { FC, useState, useRef, useEffect } from 'react';
import './uploadDocument.css';
import PDFViewerCustom from '../PDFViewerCustom/PDFViewerCustom';


const UploadDocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  handleExtractAndSend();
  }, [file, fileUrl]); 

  // Extract text from file and send to backend
  const handleExtractAndSend = async () => {
    console.log('Starting text extraction and sending to backend...', file, fileUrl);
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create FormData to send file to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:5000/api/read-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setExtractedText(data.content);
        console.log('Extracted text:', data.content);
        console.log('Summary text:', data.summary);
      }
    } catch (err) {
      setError(`Failed to extract text: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent default behavior and show drag feedback
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle the dropped file(s)
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Access the files via the dataTransfer object
    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles && droppedFiles.length > 0) {
      // For this example, we take the first file.
      // You can process multiple files by iterating through droppedFiles.
      const droppedFile = droppedFiles[0];
      setFile(droppedFile);
      // Create a Blob URL from the File object for react-pdf to read
      const url = URL.createObjectURL(droppedFile);
      setFileUrl(url);
      console.log('Dropped file:', droppedFile.name);
      
      // Clear dataTransfer data after processing
      e.dataTransfer.clearData(); 
    }
  };


  return (
    <div className='document'
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => { handleDrop(e); handleExtractAndSend(); }}
      style={{
        border: `2px dashed ${isDragging ? 'steelblue' : '#ccc'}`,
        padding: '20px',
        textAlign: 'center',
        borderRadius: '10px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        cursor: 'pointer',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <p>
        **{isDragging ? 'Release to drop file' : 'Drag and drop file here'}**
      </p>
      {file && fileUrl && (
        <div style={{ 
          width: '100%', 
          maxWidth: '90%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ 
            flex: 1, 
            overflow: 'auto',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}>
            <PDFViewerCustom fileUrl={fileUrl} fileName={file.name} />
          </div>
          {/* <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center', flexShrink: 0 }}>
            <button
              onClick={handleExtractAndSend}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: isLoading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
              }}
            >
              {isLoading ? 'Extracting...' : 'Extract & Send to Backend'}
            </button>
          </div>
          {error && (
            <div style={{ marginTop: '10px', color: 'red', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px', flexShrink: 0 }}>
              {error}
            </div>
          )}
          {extractedText && (
            <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px', maxHeight: '25vh', overflow: 'auto', flexShrink: 0 }}>
              <strong>Extracted Text:</strong>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginTop: '10px' }}>
                {extractedText}
              </pre>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default UploadDocument;
