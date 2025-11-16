import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Expense } from "../../domain/entities/Expense";
import { Category } from "../../domain/entities/Category";
import { Emotion } from "../../domain/entities/Emotion";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

interface ExpenseCardProps {
  expense: Expense;
  category?: Category;
  emotion?: Emotion;
  onPress?: () => void;
}

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Alimentação: "fast-food",
  Transporte: "car",
  Entretenimento: "game-controller",
  Compras: "cart",
  Saúde: "medical",
  Educação: "school",
  Outros: "ellipsis-horizontal",
};

const emotionIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Feliz: "happy",
  Triste: "sad",
  Estressado: "fitness",
  Entediado: "remove-circle",
  Empolgado: "star",
  Ansioso: "warning",
  Calmo: "leaf",
};

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  category,
  emotion,
  onPress,
}) => {
  const categoryIcon = categoryIcons[category?.name || ""] || "receipt";
  const emotionIcon = emotionIcons[emotion?.name || ""] || "heart";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: category?.color || colors.primary[500] },
        ]}
      >
        <Ionicons name={categoryIcon} size={24} color={colors.text.inverse} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.categoryName}>
            {category?.name || "Sem categoria"}
          </Text>
          <Text style={styles.amount}>R$ {expense.amount.toFixed(2)}</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons
              name={emotionIcon}
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.detailText}>
              {emotion?.name || "Sem emoção"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.detailText}>
              {format(new Date(expense.date), "dd 'de' MMM", { locale: ptBR })}
            </Text>
          </View>
        </View>

        {expense.note && (
          <Text style={styles.notes} numberOfLines={1}>
            {expense.note}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  amount: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
  },
  details: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  notes: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    fontStyle: "italic",
    marginTop: spacing.xs,
  },
});
