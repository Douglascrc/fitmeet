import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, Navigate } from "react-router";
import Logo from "@/assets/logoFitmeet.png";
import backgroundFit from "@/assets/backgroundFit.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/UseAuth";

const loginSchema = z.object({
  email: z.string({ required_error: "E-mail é obrigatório." }).email("Formato de e-mail inválido."),
  password: z
    .string({ required_error: "Senha é obrigatória." })
    .min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await login(values.email, values.password);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error);
      }
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {isAuthenticated && <Navigate to="/" />}
      <div className="w-1/2">
        <img
          src={backgroundFit}
          alt="Pessoas se exercitando"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-start px-20">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <img src={Logo} alt="Logo Fitmeet" className="h-10 w-10" />
            <h1 className="text-2xl font-bold bg-gradient-to-b from-primary to-primary-foreground bg-clip-text text-transparent">
              FITMEET
            </h1>
          </div>

          <h2 className="text-2xl font-bold mb-2">BEM-VINDO DE VOLTA!</h2>
          <p className="text-sm text-gray-600 mb-6">
            Encontre parceiros para treinar ao ar livre. <br />
            Conecte-se e comece agora! 💪
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      E-mail<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: joao@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>
                      Senha<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Ex.: joao123"
                        {...field}
                        className="pr-10"
                      />
                    </FormControl>
                    <span
                      className="absolute top-1/2 right-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-foreground text-white font-semibold py-2 rounded-md"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>

              <p className="text-sm text-center">
                Ainda não tem uma conta?{" "}
                <Link to="/register" className="font-semibold hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
