import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

const SparklineChart = ({ data, secondaryData, isComplexityMetric }) => {
  if (!data) return null;

  // For complexity metrics, split the data into three series
  if (isComplexityMetric) {
    const dataLength = data.length / 3;
    const highComplexity = data.slice(0, dataLength);
    const mediumComplexity = data.slice(dataLength, dataLength * 2);
    const lowComplexity = data.slice(dataLength * 2);

    const chartData = highComplexity.map((_, index) => ({
      high: highComplexity[index],
      medium: mediumComplexity[index],
      low: lowComplexity[index],
    }));

    return (
      <ResponsiveContainer width="100%" height={50}>
        <LineChart data={chartData}>
          <Tooltip
            formatter={(value, name) => {
              const label = {
                high: 'High Complexity',
                medium: 'Medium Complexity',
                low: 'Low Complexity'
              }[name];
              return [`${value.toFixed(0)} files`, label];
            }}
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#ef5350"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="medium"
            stroke="#ff9800"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="#4caf50"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // For dual metrics (like PR Review Time)
  if (secondaryData) {
    const chartData = data.map((value, index) => ({
      primary: value,
      secondary: secondaryData[index],
    }));

    return (
      <ResponsiveContainer width="100%" height={50}>
        <LineChart data={chartData}>
          <Tooltip 
            formatter={(value) => [`${value.toFixed(1)} hrs`]}
          />
          <Line
            type="monotone"
            dataKey="primary"
            stroke="#2196f3"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="secondary"
            stroke="#90caf9"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // For regular metrics
  const chartData = data.map(value => ({ value }));

  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={chartData}>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2196f3"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparklineChart;
