import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
//@ts-ignore
import Logo from '../../assets/fitmeet.png';
import {Eye, EyeSlash} from 'phosphor-react-native';

const loginApi = async (email: any, password: any) => {
  console.log('Tentando login com:', email, password);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'teste@email.com' && password === 'senha123') {
        console.log('Login API: Sucesso');
        resolve({token: 'fake-token', user: {name: 'Usuário Teste'}});
      } else {
        console.log('Login API: Falha');
        reject(new Error('E-mail ou senha inválidos.'));
      }
    }, 1500);
  });
};

const navigateToRegister = () => {
  Alert.alert('Navegação', 'Ir para a tela de Cadastro');
};

const navigateToHome = () => {
  Alert.alert('Navegação', 'Ir para a tela Home (Logado)');
};

function App(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Erro', 'E-mail é obrigatório.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Formato de e-mail inválido.');
      return;
    }
    if (!password) {
      Alert.alert('Erro', 'Senha é obrigatória.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await loginApi(email, password);
      // setIsAuthenticated(true);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigateToHome();
    } catch (error: any) {
      Alert.alert(
        'Erro no Login',
        error?.message || 'Não foi possível fazer login.',
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              {/* <Image source={Logo} style={styles.logo} /> */}
              <Image source={Logo} style={styles.logo} />
              <Text style={styles.appName}>FITMEET</Text>
            </View>

            <Text style={styles.title}>FAÇA LOGIN E COMECE A TREINAR</Text>
            <Text style={styles.subtitle}>
              Encontre parceiros para treinar ao ar livre. Conecte-se e comece
              agora! 💪
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  E-mail<Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: nome@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Senha<Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Ex.: nome123"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
                    <Text>
                      {showPassword ? (
                        <Eye size={20} />
                      ) : (
                        <EyeSlash size={20} />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  Ainda não tem uma conta?{' '}
                </Text>
                <TouchableOpacity
                  onPress={navigateToRegister}
                  disabled={isLoading}>
                  <Text style={styles.registerLink}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BC7D',
    fontFamily: 'BebasNeue-Regular',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    color: '#1F2937',
    fontFamily: 'BebasNeue-Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'left',
    lineHeight: 20,
    fontFamily: 'DM Sans',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#374151',
    fontFamily: 'DM Sans',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    fontFamily: 'DM Sans',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 0,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#00BC7D',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#009966',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'DM Sans',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'DM Sans',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
});

export default App;
