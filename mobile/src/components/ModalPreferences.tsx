import React from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import {ActivityType} from "./CategorySection";

interface PreferencesModalProps {
  visible: boolean;
  activityTypes: ActivityType[];
  userPreferences: string[];
  onChangePreferences: (preferences: string[]) => void;
  onSavePreferences: (preferences: string[]) => void;
}

export function PreferencesModal({
  visible,
  activityTypes,
  userPreferences,
  onChangePreferences,
  onSavePreferences,
}: PreferencesModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>SELECIONE SEU TIPO FAVORITO</Text>
        <FlatList
          data={activityTypes}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.preferencesList}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.preferenceItem,
                userPreferences.includes(item.id) && styles.selectedPreference,
              ]}
              onPress={() => {
                if (userPreferences.includes(item.id)) {
                  onChangePreferences(
                    userPreferences.filter(id => id !== item.id),
                  );
                } else {
                  onChangePreferences([...userPreferences, item.id]);
                }
              }}>
              <Image
                source={{
                  uri: item.image?.replace(
                    "http://localhost",
                    "http://10.0.2.2",
                  ),
                }}
                style={styles.preferenceImage}
              />
              <Text style={styles.preferenceText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onSavePreferences(userPreferences)}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 24,
  },
  preferencesList: {
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  preferenceItem: {
    alignItems: "center",
    width: "40%",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  selectedPreference: {
    backgroundColor: "#E6F7F1",
    borderWidth: 2,
    borderColor: "#00BC7D",
  },
  preferenceImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  preferenceText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#00BC7D",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
