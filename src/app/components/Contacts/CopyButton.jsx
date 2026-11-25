'use client';

import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

export default function CopyButton({ text, label = 'Копировать' }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
            aria-label={label}
            type="button"
        >
            {copied ? <FaCheck size={11} /> : <FaCopy size={11} />}
            <span>{copied ? 'Скопировано' : label}</span>
        </button>
    );
}