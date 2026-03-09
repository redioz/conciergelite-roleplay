'use client';

import { Settings } from '@/types';
import { DURATION_OPTIONS, MODEL_OPTIONS } from '@/lib/constants';

interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSave({
      model: form.get('model') as Settings['model'],
      duration: parseInt(form.get('duration') as string),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-strong rounded-3xl w-full max-w-md mx-4 p-7 animate-slide-up
                      shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-xl font-bold text-text-primary">Configuration</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-xl
                       hover:bg-white/[0.06]"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Model */}
          <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
              Mod&egrave;le IA
            </label>
            <select
              name="model"
              defaultValue={settings.model}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-sm
                         text-text-primary focus:outline-none focus:border-gold/40 focus:bg-white/[0.06]
                         transition-all appearance-none backdrop-blur-sm
                         bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22%23888888%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M1.646%204.646a.5.5%200%200%201%20.708%200L8%2010.293l5.646-5.647a.5.5%200%200%201%20.708.708l-6%206a.5.5%200%200%201-.708%200l-6-6a.5.5%200%200%201%200-.708z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat"
            >
              {MODEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
              Dur&eacute;e de l&apos;appel
            </label>
            <select
              name="duration"
              defaultValue={settings.duration}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-sm
                         text-text-primary focus:outline-none focus:border-gold/40 focus:bg-white/[0.06]
                         transition-all appearance-none backdrop-blur-sm
                         bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22%23888888%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M1.646%204.646a.5.5%200%200%201%20.708%200L8%2010.293l5.646-5.647a.5.5%200%200%201%20.708.708l-6%206a.5.5%200%200%201-.708%200l-6-6a.5.5%200%200%201%200-.708z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat"
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gold hover:bg-gold-light text-bg font-semibold rounded-2xl py-3.5
                       transition-all text-sm
                       shadow-[0_0_30px_rgba(244,200,66,0.15)] hover:shadow-[0_0_40px_rgba(244,200,66,0.25)]"
          >
            Sauvegarder
          </button>
        </form>
      </div>
    </div>
  );
}
