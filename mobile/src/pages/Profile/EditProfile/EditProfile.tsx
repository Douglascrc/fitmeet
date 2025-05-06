import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {CaretLeft, Camera, PencilSimple} from "phosphor-react-native";
import Toast from "react-native-toast-message";
import {useTypedNavigation} from "../../../hooks/useTypedNavigation";
import useAppContext from "../../../hooks/useContext";
import {user_api, activities_api} from "../../../services/api";
import {styles} from "./style";
import {ActivityType} from "../../../types/Activity";
import {launchImageLibrary} from "react-native-image-picker";

type UserProfile = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  avatar?: string;
  preferences?: string[];
};

export function EditProfile() {
  const navigation = useTypedNavigation();
  const {token, user: contextUser, logout} = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [password, setPassword] = useState("");
  const [allActivityTypes, setAllActivityTypes] = useState<ActivityType[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (token && contextUser) {
          setProfile({
            id: contextUser.id,
            name: contextUser.name,
            cpf: contextUser.cpf || "",
            email: contextUser.email,
            avatar: contextUser.avatar,
          });

          const prefsResponse = await user_api.get("/preferences");
          setSelectedPreferences(prefsResponse.data.map((p: any) => p.id));

          const typesResponse = await activities_api.get("/types");
          setAllActivityTypes(typesResponse.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados para edição:", error);
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar os dados.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, contextUser]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({...prev, [field]: value}));
  };

  const handleSelectPreference = (id: string) => {
    setSelectedPreferences(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id],
    );
  };

  const handleChooseAvatar = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 1,
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (!result.assets || !result.assets[0]) {
        throw new Error("Nenhuma imagem selecionada");
      }

      const selectedImage = result.assets[0];

      // Criar um FormData com a imagem
      const formData = new FormData();
      formData.append("avatar", {
        name: selectedImage.fileName || "avatar.jpg",
        type: selectedImage.type,
        uri:
          Platform.OS === "ios"
            ? selectedImage.uri?.replace("file://", "")
            : selectedImage.uri,
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await user_api.put("/user/avatar", formData, config);

      setProfile(prev => ({
        ...prev,
        avatar: response.data.avatar,
      }));

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Foto de perfil atualizada!",
      });
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível atualizar a foto de perfil.",
      });
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
        ...(password ? {password} : {}),
      };

      await user_api.put("/update", updateData);

      if (selectedPreferences.length > 0) {
        await user_api.post("/preferences/define", {
          preferences: selectedPreferences,
        });
      }

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Perfil atualizado com sucesso!",
        visibilityTime: 2000,
      });

      // Aguardar o Toast ser exibido antes de voltar
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2:
          error.response?.data?.message ||
          "Não foi possível salvar as alterações.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      "Desativar Conta",
      "Tem certeza que deseja desativar sua conta? Esta ação não pode ser desfeita.",
      [
        {text: "Cancelar", style: "cancel"},
        {
          text: "Desativar",
          style: "destructive",
          onPress: async () => {
            try {
              await user_api.delete("/deactivate");

              Toast.show({
                type: "success",
                text1: "Conta desativada",
                text2: "Sua conta foi desativada com sucesso.",
                visibilityTime: 2000,
                onHide: () => {
                  logout();
                  navigation.navigate({
                    name: "Login",
                    params: {name: "Login", isError: false},
                  });
                },
              });
            } catch (error) {
              console.error("Erro ao desativar conta:", error);
              Toast.show({
                type: "error",
                text1: "Erro",
                text2: "Não foi possível desativar sua conta. Tente novamente.",
              });
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BC7D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft size={32} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ATUALIZAR PERFIL</Text>
        <View style={{width: 32}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleChooseAvatar}>
            <Image
              source={{
                uri: profile.avatar?.replace(
                  "http://localhost",
                  "http://10.0.2.2",
                ),
              }}
              style={styles.avatar}
            />
            <View style={styles.cameraIconContainer}>
              <Camera size={24} color="#FFFFFF" weight="fill" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome Completo<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Joao Pessoa"
              value={profile.name || ""}
              onChangeText={value => handleInputChange("name", value)}
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              CPF<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 111.111.111-12"
              value={profile.cpf || ""}
              onChangeText={value => handleInputChange("cpf", value)}
              keyboardType="numeric"
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              E-mail<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: nome@email.com"
              value={profile.email || ""}
              onChangeText={value => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Deixe em branco para não alterar"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isSaving}
            />
          </View>
        </View>

        <View style={styles.preferencesSection}>
          <View style={styles.preferencesHeader}>
            <Text style={styles.preferencesTitle}>PREFERÊNCIAS</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {allActivityTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.preferenceItem,
                  selectedPreferences.includes(type.id) &&
                    styles.selectedPreference,
                ]}
                onPress={() => handleSelectPreference(type.id)}>
                <Image
                  source={{
                    uri:
                      type.image?.replace(
                        "http://localhost",
                        "http://10.0.2.2",
                      ) || "https://via.placeholder.com/50",
                  }}
                  style={styles.preferenceImage}
                />
                <Text style={styles.preferenceText}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveChanges}
          disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deactivateButton}
          onPress={handleDeactivateAccount}
          disabled={isSaving}>
          <Text style={styles.deactivateButtonText}>Desativar Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EditProfile;
