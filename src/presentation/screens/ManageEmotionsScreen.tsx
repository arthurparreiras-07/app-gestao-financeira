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

const PRESET_ICONS = [
  "happy",
  "sad",
  "heart",
  "heart-dislike",
  "fitness",
  "remove-circle",
  "star",
  "warning",
  "leaf",
  "sunny",
  "moon",
  "thunderstorm",
  "flame",
  "water",
  "sparkles",
  "flower",
  "skull",
  "ice-cream",
  "cafe",
  "rose",
];

const INTENSITY_LEVELS = [
  { value: 1, label: "Muito Baixa", color: "#D1D5DB" },
  { value: 2, label: "Baixa", color: "#9CA3AF" },
  { value: 3, label: "Moderada", color: "#F59E0B" },
  { value: 4, label: "Alta", color: "#EF4444" },
  { value: 5, label: "Muito Alta", color: "#991B1B" },
];

export const ManageEmotionsScreen = ({ navigation }: any) => {
  const { emotions, addEmotion, updateEmotion, deleteEmotion } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("heart");
  const [intensity, setIntensity] = useState(3);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const styles = createStyles(colors);

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setSelectedIcon("heart");
    setIntensity(3);
    setShowModal(true);
  };

  const openEditModal = (emotion: any) => {
    setEditingId(emotion.id);
    setName(emotion.name);
    setSelectedIcon(emotion.icon);
    setIntensity(emotion.intensity);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Digite um nome para a emoção");
      return;
    }

    try {
      if (editingId) {
        await updateEmotion(editingId, {
          name: name.trim(),
          icon: selectedIcon,
          intensity,
        });
        Alert.alert("Sucesso", "Emoção atualizada!");
      } else {
        await addEmotion({
          name: name.trim(),
          icon: selectedIcon,
          intensity,
        });
        Alert.alert("Sucesso", "Emoção criada!");
      }
      setShowModal(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a emoção");
    }
  };

  const handleDelete = (id: number, emotionName: string) => {
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir a emoção "${emotionName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEmotion(id);
              Alert.alert("Sucesso", "Emoção excluída!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a emoção");
            }
          },
        },
      ]
    );
  };

  const getIntensityColor = (level: number) => {
    const intensity = INTENSITY_LEVELS.find((i) => i.value === level);
    return intensity?.color || colors.gray[400];
  };

  const getIntensityLabel = (level: number) => {
    const intensity = INTENSITY_LEVELS.find((i) => i.value === level);
    return intensity?.label || "Moderada";
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
          <Text style={styles.title}>Emoções</Text>
          <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
            <Ionicons name="add" size={24} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {/* Lista de Emoções */}
        <ScrollView style={styles.scrollView}>
          {emotions.map((emotion) => (
            <View key={emotion.id} style={styles.emotionCard}>
              <View style={styles.emotionInfo}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: `${getIntensityColor(
                        emotion.intensity
                      )}20`,
                    },
                  ]}
                >
                  <Ionicons
                    name={emotion.icon as any}
                    size={24}
                    color={getIntensityColor(emotion.intensity)}
                  />
                </View>
                <View style={styles.emotionDetails}>
                  <Text style={styles.emotionName}>{emotion.name}</Text>
                  <View style={styles.intensityIndicator}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.intensityDot,
                          {
                            backgroundColor:
                              level <= emotion.intensity
                                ? getIntensityColor(emotion.intensity)
                                : colors.gray[300],
                          },
                        ]}
                      />
                    ))}
                    <Text style={styles.intensityText}>
                      {getIntensityLabel(emotion.intensity)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => openEditModal(emotion)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={colors.primary[500]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(emotion.id!, emotion.name)}
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
                  {editingId ? "Editar" : "Nova"} Emoção
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
                    placeholder="Ex: Empolgado"
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
                      color={getIntensityColor(intensity)}
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
                                ? getIntensityColor(intensity)
                                : colors.text.secondary
                            }
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Intensidade */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Intensidade Emocional</Text>
                  <View style={styles.intensitySlider}>
                    {INTENSITY_LEVELS.map((level) => (
                      <TouchableOpacity
                        key={level.value}
                        style={[
                          styles.intensityOption,
                          intensity === level.value &&
                            styles.intensityOptionSelected,
                          { borderColor: level.color },
                        ]}
                        onPress={() => setIntensity(level.value)}
                      >
                        <View
                          style={[
                            styles.intensityCircle,
                            { backgroundColor: level.color },
                            intensity === level.value &&
                              styles.intensityCircleActive,
                          ]}
                        />
                        <Text
                          style={[
                            styles.intensityLevelText,
                            intensity === level.value &&
                              styles.intensityLevelTextActive,
                          ]}
                        >
                          {level.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
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
    emotionCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.backgroundSecondary,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    emotionInfo: {
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
    emotionDetails: {
      flex: 1,
    },
    emotionName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    intensityIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    intensityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    intensityText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
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
    intensitySlider: {
      gap: spacing.sm,
    },
    intensityOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: "transparent",
      backgroundColor: colors.backgroundSecondary,
      gap: spacing.md,
    },
    intensityOptionSelected: {
      backgroundColor: colors.background,
      ...shadows.sm,
    },
    intensityCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    intensityCircleActive: {
      ...shadows.md,
    },
    intensityLevelText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
    },
    intensityLevelTextActive: {
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
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
