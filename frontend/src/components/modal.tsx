import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";

type BaseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ open, onOpenChange, title, children, footer }: BaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogContent className="w-[53rem] max-w-[95vw] max-h-[95vh] h-auto min-h-[30rem] rounded-lg px-8 sm:px-12 py-6 gap-6 flex flex-col justify-between bg-white shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl sm:text-2xl font-bold">{title}</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto scrollbar-custom -mx-4 px-4">{children}</div>

            {footer && (
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">{footer}</div>
            )}
          </DialogContent>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
