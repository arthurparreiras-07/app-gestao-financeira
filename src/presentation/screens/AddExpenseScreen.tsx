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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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
  const { emotions, categories, addExpense } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState("");
  const [emotionId, setEmotionId] = useState<number>();
  const [categoryId, setCategoryId] = useState<number>();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

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
      await addExpense({
        amount: numAmount,
        date: new Date(),
        emotionId,
        categoryId,
        note,
        type: transactionType,
      });
      Alert.alert("Sucesso", `${transactionType === 'expense' ? 'Gasto' : 'Economia'} registrado com sucesso!`);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", `Não foi possível salvar ${transactionType === 'expense' ? 'o gasto' : 'a economia'}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={styles.content}>
            {/* Tipo de transação */}
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === 'expense' && styles.typeButtonActive
                ]}
                onPress={() => setTransactionType('expense')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="trending-down"
                  size={20}
                  color={transactionType === 'expense' ? colors.error : colors.text.secondary}
                />
                <Text style={[
                  styles.typeButtonText,
                  transactionType === 'expense' && styles.typeButtonTextActive
                ]}>
                  Gasto
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === 'saving' && styles.typeButtonActive
                ]}
                onPress={() => setTransactionType('saving')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="trending-up"
                  size={20}
                  color={transactionType === 'saving' ? colors.success : colors.text.secondary}
                />
                <Text style={[
                  styles.typeButtonText,
                  transactionType === 'saving' && styles.typeButtonTextActive
                ]}>
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
                {loading ? "Salvando..." : `Salvar ${transactionType === 'expense' ? 'Gasto' : 'Economia'}`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) => StyleSheet.create({
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
});
