import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../application/store/useAppStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";
import { Expense } from "../../domain/entities/Expense";
import { PieChart } from "react-native-chart-kit";

type FilterType = "all" | "expense" | "saving";
type TabType = "list" | "reports";

export const TransactionsScreen = () => {
  const { expenses, emotions, categories } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeTab, setActiveTab] = useState<TabType>("list");

  const screenWidth = Dimensions.get("window").width;

  // Cores para emoções
  const emotionColors: Record<string, string> = {
    Feliz: "#10B981",
    Triste: "#3B82F6",
    Estressado: "#F59E0B",
    Entediado: "#6B7280",
    Empolgado: "#8B5CF6",
    Ansioso: "#EF4444",
    Calmo: "#14B8A6",
  };

  // Filtrar transações
  const filteredExpenses = expenses
    .filter((e) => {
      if (filter === "all") return true;
      return e.type === filter;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Separar gastos e economias
  const allExpenses = filteredExpenses.filter((e) => e.type === "expense");
  const allSavings = filteredExpenses.filter((e) => e.type === "saving");
  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = allSavings.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalSavings - totalExpenses;

  // Agrupar por data (para lista)
  const groupedByDate = filteredExpenses.reduce((acc, expense) => {
    const dateKey = format(expense.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Dados para gráficos (relatórios)
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

  const getEmotionName = (emotionId: number) => {
    const emotion = emotions.find((e) => e.id === emotionId);
    return emotion ? emotion.name : "Desconhecido";
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Desconhecido";
  };

  const getCategoryColor = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.color : colors.primary[500];
  };

  const chartConfig = {
    color: (opacity = 1) => `rgba(31, 166, 114, ${opacity})`,
  };

  const styles = createStyles(colors);

  // Renderizar transação individual
  const renderTransaction = (expense: Expense) => {
    const isExpense = expense.type === "expense";
    const categoryColor = getCategoryColor(expense.categoryId);

    return (
      <View key={expense.id} style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionLeft}>
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: `${categoryColor}20` },
              ]}
            >
              <Ionicons
                name={isExpense ? "trending-down" : "trending-up"}
                size={20}
                color={categoryColor}
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionCategory}>
                {getCategoryName(expense.categoryId)}
              </Text>
              <View style={styles.transactionMeta}>
                <Ionicons name="heart" size={12} color={colors.text.tertiary} />
                <Text style={styles.transactionEmotion}>
                  {getEmotionName(expense.emotionId)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.transactionRight}>
            <Text
              style={[
                styles.transactionAmount,
                { color: isExpense ? colors.error : colors.success },
              ]}
            >
              {isExpense ? "-" : "+"}R$ {expense.amount.toFixed(2)}
            </Text>
            <Text style={styles.transactionTime}>
              {format(expense.date, "HH:mm")}
            </Text>
          </View>
        </View>
        {expense.note && (
          <Text style={styles.transactionNote} numberOfLines={2}>
            {expense.note}
          </Text>
        )}
      </View>
    );
  };

  // Renderizar grupo de data
  const renderDateGroup = (dateKey: string, transactions: Expense[]) => {
    const date = new Date(dateKey);
    const isToday = format(new Date(), "yyyy-MM-dd") === dateKey;
    const isYesterday =
      format(new Date(Date.now() - 86400000), "yyyy-MM-dd") === dateKey;

    let dateLabel = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
    if (isToday) dateLabel = "Hoje";
    if (isYesterday) dateLabel = "Ontem";

    const dayTotal = transactions.reduce((sum, t) => {
      if (t.type === "expense") return sum - t.amount;
      return sum + t.amount;
    }, 0);

    return (
      <View key={dateKey} style={styles.dateGroup}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <Text
            style={[
              styles.dateTotal,
              { color: dayTotal >= 0 ? colors.success : colors.error },
            ]}
          >
            {dayTotal >= 0 ? "+" : ""}R$ {Math.abs(dayTotal).toFixed(2)}
          </Text>
        </View>
        {transactions.map(renderTransaction)}
      </View>
    );
  };

  // Renderizar aba de lista
  const renderListTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {Object.keys(groupedByDate).length > 0 ? (
        Object.entries(groupedByDate).map(([dateKey, transactions]) =>
          renderDateGroup(dateKey, transactions)
        )
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color={colors.gray[300]} />
          <Text style={styles.emptyText}>
            {filter === "all"
              ? "Nenhuma transação registrada"
              : filter === "expense"
              ? "Nenhum gasto registrado"
              : "Nenhuma economia registrada"}
          </Text>
        </View>
      )}
    </ScrollView>
  );

  // Renderizar aba de relatórios
  const renderReportsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Resumo Geral */}
      {filter === "all" && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="wallet" size={24} color={colors.primary[500]} />
            <Text style={styles.summaryTitle}>Resumo Geral</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Gastos</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                R$ {totalExpenses.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Economias</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                R$ {totalSavings.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Balanço:</Text>
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
      )}

      {/* Gráficos de Gastos */}
      {(filter === "all" || filter === "expense") && allExpenses.length > 0 && (
        <>
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
                <Text style={styles.emptyText}>Nenhum dado disponível</Text>
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
                <Text style={styles.emptyText}>Nenhum dado disponível</Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Gráficos de Economias */}
      {(filter === "all" || filter === "saving") && allSavings.length > 0 && (
        <>
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
                <Text style={styles.emptyText}>Nenhum dado disponível</Text>
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
                <Text style={styles.emptyText}>Nenhum dado disponível</Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Estado vazio quando não há dados */}
      {filteredExpenses.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name="stats-chart-outline"
            size={64}
            color={colors.gray[300]}
          />
          <Text style={styles.emptyText}>
            Nenhum dado para exibir relatórios
          </Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
      edges={["bottom"]}
    >
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "list" && styles.tabActive]}
          onPress={() => setActiveTab("list")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="list"
            size={20}
            color={
              activeTab === "list" ? colors.primary[500] : colors.text.secondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "list" && styles.tabTextActive,
            ]}
          >
            Lista
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "reports" && styles.tabActive]}
          onPress={() => setActiveTab("reports")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="stats-chart"
            size={20}
            color={
              activeTab === "reports"
                ? colors.primary[500]
                : colors.text.secondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "reports" && styles.tabTextActive,
            ]}
          >
            Relatórios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="grid"
            size={18}
            color={
              filter === "all" ? colors.primary[500] : colors.text.secondary
            }
          />
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "expense" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("expense")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trending-down"
            size={18}
            color={filter === "expense" ? colors.error : colors.text.secondary}
          />
          <Text
            style={[
              styles.filterText,
              filter === "expense" && styles.filterTextActive,
            ]}
          >
            Gastos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "saving" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("saving")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trending-up"
            size={18}
            color={filter === "saving" ? colors.success : colors.text.secondary}
          />
          <Text
            style={[
              styles.filterText,
              filter === "saving" && styles.filterTextActive,
            ]}
          >
            Economias
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo da aba ativa */}
      {activeTab === "list" ? renderListTab() : renderReportsTab()}
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      paddingVertical: spacing.md,
      borderBottomWidth: 3,
      borderBottomColor: "transparent",
    },
    tabActive: {
      borderBottomColor: colors.primary[500],
    },
    tabText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
    },
    tabTextActive: {
      color: colors.primary[500],
      fontWeight: fontWeight.bold,
    },
    filterContainer: {
      flexDirection: "row",
      padding: spacing.md,
      gap: spacing.sm,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonActive: {
      backgroundColor: `${colors.primary[500]}15`,
      borderColor: colors.primary[500],
    },
    filterText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    filterTextActive: {
      color: colors.primary[600],
      fontWeight: fontWeight.bold,
    },
    tabContent: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    dateGroup: {
      marginBottom: spacing.lg,
    },
    dateHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
    },
    dateLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textTransform: "capitalize",
    },
    dateTotal: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    transactionCard: {
      backgroundColor: colors.background,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    transactionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    transactionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      flex: 1,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
    },
    transactionInfo: {
      flex: 1,
    },
    transactionCategory: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    transactionMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    transactionEmotion: {
      fontSize: fontSize.xs,
      color: colors.text.tertiary,
    },
    transactionRight: {
      alignItems: "flex-end",
    },
    transactionAmount: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.xs,
    },
    transactionTime: {
      fontSize: fontSize.xs,
      color: colors.text.tertiary,
    },
    transactionNote: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.md,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      lineHeight: 18,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xxl * 2,
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      fontSize: fontSize.md,
      color: colors.text.tertiary,
      textAlign: "center",
      marginTop: spacing.md,
      fontStyle: "italic",
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
      marginBottom: spacing.md,
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
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
    },
    balanceRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    balanceLabel: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      fontWeight: fontWeight.semibold,
    },
    balanceValue: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
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
  });
