import axios from 'axios';
import { ChangeEvent, FC, useEffect, useState } from 'react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const FileUploader: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textPreview, setTextPreview] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const f = e.target.files[0];
      setFile(f);

      // create object URL for preview
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);

      // if text file, read first chunk for preview
      if (f.type.startsWith('text') || f.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = String(reader.result || '');
          setTextPreview(text.slice(0, 200));
        };
        reader.readAsText(f);
      } else {
        setTextPreview(null);
      }
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('https://httpbin.org/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      setStatus('success');
      setUploadProgress(100);
    } catch {
      setStatus('error');
      setUploadProgress(0);
    }
  }

  // cleanup object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-2">
      <input type="file" onChange={handleFileChange} />

      {status === 'uploading' && (
        <div className="space-y-2">
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{uploadProgress}% uploaded</p>
        </div>
      )}

      {file && status !== 'uploading' && (
        <button onClick={handleFileUpload}>Upload</button>
      )}

      {status === 'success' && (
        <p className="text-sm text-green-600">File uploaded successfully!</p>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-600">Upload failed. Please try again.</p>
      )}

      {/* once file is uploaded display preview */}
      {status === 'success' && file && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-2">File Preview:</h4>
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
          </div>

          <div className="mt-3 file-preview">
            {file.type.startsWith('image/') && previewUrl && (
              <img src={previewUrl} alt={file.name} className="max-w-full rounded-md" />
            )}

            {file.type === 'application/pdf' && previewUrl && (
              <embed src={previewUrl} type="application/pdf" width="100%" height="400px" />
            )}

            {textPreview && (
              <pre className="whitespace-pre-wrap text-sm text-gray-800 mt-2">{textPreview}</pre>
            )}

            {!previewUrl && !textPreview && (
              <p className="text-sm text-gray-600">Preview not available for this file type.</p>
            )}
          </div>
        </div>
      )}
    </div>
    
  );
}

export default FileUploader;