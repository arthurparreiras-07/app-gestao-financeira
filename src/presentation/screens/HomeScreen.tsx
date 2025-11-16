import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppStore } from "../../application/store/useAppStore";
import { InsightCard } from "../components/InsightCard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DrawerHeader } from "../components/DrawerHeader";
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
  const {
    expenses,
    insights,
    loading,
    loadData,
    emotions,
    categories,
    deleteExpense,
  } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  // Estados para modal e ações
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Calcular gastos e economias separadamente
  const allExpenses = expenses.filter((e) => e.type === "expense");
  const allSavings = expenses.filter((e) => e.type === "saving");

  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = allSavings.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalSavings - totalExpenses;

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

  // Funções de manipulação
  const handleExpenseMenu = (expense: any) => {
    setSelectedExpense(expense);
    setShowActionMenu(true);
  };

  const handleDelete = () => {
    if (!selectedExpense) return;

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteExpense(selectedExpense.id!);
              setShowActionMenu(false);
              setSelectedExpense(null);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a transação.");
            }
          },
        },
      ]
    );
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
    >
      <DrawerHeader title="MindBudget" />
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.dateHeader}>
          <Ionicons name="calendar" size={20} color={colors.text.secondary} />
          <Text style={styles.dateText}>
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </Text>
        </View>

        {/* Saldo em Conta */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="wallet" size={28} color={colors.text.primary} />
              </View>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Saldo em Conta</Text>
                <Text style={styles.balanceSubtitle}>Economias - Gastos</Text>
              </View>
            </View>
            <Text
              style={[
                styles.balanceValue,
                {
                  color: balance >= 0 ? colors.success : colors.error,
                },
              ]}
            >
              {balance >= 0 ? "+" : "-"}R$ {Math.abs(balance).toFixed(2)}
            </Text>
            <View style={styles.balanceDetails}>
              <View style={styles.balanceDetailItem}>
                <Ionicons
                  name="arrow-up-circle"
                  size={16}
                  color={colors.success}
                />
                <Text style={styles.balanceDetailText}>
                  R$ {totalSavings.toFixed(2)}
                </Text>
              </View>
              <View style={styles.balanceDetailItem}>
                <Ionicons
                  name="arrow-down-circle"
                  size={16}
                  color={colors.error}
                />
                <Text style={styles.balanceDetailText}>
                  R$ {totalExpenses.toFixed(2)}
                </Text>
              </View>
            </View>
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
            <Text style={styles.sectionTitle}>Últimas 24 Horas</Text>
          </View>
          {(() => {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentTransactions = expenses
              .filter((e) => e.date >= oneDayAgo)
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 5);

            return recentTransactions.length > 0 ? (
              <>
                {recentTransactions.map((expense) => {
                  const emotion = emotions.find(
                    (e) => e.id === expense.emotionId
                  );
                  const category = categories.find(
                    (c) => c.id === expense.categoryId
                  );
                  const isExpense = expense.type === "expense";
                  const hasAttachments =
                    expense.attachments && expense.attachments.length > 0;

                  return (
                    <View key={expense.id} style={styles.expenseItem}>
                      <View style={styles.expenseHeader}>
                        <View style={styles.expenseLeft}>
                          <View
                            style={[
                              styles.expenseIconContainer,
                              {
                                backgroundColor: category
                                  ? `${category.color}15`
                                  : `${colors.primary[500]}15`,
                              },
                            ]}
                          >
                            <Ionicons
                              name={isExpense ? "trending-down" : "trending-up"}
                              size={20}
                              color={isExpense ? colors.error : colors.success}
                            />
                          </View>
                          <View style={styles.expenseInfo}>
                            <Text style={styles.expenseCategory}>
                              {category?.name || "Sem categoria"}
                            </Text>
                            <View style={styles.expenseMeta}>
                              <Ionicons
                                name="heart"
                                size={12}
                                color={colors.text.tertiary}
                              />
                              <Text style={styles.expenseEmotion}>
                                {emotion?.name || "Desconhecido"}
                              </Text>
                              <Text style={styles.expenseTime}>
                                • {format(expense.date, "HH:mm")}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.expenseRight}>
                          <Text
                            style={[
                              styles.expenseAmount,
                              {
                                color: isExpense
                                  ? colors.error
                                  : colors.success,
                              },
                            ]}
                          >
                            {isExpense ? "-" : "+"}R${" "}
                            {expense.amount.toFixed(2)}
                          </Text>
                          <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => handleExpenseMenu(expense)}
                            activeOpacity={0.6}
                          >
                            <Ionicons
                              name="ellipsis-vertical"
                              size={18}
                              color={colors.text.secondary}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {expense.note && (
                        <Text style={styles.expenseNote} numberOfLines={2}>
                          {expense.note}
                        </Text>
                      )}
                      {hasAttachments && (
                        <View style={styles.attachmentsPreview}>
                          <Ionicons
                            name="images"
                            size={14}
                            color={colors.primary[500]}
                          />
                          <Text style={styles.attachmentsCount}>
                            {expense.attachments!.length}{" "}
                            {expense.attachments!.length === 1
                              ? "foto"
                              : "fotos"}
                          </Text>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                          >
                            {expense
                              .attachments!.slice(0, 3)
                              .map((uri: string, index: number) => (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => setExpandedImage(uri)}
                                  activeOpacity={0.8}
                                >
                                  <Image
                                    source={{ uri }}
                                    style={styles.attachmentThumbnail}
                                  />
                                </TouchableOpacity>
                              ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  );
                })}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="document-outline"
                  size={48}
                  color={colors.gray[300]}
                />
                <Text style={styles.emptyText}>
                  Nenhuma transação nas últimas 24 horas
                </Text>
              </View>
            );
          })()}
        </View>
      </ScrollView>

      {/* Modal de ações */}
      <Modal
        visible={showActionMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.actionMenu}>
            <View style={styles.actionMenuHeader}>
              <Text style={styles.actionMenuTitle}>Ações</Text>
              <TouchableOpacity onPress={() => setShowActionMenu(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={20} color={colors.error} />
              <Text style={[styles.actionMenuText, { color: colors.error }]}>
                Excluir
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de imagem expandida */}
      <Modal
        visible={expandedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setExpandedImage(null)}
      >
        <TouchableOpacity
          style={styles.imageModalOverlay}
          activeOpacity={1}
          onPress={() => setExpandedImage(null)}
        >
          <TouchableOpacity
            style={styles.closeImageButton}
            onPress={() => setExpandedImage(null)}
          >
            <Ionicons name="close-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {expandedImage && (
            <Image
              source={{ uri: expandedImage }}
              style={styles.expandedImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
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
    dateHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
      marginBottom: spacing.md,
    },
    dateText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      textTransform: "capitalize",
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
    balanceContainer: {
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    balanceCard: {
      backgroundColor: colors.background,
      padding: spacing.xl,
      borderRadius: borderRadius.xl,
      ...shadows.lg,
    },
    balanceHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    balanceIconContainer: {
      width: 52,
      height: 52,
      borderRadius: borderRadius.lg,
      backgroundColor: `${colors.primary[500]}15`,
      justifyContent: "center",
      alignItems: "center",
    },
    balanceInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    balanceLabel: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    balanceSubtitle: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    balanceValue: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      textAlign: "center",
      marginVertical: spacing.lg,
      letterSpacing: -1,
    },
    balanceDetails: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    balanceDetailItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    balanceDetailText: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      fontWeight: fontWeight.semibold,
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
      borderRadius: borderRadius.xl,
      ...shadows.md,
    },
    summaryIconContainer: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.lg,
      backgroundColor: `${colors.primary[500]}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.md,
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
    expenseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    expenseLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      flex: 1,
    },
    expenseIconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
    },
    expenseInfo: {
      flex: 1,
    },
    expenseCategory: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    expenseMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    expenseEmotion: {
      fontSize: fontSize.xs,
      color: colors.text.tertiary,
    },
    expenseTime: {
      fontSize: fontSize.xs,
      color: colors.text.tertiary,
    },
    expenseRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    expenseAmount: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
    },
    menuButton: {
      padding: spacing.xs,
      borderRadius: borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    expenseDate: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    expenseNote: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.md,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      lineHeight: 18,
    },
    attachmentsPreview: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    attachmentsCount: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginRight: spacing.sm,
    },
    attachmentThumbnail: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.sm,
      marginRight: spacing.xs,
    },
    viewAllButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      backgroundColor: colors.background,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginTop: spacing.sm,
      borderWidth: 1,
      borderColor: colors.primary[500],
      ...shadows.sm,
    },
    viewAllText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.primary[500],
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    actionMenu: {
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows.lg,
    },
    actionMenuHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionMenuTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    actionMenuItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginVertical: spacing.xs,
    },
    actionMenuText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
    },
    imageModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      justifyContent: "center",
      alignItems: "center",
    },
    closeImageButton: {
      position: "absolute",
      top: 50,
      right: 20,
      zIndex: 1,
    },
    expandedImage: {
      width: "90%",
      height: "80%",
    },
  });
