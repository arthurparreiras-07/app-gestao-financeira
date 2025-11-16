import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppStore } from "../../application/store/useAppStore";
import { PieChart, LineChart } from "react-native-chart-kit";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";
import { StatisticsCard } from "../components/StatisticsCard";
import {
  calculateStatistics,
  groupByMonth,
  calculateTrend,
  getTopCategories,
} from "../../utils/statistics";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DrawerHeader } from "../components/DrawerHeader";

type PeriodType = "all" | "month" | "3months" | "6months" | "year";

export const ReportsScreen = () => {
  const { expenses, emotions, categories } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("month");

  // Filtrar despesas por período
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case "month":
        startDate = startOfMonth(now);
        break;
      case "3months":
        startDate = startOfMonth(subMonths(now, 2));
        break;
      case "6months":
        startDate = startOfMonth(subMonths(now, 5));
        break;
      case "year":
        startDate = startOfMonth(subMonths(now, 11));
        break;
      default:
        return expenses;
    }

    return expenses.filter((e) => e.date >= startDate);
  }, [expenses, selectedPeriod]);

  // Período anterior para comparação
  const previousPeriodExpenses = useMemo(() => {
    if (selectedPeriod === "all") return [];

    const now = new Date();
    let previousStart: Date;
    let previousEnd: Date;

    switch (selectedPeriod) {
      case "month":
        previousStart = startOfMonth(subMonths(now, 1));
        previousEnd = endOfMonth(subMonths(now, 1));
        break;
      case "3months":
        previousStart = startOfMonth(subMonths(now, 5));
        previousEnd = endOfMonth(subMonths(now, 3));
        break;
      case "6months":
        previousStart = startOfMonth(subMonths(now, 11));
        previousEnd = endOfMonth(subMonths(now, 6));
        break;
      case "year":
        previousStart = startOfMonth(subMonths(now, 23));
        previousEnd = endOfMonth(subMonths(now, 12));
        break;
      default:
        return [];
    }

    return expenses.filter(
      (e) => e.date >= previousStart && e.date <= previousEnd
    );
  }, [expenses, selectedPeriod]);

  // Cores distintas para cada emoção
  const emotionColors: Record<string, string> = {
    Feliz: "#10B981",
    Triste: "#3B82F6",
    Estressado: "#F59E0B",
    Entediado: "#6B7280",
    Empolgado: "#8B5CF6",
    Ansioso: "#EF4444",
    Calmo: "#14B8A6",
  };

  // Separar gastos e economias
  const allExpenses = filteredExpenses.filter((e) => e.type === "expense");
  const allSavings = filteredExpenses.filter((e) => e.type === "saving");

  const previousExpenses = previousPeriodExpenses.filter(
    (e) => e.type === "expense"
  );
  const previousSavings = previousPeriodExpenses.filter(
    (e) => e.type === "saving"
  );

  // Estatísticas
  const expenseStats = calculateStatistics(allExpenses);
  const savingsStats = calculateStatistics(allSavings);

  // Tendências
  const expenseTrend = calculateTrend(allExpenses, previousExpenses);
  const savingsTrend = calculateTrend(allSavings, previousSavings);

  // Top categorias
  const topExpenseCategories = getTopCategories(allExpenses, categories, 5);
  const topSavingsCategories = getTopCategories(allSavings, categories, 5);

  // GASTOS por emoção
  const expensesByEmotion = emotions
    .map((emotion) => {
      const emotionExpenses = allExpenses.filter(
        (e) => e.emotionId === emotion.id
      );
      const total = emotionExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: emotion.name,
        amount: total,
        color: emotionColors[emotion.name] || colors.primary[500],
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
      };
    })
    .filter((item) => item.amount > 0);

  // ECONOMIAS por emoção
  const savingsByEmotion = emotions
    .map((emotion) => {
      const emotionSavings = allSavings.filter(
        (e) => e.emotionId === emotion.id
      );
      const total = emotionSavings.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: emotion.name,
        amount: total,
        color: emotionColors[emotion.name] || colors.success,
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
      };
    })
    .filter((item) => item.amount > 0);

  // GASTOS por categoria
  const expensesByCategory = categories
    .map((category) => {
      const categoryExpenses = allExpenses.filter(
        (e) => e.categoryId === category.id
      );
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: category.name,
        amount: total,
        color: category.color,
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
      };
    })
    .filter((item) => item.amount > 0);

  // ECONOMIAS por categoria
  const savingsByCategory = categories
    .map((category) => {
      const categorySavings = allSavings.filter(
        (e) => e.categoryId === category.id
      );
      const total = categorySavings.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: category.name,
        amount: total,
        color: category.color,
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
      };
    })
    .filter((item) => item.amount > 0);

  // Dados para gráfico de linha (evolução mensal)
  const monthlyData = useMemo(() => {
    const grouped = groupByMonth(filteredExpenses);
    const months = Object.keys(grouped).sort().slice(-6); // Últimos 6 meses

    const expensesData = months.map((month) => {
      const monthExpenses = grouped[month].filter((e) => e.type === "expense");
      return monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    });

    const savingsData = months.map((month) => {
      const monthSavings = grouped[month].filter((e) => e.type === "saving");
      return monthSavings.reduce((sum, e) => sum + e.amount, 0);
    });

    return {
      labels: months.map((m) => {
        const [year, month] = m.split("-");
        return format(new Date(parseInt(year), parseInt(month) - 1), "MMM", {
          locale: ptBR,
        });
      }),
      datasets: [
        {
          data: expensesData.length > 0 ? expensesData : [0],
          color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: savingsData.length > 0 ? savingsData : [0],
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ["Gastos", "Economias"],
    };
  }, [filteredExpenses]);

  const screenWidth = Dimensions.get("window").width;
  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = allSavings.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalSavings - totalExpenses;

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) => `rgba(31, 166, 114, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const styles = createStyles(colors);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "month":
        return "Este Mês";
      case "3months":
        return "Últimos 3 Meses";
      case "6months":
        return "Últimos 6 Meses";
      case "year":
        return "Último Ano";
      default:
        return "Todos";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DrawerHeader title="Relatórios" />
      <ScrollView style={styles.container}>
        {/* Seletor de Período */}
        <View style={styles.periodSelector}>
          <Text style={styles.periodTitle}>Período</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.periodButtons}>
              {(
                ["month", "3months", "6months", "year", "all"] as PeriodType[]
              ).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period &&
                        styles.periodButtonTextActive,
                    ]}
                  >
                    {period === "month"
                      ? "1 Mês"
                      : period === "3months"
                      ? "3 Meses"
                      : period === "6months"
                      ? "6 Meses"
                      : period === "year"
                      ? "1 Ano"
                      : "Tudo"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Comparação com Período Anterior */}
        {selectedPeriod !== "all" && (
          <View style={styles.comparisonContainer}>
            <View style={styles.comparisonCard}>
              <View style={styles.comparisonHeader}>
                <Ionicons name="trending-down" size={20} color={colors.error} />
                <Text style={styles.comparisonTitle}>Gastos</Text>
              </View>
              <Text style={[styles.comparisonValue, { color: colors.error }]}>
                R$ {expenseStats.total.toFixed(2)}
              </Text>
              <View style={styles.trendContainer}>
                <Ionicons
                  name={
                    expenseTrend.direction === "up"
                      ? "trending-up"
                      : expenseTrend.direction === "down"
                      ? "trending-down"
                      : "remove"
                  }
                  size={16}
                  color={
                    expenseTrend.direction === "up"
                      ? colors.error
                      : expenseTrend.direction === "down"
                      ? colors.success
                      : colors.text.tertiary
                  }
                />
                <Text
                  style={[
                    styles.trendText,
                    {
                      color:
                        expenseTrend.direction === "up"
                          ? colors.error
                          : expenseTrend.direction === "down"
                          ? colors.success
                          : colors.text.tertiary,
                    },
                  ]}
                >
                  {expenseTrend.percentage.toFixed(1)}% vs período anterior
                </Text>
              </View>
            </View>

            <View style={styles.comparisonCard}>
              <View style={styles.comparisonHeader}>
                <Ionicons name="trending-up" size={20} color={colors.success} />
                <Text style={styles.comparisonTitle}>Economias</Text>
              </View>
              <Text style={[styles.comparisonValue, { color: colors.success }]}>
                R$ {savingsStats.total.toFixed(2)}
              </Text>
              <View style={styles.trendContainer}>
                <Ionicons
                  name={
                    savingsTrend.direction === "up"
                      ? "trending-up"
                      : savingsTrend.direction === "down"
                      ? "trending-down"
                      : "remove"
                  }
                  size={16}
                  color={
                    savingsTrend.direction === "up"
                      ? colors.success
                      : savingsTrend.direction === "down"
                      ? colors.error
                      : colors.text.tertiary
                  }
                />
                <Text
                  style={[
                    styles.trendText,
                    {
                      color:
                        savingsTrend.direction === "up"
                          ? colors.success
                          : savingsTrend.direction === "down"
                          ? colors.error
                          : colors.text.tertiary,
                    },
                  ]}
                >
                  {savingsTrend.percentage.toFixed(1)}% vs período anterior
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Balanço Financeiro */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor:
                balance >= 0 ? `${colors.success}15` : `${colors.error}15`,
              borderLeftWidth: 4,
              borderLeftColor: balance >= 0 ? colors.success : colors.error,
            },
          ]}
        >
          <View style={styles.summaryHeader}>
            <Ionicons
              name={balance >= 0 ? "checkmark-circle" : "alert-circle"}
              size={24}
              color={balance >= 0 ? colors.success : colors.error}
            />
            <Text style={styles.summaryTitle}>
              Balanço - {getPeriodLabel()}
            </Text>
          </View>
          <View style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>
              {balance >= 0 ? "Saldo Positivo" : "Saldo Negativo"}
            </Text>
            <Text
              style={[
                styles.balanceValue,
                { color: balance >= 0 ? colors.success : colors.error },
              ]}
            >
              {balance >= 0 ? "+" : ""}R$ {balance.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Estatísticas Detalhadas */}
        {allExpenses.length > 0 && (
          <StatisticsCard
            title="Estatísticas de Gastos"
            icon="trending-down"
            iconColor={colors.error}
            data={expenseStats}
            isDark={isDark}
          />
        )}

        {allSavings.length > 0 && (
          <StatisticsCard
            title="Estatísticas de Economias"
            icon="trending-up"
            iconColor={colors.success}
            data={savingsStats}
            isDark={isDark}
          />
        )}

        {/* Gráfico de Evolução Temporal */}
        {monthlyData.datasets[0].data.length > 1 && (
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Ionicons
                name="analytics"
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles.chartTitle}>Evolução Mensal</Text>
            </View>
            <LineChart
              data={monthlyData}
              width={screenWidth - 56}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.lineChart}
              withDots={true}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={true}
            />
          </View>
        )}

        {/* Top Categorias de Gastos */}
        {topExpenseCategories.length > 0 && (
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Ionicons name="trophy" size={20} color={colors.error} />
              <Text style={styles.chartTitle}>Top Categorias de Gastos</Text>
            </View>
            {topExpenseCategories.map((item, index) => (
              <View key={index} style={styles.topItem}>
                <View style={styles.topLeft}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}º</Text>
                  </View>
                  <Text style={styles.topName}>{item.categoryName}</Text>
                </View>
                <View style={styles.topRight}>
                  <Text style={[styles.topAmount, { color: colors.error }]}>
                    R$ {item.total.toFixed(2)}
                  </Text>
                  <Text style={styles.topCount}>{item.count}x</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Top Categorias de Economias */}
        {topSavingsCategories.length > 0 && (
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Ionicons name="trophy" size={20} color={colors.success} />
              <Text style={styles.chartTitle}>Top Categorias de Economias</Text>
            </View>
            {topSavingsCategories.map((item, index) => (
              <View key={index} style={styles.topItem}>
                <View style={styles.topLeft}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}º</Text>
                  </View>
                  <Text style={styles.topName}>{item.categoryName}</Text>
                </View>
                <View style={styles.topRight}>
                  <Text style={[styles.topAmount, { color: colors.success }]}>
                    R$ {item.total.toFixed(2)}
                  </Text>
                  <Text style={styles.topCount}>{item.count}x</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Gráficos de Pizza - Gastos */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Ionicons name="heart" size={20} color={colors.error} />
            <Text style={styles.chartTitle}>Gastos por Emoção</Text>
          </View>
          {expensesByEmotion.length > 0 ? (
            <PieChart
              data={expensesByEmotion}
              width={screenWidth - 56}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <View style={styles.emptyChart}>
              <Ionicons
                name="bar-chart-outline"
                size={48}
                color={colors.gray[300]}
              />
              <Text style={styles.emptyText}>Nenhum gasto registrado</Text>
            </View>
          )}
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Ionicons name="pricetags" size={20} color={colors.error} />
            <Text style={styles.chartTitle}>Gastos por Categoria</Text>
          </View>
          {expensesByCategory.length > 0 ? (
            <PieChart
              data={expensesByCategory}
              width={screenWidth - 56}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <View style={styles.emptyChart}>
              <Ionicons
                name="pie-chart-outline"
                size={48}
                color={colors.gray[300]}
              />
              <Text style={styles.emptyText}>Nenhum gasto registrado</Text>
            </View>
          )}
        </View>

        {/* Gráficos de Pizza - Economias */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Ionicons name="heart" size={20} color={colors.success} />
            <Text style={styles.chartTitle}>Economias por Emoção</Text>
          </View>
          {savingsByEmotion.length > 0 ? (
            <PieChart
              data={savingsByEmotion}
              width={screenWidth - 56}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <View style={styles.emptyChart}>
              <Ionicons
                name="bar-chart-outline"
                size={48}
                color={colors.gray[300]}
              />
              <Text style={styles.emptyText}>Nenhuma economia registrada</Text>
            </View>
          )}
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Ionicons name="pricetags" size={20} color={colors.success} />
            <Text style={styles.chartTitle}>Economias por Categoria</Text>
          </View>
          {savingsByCategory.length > 0 ? (
            <PieChart
              data={savingsByCategory}
              width={screenWidth - 56}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <View style={styles.emptyChart}>
              <Ionicons
                name="pie-chart-outline"
                size={48}
                color={colors.gray[300]}
              />
              <Text style={styles.emptyText}>Nenhuma economia registrada</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    periodSelector: {
      backgroundColor: colors.background,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    periodTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    periodButtons: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    periodButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    periodButtonActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    periodButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
    },
    periodButtonTextActive: {
      color: colors.text.inverse,
    },
    comparisonContainer: {
      flexDirection: "row",
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    comparisonCard: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    comparisonHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    comparisonTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
    },
    comparisonValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.xs,
    },
    trendContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    trendText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
    },
    summaryCard: {
      backgroundColor: colors.background,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      ...shadows.md,
    },
    summaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    summaryTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    balanceContent: {
      alignItems: "center",
      paddingVertical: spacing.md,
    },
    balanceLabel: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 1,
      fontWeight: fontWeight.semibold,
    },
    balanceValue: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
    },
    chartContainer: {
      backgroundColor: colors.background,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    chartHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    chartTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    lineChart: {
      marginVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    emptyChart: {
      alignItems: "center",
      paddingVertical: spacing.xxl,
    },
    emptyText: {
      textAlign: "center",
      color: colors.text.tertiary,
      fontSize: fontSize.sm,
      marginTop: spacing.sm,
      fontStyle: "italic",
    },
    topItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    topLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      flex: 1,
    },
    rankBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary[500],
      justifyContent: "center",
      alignItems: "center",
    },
    rankText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.inverse,
    },
    topName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
      flex: 1,
    },
    topRight: {
      alignItems: "flex-end",
    },
    topAmount: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.xs,
    },
    topCount: {
      fontSize: fontSize.xs,
      color: colors.text.tertiary,
    },
  });
