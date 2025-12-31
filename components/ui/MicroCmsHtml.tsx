'use client';

import { useEffect, useState } from 'react';

interface MicroCmsHtmlProps {
  html: string;
  className?: string;
}

/**
 * microCMSから取得したHTMLを安全に表示するコンポーネント
 * DOMPurifyでサニタイズしてXSS対策を行う
 */
export const MicroCmsHtml = ({ html, className = '' }: MicroCmsHtmlProps) => {
  const [sanitized, setSanitized] = useState('');

  useEffect(() => {
    import('dompurify').then((DOMPurify) => {
      setSanitized(DOMPurify.default.sanitize(html, {
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
  }, [html]);

  if (!sanitized) {
    return null;
  }

  return (
    <div
      className={`microcms-html ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default MicroCmsHtml;
