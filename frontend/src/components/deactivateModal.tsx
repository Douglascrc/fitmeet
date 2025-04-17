import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { user_api } from "@/services/api-service";

interface ConfirmDeactivateModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ConfirmDeactivateModal({ open, onClose }: ConfirmDeactivateModalProps) {
  const navigate = useNavigate();

  const handleDeactivate = async () => {
    try {
      await user_api.delete("/deactivate");
      localStorage.removeItem("@Auth.Token");
      toast.success("Conta desativada com sucesso.");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao desativar conta:", error);
      toast.error("Não foi possível desativar sua conta. Tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[572px] h-[296px] top-[337px] left-[434px] rounded-[8px] p-[48px] gap-[32px] flex flex-col justify-between"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-0%, -10%)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl  font-heading font-bold">
            TEM CERTEZA QUE DESEJA DESATIVAR SUA CONTA?
          </DialogTitle>
          <p className="text-muted-foreground text-base">
            Ao desativar sua conta, todos os seus dados e histórico de atividades serão
            permanentemente removidas.{" "}
            <span className="font-semibold text-black">
              Esta ação é irreversível e não poderá ser desfeita.
            </span>
          </p>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDeactivate}>
            Desativar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
