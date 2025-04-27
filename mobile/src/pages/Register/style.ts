import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    fontFamily: 'BebasNeue-Regular',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'DMSans',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    fontFamily: 'DMSans',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'DMSans',
  },
  button: {
    backgroundColor: '#00BC7D',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DMSans',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 4,
  },
  loginText: {
    color: '#4B5563',
    fontSize: 14,
    fontFamily: 'DMSans',
  },
  loginLink: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'DMSans',
  },
});
