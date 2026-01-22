import ReactECharts from "echarts-for-react";
import { useMemo, useState, useEffect } from "react";
import ChartSkeleton from "./ChartSkeleton";
import ReportCard from "./ReportCard";
import FilterSelect from "./FilterSelect";
import { Map } from "lucide-react";
import {
  EXPERIENCE_LEVELS,
  VOIVODESHIPS,
  CHART_COLORS,
} from "../utils/constants";

const ExperiencePerVoivodeshipChart = ({ data, loading, onFilterChange }) => {
  const [experience, setExperience] = useState("%");
  const [voivodeship, setVoivodeship] = useState("%");

  useEffect(() => {
    onFilterChange(experience, voivodeship);
  }, [experience, voivodeship, onFilterChange]);

  const chartOption = useMemo(() => {
    if (!data || data.length === 0) return null;

    const groupedData = data.reduce((acc, item) => {
      const key = item.experienceLevel;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += item.experienceCount;
      return acc;
    }, {});

    const pieData = Object.entries(groupedData).map(([name, value]) => ({
      name,
      value,
      itemStyle: {
        color: CHART_COLORS.experience[name] || CHART_COLORS.primary,
      },
    }));

    return {
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        textStyle: { color: "#191919" },
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "center",
        textStyle: { color: "#666663" },
      },
      series: [
        {
          name: "Doświadczenie",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.3)",
            },
          },
          labelLine: {
            show: false,
          },
          data: pieData,
        },
      ],
    };
  }, [data]);

  return (
    <ReportCard title="Doświadczenie wg województw" icon={<Map size={20} />}>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FilterSelect
          label="Poziom doświadczenia"
          value={experience}
          onChange={setExperience}
          options={EXPERIENCE_LEVELS}
          placeholder="Wszystkie poziomy"
        />
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
        <ReactECharts option={chartOption} style={{ height: "320px" }} />
      ) : (
        <div className="h-64 flex items-center justify-center text-[var(--color-clouddark)]">
          Brak danych do wyświetlenia
        </div>
      )}
    </ReportCard>
  );
};

export default ExperiencePerVoivodeshipChart;
