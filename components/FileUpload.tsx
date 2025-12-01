// components/FileUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Video, Music, File as FileIcon, Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
  size: number;
}

interface FileUploadProps {
  onUploadSuccess?: (file: UploadedFile) => void;
  onUploadMultipleSuccess?: (files: UploadedFile[]) => void;
  accept?: string;
  maxSize?: number; // en MB
  multiple?: boolean;
  className?: string;
}

export default function FileUpload({
  onUploadSuccess,
  onUploadMultipleSuccess,
  accept = 'image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx',
  maxSize = 50,
  multiple = false,
  className = '',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);

    // Vérifier la taille
    const oversizedFiles = fileArray.filter(
      (file) => file.size > maxSize * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      toast.error(`Fichier(s) trop volumineux. Taille max : ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      if (multiple) {
        fileArray.forEach((file) => {
          formData.append('files', file);
        });

        const response = await api.post('/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setUploadedFiles([...uploadedFiles, ...response.data]);
        toast.success(`${response.data.length} fichier(s) uploadé(s)`);

        if (onUploadMultipleSuccess) {
          onUploadMultipleSuccess(response.data);
        }
      } else {
        formData.append('file', fileArray[0]);

        const response = await api.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setUploadedFiles([...uploadedFiles, response.data]);
        toast.success('Fichier uploadé avec succès');

        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <ImageIcon className="h-8 w-8 text-blue-600" />;
      case 'VIDEO':
        return <Video className="h-8 w-8 text-purple-600" />;
      case 'AUDIO':
        return <Music className="h-8 w-8 text-green-600" />;
      case 'DOCUMENT':
        return <FileText className="h-8 w-8 text-orange-600" />;
      default:
        return <FileIcon className="h-8 w-8 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Zone de drop */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Upload en cours...</p>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cliquez ou glissez vos fichiers ici
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {multiple ? 'Plusieurs fichiers acceptés' : 'Un seul fichier accepté'} • Max {maxSize}MB
            </p>
          </>
        )}
      </div>

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Fichiers uploadés ({uploadedFiles.length})
          </h3>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.filename}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}${file.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Voir
              </a>
              <button
                onClick={() => removeFile(index)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}