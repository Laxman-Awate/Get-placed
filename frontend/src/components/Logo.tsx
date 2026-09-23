import { Link } from 'react-router';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  to?: string;
  subtitle?: string;
}

export default function Logo({
  className = '',
  size = 'md',
  showText = true,
  to,
  subtitle,
}: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${iconSizes[size]} flex-shrink-0 flex items-center justify-center rounded-xl bg-[#0f0f1a] border border-[#1e1e30] p-1 shadow-md shadow-teal-500/10 group-hover:border-teal-500/40 group-hover:shadow-teal-500/20 transition-all`}
      >
        <img
          src="/logo-icon.png"
          alt="LevelUp Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(20,184,166,0.25)]"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-extrabold text-white ${textSizes[size]} font-[Plus_Jakarta_Sans] tracking-tight leading-tight`}>
            Level<span className="text-[#38bdf8]">Up</span>
          </span>
          {subtitle && (
            <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase leading-none mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center group cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
}
