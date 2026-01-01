'use client';

import NextLink from 'next/link';
import { ComponentProps, ReactNode } from 'react';

type NextLinkProps = ComponentProps<typeof NextLink>;

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
 * 外部リンク（URL表示用）
 * アイコン付き、青色、ホバーで下線
 */
interface ExternalLinkProps extends BaseLinkProps {
  href: string;
}

export function ExternalLink({ href, children, className = '' }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-500 hover:underline transition-colors ${className}`}
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

/**
 * テキスト内リンク（コンテンツ用）
 * 青色、下線付き
 */
interface TextLinkProps extends BaseLinkProps {
  href: string;
  external?: boolean;
}

export function TextLink({ href, children, className = '', external = false }: TextLinkProps) {
  const baseClass = `text-blue-400 underline hover:text-blue-500 transition-colors break-all ${className}`;
  
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={baseClass}>
      {children}
    </NextLink>
  );
}
