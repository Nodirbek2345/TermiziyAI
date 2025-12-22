'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';

interface MediaUploaderProps {
    onUploadSuccess: () => void;
}

export default function MediaUploader({ onUploadSuccess }: MediaUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/media', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                onUploadSuccess();
            } else {
                setError(data.error || 'Yuklashda xatolik');
            }
        } catch (err) {
            setError('Serverga ulanishda xatolik');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Upload size={20} className="text-purple-400" />
                Media Yuklash
            </h3>

            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 hover:border-white/20'}`}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                />

                {!file ? (
                    <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <Upload className="text-white/50" />
                        </div>
                        <p className="text-sm text-white/70">Faylni tanlash uchun bosing</p>
                        <p className="text-xs text-white/30 mt-1">Rasm yoki Video (max 10MB)</p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                        <span className="text-sm text-white truncate max-w-[200px]">{file.name}</span>
                        <button
                            onClick={() => setFile(null)}
                            className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                    {error}
                </div>
            )}

            {file && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    {uploading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Yuklanmoqda...
                        </>
                    ) : (
                        <>
                            <Upload size={16} />
                            Yuklashni Boshlash
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
