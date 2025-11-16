import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Insight } from "../../application/services/InsightsService";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const getInsightStyle = (type: Insight["type"]) => {
    switch (type) {
      case "warning":
        return {
          icon: "warning" as keyof typeof Ionicons.glyphMap,
          backgroundColor: `${colors.warning}15`,
          borderColor: colors.warning,
          iconBackground: colors.warning,
          textColor: colors.warning,
        };
      case "success":
        return {
          icon: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
          backgroundColor: `${colors.success}15`,
          borderColor: colors.success,
          iconBackground: colors.success,
          textColor: colors.success,
        };
      case "info":
      default:
        return {
          icon: "information-circle" as keyof typeof Ionicons.glyphMap,
          backgroundColor: `${colors.info}15`,
          borderColor: colors.info,
          iconBackground: colors.info,
          textColor: colors.secondary[700],
        };
    }
  };

  const style = getInsightStyle(insight.type);
  const styles = createStyles(colors);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: style.backgroundColor,
          borderLeftWidth: 4,
          borderLeftColor: style.borderColor,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: style.iconBackground },
        ]}
      >
        <Ionicons name={style.icon} size={20} color={colors.text.inverse} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.message, { color: style.textColor }]}>
          {insight.message}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    content: {
      flex: 1,
    },
    message: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      lineHeight: 20,
    },
  });
