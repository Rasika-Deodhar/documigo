import React, { FC, useState, useRef } from 'react';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';

interface DocUploadProps {}

interface FileData {
  file: File;
  id: string;
  name: string;
  size: string;
  status: 'ready' | 'uploading' | 'complete' | 'error';
  progress: number;
}

const DocUpload: FC<DocUploadProps> = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e:any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e:any) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e:any) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e:any) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles:any) => {
    const filesWithMetadata = newFiles.map((file:any) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      status: 'ready',
      progress: 0
    }));
    
    setFiles((prev) => [...prev, ...filesWithMetadata]);
  };

  const formatFileSize = (bytes:any) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFiles = () => {
    files.forEach((fileData) => {
      if (fileData.status === 'ready') {
        simulateUpload(fileData.id);
      }
    });
  };

  const simulateUpload = (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );

    const interval = setInterval(() => {
      setFiles((prev) => {
        const file = prev.find((f) => f.id === id);
        if (!file || file.progress >= 100) {
          clearInterval(interval);
          return prev.map((f) =>
            f.id === id ? { ...f, status: 'complete', progress: 100 } : f
          );
        }
        return prev.map((f) =>
          f.id === id ? { ...f, progress: Math.min(f.progress + 10, 100) } : f
        );
      });
    }, 200);
  };

  const getStatusIcon = (status: 'ready' | 'uploading' | 'complete' | 'error') => {
    if (status === 'complete') return <Check className="w-5 h-5 text-green-500" />;
    if (status === 'error') return <AlertCircle className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Upload Files</h1>
          <p className="text-gray-600">Drag and drop your files or click to browse</p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 scale-105'
              : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${
              isDragging ? 'bg-indigo-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-12 h-12 transition-colors duration-300 ${
                isDragging ? 'text-indigo-600' : 'text-gray-400'
              }`} />
            </div>
            
            <p className="text-xl font-semibold text-gray-700 mb-2">
              {isDragging ? 'Drop files here' : 'Choose files or drag here'}
            </p>
            <p className="text-sm text-gray-500">
              Supports all file types • Max 100MB per file
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Files ({files.length})
              </h2>
              {files.some(f => f.status === 'ready') && (
                <button
                  onClick={uploadFiles}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Upload All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {files.map((fileData) => (
                <div
                  key={fileData.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getStatusIcon(fileData.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {fileData.name}
                        </p>
                        <p className="text-sm text-gray-500">{fileData.size}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFile(fileData.id)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>

                  {fileData.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileData.progress}%` }}
                      />
                    </div>
                  )}

                  {fileData.status === 'complete' && (
                    <p className="text-sm text-green-600 font-medium">
                      Upload complete
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocUpload;
