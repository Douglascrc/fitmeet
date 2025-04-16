import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Calendar from "@/assets/calendar.svg";
import Group from "@/assets/group.svg";
import { Separator } from "@/components/ui/separator";
import { Link, useSearchParams } from "react-router";
import activityImage from "@/assets/activity.jpeg";
import { useEffect, useState, useCallback } from "react";
import { activities_api, user_api } from "@/services/api-service";
import Activity from "@/models/activity-model";
import ActivityType from "@/models/activityType-model";
import UserModel from "@/models/user-model";
import privateIcon from "@/assets/private.svg";
import Header from "@/components/header";

export default function Home() {
  const [user, setUser] = useState<UserModel | null>(null);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [participantCount, setParticipantCount] = useState<Record<string, number>>({});

  const [recommendedActivities, setRecommendedActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  const [searchParams] = useSearchParams();
  const filterTypeId = searchParams.get("typeId");
  const orderBy = searchParams.get("orderBy");
  const order = searchParams.get("order");

  const groupedActivities = recommendedActivities.reduce(
    (acc: Record<string, Activity[]>, activity) => {
      const type = activity.type || "Outros";
      if (!acc[type]) acc[type] = [];
      acc[type].push(activity);
      return acc;
    },
    {}
  );

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("@Auth.Token") || "";
      user_api.defaults.headers.common.Authorization = token;
      activities_api.defaults.headers.common.Authorization = token;

      const userResponse = await user_api.get("/");
      setUser(userResponse.data);

      // Busca todas as atividades para "Recomendado para você"
      const recommendedResponse = await activities_api.get("/all");
      setRecommendedActivities(recommendedResponse.data);

      // Se houver filtro, busca também as atividades filtradas
      if (filterTypeId || orderBy || order) {
        const params = new URLSearchParams();
        if (filterTypeId) params.append("typeId", filterTypeId);
        params.append("orderBy", orderBy ? orderBy : "createdAt");
        params.append("order", order ? order : "desc");
        const filteredEndpoint = `/all?${params.toString()}`;
        const filteredResponse = await activities_api.get(filteredEndpoint);
        setFilteredActivities(filteredResponse.data);
      } else {
        setFilteredActivities([]);
      }

      const typesResponse = await activities_api.get("/types");
      setActivityTypes(typesResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }, [filterTypeId, orderBy, order]);

  const fetchParticipants = async (activity: Activity) => {
    try {
      const response = await activities_api.get(`/${activity.id}/participants`);
      setParticipantCount((prev) => ({
        ...prev,
        [activity.id]: response.data.length,
      }));
    } catch (error) {
      console.error("Erro ao buscar participantes da atividade:", error);
      setParticipantCount((prev) => ({
        ...prev,
        [activity.id]: 0,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (recommendedActivities.length > 0) {
      recommendedActivities.forEach((activity) => {
        fetchParticipants(activity);
      });
    }
  }, [recommendedActivities]);

  useEffect(() => {
    if (filteredActivities.length > 0) {
      filteredActivities.forEach((activity) => {
        fetchParticipants(activity);
      });
    }
  }, [filteredActivities]);

  return (
    <div className="min-h-screen w-full">
      <Header avatar={user?.avatar || "https://github.com/shadcn.png"} name={user?.name} />

      <section className="mb-8 w-full">
        <h2 className="text-base mb-4 text-start font-bold">Recomendado para você</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6">
          {recommendedActivities.length > 0 ? (
            recommendedActivities.slice(0, 8).map((activity, index) => (
              <Card key={activity.id ?? index} className="overflow-hidden w-full shadow-sm">
                <div className="relative">
                  <img
                    src={activity.image}
                    alt="Recomendação"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {activity.private && (
                    <img
                      src={privateIcon}
                      alt="Atividade Privada"
                      className="absolute top-1 left-1 w-6 h-6"
                    />
                  )}
                </div>
                <CardContent>
                  <CardTitle className="text-sm font-medium mb-1">{activity.title}</CardTitle>
                  <div className="flex text-xs text-gray-500 gap-2 mt-1">
                    <span className="flex gap-1 items-end">
                      <img src={Calendar} alt="Data da atividade" className="w-5 h-5" />
                      {`${new Date(activity.scheduledDate).toLocaleDateString("pt-BR")} ${new Date(
                        activity.scheduledDate
                      ).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}`}
                    </span>
                    <span>|</span>
                    <span className="flex gap-1 items-end">
                      <img src={Group} alt="Participantes" className="w-5 h-5" />
                      <p>{participantCount[activity.id] || 0}</p>
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>Nenhuma Atividade encontrada</p>
          )}
        </div>
      </section>

      <Separator />

      {filterTypeId && (
        <section className="mb-8 mt-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden w-[17.5rem] shadow-sm">
                  <CardHeader className="flex">
                    <div className="relative">
                      <img
                        src={activity.image || activityImage}
                        alt="Atividade"
                        className="w-[5.5rem] h-[5.5rem] object-cover rounded-lg"
                      />
                      {activity.private && (
                        <img
                          src={privateIcon}
                          alt="Atividade Privada"
                          className="absolute top-1 left-1 w-4 h-4"
                        />
                      )}
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <CardTitle className="text-base font-medium text-center mt-4">
                        {activity.title || "Atividade sem título"}
                      </CardTitle>
                      <div className="flex text-xs text-gray-500 text-nowrap gap-2">
                        <span className="gap-1 inline-flex mr-2">
                          <img src={Calendar} alt="Data da atividade" className="w-4 h-4" />
                          {`${new Date(activity.scheduledDate).toLocaleDateString(
                            "pt-BR"
                          )} ${new Date(activity.scheduledDate).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}`}
                        </span>
                        <span className="mx-2">|</span>
                        <span className="inline-flex gap-1">
                          <img src={Group} alt="Participantes" className="w-4 h-4" />
                          <p>{participantCount[activity.id] || 0}</p>
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p>Nenhuma atividade encontrada para esse tipo.</p>
            )}
          </div>
        </section>
      )}

      {/* Seção de Tipos de atividade */}
      <section className="my-8">
        <h2 className="text-xl font-bold text-start mb-4">
          {filterTypeId ? "Outros tipos de atividades" : "Tipos de atividade"}
        </h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4">
            {activityTypes.length > 0 ? (
              activityTypes.map((type) => (
                <Link
                  key={type.id}
                  to={`?typeId=${encodeURIComponent(type.id)}`}
                  className="flex flex-col items-center"
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={type.image} />
                    <AvatarFallback>{type.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs mt-1">{type.name}</span>
                </Link>
              ))
            ) : (
              <p>Carregando...</p>
            )}
          </div>
        </ScrollArea>
      </section>

      <Separator />

      {!filterTypeId &&
        Object.entries(groupedActivities).map(([categoria, atividades], index) => (
          <section key={index} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{categoria}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {atividades.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <CardHeader>
                    <img
                      src={activity.image}
                      alt="Atividade"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-3">
                    <CardTitle className="text-sm font-medium mb-1">
                      {activity.title || "Atividade sem título"}
                    </CardTitle>
                    <div className="flex text-xs text-gray-500 gap-2">
                      <span className="flex gap-1 items-end">
                        <img src={Calendar} alt="Data da atividade" className="w-5 h-5" />
                        <p>{new Date(activity.scheduledDate).toLocaleString("pt-BR")}</p>
                      </span>
                      <span className="flex gap-1 items-end">
                        <img src={Group} alt="Participantes" className="w-5 h-5" />
                        <p>{participantCount[activity.id] || 0}</p>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
