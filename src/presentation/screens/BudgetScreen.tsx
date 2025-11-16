import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppStore } from "../../application/store/useAppStore";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

export const BudgetScreen = ({ navigation }: any) => {
  const {
    budgets,
    categories,
    expenses,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
  } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [alertThreshold, setAlertThreshold] = useState("80");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const styles = createStyles(colors);

  // Get current month/year budgets
  const currentBudgets = useMemo(() => {
    return budgets.filter(
      (b) => b.month === selectedMonth && b.year === selectedYear
    );
  }, [budgets, selectedMonth, selectedYear]);

  // Calculate total budget and spending
  const totals = useMemo(() => {
    const generalBudget = currentBudgets.find((b) => b.categoryId === null);
    const categoryBudgets = currentBudgets.filter((b) => b.categoryId !== null);

    let totalLimit = generalBudget?.monthlyLimit || 0;
    categoryBudgets.forEach((b) => {
      totalLimit += b.monthlyLimit;
    });

    const monthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        expenseDate.getMonth() + 1 === selectedMonth &&
        expenseDate.getFullYear() === selectedYear &&
        e.type === "expense"
      );
    });

    const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

    return { totalLimit, totalSpent };
  }, [currentBudgets, expenses, selectedMonth, selectedYear]);

  const getCategoryName = (categoryId: number | null) => {
    if (categoryId === null) return "Geral";
    return categories.find((c) => c.id === categoryId)?.name || "Desconhecido";
  };

  const handleSaveBudget = async () => {
    if (!monthlyLimit) {
      Alert.alert("Erro", "Digite o valor do orçamento");
      return;
    }

    const limit = parseFloat(monthlyLimit.replace(",", "."));
    if (isNaN(limit) || limit <= 0) {
      Alert.alert("Erro", "Valor inválido");
      return;
    }

    const threshold = parseFloat(alertThreshold);
    if (isNaN(threshold) || threshold < 0 || threshold > 100) {
      Alert.alert("Erro", "Limite de alerta deve estar entre 0 e 100%");
      return;
    }

    try {
      if (editingBudget) {
        await updateBudget(editingBudget, {
          monthlyLimit: limit,
          alertThreshold: threshold,
        });
        Alert.alert("Sucesso", "Orçamento atualizado!");
      } else {
        await addBudget({
          categoryId: selectedCategoryId,
          monthlyLimit: limit,
          month: selectedMonth,
          year: selectedYear,
          alertThreshold: threshold,
        });
        Alert.alert("Sucesso", "Orçamento criado!");
      }
      resetForm();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o orçamento");
    }
  };

  const handleDeleteBudget = (budgetId: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este orçamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBudget(budgetId);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir");
            }
          },
        },
      ]
    );
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget.id);
    setSelectedCategoryId(budget.categoryId);
    setMonthlyLimit(budget.monthlyLimit.toString());
    setAlertThreshold(budget.alertThreshold.toString());
    setSelectedMonth(budget.month);
    setSelectedYear(budget.year);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingBudget(null);
    setSelectedCategoryId(null);
    setMonthlyLimit("");
    setAlertThreshold("80");
    setSelectedMonth(new Date().getMonth() + 1);
    setSelectedYear(new Date().getFullYear());
  };

  const renderBudgetCard = (budget: any) => {
    const progress = getBudgetProgress(budget.id);
    const percentage = Math.min(progress.percentage, 100);
    const isOverBudget = percentage > 100;
    const isNearLimit = percentage >= budget.alertThreshold && !isOverBudget;

    let statusColor = colors.success;
    if (isOverBudget) statusColor = colors.error;
    else if (isNearLimit) statusColor = colors.warning;

    return (
      <View key={budget.id} style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View style={styles.budgetInfo}>
            <View style={styles.budgetTitleRow}>
              <Ionicons
                name={budget.categoryId === null ? "wallet" : "pricetag"}
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles.budgetTitle}>
                {getCategoryName(budget.categoryId)}
              </Text>
            </View>
            <Text style={styles.budgetPeriod}>
              {getMonthName(budget.month)}/{budget.year}
            </Text>
          </View>
          <View style={styles.budgetActions}>
            <TouchableOpacity
              onPress={() => handleEditBudget(budget)}
              style={styles.actionButton}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary[500]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteBudget(budget.id)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.budgetProgress}>
          <View style={styles.progressHeader}>
            <Text style={styles.spentText}>
              R$ {progress.spent.toFixed(2)} de R$ {progress.limit.toFixed(2)}
            </Text>
            <Text style={[styles.percentageText, { color: statusColor }]}>
              {percentage.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: statusColor,
                },
              ]}
            />
          </View>
          {isOverBudget && (
            <View style={styles.alertBadge}>
              <Ionicons name="alert-circle" size={16} color={colors.error} />
              <Text style={styles.alertText}>
                Orçamento ultrapassado em R${" "}
                {(progress.spent - progress.limit).toFixed(2)}
              </Text>
            </View>
          )}
          {isNearLimit && (
            <View
              style={[
                styles.alertBadge,
                { backgroundColor: `${colors.warning}15` },
              ]}
            >
              <Ionicons name="warning" size={16} color={colors.warning} />
              <Text style={[styles.alertText, { color: colors.warning }]}>
                Atenção: {budget.alertThreshold}% do orçamento atingido
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const getMonthName = (month: number) => {
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return months[month - 1];
  };

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // Available categories (not already budgeted for current month)
  const availableCategories = categories.filter(
    (cat) =>
      !currentBudgets.some(
        (b) => b.categoryId === cat.id && b.id !== editingBudget
      )
  );

  const hasGeneralBudget = currentBudgets.some(
    (b) => b.categoryId === null && b.id !== editingBudget
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orçamentos</Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={28} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Month/Year Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          onPress={() => {
            if (selectedMonth === 1) {
              setSelectedMonth(12);
              setSelectedYear(selectedYear - 1);
            } else {
              setSelectedMonth(selectedMonth - 1);
            }
          }}
          style={styles.periodButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.periodDisplay}>
          <Text style={styles.periodText}>
            {monthNames[selectedMonth - 1]} {selectedYear}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (selectedMonth === 12) {
              setSelectedMonth(1);
              setSelectedYear(selectedYear + 1);
            } else {
              setSelectedMonth(selectedMonth + 1);
            }
          }}
          style={styles.periodButton}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Total Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Orçado:</Text>
          <Text style={styles.summaryValue}>
            R$ {totals.totalLimit.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Gasto:</Text>
          <Text style={[styles.summaryValue, { color: colors.error }]}>
            R$ {totals.totalSpent.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Restante:</Text>
          <Text
            style={[
              styles.summaryValue,
              {
                color:
                  totals.totalLimit - totals.totalSpent >= 0
                    ? colors.success
                    : colors.error,
              },
            ]}
          >
            R$ {(totals.totalLimit - totals.totalSpent).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Budget List */}
      <ScrollView
        style={styles.budgetList}
        showsVerticalScrollIndicator={false}
      >
        {currentBudgets.length > 0 ? (
          currentBudgets.map(renderBudgetCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="wallet-outline"
              size={64}
              color={colors.gray[300]}
            />
            <Text style={styles.emptyText}>Nenhum orçamento definido</Text>
            <Text style={styles.emptySubtext}>
              Toque no + para criar seu primeiro orçamento
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBudget ? "Editar Orçamento" : "Novo Orçamento"}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Category Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Categoria</Text>
                <View style={styles.categoryGrid}>
                  {!hasGeneralBudget && (
                    <TouchableOpacity
                      style={[
                        styles.categoryOption,
                        selectedCategoryId === null &&
                          styles.categoryOptionSelected,
                      ]}
                      onPress={() => setSelectedCategoryId(null)}
                    >
                      <Ionicons
                        name="wallet"
                        size={24}
                        color={
                          selectedCategoryId === null
                            ? colors.primary[500]
                            : colors.text.secondary
                        }
                      />
                      <Text
                        style={[
                          styles.categoryOptionText,
                          selectedCategoryId === null &&
                            styles.categoryOptionTextSelected,
                        ]}
                      >
                        Geral
                      </Text>
                    </TouchableOpacity>
                  )}
                  {availableCategories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        selectedCategoryId === category.id &&
                          styles.categoryOptionSelected,
                      ]}
                      onPress={() => setSelectedCategoryId(category.id!)}
                    >
                      <Ionicons
                        name="pricetag"
                        size={24}
                        color={
                          selectedCategoryId === category.id
                            ? colors.primary[500]
                            : colors.text.secondary
                        }
                      />
                      <Text
                        style={[
                          styles.categoryOptionText,
                          selectedCategoryId === category.id &&
                            styles.categoryOptionTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Monthly Limit */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Limite Mensal *</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.currency}>R$</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0,00"
                    placeholderTextColor={colors.gray[400]}
                    keyboardType="numeric"
                    value={monthlyLimit}
                    onChangeText={setMonthlyLimit}
                  />
                </View>
              </View>

              {/* Alert Threshold */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Alerta em (%) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="80"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="numeric"
                  value={alertThreshold}
                  onChangeText={setAlertThreshold}
                />
                <Text style={styles.inputHint}>
                  Você será alertado ao atingir essa porcentagem do orçamento
                </Text>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveBudget}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.text.inverse}
                />
                <Text style={styles.saveButtonText}>
                  {editingBudget ? "Atualizar" : "Criar"} Orçamento
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing.lg,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: spacing.xs,
    },
    headerTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    addButton: {
      padding: spacing.xs,
    },
    periodSelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing.md,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    periodButton: {
      padding: spacing.sm,
    },
    periodDisplay: {
      flex: 1,
      alignItems: "center",
    },
    periodText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
    },
    summaryCard: {
      backgroundColor: colors.background,
      margin: spacing.md,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      ...shadows.md,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: spacing.xs,
    },
    summaryLabel: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    summaryValue: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    budgetList: {
      flex: 1,
      padding: spacing.md,
    },
    budgetCard: {
      backgroundColor: colors.background,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    budgetHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacing.md,
    },
    budgetInfo: {
      flex: 1,
    },
    budgetTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    budgetTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    budgetPeriod: {
      fontSize: fontSize.sm,
      color: colors.text.tertiary,
    },
    budgetActions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    actionButton: {
      padding: spacing.xs,
    },
    budgetProgress: {
      gap: spacing.sm,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    spentText: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    percentageText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
    },
    progressBarContainer: {
      height: 12,
      backgroundColor: colors.gray[200],
      borderRadius: borderRadius.full,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      borderRadius: borderRadius.full,
    },
    alertBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: `${colors.error}15`,
      padding: spacing.sm,
      borderRadius: borderRadius.md,
    },
    alertText: {
      fontSize: fontSize.sm,
      color: colors.error,
      fontWeight: fontWeight.medium,
      flex: 1,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xl * 2,
      gap: spacing.md,
    },
    emptyText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.text.secondary,
    },
    emptySubtext: {
      fontSize: fontSize.md,
      color: colors.text.tertiary,
      textAlign: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      padding: spacing.lg,
      maxHeight: "90%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    inputGroup: {
      marginBottom: spacing.lg,
    },
    inputLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
    },
    currency: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.text.secondary,
      marginRight: spacing.sm,
    },
    input: {
      flex: 1,
      padding: spacing.md,
      fontSize: fontSize.md,
      color: colors.text.primary,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputHint: {
      fontSize: fontSize.sm,
      color: colors.text.tertiary,
      marginTop: spacing.xs,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    categoryOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    categoryOptionSelected: {
      backgroundColor: `${colors.primary[500]}15`,
      borderColor: colors.primary[500],
    },
    categoryOptionText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    categoryOptionTextSelected: {
      color: colors.primary[600],
      fontWeight: fontWeight.semibold,
    },
    saveButton: {
      backgroundColor: colors.primary[500],
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      marginTop: spacing.md,
      ...shadows.md,
    },
    saveButtonText: {
      color: colors.text.inverse,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
  });
