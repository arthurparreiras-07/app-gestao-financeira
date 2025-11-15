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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../application/store/useAppStore";
import { EmotionSelector } from "../components/EmotionSelector";
import { CategorySelector } from "../components/CategorySelector";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

export const AddExpenseScreen = ({ navigation }: any) => {
  const { emotions, categories, addExpense } = useAppStore();
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
      });
      Alert.alert("Sucesso", "Gasto registrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o gasto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <View style={styles.content}>
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
                {loading ? "Salvando..." : "Salvar Gasto"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
