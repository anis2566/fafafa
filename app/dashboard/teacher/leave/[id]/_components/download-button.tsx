"use client"

import React from 'react';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Props {
    url: string;
}

export const DownloadButton = ({ url }: Props) => {
    const handleDownload = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error downloading file');
            }
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = url.split('/').pop() || 'download';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    return (
        <Button onClick={handleDownload} className="flex items-center gap-x-2">
            <Download className="w-5 h-5" />
            Download
        </Button>
    );
};