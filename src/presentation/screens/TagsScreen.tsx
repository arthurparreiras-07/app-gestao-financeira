import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
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
  "#EF4444", // Red
  "#F59E0B", // Orange
  "#10B981", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange-2
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#A855F7", // Purple-2
  "#F43F5E", // Rose
];

export const TagsScreen = ({ navigation }: any) => {
  const { tags, addTag, updateTag, deleteTag } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTag, setEditingTag] = useState<number | null>(null);
  const [tagName, setTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const styles = createStyles(colors);

  const handleSaveTag = async () => {
    if (!tagName.trim()) {
      Alert.alert("Erro", "Digite um nome para a tag");
      return;
    }

    try {
      if (editingTag) {
        await updateTag(editingTag, {
          name: tagName.trim(),
          color: selectedColor,
        });
        Alert.alert("Sucesso", "Tag atualizada!");
      } else {
        await addTag({
          name: tagName.trim(),
          color: selectedColor,
        });
        Alert.alert("Sucesso", "Tag criada!");
      }
      resetForm();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a tag");
    }
  };

  const handleDeleteTag = (tagId: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta tag? Ela será removida de todas as transações.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTag(tagId);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir");
            }
          },
        },
      ]
    );
  };

  const handleEditTag = (tag: any) => {
    setEditingTag(tag.id);
    setTagName(tag.name);
    setSelectedColor(tag.color);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingTag(null);
    setTagName("");
    setSelectedColor(PRESET_COLORS[0]);
  };

  const renderTagCard = (tag: any) => {
    return (
      <TouchableOpacity
        key={tag.id}
        style={[
          styles.tagCard,
          { borderLeftColor: tag.color, borderLeftWidth: 4 },
        ]}
        onPress={() => handleEditTag(tag)}
        activeOpacity={0.7}
      >
        <View style={styles.tagInfo}>
          <View style={[styles.colorDot, { backgroundColor: tag.color }]} />
          <Text style={styles.tagName}>{tag.name}</Text>
        </View>
        <View style={styles.tagActions}>
          <TouchableOpacity
            onPress={() => handleEditTag(tag)}
            style={styles.actionButton}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={colors.primary[500]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteTag(tag.id)}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tags</Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={28} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle"
              size={24}
              color={colors.primary[500]}
            />
            <Text style={styles.infoText}>
              Crie tags personalizadas para organizar suas transações. Você pode
              associar múltiplas tags a cada transação.
            </Text>
          </View>

          {tags.length > 0 ? (
            <View style={styles.tagsList}>{tags.map(renderTagCard)}</View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="pricetags-outline"
                size={64}
                color={colors.gray[300]}
              />
              <Text style={styles.emptyText}>Nenhuma tag criada</Text>
              <Text style={styles.emptySubtext}>
                Toque no + para criar sua primeira tag personalizada
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTag ? "Editar Tag" : "Nova Tag"}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Tag Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome da Tag *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Trabalho, Lazer, Essencial..."
                  placeholderTextColor={colors.gray[400]}
                  value={tagName}
                  onChangeText={setTagName}
                  maxLength={20}
                />
                <Text style={styles.inputHint}>
                  {tagName.length}/20 caracteres
                </Text>
              </View>

              {/* Color Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cor *</Text>
                <View style={styles.colorGrid}>
                  {PRESET_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => setSelectedColor(color)}
                      activeOpacity={0.8}
                    >
                      {selectedColor === color && (
                        <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Preview */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Pré-visualização</Text>
                <View style={styles.previewContainer}>
                  <View
                    style={[styles.previewTag, { borderColor: selectedColor }]}
                  >
                    <View
                      style={[
                        styles.previewDot,
                        { backgroundColor: selectedColor },
                      ]}
                    />
                    <Text style={styles.previewText}>
                      {tagName.trim() || "Nome da Tag"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveTag}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.text.inverse}
                />
                <Text style={styles.saveButtonText}>
                  {editingTag ? "Atualizar" : "Criar"} Tag
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing.lg,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: spacing.xs,
    },
    headerTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    addButton: {
      padding: spacing.xs,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: spacing.md,
    },
    infoCard: {
      flexDirection: "row",
      gap: spacing.md,
      backgroundColor: `${colors.primary[500]}15`,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.lg,
    },
    infoText: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    tagsList: {
      gap: spacing.md,
    },
    tagCard: {
      backgroundColor: colors.background,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    tagInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      flex: 1,
    },
    colorDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    tagName: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
    },
    tagActions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    actionButton: {
      padding: spacing.xs,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xl * 2,
      gap: spacing.md,
    },
    emptyText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.text.secondary,
    },
    emptySubtext: {
      fontSize: fontSize.md,
      color: colors.text.tertiary,
      textAlign: "center",
      paddingHorizontal: spacing.xl,
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
      padding: spacing.lg,
      maxHeight: "90%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    inputGroup: {
      marginBottom: spacing.lg,
    },
    inputLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    input: {
      padding: spacing.md,
      fontSize: fontSize.md,
      color: colors.text.primary,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputHint: {
      fontSize: fontSize.sm,
      color: colors.text.tertiary,
      marginTop: spacing.xs,
      textAlign: "right",
    },
    colorGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md,
    },
    colorOption: {
      width: 50,
      height: 50,
      borderRadius: borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      ...shadows.sm,
    },
    colorOptionSelected: {
      borderWidth: 3,
      borderColor: colors.background,
      ...shadows.md,
    },
    previewContainer: {
      backgroundColor: colors.backgroundSecondary,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      alignItems: "center",
    },
    previewTag: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      borderWidth: 1.5,
    },
    previewDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    previewText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    saveButton: {
      backgroundColor: colors.primary[500],
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      marginTop: spacing.md,
      ...shadows.md,
    },
    saveButtonText: {
      color: colors.text.inverse,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
  });
