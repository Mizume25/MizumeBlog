import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import React from 'react';
import { Index } from "@/pages/post/show";
import rehypeSlug from 'rehype-slug';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onSectionChange?: (id: string) => void;
  selectedId?: string | null;
}

const components: Components = {
  // ── Headings ──────────────────────────────────────────────────────────────
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-white px-5 border-b border-[#C8AD7F]/40 pb-4 mb-8 mt-10 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
  <h2
    {...props}
    className="text-2xl font-bold text-white px-5 mx-7 my-7 border-b border-[#C8AD7F]/30 pb-3 mb-6 mt-10 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] border-b-2 border-[#eee]"
  >
    {children}
  </h2>
),

  h3: ({ children }) => (
    <h3 className="text-lg font-bold text-[#C8AD7F] mb-2 mt- mx-7 my-7 px-5 uppercase tracking-wide drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] border-b-2 border-[#eee]">
      - {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="text-base font-semibold text-[#A18B75] mb-2 mt-6 px-5 uppercase tracking-wider">
      {children}
    </h4>
  ),

  // ── Párrafo ───────────────────────────────────────────────────────────────
  p: ({ children }) => (
    <p className="text-gray-200 leading-[1.8] mb-8 px-3 md:px-6 text-justify [text-shadow:_1px_1px_2px_rgba(0,0,0,0.6)]">
      {children}
    </p>
  ),

  // ── Blockquote → recuadro destacado ───────────────────────────────────────
  blockquote: ({ children }) => (
    <div className="bg-black/20 p-6 rounded-lg border-t border-white/5 my-6">
      <div className="text-gray-300 italic leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  ),

  // ── Tabla ─────────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div className="overflow-x-auto my-8 text-center">
      <table className="mx-auto w-full max-w-2xl border-collapse rounded-lg overflow-hidden shadow-2xl border border-[#C8AD7F]/30 text-white">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead>{children}</thead>
  ),

  tbody: ({ children }) => (
    <tbody className="bg-black/40 backdrop-blur-sm">{children}</tbody>
  ),

  tr: ({ children }) => (
    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
      {children}
    </tr>
  ),

  th: ({ children }) => (
    <th className="text-center py-4 px-6 bg-[#C8AD7F] text-white uppercase text-xs tracking-widest font-bold text-left border-b border-[#C8AD7F]/50 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="py-4 px-6 font-medium text-[#C8AD7F] first:text-[#C8AD7F] [&:not(:first-child)]:text-gray-300 [&:not(:first-child)]:italic">
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
    <ul className="list-disc list-outside text-gray-200 space-y-4 mb-8 ml-10 mr-6">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal list-outside text-gray-200 space-y-4 mb-8 ml-10 mr-6">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="text-gray-300 leading-relaxed">
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
      <code className="bg-black/30 text-[#C8AD7F] px-1.5 py-0.5 rounded text-sm font-mono border border-[#C8AD7F]/20">
        {children}
      </code>
    );
  },

  // ── Bloque de código ──────────────────────────────────────────────────────
  pre: ({ children }) => (
    <pre className="bg-black/30 border border-[#C8AD7F]/20 rounded-lg p-4 my-6 overflow-x-auto text-sm font-mono text-gray-300">
      {children}
    </pre>
  ),

  // ── Separador horizontal ──────────────────────────────────────────────────
  hr: () => (
    <hr className="border-none border-t border-white/10 my-8" />
  ),

  // ── Negrita y cursiva ─────────────────────────────────────────────────────
  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),

  em: ({ children }) => (
    <em className="text-[#A18B75] italic">{children}</em>
  ),

  // ── Enlace ────────────────────────────────────────────────────────────────
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#C8AD7F] underline underline-offset-2 hover:text-white transition-colors"
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
              // Aquí podrías emitir un evento o llamar a una prop para avisar al índice
              console.log("Sección activa:", entry.target.id);
            }
          });
        },
        { rootMargin: "-10% 0px -70% 0px" }
      );

      const headings = document.querySelectorAll("h1[id], h2[id], h3[id]");
      headings.forEach((h) => observer.observe(h));

      return () => observer.disconnect();
    }, 100); // Un pequeño delay asegura que los IDs ya estén en el DOM

    return () => clearTimeout(timer);
  }, [content]); // Volver a ejecutar si el contenido cambia




  return (
    <div className={`prose-custom max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]} 
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}