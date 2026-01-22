import ReactECharts from "echarts-for-react";
import { useMemo, useState, useEffect } from "react";
import ChartSkeleton from "./ChartSkeleton";
import ReportCard from "./ReportCard";
import FilterSelect from "./FilterSelect";
import { DollarSign } from "lucide-react";
import { MAJOR_CITIES, CHART_COLORS } from "../utils/constants";

const SalaryPerCityChart = ({ data, loading, onFilterChange }) => {
  const [city, setCity] = useState("%");

  useEffect(() => {
    onFilterChange(city);
  }, [city, onFilterChange]);

  const chartOption = useMemo(() => {
    if (!data || data.length === 0) return null;

    const sortedData = [...data]
      .sort((a, b) => (b.salary || 0) - (a.salary || 0))
      .slice(0, 12);

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        textStyle: { color: "#191919" },
        formatter: (params) => {
          const item = params[0];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div>Średnie: <strong>${item.value?.toLocaleString("pl-PL")} PLN</strong></div>
              </div>
            </div>
          `;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#e5e4df" } },
        axisLabel: {
          color: "#666663",
          formatter: (value) => `${(value / 1000).toFixed(0)}k`,
        },
        splitLine: { lineStyle: { color: "#f0f0eb" } },
      },
      yAxis: {
        type: "category",
        data: sortedData.map((item) => item.city),
        axisLine: { lineStyle: { color: "#e5e4df" } },
        axisLabel: { color: "#666663", fontSize: 11 },
      },
      series: [
        {
          name: "Średnie wynagrodzenie",
          type: "bar",
          data: sortedData.map((item) => item.salary),
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: CHART_COLORS.secondary },
                { offset: 1, color: CHART_COLORS.primary },
              ],
            },
            borderRadius: [0, 4, 4, 0],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(212, 162, 127, 0.5)",
            },
          },
          barMaxWidth: 30,
        },
      ],
    };
  }, [data]);

  return (
    <ReportCard title="Wynagrodzenia wg miast" icon={<DollarSign size={20} />}>
      <div className="mb-6">
        <FilterSelect
          label="Miasto"
          value={city}
          onChange={setCity}
          options={MAJOR_CITIES}
          placeholder="Wszystkie miasta"
        />
      </div>

      {loading ? (
        <ChartSkeleton />
      ) : chartOption ? (
        <ReactECharts option={chartOption} style={{ height: "380px" }} />
      ) : (
        <div className="h-64 flex items-center justify-center text-[var(--color-clouddark)]">
          Brak danych do wyświetlenia
        </div>
      )}
    </ReportCard>
  );
};

export default SalaryPerCityChart;
