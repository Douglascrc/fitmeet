import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {CaretLeft, Camera} from "phosphor-react-native";
import {launchImageLibrary} from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {useRoute} from "@react-navigation/native";
import {useTypedNavigation} from "../../hooks/useTypedNavigation";
import {activities_api} from "../../services/api";
import useAppContext from "../../hooks/useContext";
import {styles} from "./style";
import {ActivityType} from "../../components/CategorySection";
import Toast from "react-native-toast-message";

interface RouteParams {
  mode: "create" | "edit";
  activityId?: string;
}

export function ActivityForm() {
  const route = useRoute();
  const {mode, activityId} = route.params as RouteParams;
  const isEditMode = mode === "edit";

  const navigation = useTypedNavigation();
  const {token} = useAppContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [image, setImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [location, setLocation] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

  useEffect(() => {
    fetchActivityTypes();

    if (isEditMode && activityId) {
      fetchActivityDetails(activityId);
    }
  }, [isEditMode, activityId]);

  const fetchActivityTypes = async () => {
    try {
      if (token) {
        activities_api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        const response = await activities_api.get("/types");
        setActivityTypes(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de atividades:", error);
    }
  };

  const fetchActivityDetails = async (id: string) => {
    try {
      if (token) {
        activities_api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        const response = await activities_api.put(`/${id}/update`);
        const activity = response.data;

        setTitle(activity.title);
        setDescription(activity.description);
        setDate(new Date(activity.scheduledDate));

        if (activity.image) {
          setImageUrl(
            activity.image.replace("http://localhost", "http://10.0.2.2"),
          );
        }

        if (activity.location) {
          const locationData =
            typeof activity.location === "string"
              ? JSON.parse(activity.location)
              : activity.location;

          setLocation({
            latitude: locationData.lat || locationData.latitude,
            longitude: locationData.lng || locationData.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }

        setIsPrivate(activity.private);

        if (activity.type) {
          const typeId =
            typeof activity.type === "string"
              ? activity.type
              : activity.type.id;
          setSelectedCategories([typeId]);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da atividade:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados da atividade.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Toast.show({
            type: "error",
            text1: "Erro",
            text2: response.errorMessage || "Erro ao selecionar imagem",
          });
          return;
        }
        if (response.assets && response.assets[0]) {
          const fileType = response.assets[0].type || "image/jpeg";
          const fileName = response.assets[0].fileName || "photo.jpg";

          setImage({
            uri: response.assets[0].uri,
            type: fileType,
            name: fileName,
          });
          setImageUrl(response.assets[0].uri ?? null);

          console.log("Imagem selecionada:", {
            uri: response.assets[0].uri,
            type: fileType,
            name: fileName,
          });
        }
      },
    );
  };

  const onChangeDateTime = (event: any, selectedDateTime?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    const currentDate = selectedDateTime || date;

    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (pickerMode === "date") {
      const updatedDate = new Date(date);
      updatedDate.setFullYear(currentDate.getFullYear());
      updatedDate.setMonth(currentDate.getMonth());
      updatedDate.setDate(currentDate.getDate());

      setDate(updatedDate);

      if (Platform.OS === "android") {
        setTimeout(() => {
          setPickerMode("time");
          setShowPicker(true);
        }, 100);
      } else {
        setPickerMode("time");
      }
    } else {
      const updatedDate = new Date(date);
      updatedDate.setHours(currentDate.getHours());
      updatedDate.setMinutes(currentDate.getMinutes());

      setDate(updatedDate);

      setShowPicker(Platform.OS === "ios");

      if (Platform.OS === "ios") {
        setPickerMode("date");
      }
    }
  };

  const showDateTimePicker = () => {
    setPickerMode("date");
    setShowPicker(true);
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([categoryId]);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "O título é obrigatório",
      });
      return false;
    }
    if (!description.trim()) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "A descrição é obrigatória",
      });
      return false;
    }
    if (date < new Date()) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "A data deve ser maior que a data atual",
      });
      return false;
    }
    if (selectedCategories.length === 0) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Selecione pelo menos uma categoria",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!image && !imageUrl) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "É necessário adicionar uma imagem para a atividade",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && activityId) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("scheduledDate", date.toISOString());
        formData.append(
          "location",
          JSON.stringify({
            lat: location.latitude,
            lng: location.longitude,
          }),
        );
        formData.append("private", isPrivate ? "true" : "false");
        formData.append("typeId", selectedCategories[0]);

        if (image) {
          formData.append("image", image);
        }

        await activities_api.put(`/${activityId}/update/`, formData, {
          headers: {"Content-Type": "multipart/form-data"},
        });

        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: "Atividade atualizada com sucesso!",
        });
      } else {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("typeId", selectedCategories[0]);
        formData.append(
          "address",
          JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        );
        formData.append("scheduledDate", date.toISOString());
        formData.append("private", isPrivate.toString());

        // Adicionar a imagem
        if (image) {
          formData.append("image", {
            uri: image.uri,
            type: image.type || "image/jpeg",
            name: image.name || "photo.jpg",
          });
        }

        console.log("Enviando campos separadamente como no curl");

        const response = await activities_api.post("/new", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        });

        console.log("Atividade criada:", response.data);

        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: "Atividade criada com sucesso!",
        });
      }

      navigation.navigate({
        name: "Home",
        params: {name: "Home", isError: false},
      });
    } catch (error) {
      console.error(
        isEditMode
          ? "Erro ao atualizar atividade:"
          : "Erro ao criar atividade:",
        error,
      );

      Toast.show({
        type: "error",
        text1: "Erro",
        text2: `Não foi possível ${
          isEditMode ? "atualizar" : "criar"
        } a atividade. Tente novamente.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelActivity = () => {
    if (!activityId) return;

    Alert.alert(
      "Cancelar atividade",
      "Tem certeza que deseja cancelar esta atividade? Esta ação não pode ser desfeita.",
      [
        {text: "Não", style: "cancel"},
        {
          text: "Sim",
          style: "destructive",
          onPress: async () => {
            try {
              await activities_api.delete(`/delete/${activityId}`);
              Alert.alert("Sucesso", "Atividade cancelada com sucesso!");
              navigation.navigate({
                name: "Home",
                params: {name: "Home", isError: false},
              });
            } catch (error) {
              console.error("Erro ao cancelar atividade:", error);
              Alert.alert("Erro", "Não foi possível cancelar a atividade.");
            }
          },
        },
      ],
    );
  };

  if (isFetching) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {justifyContent: "center", alignItems: "center"},
        ]}>
        <ActivityIndicator size="large" color="#00BC7D" />
        <Text style={{marginTop: 10}}>Carregando atividade...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <CaretLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? "EDITAR ATIVIDADE" : "CADASTRAR ATIVIDADE"}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.imageUploadContainer}
          onPress={handleSelectImage}>
          {imageUrl ? (
            <Image source={{uri: imageUrl}} style={styles.uploadedImage} />
          ) : (
            <View style={styles.imageUploadPlaceholder}>
              <Camera size={32} color="#666666" />
              <Text style={styles.imageUploadText}>Adicionar Imagem</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Corrida no parque"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Detalhes sobre a atividade..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Campo único para Data e Hora do Evento */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Data do Evento *</Text>
          <TouchableOpacity style={styles.input} onPress={showDateTimePicker}>
            <Text>
              {`${date.toLocaleDateString("pt-BR")} ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={pickerMode}
              display="default"
              onChange={onChangeDateTime}
              minimumDate={pickerMode === "date" ? new Date() : undefined}
              is24Hour={true}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ponto de Encontro *</Text>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={location}
              region={location}
              onRegionChangeComplete={setLocation}>
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                draggable
                onDragEnd={e => {
                  setLocation({
                    ...location,
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  });
                }}
              />
            </MapView>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Visibilidade</Text>
          <View style={styles.privacyContainer}>
            <TouchableOpacity
              style={[
                styles.privacyOption,
                !isPrivate && styles.selectedPrivacy,
              ]}
              onPress={() => setIsPrivate(false)}>
              <Text style={styles.privacyText}>Pública</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.privacyOption,
                isPrivate && styles.selectedPrivacy,
              ]}
              onPress={() => setIsPrivate(true)}>
              <Text style={styles.privacyText}>Privada</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>CATEGORIAS *</Text>
          <View style={styles.categoriesContainer}>
            {activityTypes.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategories.includes(category.id) &&
                    styles.selectedCategory,
                ]}
                onPress={() => toggleCategory(category.id)}>
                <Image
                  source={{
                    uri: category.image.replace(
                      "http://localhost",
                      "http://10.0.2.2",
                    ),
                  }}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}>
          <Text style={styles.submitButtonText}>
            {isLoading
              ? "Salvando..."
              : isEditMode
              ? "SALVAR"
              : "CRIAR ATIVIDADE"}
          </Text>
        </TouchableOpacity>

        {isEditMode && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelActivity}
            disabled={isLoading}>
            <Text style={styles.cancelButtonText}>Cancelar Atividade</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ActivityForm;
