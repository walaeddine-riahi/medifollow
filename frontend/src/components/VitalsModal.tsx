"use client";

import { useState } from "react";
import { X, Activity, Thermometer, Droplets, HeartPulse } from "lucide-react";

interface VitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vitals: any) => void;
}

export function VitalsModal({ isOpen, onClose, onSubmit }: VitalsModalProps) {
  const [formData, setFormData] = useState({
    imc: 24.5,
    freq_cardiaque: 72,
    pa_systolique: 120,
    pa_diastolique: 80,
    spo2: 98,
    temperature: 36.6,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-medical-500" />
            Mes constantes médicales
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">IMC</label>
              <input
                type="number"
                step="0.1"
                name="imc"
                value={formData.imc}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                <HeartPulse className="h-3 w-3" /> Pouls (bpm)
              </label>
              <input
                type="number"
                name="freq_cardiaque"
                value={formData.freq_cardiaque}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">PA Systolique</label>
              <input
                type="number"
                name="pa_systolique"
                value={formData.pa_systolique}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">PA Diastolique</label>
              <input
                type="number"
                name="pa_diastolique"
                value={formData.pa_diastolique}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Droplets className="h-3 w-3" /> SpO2 (%)
              </label>
              <input
                type="number"
                name="spo2"
                value={formData.spo2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Thermometer className="h-3 w-3" /> Temp (°C)
              </label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-medical-500 text-white rounded-xl font-medium hover:bg-medical-600 transition shadow-lg shadow-medical-500/25"
            >
              Lancer l'analyse AI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
