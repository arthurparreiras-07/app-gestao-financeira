import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

interface DrawerHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightButton?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export function DrawerHeader({
  title,
  showBackButton = false,
  rightButton,
}: DrawerHeaderProps) {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const styles = createStyles(colors);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          if (showBackButton) {
            navigation.goBack();
          } else {
            navigation.dispatch(DrawerActions.openDrawer());
          }
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={showBackButton ? "arrow-back" : "menu"}
          size={24}
          color={colors.text.primary}
        />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {rightButton ? (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={rightButton.onPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={rightButton.icon}
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightButton} />
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      ...shadows.sm,
    },
    menuButton: {
      padding: spacing.sm,
      marginLeft: -spacing.sm,
    },
    title: {
      flex: 1,
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: "center",
      marginHorizontal: spacing.md,
    },
    rightButton: {
      padding: spacing.sm,
      marginRight: -spacing.sm,
      minWidth: 40,
    },
  });
