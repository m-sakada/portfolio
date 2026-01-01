'use client';

import NextLink from 'next/link';
import { ReactNode } from 'react';

interface BaseLinkProps {
  children: ReactNode;
  className?: string;
}

/**
 * ナビゲーションリンク（ヘッダー用）
 * 下線なし、グレー系、ホバーで濃くなる
 */
interface NavLinkProps extends BaseLinkProps {
  href: string;
  onClick?: () => void;
}

export function NavLink({ href, children, className = '', onClick }: NavLinkProps) {
  return (
    <NextLink
      href={href}
      className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </NextLink>
  );
}

/**
 * テキストリンク
 * external=true で外部リンク（アイコン付き、新しいタブで開く）
 */
interface TextLinkProps extends BaseLinkProps {
  href: string;
  external?: boolean;
}

export function TextLink({ href, children, className = '', external = false }: TextLinkProps) {
  const baseClass = `text-blue-400 hover:text-blue-500 transition-colors break-all ${className}`;
  
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 hover:underline ${baseClass}`}
      >
        <span className="break-all">{children}</span>
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    );
  }

  return (
    <NextLink href={href} className={`underline ${baseClass}`}>
      {children}
    </NextLink>
  );
}
