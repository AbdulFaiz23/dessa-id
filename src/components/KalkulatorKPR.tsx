"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

interface KalkulatorKPRProps {
  hargaLahan: number;
}

export function KalkulatorKPR({ hargaLahan }: KalkulatorKPRProps) {
  const [dpPersen, setDpPersen] = useState(20);
  const [tenorTahun, setTenorTahun] = useState(10);
  const [bungaPersen, setBungaPersen] = useState(8);

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const { cicilanPerBulan, dpNominal, pokokPinjaman } = useMemo(() => {
    const dpNominal = (hargaLahan * dpPersen) / 100;
    const pokokPinjaman = hargaLahan - dpNominal;
    
    // Rumus Bunga Tetap (Flat) sederhana untuk estimasi kasar KPT (Kredit Pemilikan Tanah)
    const totalBunga = pokokPinjaman * (bungaPersen / 100) * tenorTahun;
    const totalHutang = pokokPinjaman + totalBunga;
    const cicilanPerBulan = totalHutang / (tenorTahun * 12);

    return { cicilanPerBulan, dpNominal, pokokPinjaman };
  }, [hargaLahan, dpPersen, tenorTahun, bungaPersen]);

  return (
    <div className="bg-white border border-sand-300 rounded-2xl p-5 shadow-sm">
      <h3 className="font-medium text-earth-900 mb-4 flex items-center gap-2">
        <Calculator className="w-4 h-4 text-green-700" />
        Estimasi Cicilan (KPT)
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <label className="text-earth-700">Uang Muka (DP) - {dpPersen}%</label>
            <span className="font-medium">{formatRp(dpNominal)}</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            step="5"
            value={dpPersen}
            onChange={(e) => setDpPersen(parseInt(e.target.value))}
            className="w-full accent-green-700 h-1.5 bg-earth-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <label className="text-earth-700">Lama Pinjaman (Tenor)</label>
            <span className="font-medium">{tenorTahun} Tahun</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={tenorTahun}
            onChange={(e) => setTenorTahun(parseInt(e.target.value))}
            className="w-full accent-green-700 h-1.5 bg-earth-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <label className="text-earth-700">Suku Bunga / Tahun</label>
            <span className="font-medium">{bungaPersen}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="15"
            step="0.5"
            value={bungaPersen}
            onChange={(e) => setBungaPersen(parseFloat(e.target.value))}
            className="w-full accent-green-700 h-1.5 bg-earth-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="pt-4 border-t border-sand-300 mt-2">
          <p className="text-xs text-earth-500 mb-1">Estimasi Cicilan per Bulan</p>
          <p className="text-xl font-bold text-green-900">{formatRp(cicilanPerBulan)}</p>
          <p className="text-[10px] text-earth-400 mt-2 leading-relaxed">
            *Ini adalah estimasi bunga flat kasar. Suku bunga dan ketentuan riil mengikuti pihak bank/lembaga pembiayaan.
          </p>
        </div>
      </div>
    </div>
  );
}
