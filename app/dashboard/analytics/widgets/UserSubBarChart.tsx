import React, { useState, useMemo } from "react";
import { BarChart } from "@mantine/charts";
import { Select, Text, Group, Paper, useMantineTheme } from "@mantine/core";
import { motion } from "framer-motion";
import Skeleton from "@/components/ui/skeleton";
import AnalyticsCardWrap from "./AnalyticsCardWrap";

interface UserSubBarChartProps {
  id: string;
  allCreatorsTotalClicks: { id: string; name: string; totalClicks: number }[];
  allCreatorsTotalDMs: { id: string; name: string; totalDMs: number }[];
  allCreatorsTotalGreetings: {
    id: string;
    name: string;
    totalGreetings: number;
  }[];
  allCreatorsTotalFollowUps: {
    id: string;
    name: string;
    totalFollowUps: number;
  }[];
  isLoading: boolean;
}

type MetricKey =
  | "totalClicks"
  | "totalDMs"
  | "totalGreetings"
  | "totalFollowUps";

const UserSubBarChart: React.FC<UserSubBarChartProps> = ({
  id,
  allCreatorsTotalClicks,
  allCreatorsTotalDMs,
  allCreatorsTotalGreetings,
  allCreatorsTotalFollowUps,
  isLoading,
}) => {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricKey>("totalClicks");
  const theme = useMantineTheme();

  console.log("> All creators total clicks", allCreatorsTotalClicks);
  const chartData = useMemo(() => {
    const data = allCreatorsTotalClicks.map((creator) => ({
      name: creator.name,
      totalClicks: creator.totalClicks,
      totalDMs:
        allCreatorsTotalDMs.find((c) => c.id === creator.id)?.totalDMs || 0,
      totalGreetings:
        allCreatorsTotalGreetings.find((c) => c.id === creator.id)
          ?.totalGreetings || 0,
      totalFollowUps:
        allCreatorsTotalFollowUps.find((c) => c.id === creator.id)
          ?.totalFollowUps || 0,
    }));
    return data
      .sort((a, b) => b[selectedMetric] - a[selectedMetric])
      .slice(0, 10);
  }, [
    allCreatorsTotalClicks,
    allCreatorsTotalDMs,
    allCreatorsTotalGreetings,
    allCreatorsTotalFollowUps,
    selectedMetric,
  ]);

  const getColor = (metric: MetricKey): string => {
    switch (metric) {
      case "totalClicks":
        return theme.colors.blue[6];
      case "totalDMs":
        return theme.colors.green[6];
      case "totalGreetings":
        return theme.colors.yellow[6];
      case "totalFollowUps":
        return theme.colors.red[6];
      default:
        return theme.colors.gray[6];
    }
  };

  const totalEngagement = chartData.reduce(
    (sum, item) => sum + item[selectedMetric],
    0
  );

  const gradientId = `gradient-${id}`;

  if (isLoading) {
    return (
      <Paper shadow="sm" radius="md" p="xl" style={{ height: "100%" }}>
        <Skeleton width="200px" height="24px" />
        <Group justify="apart" mb="md" mt="md">
          <Skeleton width="150px" height="20px" />
          <Skeleton width="120px" height="36px" />
        </Group>
        <Group justify="apart" mb="xl">
          <Skeleton width="100px" height="16px" />
          <Skeleton width="80px" height="24px" />
        </Group>
        <Skeleton width="100%" height="300px" />
      </Paper>
    );
  }

  return (
    <AnalyticsCardWrap id="userSubBarChart" padding="pt-6 pb-14 pl-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Group justify="apart" mb="md" align="start">
          <Text size="xl" fw={700} color={theme.colors.gray[8]}>
            Creator Engagement Metrics
          </Text>
          <Select
            value={selectedMetric}
            onChange={(value) => setSelectedMetric(value as MetricKey)}
            data={[
              { value: "totalClicks", label: "Total Clicks" },
              { value: "totalDMs", label: "Total DMs" },
              { value: "totalGreetings", label: "Total Greetings" },
              { value: "totalFollowUps", label: "Total Follow-ups" },
            ]}
          />
        </Group>

        <Group justify="apart" mb="xl">
          <Text size="sm" color={theme.colors.gray[6]}>
            Total {selectedMetric.replace(/([A-Z])/g, " $1").trim()}
          </Text>
          <Text size="xl" fw={700} color={theme.colors.gray[8]}>
            {totalEngagement.toLocaleString()}
          </Text>
        </Group>

        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={getColor(selectedMetric)}
                stopOpacity="0.8"
              />
              <stop
                offset="100%"
                stopColor={getColor(selectedMetric)}
                stopOpacity="0.3"
              />
            </linearGradient>
          </defs>
        </svg>

        <BarChart
          h={300}
          data={chartData}
          dataKey="name"
          series={[{ name: selectedMetric, color: `url(#${gradientId})` }]}
          tickLine="x"
          gridAxis="y"
          barProps={{ radius: 4 }}
          yAxisProps={{ color: theme.colors.gray[6] }}
          xAxisProps={{ color: theme.colors.gray[6] }}
          tooltipProps={{
            content: ({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div
                    style={{
                      background: theme.white,
                      padding: theme.spacing.sm,
                      borderRadius: theme.radius.sm,
                      border: `1px solid ${theme.colors.gray[3]}`,
                      boxShadow: theme.shadows.sm,
                    }}
                  >
                    <Text size="sm" fw={500} color={theme.colors.gray[8]}>
                      {payload[0].payload.name}
                    </Text>
                    <Text
                      size="xs"
                      color={theme.colors.gray[6]}
                    >{`${selectedMetric
                      .replace(/([A-Z])/g, " $1")
                      .trim()}: ${payload[0].value.toLocaleString()}`}</Text>
                  </div>
                );
              }
              return null;
            },
          }}
        />
      </motion.div>
    </AnalyticsCardWrap>
  );
};

export default UserSubBarChart;
