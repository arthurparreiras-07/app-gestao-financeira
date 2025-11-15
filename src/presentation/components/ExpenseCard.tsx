import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Expense } from "../../domain/entities/Expense";
import { Emotion } from "../../domain/entities/Emotion";
import { Category } from "../../domain/entities/Category";
import { format } from "date-fns";

interface ExpenseCardProps {
  expense: Expense;
  emotion?: Emotion;
  category?: Category;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  emotion,
  category,
  onPress,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        category && { borderLeftColor: category.color, borderLeftWidth: 4 },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconsContainer}>
          {emotion && <Text style={styles.emotionIcon}>{emotion.icon}</Text>}
          {category && <Text style={styles.categoryIcon}>{category.icon}</Text>}
        </View>
        <Text style={styles.amount}>R$ {expense.amount.toFixed(2)}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.infoRow}>
          {emotion && <Text style={styles.emotionName}>{emotion.name}</Text>}
          <Text style={styles.separator}>•</Text>
          {category && <Text style={styles.categoryName}>{category.name}</Text>}
        </View>

        <Text style={styles.date}>
          {format(expense.date, "dd/MM/yyyy 'às' HH:mm")}
        </Text>

        {expense.note && <Text style={styles.note}>{expense.note}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  emotionIcon: {
    fontSize: 24,
  },
  categoryIcon: {
    fontSize: 24,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emotionName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  separator: {
    fontSize: 14,
    color: "#999",
  },
  categoryName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  note: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
});
