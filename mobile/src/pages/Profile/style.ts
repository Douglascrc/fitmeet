import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: "#00BC7D",
    flexDirection: "row",
    paddingHorizontal: 16,
    height: "auto",
    alignItems: "center",
  },
  headerSafeArea: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    alignItems: "center",
    textAlign: "center",
    fontSize: 32,
    fontFamily: "BebasNeue-Regular",
    fontWeight: "400",
    textTransform: "uppercase",
    left: 40,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    backgroundColor: "#00BC7D",
    paddingBottom: 20,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  name: {
    fontSize: 28,
    fontFamily: "BebasNeue-Regular",
    fontWeight: "400",

    marginTop: 10,
    textTransform: "uppercase",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  carouselContainer: {
    marginVertical: 16,
  },
  card: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "black",
  },
  levelLabel: {
    fontSize: 16,
    color: "#333",
  },
  levelNumber: {
    fontSize: 48,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#333",
  },
  pointsLabel: {
    fontSize: 14,
    color: "#666",
  },
  levelCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 16,
  },
  trophyContainer: {
    justifyContent: "flex-end",
    height: "auto",
    width: "auto",
  },
  trophyImage: {
    width: 150,
    height: 90,
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginRight: 10,
  },
  progress: {
    height: "100%",
    backgroundColor: "#00AA63",
    borderRadius: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  achievementsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  achievementIcon: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  achievementsLabel: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 12,
    color: "#333",
  },
  achievementsHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  achievementHeaderIcon: {
    width: 32,
    height: 32,
  },
  achievementsGrid: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  achievementItem: {
    width: "45%",
    alignItems: "center",
    marginHorizontal: "2.5%",
    marginVertical: 8,
  },
  achievementName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  noAchievements: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  activitiesSection: {
    flex: 1,
    marginVertical: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
  },
  viewMore: {
    fontSize: 18,
    color: "#00AA63",
  },
  noActivities: {
    textAlign: "center",
    color: "#666",
    marginTop: 16,
    marginBottom: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "#E0E0E0",
  },
  paginationDotActive: {
    backgroundColor: "#00AA63",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activityStatus: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
});
