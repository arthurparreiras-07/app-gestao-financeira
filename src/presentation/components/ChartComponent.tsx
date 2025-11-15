import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";

interface ChartData {
  labels?: string[];
  datasets?: Array<{ data: number[] }>;
  data?: Array<{
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }>;
}

interface ChartComponentProps {
  type: "pie" | "bar" | "line";
  data: ChartData;
  title?: string;
  width?: number;
  height?: number;
}

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#2196F3",
  },
};

export const ChartComponent: React.FC<ChartComponentProps> = ({
  type,
  data,
  title,
  width = screenWidth - 40,
  height = 220,
}) => {
  const renderChart = () => {
    switch (type) {
      case "pie":
        if (!data.data || data.data.length === 0) {
          return <Text style={styles.emptyText}>Nenhum dado disponível</Text>;
        }
        return (
          <PieChart
            data={data.data}
            width={width}
            height={height}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        );

      case "bar":
        if (!data.labels || !data.datasets || data.datasets.length === 0) {
          return <Text style={styles.emptyText}>Nenhum dado disponível</Text>;
        }
        return (
          <BarChart
            data={{
              labels: data.labels,
              datasets: data.datasets,
            }}
            width={width}
            height={height}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
            yAxisLabel="R$ "
            yAxisSuffix=""
            showValuesOnTopOfBars
          />
        );

      case "line":
        if (!data.labels || !data.datasets || data.datasets.length === 0) {
          return <Text style={styles.emptyText}>Nenhum dado disponível</Text>;
        }
        return (
          <LineChart
            data={{
              labels: data.labels,
              datasets: data.datasets,
            }}
            width={width}
            height={height}
            chartConfig={chartConfig}
            bezier
            yAxisLabel="R$ "
            fromZero
          />
        );

      default:
        return (
          <Text style={styles.emptyText}>Tipo de gráfico não suportado</Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartWrapper}>{renderChart()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  chartWrapper: {
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    paddingVertical: 40,
  },
});
