import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#00BC7D',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 52,
    height: 33,
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginRight: 8,
    gap: 6,
  },
  star: {
    width: 16,
    height: 16,
  },
  level: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 0,
    lineHeight: 16,
    textAlignVertical: 'center',
    color: '#FFFFFF',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeMore: {
    color: '#000000',
    fontSize: 12,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  activityImage: {
    width: '100%',
    height: 160,
  },
  activityTitle: {
    padding: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  activityInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  activityDate: {
    fontSize: 12,
    color: '#666666',
  },
  participants: {
    fontSize: 12,
    color: '#666666',
  },
  separator: {
    fontSize: 12,
    color: '#666666',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00BC7D',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
