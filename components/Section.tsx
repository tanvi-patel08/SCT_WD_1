import React, { ReactNode } from 'react';

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const Section: React.FC<SectionProps> = ({ id, className = '', children, title, subtitle }) => {
  return (
    <section 
      id={id} 
      className={`min-h-screen relative flex flex-col justify-center items-center py-24 px-4 sm:px-8 overflow-hidden ${className}`}
    >
      <div className="max-w-6xl w-full z-10">
        {(title || subtitle) && (
          <div className="text-center mb-16 space-y-4">
             {subtitle && (
              <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-mono tracking-wider border border-indigo-500/30 uppercase">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200 drop-shadow-sm">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;