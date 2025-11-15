import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as ImagePicker from "expo-image-picker";
import { useAppStore } from "../../application/store/useAppStore";
import { EmotionSelector } from "../components/EmotionSelector";
import { CategorySelector } from "../components/CategorySelector";
import { TransactionType } from "../../domain/entities/Expense";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

export const AddExpenseScreen = ({ navigation }: any) => {
  const { emotions, categories, tags, addExpense, addRecurringExpense } =
    useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [emotionId, setEmotionId] = useState<number>();
  const [categoryId, setCategoryId] = useState<number>();
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // New features
  const [attachments, setAttachments] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");
  const [recurringEndDate, setRecurringEndDate] = useState<Date | null>(null);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar suas fotos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setAttachments([...attachments, ...newImages]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const toggleTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !emotionId || !categoryId) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const numAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Erro", "Valor inválido");
      return;
    }

    setLoading(true);
    try {
      if (isRecurring) {
        // Create recurring expense
        await addRecurringExpense({
          frequency,
          amount: numAmount,
          emotionId,
          categoryId,
          note,
          startDate: selectedDate,
          endDate: recurringEndDate,
          type: transactionType,
        });
        Alert.alert(
          "Sucesso",
          `${
            transactionType === "expense" ? "Gasto" : "Economia"
          } recorrente criado com sucesso!`
        );
      } else {
        // Create single expense
        await addExpense({
          amount: numAmount,
          date: selectedDate,
          emotionId,
          categoryId,
          note,
          type: transactionType,
          attachments,
          tagIds: selectedTags,
        });
        Alert.alert(
          "Sucesso",
          `${
            transactionType === "expense" ? "Gasto" : "Economia"
          } registrado com sucesso!`
        );
      }
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert(
        "Erro",
        `Não foi possível salvar. Detalhes: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={[
            styles.container,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <View style={styles.content}>
            {/* Tipo de transação */}
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === "expense" && styles.typeButtonActive,
                ]}
                onPress={() => setTransactionType("expense")}
                activeOpacity={0.7}
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
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === "expense" &&
                      styles.typeButtonTextActive,
                  ]}
                >
                  Gasto
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === "saving" && styles.typeButtonActive,
                ]}
                onPress={() => setTransactionType("saving")}
                activeOpacity={0.7}
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
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === "saving" && styles.typeButtonTextActive,
                  ]}
                >
                  Economia
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="cash" size={20} color={colors.primary[500]} />
                <Text style={styles.label}>Valor *</Text>
              </View>
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

            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons
                  name="calendar"
                  size={20}
                  color={colors.primary[500]}
                />
                <Text style={styles.label}>Data *</Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.dateText}>
                  {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, date) => {
                    setShowDatePicker(Platform.OS === "ios");
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.section}>
              <EmotionSelector
                emotions={emotions}
                selectedEmotionId={emotionId}
                onSelect={setEmotionId}
              />
            </View>

            <View style={styles.section}>
              <CategorySelector
                categories={categories}
                selectedCategoryId={categoryId}
                onSelect={setCategoryId}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color={colors.primary[500]}
                />
                <Text style={styles.label}>Observações (opcional)</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ex: Almoço no restaurante..."
                placeholderTextColor={colors.gray[400]}
                multiline
                numberOfLines={4}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Attachments */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="images" size={20} color={colors.primary[500]} />
                <Text style={styles.label}>Anexos (opcional)</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handlePickImage}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="add-circle"
                  size={20}
                  color={colors.primary[500]}
                />
                <Text style={styles.addButtonText}>Adicionar Foto</Text>
              </TouchableOpacity>
              {attachments.length > 0 && (
                <ScrollView horizontal style={styles.attachmentsContainer}>
                  {attachments.map((uri, index) => (
                    <View key={index} style={styles.attachmentItem}>
                      <Image source={{ uri }} style={styles.attachmentImage} />
                      <TouchableOpacity
                        style={styles.removeAttachment}
                        onPress={() => removeAttachment(index)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color={colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Tags */}
            {tags.length > 0 && (
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Ionicons
                    name="pricetags"
                    size={20}
                    color={colors.primary[500]}
                  />
                  <Text style={styles.label}>Tags (opcional)</Text>
                </View>
                <View style={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <TouchableOpacity
                      key={tag.id}
                      style={[
                        styles.tagChip,
                        selectedTags.includes(tag.id!) &&
                          styles.tagChipSelected,
                        { borderColor: tag.color },
                      ]}
                      onPress={() => toggleTag(tag.id!)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[styles.tagDot, { backgroundColor: tag.color }]}
                      />
                      <Text
                        style={[
                          styles.tagText,
                          selectedTags.includes(tag.id!) &&
                            styles.tagTextSelected,
                        ]}
                      >
                        {tag.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Recurring */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.recurringToggle}
                onPress={() => setIsRecurring(!isRecurring)}
                activeOpacity={0.7}
              >
                <View style={styles.labelContainer}>
                  <Ionicons
                    name="repeat"
                    size={20}
                    color={colors.primary[500]}
                  />
                  <Text style={styles.label}>Transação Recorrente</Text>
                </View>
                <View
                  style={[
                    styles.switch,
                    isRecurring && { backgroundColor: colors.primary[500] },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      isRecurring && styles.switchThumbActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>

              {isRecurring && (
                <View style={styles.recurringOptions}>
                  <View style={styles.frequencyContainer}>
                    {(["daily", "weekly", "monthly", "yearly"] as const).map(
                      (freq) => (
                        <TouchableOpacity
                          key={freq}
                          style={[
                            styles.frequencyButton,
                            frequency === freq && styles.frequencyButtonActive,
                          ]}
                          onPress={() => setFrequency(freq)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.frequencyText,
                              frequency === freq && styles.frequencyTextActive,
                            ]}
                          >
                            {freq === "daily" && "Diário"}
                            {freq === "weekly" && "Semanal"}
                            {freq === "monthly" && "Mensal"}
                            {freq === "yearly" && "Anual"}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowEndDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dateLabel}>Data Final (opcional):</Text>
                    <Text style={styles.dateText}>
                      {recurringEndDate
                        ? format(recurringEndDate, "dd 'de' MMM 'de' yyyy", {
                            locale: ptBR,
                          })
                        : "Sem data final"}
                    </Text>
                  </TouchableOpacity>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={recurringEndDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, date) => {
                        setShowEndDatePicker(Platform.OS === "ios");
                        if (date) {
                          setRecurringEndDate(date);
                        }
                      }}
                      minimumDate={selectedDate}
                    />
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Ionicons
                name={loading ? "hourglass" : "checkmark-circle"}
                size={20}
                color={colors.text.inverse}
              />
              <Text style={styles.submitButtonText}>
                {loading
                  ? "Salvando..."
                  : `Salvar ${
                      transactionType === "expense" ? "Gasto" : "Economia"
                    }`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    content: {
      padding: spacing.lg,
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
      backgroundColor: colors.background,
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
    typeButtonTextActive: {
      color: colors.primary[600],
      fontWeight: fontWeight.bold,
    },
    section: {
      marginBottom: spacing.lg,
    },
    inputContainer: {
      marginBottom: spacing.lg,
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    label: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      ...shadows.sm,
    },
    currency: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.text.secondary,
      marginRight: spacing.sm,
    },
    input: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      fontSize: fontSize.md,
      color: colors.text.primary,
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    dateButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      ...shadows.sm,
    },
    dateText: {
      fontSize: fontSize.md,
      color: colors.text.primary,
      fontWeight: fontWeight.medium,
    },
    submitButton: {
      backgroundColor: colors.primary[500],
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      marginTop: spacing.xl,
      ...shadows.md,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: colors.text.inverse,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      backgroundColor: colors.background,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.primary[500],
      borderStyle: "dashed",
    },
    addButtonText: {
      color: colors.primary[500],
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    attachmentsContainer: {
      marginTop: spacing.md,
      gap: spacing.sm,
    },
    attachmentItem: {
      position: "relative",
      marginRight: spacing.sm,
    },
    attachmentImage: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.md,
    },
    removeAttachment: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: colors.background,
      borderRadius: 12,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    tagChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      borderWidth: 1.5,
    },
    tagChipSelected: {
      backgroundColor: `${colors.primary[500]}15`,
    },
    tagDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    tagText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    tagTextSelected: {
      color: colors.primary[600],
      fontWeight: fontWeight.semibold,
    },
    recurringToggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.background,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    switch: {
      width: 50,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.gray[300],
      padding: 2,
    },
    switchThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.background,
      ...shadows.sm,
    },
    switchThumbActive: {
      transform: [{ translateX: 22 }],
    },
    recurringOptions: {
      marginTop: spacing.md,
      gap: spacing.md,
    },
    frequencyContainer: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    frequencyButton: {
      flex: 1,
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background,
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
    dateLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
  });
