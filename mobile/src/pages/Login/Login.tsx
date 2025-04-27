import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
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
import Logo from '../../assets/images/fitmeet.png';
import {Eye, EyeSlash} from 'phosphor-react-native';
import {styles} from './style';
import {useTypedNavigation} from '../../hooks/useTypedNavigation';

const login = async (email: any, password: any) => {
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

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useTypedNavigation();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigateToRegister = () => {
    navigation.navigate({
      name: 'Register',
      params: {name: 'User', isError: false},
    });
  };

  const navigateToHome = () => {
    navigation.navigate({name: 'Home', params: {name: 'User', isError: false}});
  };

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
      await login(email, password);
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
export default App;
