import ReactECharts from "echarts-for-react";
import { useMemo, useState, useEffect } from "react";
import ChartSkeleton from "./ChartSkeleton";
import ReportCard from "./ReportCard";
import FilterSelect from "./FilterSelect";
import { Globe } from "lucide-react";
import { VOIVODESHIPS, CHART_COLORS } from "../utils/constants";

const SalaryPerVoivodeshipChart = ({ data, loading, onFilterChange }) => {
  const [voivodeship, setVoivodeship] = useState("%");

  useEffect(() => {
    onFilterChange(voivodeship);
  }, [voivodeship, onFilterChange]);

  const chartOption = useMemo(() => {
    if (!data || data.length === 0) return null;

    const sortedData = [...data]
      .sort((a, b) => (b.salary || 0) - (a.salary || 0))
      .slice(0, 16);

    const maxSalary = Math.max(...sortedData.map((d) => d.salary || 0));

    return {
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        textStyle: { color: "#191919" },
        formatter: (params) => {
          const dataItem = sortedData.find(
            (d) => d.voivodeship === params.name,
          );
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div>Średnie: <strong>${params.value?.toLocaleString("pl-PL")} PLN</strong></div>
                ${dataItem?.minSalary ? `<div>Min: ${dataItem.minSalary.toLocaleString("pl-PL")} PLN</div>` : ""}
                ${dataItem?.maxSalary ? `<div>Max: ${dataItem.maxSalary.toLocaleString("pl-PL")} PLN</div>` : ""}
              </div>
            </div>
          `;
        },
      },
      legend: {
        show: false,
      },
      series: [
        {
          name: "Województwa",
          type: "treemap",
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          label: {
            show: true,
            formatter: (params) =>
              `${params.name}\n${(params.value / 1000).toFixed(1)}k`,
            fontSize: 11,
            color: "#fff",
            textShadowBlur: 2,
            textShadowColor: "rgba(0,0,0,0.3)",
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
            gapWidth: 2,
          },
          data: sortedData.map((item) => ({
            name: item.voivodeship,
            value: item.salary,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: `rgba(204, 120, 92, ${0.4 + (item.salary / maxSalary) * 0.6})`,
                  },
                  {
                    offset: 1,
                    color: `rgba(212, 162, 127, ${0.5 + (item.salary / maxSalary) * 0.5})`,
                  },
                ],
              },
              borderRadius: 4,
            },
          })),
        },
      ],
    };
  }, [data]);

  return (
    <ReportCard title="Wynagrodzenia wg województw" icon={<Globe size={20} />}>
      <div className="mb-6">
        <FilterSelect
          label="Województwo"
          value={voivodeship}
          onChange={setVoivodeship}
          options={VOIVODESHIPS}
          placeholder="Wszystkie województwa"
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

export default SalaryPerVoivodeshipChart;
