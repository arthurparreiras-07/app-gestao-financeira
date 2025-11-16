import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppStore } from "../../application/store/useAppStore";
import { CategorySelector } from "../components/CategorySelector";
import { EmotionSelector } from "../components/EmotionSelector";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";
import { Expense, TransactionType } from "../../domain/entities/Expense";

export const EditExpenseScreen: React.FC<any> = ({ navigation, route }) => {
  const { expenseId } = route.params;
  const { expenses, categories, emotions, updateExpense } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  // Encontrar a despesa atual
  const currentExpense = expenses.find((e) => e.id === expenseId);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedEmotionId, setSelectedEmotionId] = useState<number | null>(
    null
  );
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    if (currentExpense) {
      setAmount(currentExpense.amount.toString());
      setNote(currentExpense.note);
      setDate(currentExpense.date);
      setSelectedCategoryId(currentExpense.categoryId);
      setSelectedEmotionId(currentExpense.emotionId);
      setTransactionType(currentExpense.type);
      setAttachments(currentExpense.attachments || []);
    } else {
      Alert.alert("Erro", "Transação não encontrada");
      navigation.goBack();
    }
  }, [currentExpense]);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Erro", "Por favor, insira um valor válido");
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert("Erro", "Por favor, selecione uma categoria");
      return;
    }

    if (!selectedEmotionId) {
      Alert.alert("Erro", "Por favor, selecione uma emoção");
      return;
    }

    setLoading(true);

    try {
      await updateExpense(expenseId, {
        amount: parseFloat(amount),
        date,
        categoryId: selectedCategoryId,
        emotionId: selectedEmotionId,
        note,
        type: transactionType,
        attachments,
      });

      Alert.alert("Sucesso", "Transação atualizada!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a transação");
      console.error("Erro ao atualizar transação:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCancel = () => {
    Alert.alert("Cancelar edição", "Deseja descartar as alterações?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => navigation.goBack() },
    ]);
  };

  const styles = createStyles(colors);

  if (!currentExpense) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Editar Transação</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Tipo de Transação */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === "expense" && styles.typeButtonActive,
                  {
                    borderColor:
                      transactionType === "expense"
                        ? colors.error
                        : colors.border,
                    backgroundColor:
                      transactionType === "expense"
                        ? `${colors.error}15`
                        : colors.backgroundSecondary,
                  },
                ]}
                onPress={() => setTransactionType("expense")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="trending-down"
                  size={24}
                  color={
                    transactionType === "expense"
                      ? colors.error
                      : colors.text.primary
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === "expense" && { color: colors.error },
                  ]}
                >
                  Gasto
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === "saving" && styles.typeButtonActive,
                  {
                    borderColor:
                      transactionType === "saving"
                        ? colors.success
                        : colors.border,
                    backgroundColor:
                      transactionType === "saving"
                        ? `${colors.success}15`
                        : colors.backgroundSecondary,
                  },
                ]}
                onPress={() => setTransactionType("saving")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="trending-up"
                  size={24}
                  color={
                    transactionType === "saving"
                      ? colors.success
                      : colors.text.primary
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === "saving" && { color: colors.success },
                  ]}
                >
                  Economia
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Valor */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Valor</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0,00"
                placeholderTextColor={colors.gray[400]}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar" size={20} color={colors.primary[500]} />
              <Text style={styles.dateText}>
                {date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          {/* Categoria */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria</Text>
            <CategorySelector
              categories={categories}
              selectedCategoryId={selectedCategoryId ?? undefined}
              onSelect={setSelectedCategoryId}
            />
          </View>

          {/* Emoção */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Como você estava se sentindo?
            </Text>
            <EmotionSelector
              emotions={emotions}
              selectedEmotionId={selectedEmotionId ?? undefined}
              onSelect={setSelectedEmotionId}
            />
          </View>

          {/* Observações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <TextInput
              style={styles.textArea}
              value={note}
              onChangeText={setNote}
              placeholder="Adicione detalhes sobre esta transação..."
              placeholderTextColor={colors.gray[400]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Anexos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anexos (opcional)</Text>
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
                    <TouchableOpacity
                      onPress={() => setExpandedImage(uri)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri }} style={styles.attachmentImage} />
                    </TouchableOpacity>
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

          {/* Botões de Ação */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: colors.primary[500] },
                loading && { opacity: 0.6 },
              ]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Imagem Expandida */}
      <Modal
        visible={expandedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setExpandedImage(null)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageModalClose}
            onPress={() => setExpandedImage(null)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {expandedImage && (
            <Image
              source={{ uri: expandedImage }}
              style={styles.expandedImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      padding: spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.lg,
      paddingTop: spacing.sm,
    },
    backButton: {
      padding: spacing.xs,
    },
    title: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    typeContainer: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    typeButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      gap: spacing.xs,
    },
    typeButtonActive: {
      borderWidth: 2,
    },
    typeButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    currencySymbol: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary[500],
      marginRight: spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      paddingVertical: spacing.md,
    },
    dateButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
      ...shadows.sm,
    },
    dateText: {
      fontSize: fontSize.md,
      color: colors.text.primary,
      textTransform: "capitalize",
    },
    textArea: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      fontSize: fontSize.md,
      color: colors.text.primary,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 100,
      ...shadows.sm,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.md,
      marginBottom: spacing.xl,
    },
    cancelButton: {
      flex: 1,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      alignItems: "center",
    },
    cancelButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
    },
    saveButton: {
      flex: 1,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      alignItems: "center",
      ...shadows.md,
    },
    saveButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: "#FFFFFF",
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: colors.primary[500],
      borderStyle: "dashed",
      gap: spacing.sm,
      justifyContent: "center",
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
      width: 100,
      height: 100,
      borderRadius: borderRadius.md,
    },
    removeAttachment: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: colors.background,
      borderRadius: 12,
    },
    imageModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      justifyContent: "center",
      alignItems: "center",
    },
    imageModalClose: {
      position: "absolute",
      top: 50,
      right: 20,
      zIndex: 10,
      padding: spacing.sm,
    },
    expandedImage: {
      width: "90%",
      height: "80%",
    },
  });
