import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import React from 'react';
import rehypeSlug from 'rehype-slug';
import remarkHeadingId from 'remark-heading-id';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onSectionChange?: (id: string) => void;
  selectedId?: string | null;
}

const components: Components = {
  // ── Headings ──────────────────────────────────────────────────────────────
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-mizume-secondary-foreground px-5 border-b border-md-accent/40 pb-4 mb-8 mt-10 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className="text-sm sm:text-base md:text-lg font-bold text-mizume-secondary-foreground mb-2 mx-2 sm:mx-4 md:mx-7 my-4 sm:my-6 md:my-7 px-3 sm:px-5 uppercase tracking-wide drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] border-b-2 border-md-accent/60"
    >
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="text-sm sm:text-base md:text-lg font-bold text-md-accent mb-2 mx-2 sm:mx-4 md:mx-7 my-4 sm:my-6 md:my-7 px-3 sm:px-5 uppercase tracking-wide drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] border-b-2 border-md-accent/60">
      - {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="text-base font-semibold text-md-muted mb-2 mt-6 px-5 uppercase tracking-wider">
      {children}
    </h4>
  ),

  h5: ({ children, ...props }) => (
    <h5 {...props} className="text-sm font-semibold text-md-accent mb-2 mt-5 px-5 uppercase tracking-wider">
      {children}
    </h5>
  ),

  h6: ({ children, ...props }) => (
    <h6 {...props} className="text-xs font-semibold text-md-muted italic mb-2 mt-4 px-5 uppercase tracking-widest">
      {children}
    </h6>
  ),

  // ── Párrafo ───────────────────────────────────────────────────────────────
  p: ({ children }) => (
    <p className="text-md-text leading-[1.8] mb-8 px-3 md:px-6 text-justify [text-shadow:_1px_1px_2px_rgba(0,0,0,0.6)]">
      {children}
    </p>
  ),

  // ── Blockquote → recuadro destacado ───────────────────────────────────────
  blockquote: ({ children }) => (
    <div className="bg-md-surface p-6 rounded-lg border-t border-md-border my-6">
      <div className="text-md-muted italic leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  ),

  // ── Tabla ─────────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div className="overflow-x-auto my-8 text-center">
      <table className="mx-auto w-full max-w-2xl border-collapse rounded-lg overflow-hidden shadow-2xl border border-md-border text-md-text">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead>{children}</thead>
  ),

  tbody: ({ children }) => (
    <tbody className="bg-md-surface backdrop-blur-sm">{children}</tbody>
  ),

  tr: ({ children }) => (
    <tr className="border-b border-md-border hover:bg-md-accent/10 transition-colors">
      {children}
    </tr>
  ),

  th: ({ children }) => (
    <th className="text-center py-4 px-6 bg-mizume-fourthary text-mizume-fourthary-foreground uppercase text-xs tracking-widest font-bold text-left border-b border-md-border drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="py-4 px-6 font-medium text-md-accent first:text-md-accent [&:not(:first-child)]:text-md-muted [&:not(:first-child)]:italic">
      {children}
    </td>
  ),

  // ── Imagen ────────────────────────────────────────────────────────────────
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ''}
      loading="lazy" // <-- Implementación de Lazy Load nativo
      className="mx-auto my-6 rounded-lg block max-w-full"
    />
  ),

  // ── Listas ────────────────────────────────────────────────────────────────
  ul: ({ children }) => (
    <ul className="list-disc list-outside text-md-text space-y-4 mb-8 ml-10 mr-6">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal list-outside text-md-text space-y-4 mb-8 ml-10 mr-6">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="text-md-text leading-relaxed">
      {children}
    </li>
  ),

  // ── Código inline ─────────────────────────────────────────────────────────
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className={`${className} block`}>
          {children}
        </code>
      );
    }
    return (
      <code className="bg-md-surface text-md-accent px-1.5 py-0.5 rounded text-sm font-mono border border-md-border">
        {children}
      </code>
    );
  },

  // ── Bloque de código ──────────────────────────────────────────────────────
  pre: ({ children }) => (
    <pre className="bg-md-surface border border-md-border rounded-lg p-4 my-6 overflow-x-auto text-sm font-mono text-md-text">
      {children}
    </pre>
  ),

  // ── Separador horizontal ──────────────────────────────────────────────────
  hr: () => (
    <hr className="border-none border-t border-md-border " />
  ),

  // ── Negrita y cursiva ─────────────────────────────────────────────────────
  strong: ({ children }) => (
    <strong className="text-mizume-secondary-foreground font-semibold">{children}</strong>
  ),

  em: ({ children }) => (
    <em className="text-md-muted italic">{children}</em>
  ),

  // ── Enlace ────────────────────────────────────────────────────────────────
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-md-accent underline underline-offset-2 hover:text-mizume-secondary-foreground transition-colors"
    >
      {children}
    </a>
  ),
};

export default function MarkdownRenderer({ content, className = '', selectedId }: MarkdownRendererProps) {

  const [activeSection, setActiveSection] = React.useState("");

  React.useEffect(() => {
    if (!selectedId) return;
    document.getElementById(selectedId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedId]);

  React.useEffect(() => {

    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: "-10% 0px -70% 0px" }
      );

      const headings = document.querySelectorAll("h1[id], h2[id], h3[id]");
      headings.forEach((h) => observer.observe(h));

      return () => observer.disconnect();
    }, 100); 

    return () => clearTimeout(timer);
  }, [content]); 




  return (
    <div className={`prose-custom max-w-none ${className}`}>
      <style>{`mjx-container { color: var(--md-text); }`}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkHeadingId, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeMathjax]}
        components={components}
      
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}