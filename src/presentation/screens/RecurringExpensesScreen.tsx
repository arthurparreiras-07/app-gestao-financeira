import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { Frequency } from "../../domain/entities/RecurringExpense";

export const RecurringExpensesScreen = ({ navigation }: any) => {
  const {
    recurringExpenses,
    categories,
    emotions,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    processRecurringExpenses,
  } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [emotionId, setEmotionId] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [note, setNote] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [transactionType, setTransactionType] = useState<"expense" | "saving">(
    "expense"
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const styles = createStyles(colors);

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "Desconhecido";
  };

  const getEmotionName = (emotionId: number) => {
    return emotions.find((e) => e.id === emotionId)?.name || "Desconhecido";
  };

  const getFrequencyLabel = (freq: Frequency) => {
    const labels = {
      daily: "Diário",
      weekly: "Semanal",
      monthly: "Mensal",
      yearly: "Anual",
    };
    return labels[freq];
  };

  const getNextOccurrence = (recurring: any) => {
    if (!recurring.isActive) return null;

    const last = recurring.lastProcessedDate
      ? new Date(recurring.lastProcessedDate)
      : new Date(recurring.startDate);
    const next = new Date(last);

    switch (recurring.frequency) {
      case "daily":
        next.setDate(next.getDate() + 1);
        break;
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
      case "yearly":
        next.setFullYear(next.getFullYear() + 1);
        break;
    }

    if (recurring.endDate && next > new Date(recurring.endDate)) {
      return null;
    }

    return next;
  };

  const handleSaveRecurring = async () => {
    if (!amount || !emotionId || !categoryId) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    const numAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Erro", "Valor inválido");
      return;
    }

    try {
      if (editingExpense) {
        await updateRecurringExpense(editingExpense, {
          amount: numAmount,
          emotionId,
          categoryId,
          note,
          frequency,
          startDate,
          endDate: hasEndDate ? endDate : null,
          type: transactionType,
        });
        Alert.alert("Sucesso", "Transação recorrente atualizada!");
      } else {
        await addRecurringExpense({
          amount: numAmount,
          emotionId,
          categoryId,
          note,
          frequency,
          startDate,
          endDate: hasEndDate ? endDate : null,
          type: transactionType,
        });

        // Processar imediatamente para criar a primeira transação se a data for hoje ou no passado
        await processRecurringExpenses();

        Alert.alert("Sucesso", "Transação recorrente criada!");
      }
      resetForm();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar");
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta transação recorrente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecurringExpense(id);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir");
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (recurring: any) => {
    try {
      await updateRecurringExpense(recurring.id, {
        isActive: !recurring.isActive,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar o status");
    }
  };

  const handleEdit = (recurring: any) => {
    setEditingExpense(recurring.id);
    setAmount(recurring.amount.toString());
    setEmotionId(recurring.emotionId);
    setCategoryId(recurring.categoryId);
    setNote(recurring.note);
    setFrequency(recurring.frequency);
    setStartDate(new Date(recurring.startDate));
    setEndDate(recurring.endDate ? new Date(recurring.endDate) : null);
    setHasEndDate(!!recurring.endDate);
    setTransactionType(recurring.type);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingExpense(null);
    setAmount("");
    setEmotionId(undefined);
    setCategoryId(undefined);
    setNote("");
    setFrequency("monthly");
    setStartDate(new Date());
    setEndDate(null);
    setHasEndDate(false);
    setTransactionType("expense");
  };

  const handleProcessRecurring = async () => {
    try {
      await processRecurringExpenses();
      Alert.alert("Sucesso", "Transações recorrentes processadas!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível processar");
    }
  };

  const activeRecurring = recurringExpenses.filter((r) => r.isActive);
  const inactiveRecurring = recurringExpenses.filter((r) => !r.isActive);

  const renderRecurringCard = (recurring: any) => {
    const isExpense = recurring.type === "expense";
    const nextOccurrence = getNextOccurrence(recurring);

    return (
      <View key={recurring.id} style={styles.recurringCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <View style={styles.titleRow}>
              <Ionicons
                name={isExpense ? "trending-down" : "trending-up"}
                size={20}
                color={isExpense ? colors.error : colors.success}
              />
              <Text style={styles.cardTitle}>
                {getCategoryName(recurring.categoryId)}
              </Text>
            </View>
            <Text style={styles.cardAmount}>
              {isExpense ? "-" : "+"}R$ {recurring.amount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              onPress={() => handleEdit(recurring)}
              style={styles.actionButton}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary[500]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(recurring.id)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="repeat" size={16} color={colors.text.tertiary} />
            <Text style={styles.detailText}>
              {getFrequencyLabel(recurring.frequency)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="heart" size={16} color={colors.text.tertiary} />
            <Text style={styles.detailText}>
              {getEmotionName(recurring.emotionId)}
            </Text>
          </View>
          {nextOccurrence && (
            <View style={styles.detailRow}>
              <Ionicons
                name="calendar"
                size={16}
                color={colors.text.tertiary}
              />
              <Text style={styles.detailText}>
                Próxima: {format(nextOccurrence, "dd/MM/yyyy")}
              </Text>
            </View>
          )}
        </View>

        {recurring.note && (
          <Text style={styles.cardNote} numberOfLines={2}>
            {recurring.note}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: recurring.isActive
                    ? colors.success
                    : colors.gray[400],
                },
              ]}
            />
            <Text style={styles.statusText}>
              {recurring.isActive ? "Ativo" : "Inativo"}
            </Text>
          </View>
          <Switch
            value={recurring.isActive}
            onValueChange={() => handleToggleActive(recurring)}
            trackColor={{ false: colors.gray[300], true: colors.success }}
            thumbColor={colors.background}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transações Recorrentes</Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={28} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Process Button */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.processButton}
          onPress={handleProcessRecurring}
          activeOpacity={0.8}
        >
          <Ionicons name="sync" size={20} color={colors.text.inverse} />
          <Text style={styles.processButtonText}>Processar Pendentes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Section */}
        {activeRecurring.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Ativas ({activeRecurring.length})
            </Text>
            {activeRecurring.map(renderRecurringCard)}
          </View>
        )}

        {/* Inactive Section */}
        {inactiveRecurring.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Inativas ({inactiveRecurring.length})
            </Text>
            {inactiveRecurring.map(renderRecurringCard)}
          </View>
        )}

        {/* Empty State */}
        {recurringExpenses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="repeat-outline"
              size={64}
              color={colors.gray[300]}
            />
            <Text style={styles.emptyText}>Nenhuma transação recorrente</Text>
            <Text style={styles.emptySubtext}>
              Toque no + para criar sua primeira transação recorrente
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
                {editingExpense ? "Editar" : "Nova"} Transação Recorrente
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Type Selection */}
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === "expense" && styles.typeButtonActive,
                  ]}
                  onPress={() => setTransactionType("expense")}
                >
                  <Ionicons
                    name="trending-down"
                    size={20}
                    color={
                      transactionType === "expense"
                        ? colors.error
                        : colors.text.secondary
                    }
                  />
                  <Text style={styles.typeButtonText}>Gasto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === "saving" && styles.typeButtonActive,
                  ]}
                  onPress={() => setTransactionType("saving")}
                >
                  <Ionicons
                    name="trending-up"
                    size={20}
                    color={
                      transactionType === "saving"
                        ? colors.success
                        : colors.text.secondary
                    }
                  />
                  <Text style={styles.typeButtonText}>Economia</Text>
                </TouchableOpacity>
              </View>

              {/* Amount */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Valor *</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.currency}>R$</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0,00"
                    placeholderTextColor={colors.gray[400]}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Categoria *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.optionsRow}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.option,
                          categoryId === cat.id && styles.optionSelected,
                        ]}
                        onPress={() => setCategoryId(cat.id!)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            categoryId === cat.id && styles.optionTextSelected,
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Emotion */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Emoção *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.optionsRow}>
                    {emotions.map((emo) => (
                      <TouchableOpacity
                        key={emo.id}
                        style={[
                          styles.option,
                          emotionId === emo.id && styles.optionSelected,
                        ]}
                        onPress={() => setEmotionId(emo.id!)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            emotionId === emo.id && styles.optionTextSelected,
                          ]}
                        >
                          {emo.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Frequency */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Frequência *</Text>
                <View style={styles.frequencyGrid}>
                  {(
                    ["daily", "weekly", "monthly", "yearly"] as Frequency[]
                  ).map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        frequency === freq && styles.frequencyButtonActive,
                      ]}
                      onPress={() => setFrequency(freq)}
                    >
                      <Text
                        style={[
                          styles.frequencyText,
                          frequency === freq && styles.frequencyTextActive,
                        ]}
                      >
                        {getFrequencyLabel(freq)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Start Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Data Inicial *</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Ionicons
                    name="calendar"
                    size={20}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.dateText}>
                    {format(startDate, "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    onChange={(event, date) => {
                      setShowStartDatePicker(false);
                      if (date) setStartDate(date);
                    }}
                  />
                )}
              </View>

              {/* End Date Toggle */}
              <View style={styles.inputGroup}>
                <View style={styles.toggleRow}>
                  <Text style={styles.inputLabel}>Data Final (Opcional)</Text>
                  <Switch
                    value={hasEndDate}
                    onValueChange={setHasEndDate}
                    trackColor={{
                      false: colors.gray[300],
                      true: colors.primary[500],
                    }}
                    thumbColor={colors.background}
                  />
                </View>
                {hasEndDate && (
                  <>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowEndDatePicker(true)}
                    >
                      <Ionicons
                        name="calendar"
                        size={20}
                        color={colors.text.secondary}
                      />
                      <Text style={styles.dateText}>
                        {endDate
                          ? format(endDate, "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })
                          : "Selecionar data"}
                      </Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                      <DateTimePicker
                        value={endDate || new Date()}
                        mode="date"
                        onChange={(event, date) => {
                          setShowEndDatePicker(false);
                          if (date) setEndDate(date);
                        }}
                        minimumDate={startDate}
                      />
                    )}
                  </>
                )}
              </View>

              {/* Note */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Observações (Opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ex: Aluguel mensal..."
                  placeholderTextColor={colors.gray[400]}
                  multiline
                  numberOfLines={3}
                  value={note}
                  onChangeText={setNote}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveRecurring}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.text.inverse}
                />
                <Text style={styles.saveButtonText}>
                  {editingExpense ? "Atualizar" : "Criar"} Recorrência
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
      flex: 1,
      textAlign: "center",
      marginHorizontal: spacing.md,
    },
    addButton: {
      padding: spacing.xs,
    },
    actionBar: {
      padding: spacing.md,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    processButton: {
      backgroundColor: colors.primary[500],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      ...shadows.md,
    },
    processButtonText: {
      color: colors.text.inverse,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      padding: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    recurringCard: {
      backgroundColor: colors.background,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacing.md,
    },
    cardInfo: {
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    cardTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    cardAmount: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    cardActions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    actionButton: {
      padding: spacing.xs,
    },
    cardDetails: {
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    detailText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    cardNote: {
      fontSize: fontSize.sm,
      color: colors.text.tertiary,
      fontStyle: "italic",
      marginBottom: spacing.md,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    statusText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
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
      paddingHorizontal: spacing.xl,
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
    typeContainer: {
      flexDirection: "row",
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    typeButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: colors.border,
    },
    typeButtonActive: {
      borderColor: colors.primary[500],
      backgroundColor: `${colors.primary[500]}10`,
    },
    typeButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
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
    textArea: {
      height: 80,
      textAlignVertical: "top",
    },
    optionsRow: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    option: {
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    optionSelected: {
      backgroundColor: `${colors.primary[500]}15`,
      borderColor: colors.primary[500],
    },
    optionText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    optionTextSelected: {
      color: colors.primary[600],
      fontWeight: fontWeight.semibold,
    },
    frequencyGrid: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    frequencyButton: {
      flex: 1,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    frequencyButtonActive: {
      backgroundColor: `${colors.primary[500]}15`,
      borderColor: colors.primary[500],
    },
    frequencyText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    frequencyTextActive: {
      color: colors.primary[600],
      fontWeight: fontWeight.semibold,
    },
    dateButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateText: {
      fontSize: fontSize.md,
      color: colors.text.primary,
      fontWeight: fontWeight.medium,
    },
    toggleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
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
