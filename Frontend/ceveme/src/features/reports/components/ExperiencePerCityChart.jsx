import ReactECharts from "echarts-for-react";
import { useMemo, useState, useEffect } from "react";
import ChartSkeleton from "./ChartSkeleton";
import ReportCard from "./ReportCard";
import FilterSelect from "./FilterSelect";
import { MapPin } from "lucide-react";
import {
  EXPERIENCE_LEVELS,
  MAJOR_CITIES,
  CHART_COLORS,
} from "../utils/constants";

const ExperiencePerCityChart = ({ data, loading, onFilterChange }) => {
  const [city, setCity] = useState("%");
  const [experience, setExperience] = useState("%");

  useEffect(() => {
    onFilterChange(city, experience);
  }, [city, experience, onFilterChange]);

  const chartOption = useMemo(() => {
    if (!data || data.length === 0) return null;

    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = {};
      }
      acc[item.city][item.experienceLevel] = item.experienceCount;
      return acc;
    }, {});

    const cities = Object.keys(groupedData).slice(0, 10);
    const experienceLevels = [
      ...new Set(data.map((item) => item.experienceLevel)),
    ];

    const series = experienceLevels.map((level) => ({
      name: level,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: cities.map((city) => groupedData[city][level] || 0),
      itemStyle: {
        color: CHART_COLORS.experience[level] || CHART_COLORS.primary,
        borderRadius: [0, 0, 0, 0],
      },
    }));

    if (series.length > 0) {
      series[series.length - 1].itemStyle.borderRadius = [4, 4, 0, 0];
    }

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        textStyle: { color: "#191919" },
      },
      legend: {
        data: experienceLevels,
        bottom: 0,
        textStyle: { color: "#666663" },
        itemGap: 20,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: cities,
        axisLine: { lineStyle: { color: "#e5e4df" } },
        axisLabel: {
          color: "#666663",
          rotate: 30,
          fontSize: 11,
        },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#e5e4df" } },
        axisLabel: { color: "#666663" },
        splitLine: { lineStyle: { color: "#f0f0eb" } },
      },
      series,
    };
  }, [data]);

  return (
    <ReportCard title="Doświadczenie wg miast" icon={<MapPin size={20} />}>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FilterSelect
          label="Miasto"
          value={city}
          onChange={setCity}
          options={MAJOR_CITIES}
          placeholder="Wszystkie miasta"
        />
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

export default ExperiencePerCityChart;
