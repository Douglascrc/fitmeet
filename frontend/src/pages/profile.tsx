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
      <section className="relative mt-10">
        <div className="flex flex-col items-center">
          <Avatar className="w-48 h-48">
            <AvatarImage
              className="object-cover"
              src={user?.avatar || "https://github.com/shadcn.png"}
            />
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

      <section className="flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-8 mt-8 mb-8 w-full max-w-4xl mx-auto">
        <Card className="relative bg-gray-50 w-full md:w-1/2 p-6 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between">
          {" "}
          <div className="flex justify-between items-start mb-4">
            {" "}
            <div>
              <CardTitle className="text-sm font-semibold text-gray-600 mb-1">
                Seu nível é
              </CardTitle>{" "}
              <p className="text-4xl font-extrabold text-gray-800 leading-none">
                {user?.level || "0"}
              </p>{" "}
            </div>
            <img
              src={trofeuImg}
              alt="Troféu"
              className="w-20 h-auto object-contain drop-shadow-lg mt-1"
            />
          </div>
          <div className="mt-auto">
            {" "}
            <div className="flex justify-between items-end mb-1">
              {" "}
              <p className="text-xs text-gray-600">Pontos para o próximo nível</p>
              <p className="text-sm font-medium text-gray-800">{user?.xp || 0}/50 pts</p>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full shadow-inner">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${Math.min(((user?.xp ?? 0) / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>
        <Card className="bg-gray-50 w-full md:w-1/2 p-6 rounded-2xl shadow-lg overflow-hidden flex flex-col">
          {" "}
          <CardContent className="flex-grow flex items-center justify-center">
            {" "}
            {user?.achievements && user.achievements.length > 0 ? (
              <div className="flex flex-wrap justify-center items-start gap-x-6 gap-y-4">
                {" "}
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="flex flex-col items-center text-center w-20">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-1.5 shadow-inner">
                      <img
                        src={MedalIcon}
                        alt={achievement.name}
                        className="w-10 h-10 drop-shadow-md"
                      />
                    </div>

                    <p className="text-xs font-medium text-gray-700 leading-tight">
                      {achievement.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                Complete atividades para ganhar conquistas!
              </p>
            )}
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
      <label>
        Itens por página:
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
          {[4, 8, 12].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
