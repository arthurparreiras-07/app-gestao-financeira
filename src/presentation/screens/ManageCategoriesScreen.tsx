import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppStore } from "../../application/store/useAppStore";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

const PRESET_COLORS = [
  "#EF4444", // red
  "#F59E0B", // amber
  "#10B981", // green
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#F97316", // orange
  "#6366F1", // indigo
];

const PRESET_ICONS = [
  "fast-food",
  "car",
  "game-controller",
  "cart",
  "medical",
  "school",
  "home",
  "airplane",
  "fitness",
  "cafe",
  "pizza",
  "restaurant",
  "wallet",
  "card",
  "gift",
  "shirt",
  "basketball",
  "beer",
  "book",
  "briefcase",
];

export const ManageCategoriesScreen = ({ navigation }: any) => {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("receipt");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const styles = createStyles(colors);

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setSelectedIcon("receipt");
    setSelectedColor(PRESET_COLORS[0]);
    setShowModal(true);
  };

  const openEditModal = (category: any) => {
    setEditingId(category.id);
    setName(category.name);
    setSelectedIcon(category.icon);
    setSelectedColor(category.color);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Digite um nome para a categoria");
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: name.trim(),
          icon: selectedIcon,
          color: selectedColor,
        });
        Alert.alert("Sucesso", "Categoria atualizada!");
      } else {
        await addCategory({
          name: name.trim(),
          icon: selectedIcon,
          color: selectedColor,
        });
        Alert.alert("Sucesso", "Categoria criada!");
      }
      setShowModal(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a categoria");
    }
  };

  const handleDelete = (id: number, categoryName: string) => {
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir a categoria "${categoryName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(id);
              Alert.alert("Sucesso", "Categoria excluída!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a categoria");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Categorias</Text>
          <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
            <Ionicons name="add" size={24} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {/* Lista de Categorias */}
        <ScrollView style={styles.scrollView}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryInfo}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${category.color}20` },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={category.color}
                  />
                </View>
                <View style={styles.categoryDetails}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <View style={styles.colorIndicator}>
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: category.color },
                      ]}
                    />
                    <Text style={styles.colorText}>{category.color}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => openEditModal(category)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={colors.primary[500]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(category.id!, category.name)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Modal de Criar/Editar */}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingId ? "Editar" : "Nova"} Categoria
                </Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.text.primary}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Nome */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: Alimentação"
                    placeholderTextColor={colors.gray[400]}
                  />
                </View>

                {/* Ícone */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ícone</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowIconPicker(!showIconPicker)}
                  >
                    <Ionicons
                      name={selectedIcon as any}
                      size={24}
                      color={selectedColor}
                    />
                    <Text style={styles.pickerButtonText}>{selectedIcon}</Text>
                    <Ionicons
                      name={showIconPicker ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>

                  {showIconPicker && (
                    <View style={styles.iconGrid}>
                      {PRESET_ICONS.map((icon) => (
                        <TouchableOpacity
                          key={icon}
                          style={[
                            styles.iconOption,
                            selectedIcon === icon && styles.iconOptionSelected,
                          ]}
                          onPress={() => {
                            setSelectedIcon(icon);
                            setShowIconPicker(false);
                          }}
                        >
                          <Ionicons
                            name={icon as any}
                            size={24}
                            color={
                              selectedIcon === icon
                                ? selectedColor
                                : colors.text.secondary
                            }
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Cor */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Cor</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowColorPicker(!showColorPicker)}
                  >
                    <View
                      style={[
                        styles.colorPreview,
                        { backgroundColor: selectedColor },
                      ]}
                    />
                    <Text style={styles.pickerButtonText}>{selectedColor}</Text>
                    <Ionicons
                      name={showColorPicker ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>

                  {showColorPicker && (
                    <View style={styles.colorGrid}>
                      {PRESET_COLORS.map((color) => (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            selectedColor === color &&
                              styles.colorOptionSelected,
                          ]}
                          onPress={() => {
                            setSelectedColor(color);
                            setShowColorPicker(false);
                          }}
                        >
                          {selectedColor === color && (
                            <Ionicons name="checkmark" size={20} color="#FFF" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Botões */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: spacing.xs,
    },
    title: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    addButton: {
      padding: spacing.xs,
    },
    scrollView: {
      flex: 1,
      padding: spacing.md,
    },
    categoryCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.backgroundSecondary,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    categoryInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    categoryDetails: {
      flex: 1,
    },
    categoryName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    colorIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    colorText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    actions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    actionButton: {
      padding: spacing.sm,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    modalBody: {
      padding: spacing.lg,
    },
    inputGroup: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      fontSize: fontSize.md,
      color: colors.text.primary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pickerButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },
    pickerButtonText: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text.primary,
    },
    colorPreview: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    iconGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginTop: spacing.sm,
      padding: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
    },
    iconOption: {
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: "transparent",
    },
    iconOptionSelected: {
      borderColor: colors.primary[500],
      backgroundColor: `${colors.primary[500]}10`,
    },
    colorGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md,
      marginTop: spacing.sm,
      padding: spacing.sm,
    },
    colorOption: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "transparent",
    },
    colorOptionSelected: {
      borderColor: colors.background,
      ...shadows.md,
    },
    modalFooter: {
      flexDirection: "row",
      padding: spacing.lg,
      gap: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    button: {
      flex: 1,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 2,
      borderColor: colors.border,
    },
    cancelButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
    },
    saveButton: {
      backgroundColor: colors.primary[500],
      ...shadows.md,
    },
    saveButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: "#FFFFFF",
    },
  });
