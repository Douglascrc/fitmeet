import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AchievementCardProps = {
  title: string;
  iconSrc: string;
  description?: string;
};

export default function AchievementCard({ title, iconSrc, description }: AchievementCardProps) {
  return (
    <Card className="bg-gray-100 shadow-md p-4 w-full max-w-sm rounded-2xl">
      <CardHeader className="flex flex-col items-center p-2">
        <img src={iconSrc} alt="Ícone de conquista" className="w-16 h-16 drop-shadow-md" />
        <CardTitle className="text-lg font-semibold mt-2 text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-sm text-gray-700">
          {description || "Continue se esforçando para desbloquear mais conquistas!"}
        </p>
      </CardContent>
    </Card>
  );
}
