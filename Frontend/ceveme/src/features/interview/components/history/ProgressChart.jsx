import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { INTERVIEW_COLORS } from "../../utils/constants";

export default function ProgressChart({ data, height = "300px" }) {
  const chartOption = useMemo(() => {
    if (!data || data.length === 0) return null;

    const dates = data.map((d) => d.date);
    const scores = data.map((d) => d.score);

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: INTERVIEW_COLORS.primary,
        borderWidth: 1,
        textStyle: { color: "#191919" },
        formatter: (params) => {
          const point = params[0];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${point.name}</div>
              <div>Wynik: <strong>${point.value}%</strong></div>
            </div>
          `;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLine: { lineStyle: { color: "#e5e4df" } },
        axisLabel: {
          color: "#666663",
          rotate: 45,
          fontSize: 11,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: "#e5e4df" } },
        axisLabel: { color: "#666663", formatter: "{value}%" },
        splitLine: { lineStyle: { color: "#f0f0eb" } },
      },
      series: [
        {
          name: "Wynik",
          type: "line",
          smooth: true,
          data: scores,
          lineStyle: {
            width: 3,
            color: INTERVIEW_COLORS.primary,
          },
          itemStyle: {
            color: INTERVIEW_COLORS.primary,
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${INTERVIEW_COLORS.primary}40` },
                { offset: 1, color: `${INTERVIEW_COLORS.primary}05` },
              ],
            },
          },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: {
              color: "#22c55e",
              type: "dashed",
            },
            data: [
              {
                yAxis: 85,
                label: {
                  formatter: "Doskonale",
                  position: "end",
                  color: "#22c55e",
                },
              },
            ],
          },
        },
      ],
    };
  }, [data]);

  if (!chartOption) {
    return (
      <div
        className="flex items-center justify-center text-[var(--color-clouddark)]"
        style={{ height }}
      >
        Brak danych do wyświetlenia
      </div>
    );
  }

  return <ReactECharts option={chartOption} style={{ height }} />;
}
