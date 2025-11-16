import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../../theme/theme";
import { useAppStore } from "../../application/store/useAppStore";

interface MenuItem {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: "main" | "secondary";
}

const menuItems: MenuItem[] = [
  { name: "Home", label: "Início", icon: "home", type: "main" },
  { name: "Transactions", label: "Transações", icon: "list", type: "main" },
  {
    name: "Reports",
    label: "Relatórios",
    icon: "bar-chart",
    type: "secondary",
  },
  { name: "Budget", label: "Orçamento", icon: "wallet", type: "secondary" },
  {
    name: "RecurringExpenses",
    label: "Despesas Recorrentes",
    icon: "repeat",
    type: "secondary",
  },
  { name: "Tags", label: "Tags", icon: "pricetag", type: "secondary" },
  { name: "Settings", label: "Configurações", icon: "settings", type: "main" },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { navigation, state } = props;
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const { expenses } = useAppStore();

  const styles = createStyles(colors);

  const currentRoute = state.routes[state.index].name;

  // Calcular totais
  const totalExpenses = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = expenses
    .filter((e) => e.type === "saving")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = totalSavings - totalExpenses;

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="analytics" size={32} color={colors.primary[500]} />
          </View>
          <Text style={styles.appName}>MindBudget</Text>
          <Text style={styles.appTagline}>Gestão Financeira Emocional</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Atual</Text>
          <Text
            style={[
              styles.balanceValue,
              { color: balance >= 0 ? colors.success : colors.error },
            ]}
          >
            {balance >= 0 ? "+" : ""}R$ {balance.toFixed(2)}
          </Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <Ionicons name="trending-down" size={16} color={colors.error} />
              <Text style={styles.balanceText}>
                R$ {totalExpenses.toFixed(2)}
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <Ionicons name="trending-up" size={16} color={colors.success} />
              <Text style={styles.balanceText}>
                R$ {totalSavings.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>NAVEGAÇÃO</Text>
          {menuItems
            .filter((item) => item.type === "main")
            .map((item) => {
              const isActive = currentRoute === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => navigation.navigate(item.name)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={
                      isActive ? colors.primary[500] : colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.menuLabel,
                      isActive && styles.menuLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
        </View>

        {/* Secondary Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>FERRAMENTAS</Text>
          {menuItems
            .filter((item) => item.type === "secondary")
            .map((item) => {
              const isActive = currentRoute === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => navigation.navigate(item.name)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={
                      isActive ? colors.primary[500] : colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.menuLabel,
                      isActive && styles.menuLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 2.0.0</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: spacing.md,
    },
    header: {
      padding: spacing.xl,
      paddingTop: spacing.xxl,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: "center",
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${colors.primary[500]}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    appName: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    appTagline: {
      fontSize: fontSize.sm,
      color: colors.text.tertiary,
      textAlign: "center",
    },
    balanceCard: {
      margin: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary[500],
    },
    balanceLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    balanceValue: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.md,
    },
    balanceDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    balanceItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    balanceText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    menuSection: {
      marginTop: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.bold,
      color: colors.text.tertiary,
      marginLeft: spacing.lg,
      marginBottom: spacing.sm,
      letterSpacing: 1,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      marginHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      position: "relative",
    },
    menuItemActive: {
      backgroundColor: `${colors.primary[500]}10`,
    },
    menuLabel: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      marginLeft: spacing.md,
      fontWeight: fontWeight.medium,
      flex: 1,
    },
    menuLabelActive: {
      color: colors.primary[500],
      fontWeight: fontWeight.semibold,
    },
    activeIndicator: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: colors.primary[500],
      borderTopLeftRadius: borderRadius.sm,
      borderBottomLeftRadius: borderRadius.sm,
    },
    footer: {
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: "center",
    },
    footerText: {
      fontSize: fontSize.xs,
      color: colors.text.tertiary,
    },
  });
