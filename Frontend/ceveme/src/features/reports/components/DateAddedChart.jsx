import ReactECharts from "echarts-for-react";
import { useMemo, useState, useEffect } from "react";
import ChartSkeleton from "./ChartSkeleton";
import ReportCard from "./ReportCard";
import FilterSelect from "./FilterSelect";
import { Calendar } from "lucide-react";
import { EXPERIENCE_LEVELS, CHART_COLORS } from "../utils/constants";

const getDefaultDates = () => {
  const now = new Date();
  const toDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const fromDateObj = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const fromDate = `${fromDateObj.getFullYear()}-${String(fromDateObj.getMonth() + 1).padStart(2, "0")}`;
  return { fromDate, toDate };
};

const DateAddedChart = ({ data, loading, onFilterChange }) => {
  const defaultDates = getDefaultDates();
  const [experience, setExperience] = useState("%");
  const [fromDate, setFromDate] = useState(defaultDates.fromDate);
  const [toDate, setToDate] = useState(defaultDates.toDate);

  useEffect(() => {
    onFilterChange(experience, fromDate, toDate);
  }, [experience, fromDate, toDate, onFilterChange]);

  const chartOption = useMemo(() => {
    if (!data || data.length === 0) return null;

    const allDates = [...new Set(data.map((item) => item.dateAdded))].sort();
    const experienceLevels = [...new Set(data.map((item) => item.experienceLevel))];

    const dataByDateAndExp = data.reduce((acc, item) => {
      const key = `${item.dateAdded}_${item.experienceLevel}`;
      acc[key] = item.offerCount;
      return acc;
    }, {});

    const series = experienceLevels.map((level) => ({
      name: level,
      type: "line",
      smooth: true,
      data: allDates.map((date) => dataByDateAndExp[`${date}_${level}`] || 0),
      lineStyle: {
        width: 2,
        color: CHART_COLORS.experience[level] || CHART_COLORS.primary,
      },
      itemStyle: {
        color: CHART_COLORS.experience[level] || CHART_COLORS.primary,
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: `${CHART_COLORS.experience[level] || CHART_COLORS.primary}40` },
            { offset: 1, color: `${CHART_COLORS.experience[level] || CHART_COLORS.primary}05` },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
    }));

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        textStyle: { color: "#191919" },
      },
      legend: {
        data: experienceLevels,
        bottom: 0,
        textStyle: { color: "#666663" },
        itemGap: 15,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: allDates,
        axisLine: { lineStyle: { color: "#e5e4df" } },
        axisLabel: {
          color: "#666663",
          rotate: 45,
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

  const handleFromDateChange = (value) => {
    setFromDate(value || "%");
  };

  const handleToDateChange = (value) => {
    setToDate(value || "%");
  };

  return (
    <ReportCard title="Oferty w czasie" icon={<Calendar size={20} />}>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FilterSelect
          label="Poziom doświadczenia"
          value={experience}
          onChange={setExperience}
          options={EXPERIENCE_LEVELS}
          placeholder="Wszystkie poziomy"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-clouddark)]">Miesiąc od</label>
          <input
            type="month"
            value={fromDate === "%" ? "" : fromDate}
            onChange={(e) => handleFromDateChange(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-[var(--color-ivorydark)] bg-[var(--color-basewhite)] text-[var(--color-slatedark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-kraft)]/50 focus:border-[var(--color-kraft)] transition-all duration-200"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-clouddark)]">Miesiąc do</label>
          <input
            type="month"
            value={toDate === "%" ? "" : toDate}
            onChange={(e) => handleToDateChange(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-[var(--color-ivorydark)] bg-[var(--color-basewhite)] text-[var(--color-slatedark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-kraft)]/50 focus:border-[var(--color-kraft)] transition-all duration-200"
          />
        </div>
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

export default DateAddedChart;
