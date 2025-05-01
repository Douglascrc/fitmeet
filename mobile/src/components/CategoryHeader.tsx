import React from "react";
import {Text, TouchableOpacity, StyleSheet} from "react-native";
// @ts-ignore
import {CaretLeft} from "phosphor-react-native";
import {SafeAreaView} from "react-native-safe-area-context";

interface CategoryHeaderProps {
  title: string;
  onBackPress: () => void;
}

export function CategoryHeader({title, onBackPress}: CategoryHeaderProps) {
  return (
    <SafeAreaView style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <CaretLeft style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
