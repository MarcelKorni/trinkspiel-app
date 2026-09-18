import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Wenn gesetzt, wird links ein Zurueck-Pfeil angezeigt. */
  backTo?: string;
}

export function PageHeader({ title, subtitle, backTo }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center gap-3">
      {backTo && (
        <button
          onClick={() => navigate(backTo)}
          aria-label="Zurueck"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-800 text-xl active:scale-95"
        >
          ←
        </button>
      )}
      <div>
        <h1 className="text-2xl font-extrabold leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
      </div>
    </div>
  );
}
