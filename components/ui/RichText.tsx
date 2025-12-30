'use client';

import { useEffect, useState } from 'react';

interface RichTextProps {
  content: string;
  className?: string;
}

export default function RichText({ content, className = '' }: RichTextProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    import('dompurify').then((DOMPurify) => {
      setSanitizedContent(DOMPurify.default.sanitize(content || '', {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'a', 'strong', 'em', 'u', 's', 'code', 'pre',
      'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'figure', 'figcaption',
      'div', 'span',
    ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class'],
        ALLOW_DATA_ATTR: false,
      }));
    });
  }, [content]);

  if (!sanitizedContent) {
    return null;
  }

  return (
    <>
      <div
        className={`rich-text ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      <style jsx global>{`
        .rich-text {
          line-height: 1.7;
          color: #374151;
        }
        
        .rich-text h1,
        .rich-text h2,
        .rich-text h3,
        .rich-text h4,
        .rich-text h5,
        .rich-text h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          color: #111827;
        }
        
        .rich-text h1 {
          font-size: 1.875rem;
        }
        
        .rich-text h2 {
          font-size: 1.5rem;
        }
        
        .rich-text h3 {
          font-size: 1.25rem;
        }
        
        .rich-text p {
          margin-bottom: 1em;
        }
        
        .rich-text ul {
          margin-bottom: 1em;
          padding-left: 1.5em;
          list-style-type: disc;
        }
        
        .rich-text ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
          list-style-type: decimal;
        }
        
        .rich-text li {
          margin-bottom: 0.25em;
        }
        
        .rich-text a {
          color: #3b82f6;
          text-decoration: underline;
          word-break: break-all;
          overflow-wrap: anywhere;
        }
        
        .rich-text a:hover {
          color: #1d4ed8;
        }
        
        .rich-text strong {
          font-weight: 600;
        }
        
        .rich-text em {
          font-style: italic;
        }
        
        .rich-text blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .rich-text code {
          background-color: #f3f4f6;
          padding: 0.125em 0.25em;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
        }
        
        .rich-text pre {
          background-color: #f3f4f6;
          padding: 1em;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .rich-text pre code {
          background-color: transparent;
          padding: 0;
        }
        
        .rich-text img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
        
        .rich-text table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        
        .rich-text th,
        .rich-text td {
          border: 1px solid #e5e7eb;
          padding: 0.5em;
          text-align: left;
        }
        
        .rich-text th {
          background-color: #f9fafb;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}