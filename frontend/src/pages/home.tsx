import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Calendar from "@/assets/calendar.svg";
import Group from "@/assets/group.svg";
import Yoga from "@/assets/yoga.png";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import Logo from "@/assets/logoFitmeet.png";
import activityImage from "@/assets/activity.jpeg";
import corridaImg from "@/assets/corrida.jpg";
import muscImg from "@/assets/musculacao.jpg";
import cicleImg from "@/assets/ciclismo.jpg";

const recommendations = new Array(8).fill(null);
const activityTypes = ["Yoga", "Corrida", "Ciclismo", "Musculação"];
const groupedActivities = {
  Corrida: recommendations,
  Ciclismo: recommendations,
  Yoga: recommendations,
  Musculação: recommendations,
};

const categoryImages: Record<string, string> = {
  Corrida: corridaImg,
  Ciclismo: cicleImg,
  Yoga: Yoga,
  Musculação: muscImg,
};

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Fitmeet Logo" className="w-8 h-8" />
          <h1 className="text-lg font-bold text-primary">FITMEET</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="text-base cursor-pointer bg-primary hover:bg-primary-foreground"
          >
            <Plus size={16} />
            Criar atividade
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>DC</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <section className="mb-8 w-full">
        <h2 className="text-xl text-start font-bold">Recomendado para você</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6">
          {recommendations.map((_, index) => (
            <Card key={index} className="overflow-hidden w-full border border-gray-600 shadow-sm">
              <img
                src={activityImage}
                alt="Recomendação"
                className="w-full object-cover rounded-lg"
              />
              <CardContent>
                <p className="w-full text-lg text-wrap md:whitespace-nowrap font-medium">
                  Exercício com corda de pular
                </p>
                <div className="flex text-xs text-gray-500 gap-2 mt-1">
                  <span className="flex gap-1">
                    <img src={Calendar} alt="data da atividade" className="w-5 h-5" />
                    <p>10/01/2026 8:00</p>
                  </span>
                  <span className="flex gap-1">
                    <img src={Group} alt="data da atividade" className="w-5 h-5" />
                    <p>10/01/2026 8:00</p>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      <section className="my-8">
        <h2 className="text-xl font-bold text-start mb-4">Tipos de atividade</h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4">
            {activityTypes.map((type, index) => (
              <div key={index} className="flex flex-col items-center">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={Yoga} />
                  <AvatarFallback>{type[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs mt-1">{type}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>

      <Separator />

      {Object.entries(groupedActivities).map(([categoria, atividades], index) => (
        <section key={index} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{categoria}</h2>
            <Link to="#" className="text-sm text-primary hover:underline">
              Ver mais
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {atividades.map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <img
                    src={categoryImages[categoria]}
                    alt="Atividade"
                    className="w-full h-28 object-contain"
                  />
                </CardHeader>
                <CardContent className="p-3">
                  <CardTitle className="text-sm font-medium mb-1">
                    {categoria === "Corrida"
                      ? "Correr 2Km"
                      : categoria === "Ciclismo"
                      ? "Pedalar 5Km"
                      : categoria === "Yoga"
                      ? "Yoga Flow"
                      : "Treino de Musculação"}
                  </CardTitle>
                  <div className="flex text-xs text-gray-500 gap-2 mt-1">
                    <span className="flex gap-1">
                      <img src={Calendar} alt="data da atividade" className="w-5 h-5" />
                      <p>10/01/2026 8:00</p>
                    </span>
                    <span className="flex gap-1">
                      <img src={Group} alt="data da atividade" className="w-5 h-5" />
                      <p>10/01/2026 8:00</p>
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
