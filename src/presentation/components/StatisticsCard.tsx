import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getColors, spacing, borderRadius, fontSize, fontWeight, shadows } from "../../theme/theme";

interface StatisticsCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  data: {
    average: number;
    median: number;
    min: number;
    max: number;
    total: number;
    count: number;
  };
  isDark: boolean;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  icon,
  iconColor,
  data,
  isDark,
}) => {
  const colors = getColors(isDark);
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Média</Text>
          <Text style={styles.statValue}>R$ {data.average.toFixed(2)}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Mediana</Text>
          <Text style={styles.statValue}>R$ {data.median.toFixed(2)}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Mínimo</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            R$ {data.min.toFixed(2)}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Máximo</Text>
          <Text style={[styles.statValue, { color: colors.error }]}>
            R$ {data.max.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={[styles.footerValue, { color: iconColor }]}>
            R$ {data.total.toFixed(2)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Transações</Text>
          <Text style={styles.footerValue}>{data.count}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.md,
      marginBottom: spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: spacing.md,
    },
    statItem: {
      width: "50%",
      marginBottom: spacing.md,
    },
    statLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    statValue: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerItem: {
      flex: 1,
      alignItems: "center",
    },
    footerLabel: {
      fontSize: fontSize.xs,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    footerValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
    },
  });
