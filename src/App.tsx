import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AppNavigator } from "./presentation/navigation/AppNavigator";
import { DatabaseManager } from "./infrastructure/database/DatabaseManager";
import { DatabaseMigrations } from "./infrastructure/database/migrations";
import { Emotion } from "./domain/entities/Emotion";
import { Category } from "./domain/entities/Category";
import { EmotionRepository } from "./infrastructure/repositories/EmotionRepository";
import { CategoryRepository } from "./infrastructure/repositories/CategoryRepository";
import { ThemeProvider } from "./theme/ThemeContext";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Inicializar banco de dados
      await DatabaseManager.initialize();

      // Executar migrations
      await DatabaseMigrations.runMigrations();

      // Popular dados padrão
      const emotionRepo = new EmotionRepository();
      const categoryRepo = new CategoryRepository();

      const emotions = await emotionRepo.findAll();
      if (emotions.length === 0) {
        for (const emotion of Emotion.getDefaultEmotions()) {
          await emotionRepo.create(
            new Emotion(null, emotion.name, emotion.intensity, emotion.icon)
          );
        }
      }

      const categories = await categoryRepo.findAll();
      if (categories.length === 0) {
        for (const category of Category.getDefaultCategories()) {
          await categoryRepo.create(
            new Category(null, category.name, category.icon, category.color)
          );
        }
      }

      setIsReady(true);
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1FA672" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
