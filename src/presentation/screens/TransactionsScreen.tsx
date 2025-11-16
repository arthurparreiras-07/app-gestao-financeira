import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { Expense } from "../../domain/entities/Expense";
import { PieChart } from "react-native-chart-kit";

type FilterType = "all" | "expense" | "saving";
type TabType = "list" | "reports";

export const TransactionsScreen = ({ navigation }: any) => {
  const { expenses, emotions, categories, deleteExpense, tags } = useAppStore();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeTab, setActiveTab] = useState<TabType>("list");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Edit/Delete
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Filtros avançados
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  // Cores para emoções
  const emotionColors: Record<string, string> = {
    Feliz: "#10B981",
    Triste: "#3B82F6",
    Estressado: "#F59E0B",
    Entediado: "#6B7280",
    Empolgado: "#8B5CF6",
    Ansioso: "#EF4444",
    Calmo: "#14B8A6",
  };

  // Handle long press
  const handleLongPress = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowActionMenu(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (!selectedExpense) return;

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteExpense(selectedExpense.id!);
              setShowActionMenu(false);
              setSelectedExpense(null);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a transação");
            }
          },
        },
      ]
    );
  };

  // Filtrar transações
  const filteredExpenses = expenses
    .filter((e) => {
      // Filtro por busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const categoryName = getCategoryName(e.categoryId).toLowerCase();
        const emotionName = getEmotionName(e.emotionId).toLowerCase();
        const note = (e.note || "").toLowerCase();
        const amount = e.amount.toString();

        const matchesSearch =
          categoryName.includes(query) ||
          emotionName.includes(query) ||
          note.includes(query) ||
          amount.includes(query);

        if (!matchesSearch) return false;
      }

      // Filtro por tipo (all, expense, saving)
      if (filter !== "all" && e.type !== filter) return false;

      // Filtro por categoria
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(e.categoryId)
      ) {
        return false;
      }

      // Filtro por emoção
      if (
        selectedEmotions.length > 0 &&
        !selectedEmotions.includes(e.emotionId)
      ) {
        return false;
      }

      // Filtro por data mínima
      if (startDate && e.date < startDate) {
        return false;
      }

      // Filtro por data máxima
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (e.date > endOfDay) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Separar gastos e economias
  const allExpenses = filteredExpenses.filter((e) => e.type === "expense");
  const allSavings = filteredExpenses.filter((e) => e.type === "saving");
  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = allSavings.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalSavings - totalExpenses;

  // Agrupar por data (para lista)
  const groupedByDate = filteredExpenses.reduce((acc, expense) => {
    const dateKey = format(expense.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Dados para gráficos (relatórios)
  const expensesByEmotion = emotions
    .map((emotion) => {
      const emotionExpenses = allExpenses.filter(
        (e) => e.emotionId === emotion.id
      );
      const total = emotionExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: emotion.name,
        amount: total,
        color: emotionColors[emotion.name] || colors.primary[500],
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
      };
    })
    .filter((item) => item.amount > 0);

  const savingsByEmotion = emotions
    .map((emotion) => {
      const emotionSavings = allSavings.filter(
        (e) => e.emotionId === emotion.id
      );
      const total = emotionSavings.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: emotion.name,
        amount: total,
        color: emotionColors[emotion.name] || colors.success,
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
      };
    })
    .filter((item) => item.amount > 0);

  const expensesByCategory = categories
    .map((category) => {
      const categoryExpenses = allExpenses.filter(
        (e) => e.categoryId === category.id
      );
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: category.name,
        amount: total,
        color: category.color,
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
      };
    })
    .filter((item) => item.amount > 0);

  const savingsByCategory = categories
    .map((category) => {
      const categorySavings = allSavings.filter(
        (e) => e.categoryId === category.id
      );
      const total = categorySavings.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: category.name,
        amount: total,
        color: category.color,
        legendFontColor: colors.text.secondary,
        legendFontSize: 12,
      };
    })
    .filter((item) => item.amount > 0);

  const getEmotionName = (emotionId: number) => {
    const emotion = emotions.find((e) => e.id === emotionId);
    return emotion ? emotion.name : "Desconhecido";
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Desconhecido";
  };

  const getCategoryColor = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.color : colors.primary[500];
  };

  const chartConfig = {
    color: (opacity = 1) => `rgba(31, 166, 114, ${opacity})`,
  };

  // Funções de filtros
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleEmotion = (emotionId: number) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotionId)
        ? prev.filter((id) => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedEmotions([]);
    setStartDate(null);
    setEndDate(null);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedEmotions.length > 0 ||
    startDate !== null ||
    endDate !== null;

  const styles = createStyles(colors);

  // Renderizar transação individual
  const renderTransaction = (expense: Expense) => {
    const isExpense = expense.type === "expense";
    const categoryColor = getCategoryColor(expense.categoryId);
    const hasAttachments =
      expense.attachments && expense.attachments.length > 0;

    return (
      <TouchableOpacity
        key={expense.id}
        style={styles.transactionCard}
        onLongPress={() => handleLongPress(expense)}
        activeOpacity={0.7}
        delayLongPress={500}
      >
        <View style={styles.transactionHeader}>
          <View style={styles.transactionLeft}>
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: `${categoryColor}20` },
              ]}
            >
              <Ionicons
                name={isExpense ? "trending-down" : "trending-up"}
                size={20}
                color={categoryColor}
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionCategory}>
                {getCategoryName(expense.categoryId)}
              </Text>
              <View style={styles.transactionMeta}>
                <Ionicons name="heart" size={12} color={colors.text.tertiary} />
                <Text style={styles.transactionEmotion}>
                  {getEmotionName(expense.emotionId)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.transactionRight}>
            <Text
              style={[
                styles.transactionAmount,
                { color: isExpense ? colors.error : colors.success },
              ]}
            >
              {isExpense ? "-" : "+"}R$ {expense.amount.toFixed(2)}
            </Text>
            <Text style={styles.transactionTime}>
              {format(expense.date, "HH:mm")}
            </Text>
          </View>
        </View>
        {expense.note && (
          <Text style={styles.transactionNote} numberOfLines={2}>
            {expense.note}
          </Text>
        )}
        {hasAttachments && (
          <View style={styles.attachmentsPreview}>
            <Ionicons name="images" size={14} color={colors.primary[500]} />
            <Text style={styles.attachmentsCount}>
              {expense.attachments!.length}{" "}
              {expense.attachments!.length === 1 ? "foto" : "fotos"}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {expense.attachments!.slice(0, 3).map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setExpandedImage(uri)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri }} style={styles.attachmentThumbnail} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Renderizar grupo de data
  const renderDateGroup = (dateKey: string, transactions: Expense[]) => {
    const date = new Date(dateKey);
    const isToday = format(new Date(), "yyyy-MM-dd") === dateKey;
    const isYesterday =
      format(new Date(Date.now() - 86400000), "yyyy-MM-dd") === dateKey;

    let dateLabel = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
    if (isToday) dateLabel = "Hoje";
    if (isYesterday) dateLabel = "Ontem";

    const dayTotal = transactions.reduce((sum, t) => {
      if (t.type === "expense") return sum - t.amount;
      return sum + t.amount;
    }, 0);

    return (
      <View key={dateKey} style={styles.dateGroup}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <Text
            style={[
              styles.dateTotal,
              { color: dayTotal >= 0 ? colors.success : colors.error },
            ]}
          >
            {dayTotal >= 0 ? "+" : ""}R$ {Math.abs(dayTotal).toFixed(2)}
          </Text>
        </View>
        {transactions.map(renderTransaction)}
      </View>
    );
  };

  // Renderizar aba de lista
  const renderListTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {Object.keys(groupedByDate).length > 0 ? (
        Object.entries(groupedByDate).map(([dateKey, transactions]) =>
          renderDateGroup(dateKey, transactions)
        )
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color={colors.gray[300]} />
          <Text style={styles.emptyText}>
            {filter === "all"
              ? "Nenhuma transação registrada"
              : filter === "expense"
              ? "Nenhum gasto registrado"
              : "Nenhuma economia registrada"}
          </Text>
        </View>
      )}
    </ScrollView>
  );

  // Renderizar aba de relatórios
  const renderReportsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Resumo Geral */}
      {filter === "all" && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="wallet" size={24} color={colors.primary[500]} />
            <Text style={styles.summaryTitle}>Resumo Geral</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Gastos</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                R$ {totalExpenses.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Economias</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                R$ {totalSavings.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Balanço:</Text>
            <Text
              style={[
                styles.balanceValue,
                { color: balance >= 0 ? colors.success : colors.error },
              ]}
            >
              {balance >= 0 ? "+" : ""}R$ {balance.toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* Gráficos de Gastos */}
      {(filter === "all" || filter === "expense") && allExpenses.length > 0 && (
        <>
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Ionicons name="heart" size={20} color={colors.error} />
              <Text style={styles.chartTitle}>Gastos por Emoção</Text>
            </View>
            {expensesByEmotion.length > 0 ? (
              <PieChart
                data={expensesByEmotion}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons
                  name="bar-chart-outline"
                  size={48}
                  color={colors.gray[300]}
                />
                <Text style={styles.emptyText}>Nenhum dado disponível</Text>
              </View>
            )}
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Ionicons name="pricetags" size={20} color={colors.error} />
              <Text style={styles.chartTitle}>Gastos por Categoria</Text>
            </View>
            {expensesByCategory.length > 0 ? (
              <PieChart
                data={expensesByCategory}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons
                  name="pie-chart-outline"
                  size={48}
                  color={colors.gray[300]}
                />
                <Text style={styles.emptyText}>Nenhum dado disponível</Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Gráficos de Economias */}
      {(filter === "all" || filter === "saving") && allSavings.length > 0 && (
        <>
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Ionicons name="heart" size={20} color={colors.success} />
              <Text style={styles.chartTitle}>Economias por Emoção</Text>
            </View>
            {savingsByEmotion.length > 0 ? (
              <PieChart
                data={savingsByEmotion}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons
                  name="bar-chart-outline"
                  size={48}
                  color={colors.gray[300]}
                />
                <Text style={styles.emptyText}>Nenhum dado disponível</Text>
              </View>
            )}
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Ionicons name="pricetags" size={20} color={colors.success} />
              <Text style={styles.chartTitle}>Economias por Categoria</Text>
            </View>
            {savingsByCategory.length > 0 ? (
              <PieChart
                data={savingsByCategory}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons
                  name="pie-chart-outline"
                  size={48}
                  color={colors.gray[300]}
                />
                <Text style={styles.emptyText}>Nenhum dado disponível</Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Estado vazio quando não há dados */}
      {filteredExpenses.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name="stats-chart-outline"
            size={64}
            color={colors.gray[300]}
          />
          <Text style={styles.emptyText}>
            Nenhum dado para exibir relatórios
          </Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
      edges={["bottom"]}
    >
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "list" && styles.tabActive]}
          onPress={() => setActiveTab("list")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="list"
            size={20}
            color={
              activeTab === "list" ? colors.primary[500] : colors.text.secondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "list" && styles.tabTextActive,
            ]}
          >
            Lista
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "reports" && styles.tabActive]}
          onPress={() => setActiveTab("reports")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="stats-chart"
            size={20}
            color={
              activeTab === "reports"
                ? colors.primary[500]
                : colors.text.secondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "reports" && styles.tabTextActive,
            ]}
          >
            Relatórios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {activeTab === "list" && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color={colors.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por categoria, emoção, valor..."
              placeholderTextColor={colors.gray[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.text.tertiary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="grid"
            size={18}
            color={
              filter === "all" ? colors.primary[500] : colors.text.secondary
            }
          />
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "expense" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("expense")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trending-down"
            size={18}
            color={filter === "expense" ? colors.error : colors.text.secondary}
          />
          <Text
            style={[
              styles.filterText,
              filter === "expense" && styles.filterTextActive,
            ]}
          >
            Gastos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "saving" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("saving")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trending-up"
            size={18}
            color={filter === "saving" ? colors.success : colors.text.secondary}
          />
          <Text
            style={[
              styles.filterText,
              filter === "saving" && styles.filterTextActive,
            ]}
          >
            Economias
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.advancedFilterButton,
            hasActiveFilters && styles.advancedFilterButtonActive,
          ]}
          onPress={() => setShowFilters(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options"
            size={18}
            color={
              hasActiveFilters ? colors.primary[500] : colors.text.secondary
            }
          />
          {hasActiveFilters && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      {/* Conteúdo da aba ativa */}
      {activeTab === "list" ? renderListTab() : renderReportsTab()}

      {/* Modal de Filtros Avançados */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros Avançados</Text>
              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Filtro de Data */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Período</Text>

                <View style={styles.dateFilterRow}>
                  <View style={styles.dateFilterItem}>
                    <Text style={styles.dateFilterLabel}>Data Inicial</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowStartDatePicker(true)}
                    >
                      <Text style={styles.datePickerText}>
                        {startDate
                          ? format(startDate, "dd/MM/yyyy")
                          : "Selecionar"}
                      </Text>
                      <Ionicons
                        name="calendar"
                        size={16}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>
                    {startDate && (
                      <TouchableOpacity
                        onPress={() => setStartDate(null)}
                        style={styles.clearDateButton}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={colors.error}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.dateFilterItem}>
                    <Text style={styles.dateFilterLabel}>Data Final</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowEndDatePicker(true)}
                    >
                      <Text style={styles.datePickerText}>
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar"}
                      </Text>
                      <Ionicons
                        name="calendar"
                        size={16}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>
                    {endDate && (
                      <TouchableOpacity
                        onPress={() => setEndDate(null)}
                        style={styles.clearDateButton}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={colors.error}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowStartDatePicker(false);
                      if (date) setStartDate(date);
                    }}
                    maximumDate={endDate || new Date()}
                  />
                )}

                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowEndDatePicker(false);
                      if (date) setEndDate(date);
                    }}
                    minimumDate={startDate || undefined}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* Filtro de Categorias */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Categorias</Text>
                <View style={styles.filterChipsContainer}>
                  {categories.map((category) => {
                    if (!category.id) return null;
                    return (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.filterChip,
                          selectedCategories.includes(category.id) &&
                            styles.filterChipActive,
                          {
                            borderColor: selectedCategories.includes(
                              category.id
                            )
                              ? category.color
                              : colors.border,
                          },
                        ]}
                        onPress={() => toggleCategory(category.id!)}
                      >
                        <View
                          style={[
                            styles.chipColorDot,
                            { backgroundColor: category.color },
                          ]}
                        />
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedCategories.includes(category.id) &&
                              styles.filterChipTextActive,
                          ]}
                        >
                          {category.name}
                        </Text>
                        {selectedCategories.includes(category.id) && (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={category.color}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Filtro de Emoções */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Emoções</Text>
                <View style={styles.filterChipsContainer}>
                  {emotions.map((emotion) => {
                    if (!emotion.id) return null;
                    return (
                      <TouchableOpacity
                        key={emotion.id}
                        style={[
                          styles.filterChip,
                          selectedEmotions.includes(emotion.id) &&
                            styles.filterChipActive,
                          {
                            borderColor: selectedEmotions.includes(emotion.id)
                              ? emotionColors[emotion.name] ||
                                colors.primary[500]
                              : colors.border,
                          },
                        ]}
                        onPress={() => toggleEmotion(emotion.id!)}
                      >
                        <Text style={styles.emotionIcon}>{emotion.icon}</Text>
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedEmotions.includes(emotion.id) &&
                              styles.filterChipTextActive,
                          ]}
                        >
                          {emotion.name}
                        </Text>
                        {selectedEmotions.includes(emotion.id) && (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={
                              emotionColors[emotion.name] || colors.primary[500]
                            }
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearFilters}
                disabled={!hasActiveFilters}
              >
                <Ionicons
                  name="refresh"
                  size={18}
                  color={hasActiveFilters ? colors.error : colors.gray[400]}
                />
                <Text
                  style={[
                    styles.clearFiltersText,
                    !hasActiveFilters && styles.clearFiltersTextDisabled,
                  ]}
                >
                  Limpar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyFiltersText}>Aplicar Filtros</Text>
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={colors.text.inverse}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Action Menu Modal */}
      <Modal
        visible={showActionMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.actionMenu}>
            <View style={styles.actionMenuHeader}>
              <Text style={styles.actionMenuTitle}>Ações</Text>
              <TouchableOpacity onPress={() => setShowActionMenu(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={24} color={colors.error} />
              <Text style={[styles.actionMenuText, { color: colors.error }]}>
                Excluir Transação
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionMenu(false);
                if (selectedExpense?.id) {
                  navigation.navigate("EditExpense", {
                    expenseId: selectedExpense.id,
                  });
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="create-outline"
                size={24}
                color={colors.primary[500]}
              />
              <Text style={styles.actionMenuText}>Editar Transação</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Imagem Expandida */}
      <Modal
        visible={expandedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setExpandedImage(null)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageModalClose}
            onPress={() => setExpandedImage(null)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {expandedImage && (
            <Image
              source={{ uri: expandedImage }}
              style={styles.expandedImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      paddingVertical: spacing.md,
      borderBottomWidth: 3,
      borderBottomColor: "transparent",
    },
    tabActive: {
      borderBottomColor: colors.primary[500],
    },
    tabText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.secondary,
    },
    tabTextActive: {
      color: colors.primary[500],
      fontWeight: fontWeight.bold,
    },
    filterContainer: {
      flexDirection: "row",
      padding: spacing.md,
      gap: spacing.sm,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonActive: {
      backgroundColor: `${colors.primary[500]}15`,
      borderColor: colors.primary[500],
    },
    filterText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    filterTextActive: {
      color: colors.primary[600],
      fontWeight: fontWeight.bold,
    },
    advancedFilterButton: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius.md,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      position: "relative",
    },
    advancedFilterButtonActive: {
      backgroundColor: `${colors.primary[500]}15`,
      borderColor: colors.primary[500],
    },
    filterBadge: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary[500],
    },
    tabContent: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    dateGroup: {
      marginBottom: spacing.lg,
    },
    dateHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
    },
    dateLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textTransform: "capitalize",
    },
    dateTotal: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    transactionCard: {
      backgroundColor: colors.background,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    transactionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    transactionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      flex: 1,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
    },
    transactionInfo: {
      flex: 1,
    },
    transactionCategory: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    transactionMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    transactionEmotion: {
      fontSize: fontSize.xs,
      color: colors.text.tertiary,
    },
    transactionRight: {
      alignItems: "flex-end",
    },
    transactionAmount: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.xs,
    },
    transactionTime: {
      fontSize: fontSize.xs,
      color: colors.text.tertiary,
    },
    transactionNote: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.md,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      lineHeight: 18,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xxl * 2,
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      fontSize: fontSize.md,
      color: colors.text.tertiary,
      textAlign: "center",
      marginTop: spacing.md,
      fontStyle: "italic",
    },
    summaryCard: {
      backgroundColor: colors.background,
      margin: spacing.md,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      ...shadows.md,
    },
    summaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    summaryTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    summaryItem: {
      flex: 1,
      alignItems: "center",
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
    },
    summaryLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    summaryValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
    },
    balanceRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    balanceLabel: {
      fontSize: fontSize.md,
      color: colors.text.secondary,
      fontWeight: fontWeight.semibold,
    },
    balanceValue: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
    },
    chartContainer: {
      backgroundColor: colors.background,
      margin: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    chartHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    chartTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    emptyChart: {
      alignItems: "center",
      paddingVertical: spacing.xxl,
    },
    // Estilos do Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      maxHeight: "90%",
      ...shadows.lg,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    closeButton: {
      padding: spacing.xs,
    },
    modalScroll: {
      maxHeight: 500,
    },
    filterSection: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterSectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    dateFilterRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    dateFilterItem: {
      flex: 1,
    },
    dateFilterLabel: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
      fontWeight: fontWeight.medium,
    },
    datePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
    },
    datePickerText: {
      fontSize: fontSize.sm,
      color: colors.text.primary,
    },
    clearDateButton: {
      position: "absolute",
      top: 22,
      right: 35,
    },
    filterChipsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    filterChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.full,
      borderWidth: 2,
      backgroundColor: colors.background,
    },
    filterChipActive: {
      backgroundColor: colors.backgroundSecondary,
    },
    filterChipText: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      fontWeight: fontWeight.medium,
    },
    filterChipTextActive: {
      color: colors.text.primary,
      fontWeight: fontWeight.semibold,
    },
    chipColorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    emotionIcon: {
      fontSize: fontSize.md,
    },
    modalFooter: {
      flexDirection: "row",
      gap: spacing.md,
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    clearFiltersButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
    },
    clearFiltersText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.error,
    },
    clearFiltersTextDisabled: {
      color: colors.gray[400],
    },
    applyFiltersButton: {
      flex: 2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primary[500],
      ...shadows.md,
    },
    applyFiltersText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text.inverse,
    },
    searchContainer: {
      padding: spacing.md,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    searchInput: {
      flex: 1,
      padding: spacing.sm,
      fontSize: fontSize.md,
      color: colors.text.primary,
    },
    attachmentsPreview: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    attachmentsCount: {
      fontSize: fontSize.sm,
      color: colors.text.secondary,
      marginRight: spacing.sm,
    },
    attachmentThumbnail: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.sm,
      marginRight: spacing.xs,
    },
    actionMenu: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      margin: spacing.xl,
      marginTop: "auto",
      ...shadows.lg,
    },
    actionMenuHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionMenuTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
    },
    actionMenuItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginVertical: spacing.xs,
    },
    actionMenuText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text.primary,
    },
    imageModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      justifyContent: "center",
      alignItems: "center",
    },
    imageModalClose: {
      position: "absolute",
      top: 50,
      right: 20,
      zIndex: 10,
      padding: spacing.sm,
    },
    expandedImage: {
      width: "90%",
      height: "80%",
    },
  });
