import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Emotion } from "../../domain/entities/Emotion";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

interface EmotionSelectorProps {
  emotions: Emotion[];
  selectedEmotionId?: number;
  onSelect: (emotionId: number) => void;
}

const emotionIcons: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  Feliz: { icon: "happy", color: "#10B981" },
  Triste: { icon: "sad", color: "#3B82F6" },
  Estressado: { icon: "fitness", color: "#F59E0B" },
  Entediado: { icon: "remove-circle", color: "#6B7280" },
  Empolgado: { icon: "star", color: "#F59E0B" },
  Ansioso: { icon: "warning", color: "#EF4444" },
  Calmo: { icon: "leaf", color: "#10B981" },
};

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  emotions,
  selectedEmotionId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name="heart" size={20} color={colors.primary[500]} />
        <Text style={styles.label}>Como você está se sentindo? *</Text>
      </View>
      <View style={styles.emotionsGrid}>
        {emotions.map((emotion) => {
          const isSelected = selectedEmotionId === emotion.id;
          const emotionStyle = emotionIcons[emotion.name] || {
            icon: "heart",
            color: colors.primary[500],
          };

          return (
            <TouchableOpacity
              key={emotion.id}
              style={[
                styles.emotionButton,
                isSelected && {
                  backgroundColor: `${emotionStyle.color}20`,
                  borderWidth: 2,
                  borderColor: emotionStyle.color,
                },
              ]}
              onPress={() => onSelect(emotion.id!)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: emotionStyle.color },
                ]}
              >
                <Ionicons
                  name={emotionStyle.icon}
                  size={24}
                  color={colors.text.inverse}
                />
              </View>
              <Text
                style={[
                  styles.emotionName,
                  isSelected && styles.emotionNameSelected,
                ]}
              >
                {emotion.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  emotionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  emotionButton: {
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: "31%",
    backgroundColor: colors.backgroundSecondary,
    ...shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  emotionName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: "center",
    fontWeight: fontWeight.medium,
  },
  emotionNameSelected: {
    color: colors.text.primary,
    fontWeight: fontWeight.semibold,
  },
});
