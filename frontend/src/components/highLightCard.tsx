import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type HighlightCardProps = {
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  onClick: () => void;
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
  showInput?: boolean;
  backgroundColor?: string;
  align?: "left" | "center";
  inputValue?: string;
};

export const HighlightCard: React.FC<HighlightCardProps> = ({
  title,
  description,
  buttonText,
  imageSrc,
  onClick,
  inputPlaceholder = "Digite aqui",
  onInputChange,
  showInput = false,
  backgroundColor = "bg-white",
  align = "center",
  inputValue = "",
}) => {
  return (
    <Card className={`w-full max-w-md ${backgroundColor}`}>
      <CardContent className={`p-6 flex flex-col items-${align} text-${align}`}>
        <img src={imageSrc} alt="Icone" className="w-16 h-16 mb-4 self-center" />

        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {showInput && (
          <div className="w-full mb-4">
            <Label htmlFor="codeInput">Código</Label>
            <Input
              id="codeInput"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        <Button onClick={onClick} className="w-full">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
