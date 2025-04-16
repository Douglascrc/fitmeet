import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { activities_api, user_api } from "@/services/api-service";
import { Link } from "react-router";
import UserModel from "@/models/user-model";
import Activity from "@/models/activity-model";
import MedalIcon from "@/assets/conquista.svg";
import trofeuImg from "@/assets/trofeu.png";
import AchievementCard from "@/components/achievementCard";
import Header from "@/components/header";

export default function Profile() {
  console.log("Profile component is rendering");
  const [user, setUser] = useState<UserModel>() || null;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [historicActivities, setHistoricActivities] = useState<Activity[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("@Auth.Token") || "";
        user_api.defaults.headers.common.Authorization = token;
        activities_api.defaults.headers.common.Authorization = token;

        const userResponse = await user_api.get("/");
        setUser(userResponse.data);

        const activitiesResponse = await activities_api.get("/user/participant", {
          params: {
            page: page,
            pageSize: pageSize,
          },
        });
        setActivities(activitiesResponse.data.activities || activitiesResponse.data);

        if (activitiesResponse.data.totalPages) {
          setTotalPages(activitiesResponse.data.totalPages);
        }

        const historicResponse = await activities_api.get("/user/participant/all");
        const completedActivities = historicResponse.data.filter(
          (act: Activity) => act.completedAt && new Date(act.completedAt) < new Date()
        );
        setHistoricActivities(completedActivities);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen w-full px-4">
      <Header avatar={user?.avatar || "https://github.com/shadcn.png"} name={user?.name} />
      <section className="relative mb-8">
        <div className="flex flex-col items-center">
          <Avatar className="w-32 h-32">
            <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
            <AvatarFallback>{user?.name || "A"}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-heading font-bold mt-4">{user?.name || "Carregando..."}</h2>
        </div>
        <Link
          to="/editar"
          state={{ fromProfile: true }}
          className="absolute top-0 right-0 mt-4 mr-4"
        >
          <Button
            variant="outline"
            className="text-base text-gray-400 cursor-pointer border border-gray-600"
          >
            <Pencil size={16} className="mr-2" />
            Editar Perfil
          </Button>
        </Link>
      </section>

      <section className="flex flex-col sm:flex-row justify-center gap-4 mb-8 w-full items-start">
        {/* Card de nível */}
        <Card className="relative bg-gray-100 w-full sm:max-w-md px-4 py-2 rounded-2xl shadow-md overflow-hidden flex flex-col top-10">
          <div className="flex justify-between items-center mb-1">
            <div>
              <CardTitle className="text-sm font-bold text-green-900">Seu nível é</CardTitle>
              <p className="text-xl font-extrabold text-green-800 mt-0">{user?.level || "0"}</p>
            </div>

            <img
              src={trofeuImg}
              alt="Troféu"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-lg"
            />
          </div>

          <div className="mt-0">
            <p className="text-xs text-green-900 mb-0">Pontos para o próximo nível</p>
            <p className="text-xs font-medium text-green-800">{user?.xp || 0}/50 pts</p>

            <div className="w-full h-1.5 bg-white rounded-full shadow-inner mt-0.5 mb-1">
              <div
                className="h-full bg-green-600 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((user?.xp ?? 0) / 50) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Card de conquistas */}
        <Card className="bg-transparent w-full sm:max-w-md px-4 overflow-y-auto border-0">
          <CardContent className="h-full p-0 pt-4">
            <div className="space-y-3">
              {user?.achievements && user.achievements.length > 0 ? (
                user.achievements.map((achievement, index) => (
                  <AchievementCard
                    key={index}
                    title={achievement.name}
                    iconSrc={MedalIcon}
                    description={achievement.name}
                  />
                ))
              ) : (
                <p className="text-center text-sm text-gray-500">
                  Complete atividades para ganhar conquistas!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Minhas atividades</h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : activities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardHeader>
                    <CardTitle className="text-base m-0 p-0">{activity.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">
                      {activity.description} -{" "}
                      {new Date(activity.scheduledDate).toLocaleDateString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center items-center mt-6 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <span>
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Você não está inscrito em nenhuma atividade.</p>
        )}
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-bold mb-4">Histórico de atividades</h3>
        {historicActivities.length > 0 ? (
          <div className="space-y-3">
            {historicActivities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="py-4">
                  <p className="text-gray-300 text-sm">
                    {activity.title} - {activity.type} -{" "}
                    {new Date(activity.completedAt).toLocaleDateString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhuma atividade concluída ainda.</p>
        )}
      </section>
    </div>
  );
}
