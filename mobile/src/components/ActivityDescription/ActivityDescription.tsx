import React, {useState, useEffect, use} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {
  CaretLeft,
  Users,
  MapPin,
  Calendar,
  Clock,
  Lock,
  PencilSimple,
} from "phosphor-react-native";
import MapView, {Marker} from "react-native-maps";
import {styles} from "./style";
import {activities_api} from "../../services/api";
import useAppContext from "../../hooks/useContext";
import {useTypedNavigation} from "../../hooks/useTypedNavigation";
import {
  ActivityProps,
  Participant,
  ParticipantStatus,
} from "../../types/ActivityProps";
import Toast from "react-native-toast-message";

interface ActivityDescriptionProps {
  activity: ActivityProps;
  onClose: () => void;
  onEdit?: () => void;
}

const ActivityDescription = ({
  activity,
  onClose,
  onEdit,
}: ActivityDescriptionProps) => {
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const {token, user} = useAppContext();
  const userId = user?.id || null;
  const navigation = useTypedNavigation();

  const isOrganizer = activity.creator.id === userId;

  const today = new Date();
  const activityDate = new Date(activity.scheduledDate);
  const isPastActivity = today > activityDate;
  const isActivityDay =
    today.getDate() === activityDate.getDate() &&
    today.getMonth() === activityDate.getMonth() &&
    today.getFullYear() === activityDate.getFullYear();

  const [userStatus, setUserStatus] = useState<ParticipantStatus>(
    ParticipantStatus.NOT_SUBSCRIBED,
  );

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await activities_api.get(`/${activity.id}/participants`);
      setParticipants(response.data || []);
    } catch (error) {
      console.error("Error fetching participants:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar os participantes",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await activities_api.post(`/activities/${activity.id}/subscribe`);
      setUserStatus(ParticipantStatus.PENDING);
      fetchParticipants();
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Solicitação de participação enviada",
      });
    } catch (error) {
      console.error("Error subscribing to activity:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível solicitar participação",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      await activities_api.delete(`/${activity.id}/unsubscribe`);
      setUserStatus(ParticipantStatus.NOT_SUBSCRIBED);
      fetchParticipants();
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Você saiu desta atividade",
      });
    } catch (error) {
      console.error("Error unsubscribing from activity:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível sair da atividade",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveParticipant = async (
    participantId: string,
    approved: boolean,
  ) => {
    try {
      setLoading(true);
      await activities_api.post(`/${activity.id}/approve`, {
        participantId,
        approved,
      });
      setUserStatus(ParticipantStatus.APPROVED);
      fetchParticipants();
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: approved ? "Participante aprovado" : "Participante rejeitado",
      });
    } catch (error) {
      console.error("Error approving/rejecting participant:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível processar a solicitação",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPresence = async () => {
    try {
      setLoading(true);
      await activities_api.post(`/${activity.id}/check-in`, {
        confirmationCode: activity.confirmationCode,
      });
      Toast.show({
        type: "success",
        text1: "Presença Confirmada",
        text2: "Sua presença foi registrada com sucesso",
      });
    } catch (error) {
      console.error("Error confirming presence:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível confirmar presença",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeActivity = async () => {
    try {
      setLoading(true);
      await activities_api.post(`/${activity.id}/conclude`);
      setUserStatus(ParticipantStatus.ACTIVITY_ENDED);
      Toast.show({
        type: "success",
        text1: "Atividade Finalizada",
        text2: "A atividade foi finalizada com sucesso",
      });
    } catch (error) {
      console.error("Error finalizing activity:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível finalizar a atividade",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderParticipantItem = (participant: Participant) => {
    return (
      <View key={participant.id} style={styles.participantItem}>
        <Image
          source={{
            uri:
              participant.avatar?.replace(
                "http://localhost",
                "http://10.0.2.2",
              ) || "https://via.placeholder.com/40",
          }}
          style={styles.participantAvatar}
        />
        <Text style={styles.participantName}>{participant.name}</Text>

        {/* Organizer sees approve/reject buttons for pending participants */}
        {isOrganizer && !isPastActivity && participant.status === "PENDING" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleApproveParticipant(participant.id, true)}>
              <Text style={styles.approveButtonText}>Aprovar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleApproveParticipant(participant.id, false)}>
              <Text style={styles.rejectButtonText}>Rejeitar</Text>
            </TouchableOpacity>
          </View>
        )}

        {participant.status !== "PENDING" && (
          <View
            style={[
              styles.statusIndicator,
              participant.status === "APPROVED"
                ? styles.statusApproved
                : styles.statusRejected,
            ]}
          />
        )}
      </View>
    );
  };

  const renderActionButton = () => {
    if (activity.isFinalized) {
      return (
        <View style={styles.infoTag}>
          <Text style={styles.infoTagText}>Atividade Finalizada</Text>
        </View>
      );
    }

    if (isOrganizer) {
      if (isPastActivity) {
        return (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleFinalizeActivity}>
            <Text style={styles.primaryButtonText}>Finalizar Atividade</Text>
          </TouchableOpacity>
        );
      } else if (isActivityDay) {
        return (
          <View style={styles.confirmationCodeContainer}>
            <Text style={styles.confirmationCodeLabel}>
              Código de Confirmação:
            </Text>
            <Text style={styles.confirmationCode}>
              {activity.confirmationCode || "123456"}
            </Text>
          </View>
        );
      }

      return onEdit ? (
        <TouchableOpacity style={styles.primaryButton} onPress={onEdit}>
          <Text style={styles.primaryButtonText}>Editar Atividade</Text>
        </TouchableOpacity>
      ) : null;
    }

    if (isActivityDay && userStatus === "APPROVED") {
      return (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConfirmPresence}>
          <Text style={styles.primaryButtonText}>Confirmar Presença</Text>
        </TouchableOpacity>
      );
    } else if (!isPastActivity) {
      if (userStatus === "DENIED") {
        return (
          <TouchableOpacity style={styles.disabledButton} disabled={true}>
            <Text style={styles.disabledButtonText}>Participação Negada</Text>
          </TouchableOpacity>
        );
      } else if (userStatus === "PENDING") {
        return (
          <View>
            <Text style={styles.pendingText}>
              Solicitação pendente de aprovação
            </Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleUnsubscribe}>
              <Text style={styles.secondaryButtonText}>
                Cancelar Solicitação
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else if (userStatus === "APPROVED") {
        return (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleUnsubscribe}>
            <Text style={styles.secondaryButtonText}>Sair da Atividade</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubscribe}>
            <Text style={styles.primaryButtonText}>Participar</Text>
          </TouchableOpacity>
        );
      }
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.header}>
        <SafeAreaView style={styles.headerSafeArea}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <CaretLeft size={28} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>ATIVIDADE</Text>

          {isOrganizer && !activity.isFinalized && onEdit && (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <PencilSimple size={24} color="#FFF" />
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                activity.image?.replace(
                  "http://localhost",
                  "http://10.0.2.2",
                ) || "https://via.placeholder.com/400x200",
            }}
            style={styles.activityImage}
            resizeMode="cover"
          />
          {activity.private && (
            <View style={styles.privateIconContainer}>
              <Lock size={20} color="#FFF" weight="fill" />
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{activity.title}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Calendar size={16} color="#666" />
              <Text style={styles.infoText}>
                {new Date(activity.scheduledDate).toLocaleDateString("pt-BR")}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Clock size={16} color="#666" />
              <Text style={styles.infoText}>
                {new Date(activity.scheduledDate).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Users size={16} color="#666" />
              <Text style={styles.infoText}>
                {activity.participantCount} participantes
              </Text>
            </View>
          </View>

          <View style={styles.organizerContainer}>
            <Text style={styles.organizerLabel}>Organizado por:</Text>
            <View style={styles.organizerInfo}>
              <Image
                source={{
                  uri:
                    activity.creator.avatar?.replace(
                      "http://localhost",
                      "http://10.0.2.2",
                    ) || "https://via.placeholder.com/40",
                }}
                style={styles.organizerAvatar}
              />
              <Text style={styles.organizerName}>{activity.creator.name}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>DESCRIÇÃO DA ATIVIDADE</Text>
          <Text style={styles.description}>{activity.description}</Text>

          <Text style={styles.sectionTitle}>PONTO DE ENCONTRO</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: activity.location.latitude,
                longitude: activity.location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}>
              <Marker
                coordinate={{
                  latitude: activity.location.latitude,
                  longitude: activity.location.longitude,
                }}
                title={activity.title}
              />
            </MapView>
            <View style={styles.addressContainer}>
              <MapPin size={16} color="#666" />
              <Text style={styles.addressText}>
                {activity.location.latitude}, {activity.location.longitude}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>PARTICIPANTES</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#00BC7D" />
          ) : (
            <View style={styles.participantsContainer}>
              {participants.length > 0 ? (
                participants.map(renderParticipantItem)
              ) : (
                <Text style={styles.noParticipantsText}>
                  Nenhum participante inscrito
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>{renderActionButton()}</View>
    </View>
  );
};

export default ActivityDescription;
