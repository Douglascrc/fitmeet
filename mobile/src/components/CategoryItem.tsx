import React from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {styles} from "../pages/Home/style";
import {ActivityType} from "./CategorySection";

interface CategoryItemProps {
  category?: ActivityType;
  isLoading?: boolean;
  onPress?: (categoryId: string) => void;
  isSelected?: boolean;
}

export function CategoryItem({
  category,
  isLoading = false,
  onPress,
  isSelected = false,
}: CategoryItemProps) {
  if (isLoading) {
    return (
      <View style={styles.categoryItem}>
        <View style={[styles.categoryImage, {backgroundColor: "#E5E5E5"}]} />
        <Text style={styles.categoryText}>Carregando...</Text>
      </View>
    );
  }

  const formattedImageUrl = category?.image.replace(
    "http://localhost",
    "http://10.0.2.2",
  );

  const handlePress = () => {
    if (onPress && category) {
      onPress(category.id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={handlePress}
      activeOpacity={0.7}>
      <View
        style={[
          styles.categoryImageContainer,
          isSelected ? styles.selectedCategoryContainer : null,
        ]}>
        <Image
          source={{uri: formattedImageUrl}}
          style={styles.categoryImage}
          resizeMode="cover"
        />
      </View>
      <Text
        style={[
          styles.categoryText,
          isSelected ? styles.selectedCategoryText : null,
        ]}>
        {category?.name}
      </Text>
    </TouchableOpacity>
  );
}
