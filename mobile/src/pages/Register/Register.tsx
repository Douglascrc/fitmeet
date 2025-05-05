import React, {useState} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import {styles} from "./style";
import {useTypedNavigation} from "../../hooks/useTypedNavigation";
import {CaretLeft} from "phosphor-react-native";
import axios from "axios";
import {auth_api} from "../../services/api";

export function Register() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useTypedNavigation();

  const handleRegister = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Nome é obrigatório",
      });
      return;
    }
    if (!cpf.trim()) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "CPF é obrigatório",
      });
      return;
    }
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "E-mail é obrigatório",
      });
      return;
    }
    if (!password.trim()) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Senha é obrigatória",
      });
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        cpf: cpf.trim().replace(/[^\d]/g, ""),
        password: password,
      };
      console.log("User data:", userData);
      await auth_api.post(`/register`, userData);

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Cadastro realizado com sucesso!",
      });

      navigation.navigate({
        name: "Login",
        params: {
          name: "Login",
          isError: false,
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);

      const errorMessage =
        error.response?.data?.message || "Não foi possível realizar o cadastro";

      Toast.show({
        type: "error",
        text1: "Erro",
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <CaretLeft size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>CRIE SUA CONTA</Text>
          <Text style={styles.subtitle}>
            Por favor preencha os dados para prosseguir!
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome Completo<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João Pessoa"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              CPF<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 111.111.111-12"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              E-mail<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: nome@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Senha<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: nome123"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já possui uma conta?</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate({
                  name: "Login",
                  params: {name: "Login", isError: false},
                })
              }
              disabled={isLoading}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
