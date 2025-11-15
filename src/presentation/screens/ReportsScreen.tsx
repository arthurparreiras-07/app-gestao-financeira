import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../application/store/useAppStore";
import { PieChart } from "react-native-chart-kit";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

export const ReportsScreen = () => {
  const { expenses, emotions, categories } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  // Cores distintas para cada emoção
  const emotionColors: Record<string, string> = {
    Feliz: "#10B981", // Verde vibrante
    Triste: "#3B82F6", // Azul
    Estressado: "#F59E0B", // Laranja
    Entediado: "#6B7280", // Cinza
    Empolgado: "#8B5CF6", // Roxo
    Ansioso: "#EF4444", // Vermelho
    Calmo: "#14B8A6", // Teal
  };

  // Separar gastos e economias
  const allExpenses = expenses.filter((e) => e.type === "expense");
  const allSavings = expenses.filter((e) => e.type === "saving");

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

  const screenWidth = Dimensions.get("window").width;
  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = allSavings.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalSavings - totalExpenses;

  const chartConfig = {
    color: (opacity = 1) => `rgba(31, 166, 114, ${opacity})`,
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView style={styles.container}>
        {/* Resumo Geral - Gastos */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="trending-down" size={24} color={colors.error} />
            <Text style={styles.summaryTitle}>Resumo de Gastos</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Quantidade</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                {allExpenses.length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Valor Total</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                R$ {totalExpenses.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Resumo Geral - Economias */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="trending-up" size={24} color={colors.success} />
            <Text style={styles.summaryTitle}>Resumo de Economias</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Quantidade</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                {allSavings.length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Valor Total</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                R$ {totalSavings.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

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
            <Text style={styles.summaryTitle}>Balanço Financeiro</Text>
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
            <Text style={styles.balanceDescription}>
              {balance >= 0
                ? "Parabéns! Você está economizando mais do que gastando! 🎉"
                : "Atenção! Seus gastos estão maiores que suas economias"}
            </Text>
          </View>
        </View>

        {/* Gráficos de Gastos */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Ionicons name="heart" size={20} color={colors.error} />
            <Text style={styles.chartTitle}>Gastos por Emoção</Text>
          </View>
          {expensesByEmotion.length > 0 ? (
            <PieChart
              data={expensesByEmotion}
              width={screenWidth - 40}
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
              width={screenWidth - 40}
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

        {/* Gráficos de Economias */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Ionicons name="heart" size={20} color={colors.success} />
            <Text style={styles.chartTitle}>Economias por Emoção</Text>
          </View>
          {savingsByEmotion.length > 0 ? (
            <PieChart
              data={savingsByEmotion}
              width={screenWidth - 40}
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
              width={screenWidth - 40}
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

        {/* Detalhamento de Gastos */}
        <View style={styles.detailsContainer}>
          <View style={styles.chartHeader}>
            <Ionicons name="list" size={20} color={colors.error} />
            <Text style={styles.chartTitle}>Detalhamento de Gastos</Text>
          </View>
          {expensesByEmotion.map((item, index) => (
            <View key={index} style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View
                  style={[styles.colorDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.detailName}>{item.name}</Text>
              </View>
              <Text style={[styles.detailAmount, { color: colors.error }]}>
                R$ {item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
          {expensesByEmotion.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum gasto registrado</Text>
            </View>
          )}
        </View>

        {/* Detalhamento de Economias */}
        <View style={styles.detailsContainer}>
          <View style={styles.chartHeader}>
            <Ionicons name="list" size={20} color={colors.success} />
            <Text style={styles.chartTitle}>Detalhamento de Economias</Text>
          </View>
          {savingsByEmotion.map((item, index) => (
            <View key={index} style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View
                  style={[styles.colorDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.detailName}>{item.name}</Text>
              </View>
              <Text style={[styles.detailAmount, { color: colors.success }]}>
                R$ {item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
          {savingsByEmotion.length === 0 && (
            <View style={styles.emptyState}>
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
    summaryCard: {
      backgroundColor: colors.background,
      margin: spacing.md,
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
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    summaryItem: {
      flex: 1,
      alignItems: "center",
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
    },
    summaryLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    summaryValue: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.primary[500],
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
      marginBottom: spacing.md,
    },
    balanceDescription: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
      textAlign: "center",
      lineHeight: 20,
      paddingHorizontal: spacing.lg,
    },
    chartContainer: {
      backgroundColor: colors.background,
      margin: spacing.md,
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
    emptyChart: {
      alignItems: "center",
      paddingVertical: spacing.xxl,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: spacing.lg,
    },
    emptyText: {
      textAlign: "center",
      color: colors.text.tertiary,
      fontSize: fontSize.sm,
      marginTop: spacing.sm,
      fontStyle: "italic",
    },
    detailsContainer: {
      backgroundColor: colors.background,
      margin: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    detailLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    detailName: {
      fontSize: fontSize.md,
      color: colors.text.primary,
      fontWeight: fontWeight.medium,
    },
    detailAmount: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.primary[500],
    },
  });
