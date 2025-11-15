import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

type FilterType = "all" | "expense" | "saving";

export const TransactionsScreen = () => {
  const { expenses, emotions, categories } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [filter, setFilter] = useState<FilterType>("all");

  // Filtrar e ordenar transações
  const filteredExpenses = expenses
    .filter((e) => {
      if (filter === "all") return true;
      return e.type === filter;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Agrupar por data
  const groupedByDate = filteredExpenses.reduce((acc, expense) => {
    const dateKey = format(expense.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

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

  const styles = createStyles(colors);

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

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
      edges={["bottom"]}
    >
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
            name="list"
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

      {/* Lista de transações */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {Object.keys(groupedByDate).length > 0 ? (
          Object.entries(groupedByDate).map(([dateKey, transactions]) =>
            renderDateGroup(dateKey, transactions)
          )
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="receipt-outline"
              size={64}
              color={colors.gray[300]}
            />
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
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
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
  });
