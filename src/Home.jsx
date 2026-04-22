import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
} from "recharts";
import "./Home.css";

// -------------------------
// HELPER: ROUND JSON VALUES
// -------------------------
const roundData = (data) => {
  if (!Array.isArray(data)) return data;

  return data.map((item) => {
    const newItem = {};
    Object.keys(item).forEach((key) => {
      const value = item[key];
      newItem[key] = typeof value === "number" ? Math.round(value) : value;
    });
    return newItem;
  });
};

// -------------------------
// REUSABLE LINE CHART
// -------------------------
const RiskLineChart = ({ title, dataKey, color, data = [] }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="mini-card">
      <div className="mini-header">
        <h3>{title}</h3>
      </div>

      <ResponsiveContainer
        width="100%"
        height={isMobile ? 150 : 180}>
        <LineChart data={data}>
          <XAxis
            dataKey="Year"
            type="number"
            domain={[1990, 2020]}
            tick={{ fontSize: isMobile ? 11 : 12 }}
          />
          <YAxis
            tick={{ fontSize: isMobile ? 11 : 12 }}
            width={isMobile ? 50 : 50}
          />
          <Tooltip contentStyle={{ fontSize: 12 }} />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// -------------------------
// COUNTRY PANEL
// -------------------------
const CountryTrendPanel = ({ data }) => {
  if (!data || data.length === 0) return null;

  const metrics = [
    { key: "bp", title: "High BP", color: "#6366F1" },
    { key: "smoking", title: "Smoking", color: "#EF4444" },
    { key: "air", title: "Air Pollution", color: "#22C55E" },
    { key: "glucose", title: "High Glucose", color: "#0EA5E9" },
    { key: "obesity", title: "Obesity", color: "#F59E0B" },
    { key: "ldl", title: "High LDL Cholesterol", color: "#A855F7" },
    { key: "pm", title: "PM Pollution", color: "#14B8A6" },
    { key: "alcohol", title: "Alcohol Consumption", color: "#F43F5E" },
    { key: "grain", title: "Low Whole Grain Diet", color: "#84CC16" },
    { key: "sodium", title: "Excess Sodium", color: "#F97316" },
  ];

  return (
    <div className="trend-section">
      <div className="grid-mini">
        {metrics.map((m) => (
          <RiskLineChart
            key={m.key}
            title={m.title}
            dataKey={m.key}
            color={m.color}
            data={data}
          />
        ))}
      </div>
    </div>
  );
};

// -------------------------
// INSIGHT CARD
// -------------------------
const MortalityInsightCard = () => {
  const environmental = Math.round(4118.25 + 1535.18);

  const lifestyle = Math.round(
    7026.15 + 3957.62 + 3948.9 + 3000.33 + 2385.26 + 1352.14 + 1137.9 + 807.44,
  );

  const total = lifestyle + environmental;

  const lifestylePct = Math.round((lifestyle / total) * 100);
  const environmentalPct = Math.round((environmental / total) * 100);

  return (
    <div className="insight-wrapper">
      <div className="flashcard">
        <h3>Lifestyle Related Risks</h3>
        <div className="big">{lifestylePct}%</div>
        <ul>
          <li>High blood pressure</li>
          <li>Smoking</li>
          <li>High glucose</li>
          <li>Obesity</li>
          <li>High LDL cholesterol</li>
          <li>Alcohol Consumption</li>
          <li>Low Whole Grain Diet</li>
          <li>Excess Sodium</li>
        </ul>
      </div>

      <div className="flashcard">
        <h3>Environmental Risks</h3>
        <div className="big">{environmentalPct}%</div>
        <ul>
          <li>Air pollution</li>
          <li>PM pollution</li>
        </ul>
      </div>
    </div>
  );
};

// -------------------------
// MAIN APP
// -------------------------
const Home = () => {
  const [riskData, setRiskData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [countryTrends, setCountryTrends] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768,
  );

  const COLORS = [
    "#6366F1",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#0EA5E9",
    "#A855F7",
    "#14B8A6",
    "#F43F5E",
    "#84CC16",
    "#F97316",
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setRiskData([
      { risk: "High Blood Pressure", value: 7026 },
      { risk: "Air Pollution", value: 4118 },
      { risk: "Active Smoking", value: 3958 },
      { risk: "High Glucose", value: 3949 },
      { risk: "Obesity", value: 3000 },
      { risk: "High LDL Cholestrol", value: 2385 },
      { risk: "PM Pollution", value: 1535 },
      { risk: "Alcohol Consumption", value: 1352 },
      { risk: "Low Whole Grains Diet", value: 1138 },
      { risk: "Excess Sodium", value: 807 },
    ]);
  }, []);

  // -------------------------
  // ROUND trend_data.json
  // -------------------------
  useEffect(() => {
    fetch("trend_data.json")
      .then((res) => res.json())
      .then((data) => setTrendData(roundData(data)))
      .catch((err) => console.log("Trend fetch error:", err));
  }, []);

  // -------------------------
  // ROUND all_country_trends.json
  // -------------------------
  useEffect(() => {
    fetch("all_country_trends.json")
      .then((res) => res.json())
      .then((data) => {
        const rounded = {};
        Object.keys(data).forEach((country) => {
          rounded[country] = roundData(data[country]);
        });
        setCountryTrends(rounded);
      })
      .catch((err) => console.log("Country fetch error:", err));
  }, []);

  const sortedRisk = [...riskData].sort((a, b) => b.value - a.value);
  const selectedData = countryTrends[selectedCountry] || [];

  const metrics = [
    { key: "bp", title: "High BP", color: "#6366F1" },
    { key: "smoking", title: "Smoking", color: "#EF4444" },
    { key: "air", title: "Air Pollution", color: "#22C55E" },
    { key: "glucose", title: "High Glucose", color: "#0EA5E9" },
    { key: "obesity", title: "Obesity", color: "#F59E0B" },
    { key: "ldl", title: "High LDL Cholesterol", color: "#A855F7" },
    { key: "pm", title: "PM Pollution", color: "#14B8A6" },
    { key: "alcohol", title: "Alcohol Consumption", color: "#F43F5E" },
    { key: "grain", title: "Low Whole Grain Diet", color: "#84CC16" },
    { key: "sodium", title: "Excess Sodium", color: "#F97316" },
  ];

  return (
    <div className="container">
      <header className="hero">
        <h1>Global Mortality Risk Factors</h1>
        <p>Health analytics (1990 - 2020)</p>
      </header>
      <div className="intro">
        <h3>Introduction</h3>
        <br />
        <p>
          Helalth and wellness remains a critical focus in global development,
          with mortality risk factors playing a key role in shaping public
          health strategies. This dashboard provides an in-depth analysis of the
          top mortality risk factors worldwide, trends over time, and
          country-specific insights.
        </p>
      </div>

      <div className="card">
        <h2>Top (10) Mortality Risk Factors</h2>

        <ResponsiveContainer
          className="bar-chart-content"
          width="100%"
          height={isMobile ? 500 : 350}>
          <BarChart
            data={sortedRisk}
            layout="vertical"
            margin={
              isMobile
                ? { left: 90, right: 15, top: 10, bottom: 10 }
                : { left: 130, right: 20 }
            }>
            <XAxis
              type="number"
              tick={{ fontSize: isMobile ? 12 : 12 }}
            />
            <YAxis
              type="category"
              dataKey="risk"
              width={isMobile ? 85 : 200}
              tick={{ fontSize: isMobile ? 12 : 12 }}
            />
            <Tooltip contentStyle={{ fontSize: 13 }} />

            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}>
              {sortedRisk.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>Mortality Risk Breakdown</h2>
        <MortalityInsightCard />
      </div>

      <div className="card">
        <h2>Global Risk Factor + Fatality Trends</h2>

        <div className="trend-section">
          <div className="grid-mini">
            {metrics.map((m) => (
              <RiskLineChart
                key={m.key}
                title={m.title}
                dataKey={m.key}
                color={m.color}
                data={trendData}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Country Risk Factor + Fatality Trends</h2>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}>
          {Object.keys(countryTrends).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <CountryTrendPanel data={selectedData} />
      </div>

      <footer className="footer">
        <p>© 2026 Global Health Dashboard</p>
      </footer>
    </div>
  );
};

export default Home;
