import {StyleSheet} from "react-native";

// Reusing and adapting styles from Register/Profile styles
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    fontFamily: "BebasNeue-Regular", // Or your preferred font
    textAlign: "center",
  },
  content: {
    padding: 24,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F3F4F6", // Placeholder background
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00BC7D",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    fontFamily: "DMSans", // Or your preferred font
  },
  required: {
    color: "#EF4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
    fontFamily: "DMSans", // Or your preferred font
  },
  preferencesSection: {
    marginBottom: 32,
  },
  preferencesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    fontFamily: "BebasNeue-Regular", // Or your preferred font
  },
  preferenceItem: {
    alignItems: "center",
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent", // Default no border
  },
  selectedPreference: {
    borderColor: "#00BC7D", // Highlight selected
    backgroundColor: "#E8F8F1",
  },
  preferenceImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  preferenceText: {
    fontSize: 12,
    color: "#4B5563",
    fontFamily: "DMSans", // Or your preferred font
  },
  saveButton: {
    backgroundColor: "#00BC7D",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans", // Or your preferred font
  },
  deactivateButton: {
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  deactivateButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans", // Or your preferred font
  },
});
