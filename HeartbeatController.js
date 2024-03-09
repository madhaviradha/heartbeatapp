const fs = require('fs');
const _ = require('lodash');
const dailyStatisticsDetails = (data) => {
  const result = [];
  // Group data by date
  const groupedData = {};
  data.forEach((entry) => {
    const date = entry.timestamps.startTime.split('T')[0];
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push(entry);
  });
  // Calculate metrics for each day
  for (const date in groupedData) {
    const measurements = groupedData[date].map((entry) => entry.beatsPerMinute);
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    const sorted = measurements.sort((a, b) => a - b);
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
    const latestDataTimestamp =
      groupedData[date][groupedData[date].length - 1].timestamps.endTime;
    result.push({
      date,
      min,
      max,
      median,
      latestDataTimestamp,
    });
  }
  return result;
};
const readHeartbeatRateData = () => {
  const rawData = fs.readFileSync('heartrate.json', 'utf-8');
  return JSON.parse(rawData);
};
const writeOutputToFile = (data) => {
  fs.writeFileSync('output1.json', JSON.stringify(data, null, 2), 'utf-8');
};
const main = () => {
  try {
    const heartbeatRateData = readHeartbeatRateData();
    const dailyStatistics = dailyStatisticsDetails(heartbeatRateData);
    writeOutputToFile(dailyStatistics);
    console.log('Output written to output.json');
  } catch (error) {
    console.error('Error:', error.message);
  }
};
main();
