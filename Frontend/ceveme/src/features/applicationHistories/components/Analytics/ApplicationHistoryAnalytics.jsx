/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { BarChart, CustomChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GraphicComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import LoadingSpinner from '../cardView/LoadingSpinner';
import ApplicationHistories from '../../hooks/useApplicationHistories';
import { STATUS_MAP } from '../../constants/statusConfig';

echarts.use([
  BarChart,
  CustomChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GraphicComponent,
  CanvasRenderer,
]);

const FALLBACK_PALETTE = [
  '#4338CA',
  '#4F46E5',
  '#6366F1',
  '#0EA5E9',
  '#06B6D4',
  '#14B8A6',
  '#10B981',
  '#22C55E',
];

const ORDER = Object.keys(STATUS_MAP).map((k) => k.toLowerCase());

const LABELS_PL = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([K, V]) => [
    K.toLowerCase(),
    V.label || V.name || K,
  ])
);

const getStatusHex = (key, idx = 0) => {
  const statusKey = String(key || '').toUpperCase();
  const meta = STATUS_MAP?.[statusKey] || {};
  if (meta.hex && typeof meta.hex === 'string') return meta.hex;
  if (meta.colorHex && typeof meta.colorHex === 'string') return meta.colorHex;
  if (meta.color && typeof meta.color === 'string' && /^#/.test(meta.color))
    return meta.color;
  return FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];
};

const COLOR_BY_STATUS = (key, i) => getStatusHex(key, i);

function lighten(hex, amt = 0.2) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  r = Math.min(255, Math.round(r + (255 - r) * amt));
  g = Math.min(255, Math.round(g + (255 - g) * amt));
  b = Math.min(255, Math.round(b + (255 - b) * amt));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export default function ApplicationHistoryAnalytics() {
  const api = new ApplicationHistories();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.getApplicationHistoriesStatusCount();
        if (mounted) setData(res || null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const { rows, total } = useMemo(() => {
    const safe = data || {};
    const total =
      typeof safe.total === 'number'
        ? safe.total
        : ORDER.reduce((a, k) => a + (safe[k] || 0), 0);

    const rows = ORDER.map((key, i) => {
      const v = safe[key] ?? 0;
      const statusKey = String(key || '').toUpperCase();
      const statusMeta = STATUS_MAP?.[statusKey] || {};
      const label = statusMeta.label || LABELS_PL[key] || key;
      const color = COLOR_BY_STATUS(key, i);
      const grad = {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          { offset: 0, color: lighten(color, 0.28) },
          { offset: 1, color },
        ],
      };
      return { key, label, value: v, color, grad };
    });

    const nonZero = rows.filter((r) => r.value > 0);
    return { rows, total, nonZero };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/60 p-8 text-center text-slate-500">
        Brak danych do wyświetlenia
      </div>
    );
  }

  const pct = (v) => (total > 0 ? Math.round((v / total) * 100) : 0);

  const barOption = {
    backgroundColor: 'transparent',
    title: {
      text: 'Przepływ etapów (udział w łącznej liczbie)',
      left: 'center',
      textStyle: { fontWeight: 800, color: '#1e293b' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15,23,42,0.92)',
      borderRadius: 12,
      textStyle: { color: '#fff' },
      formatter: (params) => {
        const p = params[0];
        return `${p.name}<br/><b>${p.value}</b> (${pct(p.value)}%)`;
      },
    },
    grid: { left: 160, right: 24, top: 56, bottom: 16, containLabel: true },
    xAxis: {
      type: 'value',
      max: Math.max(total, 1),
      axisLabel: { show: false },
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'category',
      data: rows.map((r) => r.label),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: '#334155', fontWeight: 600 },
    },
    series: [
      {
        type: 'bar',
        data: rows.map((r) => r.value),
        showBackground: true,
        backgroundStyle: { color: 'rgba(2,6,23,0.06)', borderRadius: 8 },
        itemStyle: {
          borderRadius: 8,
          color: (p) => rows[p.dataIndex].grad,
          opacity: (p) => (rows[p.dataIndex].value > 0 ? 1 : 0.25),
          shadowBlur: 10,
          shadowColor: 'rgba(2,6,23,0.12)',
        },
        barWidth: 16,
        label: {
          show: true,
          position: 'right',
          formatter: (p) => {
            const v = p.value;
            return v > 0 ? `${v} • ${pct(v)}%` : '';
          },
          color: '#0f172a',
          fontWeight: 700,
        },
        z: 2,
      },
      {
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 16,
        data: rows.map((r) => r.value),
        itemStyle: {
          color: (p) => rows[p.dataIndex].color,
          opacity: (p) => (rows[p.dataIndex].value > 0 ? 1 : 0),
        },
        z: 3,
      },
    ],
    animationDuration: 600,
    animationEasing: 'cubicOut',
  };

  // eslint-disable-next-line no-unused-vars
  const waffleCells = (() => {
    const seq = [];
    // eslint-disable-next-line no-unused-vars
    ORDER.forEach((key, i) => {
      const row = rows.find((r) => r.key === key);
      if (!row || row.value <= 0) return;
      for (let c = 0; c < row.value; c++) {
        seq.push({ key, label: row.label, color: row.color });
      }
    });
    return seq;
  })();

  const N = Math.max(2, Math.ceil(Math.sqrt(Math.max(total, 1))));
  const pieData = rows
    .filter((r) => r.value > 0)
    .map((r) => ({
      name: r.label,
      value: r.value,
      itemStyle: { color: r.color },
    }));

  const pieOption = {
    backgroundColor: 'transparent',
    title: {
      text: 'Rozkład statusów (udział)',
      left: 'center',
      top: 8,
      textStyle: { fontWeight: 800, color: '#1e293b' },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15,23,42,0.92)',
      borderRadius: 10,
      textStyle: { color: '#fff' },
      formatter: (p) => {
        return `${p.name}<br/><b>${p.value}</b> — ${p.percent}%`;
      },
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 'center',
      data: pieData.map((d) => d.name),
      textStyle: { color: '#334155' },
    },
    series: [
      {
        name: 'Statusy',
        type: 'pie',
        radius: ['42%', '70%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c} ({d}%)',
          color: '#0f172a',
        },
        labelLine: { length: 12, length2: 6, smooth: true },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(15,23,42,0.2)',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: pieData,
        animationType: 'scale',
        animationEasing: 'cubicOut',
        animationDuration: 700,
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '50%',
        style: {
          text: `Łącznie ${total}`,
          fill: '#0f172a',
          font: '700 14px "Inter", sans-serif',
          align: 'center',
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-lg shadow-sm p-3 sm:p-5">
        <ReactECharts
          option={barOption}
          style={{ height: 520, width: '100%' }}
          notMerge
        />
      </div>
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-lg shadow-sm p-3 sm:p-5">
        <ReactECharts
          option={pieOption}
          style={{ height: 360, width: '100%' }}
          notMerge
        />
      </div>
    </div>
  );
}
