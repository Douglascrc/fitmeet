import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "@/assets/logoFitmeet.png";

type headerProps = {
  avatar: string;
  name?: string;
};

export default function Header({ avatar, name }: headerProps) {
  return (
    <>
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
          <Avatar className="border-1 border-white outline-2 outline-primary">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name || "Username"}</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </>
  );
}
