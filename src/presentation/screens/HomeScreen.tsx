import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../application/store/useAppStore";
import { InsightCard } from "../components/InsightCard";
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

export const HomeScreen = ({ navigation }: any) => {
  const { expenses, insights, loading, loadData } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  useEffect(() => {
    loadData();
  }, []);

  // Calcular gastos e economias separadamente
  const allExpenses = expenses.filter((e) => e.type === "expense");
  const allSavings = expenses.filter((e) => e.type === "saving");

  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = allSavings.reduce((sum, e) => sum + e.amount, 0);

  const thisMonthExpenses = allExpenses.filter(
    (e) => e.date.getMonth() === new Date().getMonth()
  );
  const thisMonthSavings = allSavings.filter(
    (e) => e.date.getMonth() === new Date().getMonth()
  );

  const monthExpensesTotal = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const monthSavingsTotal = thisMonthSavings.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const styles = createStyles(colors);

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
        edges={["top", "bottom"]}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
      edges={["bottom"]}
    >
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>MindBudget</Text>
              <Text style={styles.subtitle}>
                {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </Text>
            </View>
            <Ionicons name="wallet" size={32} color={colors.text.inverse} />
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons
                name="cash-outline"
                size={24}
                color={colors.primary[500]}
              />
            </View>
            <Text style={styles.summaryLabel}>Total Gasto</Text>
            <Text style={styles.summaryValue}>
              R$ {totalExpenses.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: colors.success + "15" },
              ]}
            >
              <Ionicons name="trending-up" size={24} color={colors.success} />
            </View>
            <Text style={styles.summaryLabel}>Economias</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              R$ {totalSavings.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={colors.secondary[500]}
              />
            </View>
            <Text style={styles.summaryLabel}>Gastos do Mês</Text>
            <Text style={styles.summaryValue}>
              R$ {monthExpensesTotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: colors.success + "15" },
              ]}
            >
              <Ionicons
                name="calendar-clear-outline"
                size={24}
                color={colors.success}
              />
            </View>
            <Text style={styles.summaryLabel}>Economias do Mês</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              R$ {monthSavingsTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddExpense")}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={20} color={colors.text.inverse} />
          <Text style={styles.addButtonText}>Adicionar Transação</Text>
        </TouchableOpacity>

        <View style={styles.insightsContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb" size={20} color={colors.primary[500]} />
            <Text style={styles.sectionTitle}>Insights</Text>
          </View>
          {insights.length > 0 ? (
            insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="analytics-outline"
                size={48}
                color={colors.gray[300]}
              />
              <Text style={styles.emptyText}>
                Adicione gastos para receber insights personalizados
              </Text>
            </View>
          )}
        </View>

        <View style={styles.recentContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.primary[500]}
            />
            <Text style={styles.sectionTitle}>Gastos Recentes</Text>
          </View>
          {expenses.slice(0, 5).length > 0 ? (
            expenses.slice(0, 5).map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={styles.expenseLeft}>
                  <View style={styles.expenseIconContainer}>
                    <Ionicons
                      name="receipt-outline"
                      size={20}
                      color={colors.primary[500]}
                    />
                  </View>
                  <View>
                    <Text style={styles.expenseAmount}>
                      R$ {expense.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.expenseDate}>
                      {format(expense.date, "dd/MM/yyyy")}
                    </Text>
                  </View>
                </View>
                {expense.note && (
                  <Text style={styles.expenseNote} numberOfLines={1}>
                    {expense.note}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-outline"
                size={48}
                color={colors.gray[300]}
              />
              <Text style={styles.emptyText}>
                Nenhum gasto registrado ainda
              </Text>
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary[500],
      paddingTop: 60,
      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      color: colors.text.inverse,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: fontSize.sm,
      color: colors.text.inverse,
      opacity: 0.9,
    },
    summaryContainer: {
      flexDirection: "row",
      padding: spacing.md,
      gap: spacing.md,
      marginTop: -spacing.lg,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      ...shadows.md,
    },
    summaryIconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: `${colors.primary[500]}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    summaryLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
      fontWeight: fontWeight.medium,
    },
    summaryValue: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    addButton: {
      backgroundColor: colors.primary[500],
      marginHorizontal: spacing.md,
      marginVertical: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      ...shadows.md,
      elevation: 5,
      zIndex: 10,
    },
    addButtonText: {
      color: colors.text.inverse,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
    insightsContainer: {
      padding: spacing.md,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    emptyState: {
      backgroundColor: colors.background,
      padding: spacing.xl,
      borderRadius: borderRadius.lg,
      alignItems: "center",
      ...shadows.sm,
    },
    emptyText: {
      textAlign: "center",
      color: colors.text.tertiary,
      fontSize: fontSize.sm,
      marginTop: spacing.sm,
      fontStyle: "italic",
    },
    recentContainer: {
      padding: spacing.md,
    },
    expenseItem: {
      backgroundColor: colors.background,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.sm,
      ...shadows.sm,
    },
    expenseLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    expenseIconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: `${colors.secondary[500]}15`,
      justifyContent: "center",
      alignItems: "center",
    },
    expenseAmount: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
    },
    expenseDate: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    expenseNote: {
      fontSize: fontSize.sm,
      color: colors.text.tertiary,
      marginTop: spacing.sm,
      marginLeft: 56,
    },
  });
