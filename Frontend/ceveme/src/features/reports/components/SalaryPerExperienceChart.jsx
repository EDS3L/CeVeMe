import ReactECharts from "echarts-for-react";
import { useMemo, useState, useEffect } from "react";
import ChartSkeleton from "./ChartSkeleton";
import ReportCard from "./ReportCard";
import FilterSelect from "./FilterSelect";
import { TrendingUp } from "lucide-react";
import { EXPERIENCE_LEVELS, CHART_COLORS } from "../utils/constants";

const SalaryPerExperienceChart = ({ data, loading, onFilterChange }) => {
  const [experience, setExperience] = useState("%");

  useEffect(() => {
    onFilterChange(experience);
  }, [experience, onFilterChange]);

  const chartOption = useMemo(() => {
    if (!data || data.length === 0) return null;

    const orderMap = { JUNIOR: 0, MID: 1, SENIOR: 2, LEAD: 3, EXPERT: 4 };
    const sortedData = [...data].sort(
      (a, b) => (orderMap[a.experience] || 99) - (orderMap[b.experience] || 99),
    );

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
          const dataItem = sortedData.find((d) => d.experience === item.name);
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div>Średnie: <strong>${item.value?.toLocaleString("pl-PL")} PLN</strong></div>
                ${dataItem?.minSalary ? `<div>Min: ${dataItem.minSalary.toLocaleString("pl-PL")} PLN</div>` : ""}
                ${dataItem?.maxSalary ? `<div>Max: ${dataItem.maxSalary.toLocaleString("pl-PL")} PLN</div>` : ""}
              </div>
            </div>
          `;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: sortedData.map((item) => item.experience),
        axisLine: { lineStyle: { color: "#e5e4df" } },
        axisLabel: { color: "#666663", fontSize: 12 },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#e5e4df" } },
        axisLabel: {
          color: "#666663",
          formatter: (value) => `${(value / 1000).toFixed(0)}k`,
        },
        splitLine: { lineStyle: { color: "#f0f0eb" } },
      },
      series: [
        {
          name: "Średnie wynagrodzenie",
          type: "bar",
          data: sortedData.map((item, index) => ({
            value: item.salary,
            itemStyle: {
              color:
                CHART_COLORS.experience[item.experience] ||
                CHART_COLORS.gradient[index % 4],
              borderRadius: [6, 6, 0, 0],
            },
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.2)",
            },
          },
          barMaxWidth: 60,
          label: {
            show: true,
            position: "top",
            formatter: (params) => `${(params.value / 1000).toFixed(1)}k`,
            color: "#666663",
            fontSize: 11,
          },
        },
      ],
    };
  }, [data]);

  return (
    <ReportCard
      title="Wynagrodzenia wg doświadczenia"
      icon={<TrendingUp size={20} />}
    >
      <div className="mb-6">
        <FilterSelect
          label="Poziom doświadczenia"
          value={experience}
          onChange={setExperience}
          options={EXPERIENCE_LEVELS}
          placeholder="Wszystkie poziomy"
        />
      </div>

      {loading ? (
        <ChartSkeleton />
      ) : chartOption ? (
        <ReactECharts option={chartOption} style={{ height: "320px" }} />
      ) : (
        <div className="h-64 flex items-center justify-center text-[var(--color-clouddark)]">
          Brak danych do wyświetlenia
        </div>
      )}
    </ReportCard>
  );
};

export default SalaryPerExperienceChart;
