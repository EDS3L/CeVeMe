import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { INTERVIEW_COLORS } from "../../utils/constants";

export default function ScoreRadarChart({ scores, size = "md" }) {
  const chartOption = useMemo(() => {
    if (!scores || Object.keys(scores).length === 0) return null;

    const entries = Object.entries(scores);
    const indicators = entries.map(([name]) => ({ name, max: 100 }));
    const data = entries.map(([, value]) => value || 0);

    return {
      radar: {
        indicator: indicators,
        shape: "circle",
        splitNumber: 5,
        axisName: {
          color: INTERVIEW_COLORS.muted,
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            color: ["#f0f0eb"],
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(255,255,255,0.8)", "rgba(245,245,240,0.5)"],
          },
        },
        axisLine: {
          lineStyle: {
            color: "#e5e4df",
          },
        },
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: data,
              name: "Twój wynik",
              areaStyle: {
                color: {
                  type: "radial",
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [
                    { offset: 0, color: `${INTERVIEW_COLORS.primary}40` },
                    { offset: 1, color: `${INTERVIEW_COLORS.primary}10` },
                  ],
                },
              },
              lineStyle: {
                color: INTERVIEW_COLORS.primary,
                width: 2,
              },
              itemStyle: {
                color: INTERVIEW_COLORS.primary,
              },
            },
          ],
        },
      ],
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: INTERVIEW_COLORS.primary,
        borderWidth: 1,
        textStyle: { color: "#191919" },
      },
    };
  }, [scores]);

  const heights = {
    sm: "200px",
    md: "300px",
    lg: "400px",
  };

  if (!chartOption) {
    return (
      <div
        className="flex items-center justify-center text-[var(--color-clouddark)]"
        style={{ height: heights[size] }}
      >
        Brak danych do wyświetlenia
      </div>
    );
  }

  return (
    <ReactECharts option={chartOption} style={{ height: heights[size] }} />
  );
}
