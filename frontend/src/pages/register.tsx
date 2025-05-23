/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Logo from "@/assets/logoFitmeet.png";
import backgroundFit from "@/assets/backgroundFit.png";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { IMaskInput } from "react-imask";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { auth_api } from "@/services/api-service";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome de usuário deve ter no mínimo 5 caracteres.",
  }),
  email: z.string().min(1, "E-mail é obrigatório.").email("Formato de e-mail inválido."),
  password: z
    .string({
      required_error: "A senha é obrigatória",
    })
    .min(6, {
      message: "A senha deve ter no mínimo 6 caracteres.",
    }),
  cpf: z
    .string({
      required_error: "CPF/CNPJ é obrigatório.",
    })
    .regex(/^\d+$/, "CPF deve conter apenas números.")
    .refine((cpf) => cpf.length === 11, "CPF deve conter exatamente 11 dígitos."),
});

const CustomInput = forwardRef<HTMLInputElement, any>((props, ref) => (
  <IMaskInput {...props} inputRef={ref} />
));

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cpf: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const resp = await auth_api.post("/register", values);
      console.log(resp.data);
      toast.success("Conta criada com sucesso!");
    } catch (error: any) {
      toast.error(error);
    }
  }

  return (
    <div className="flex h-screen overflow-auto">
      <div className="w-1/2">
        <img
          src={backgroundFit}
          alt="Pessoas se exercitando"
          className="object-cover w-full h-full rounded-md"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-start text-start px-20">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-6 gap-2">
            <img src={Logo} alt="Logo Fitmeet" className="h-10 w-10" />
            <h2 className="font-bold font-heading text-2xl bg-gradient-to-b from-primary to-primary-foreground bg-clip-text text-transparent">
              FITMEET
            </h2>
          </div>

          <h2 className="text-2xl font-bold font-heading mb-2">CRIE SUA CONTA</h2>
          <p className="text-sm text-gray-600 mb-6">
            Cadastre-se para encontrar parceiros de treino e começar a se exercitar ao ar livre.
            Vamos juntos! 💪
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>
                      Nome Completo<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field: { value, onChange, ref } }) => (
                  <FormItem className="relative">
                    <FormLabel>
                      CPF<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <CustomInput
                        mask="000.000.000-00"
                        unmask={true}
                        placeholder="Ex.: 123.456.789-01"
                        value={value}
                        onAccept={onChange}
                        inputRef={ref}
                        className="w-full rounded-md border px-3 py-1 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>
                      E-mail<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: joao@email.com" {...field}></Input>
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
                      className="absolute top-1/2 right-0 flex items-center pr-3 cursor-pointer"
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
                disabled={form.formState.isSubmitting}
                className="w-full bg-primary text-white py-2 rounded-md font-semibold cursor-pointer hover:bg-primary-foreground disabled:opacity-70"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  "Cadastrar"
                )}
              </Button>

              <p className="text-sm text-center">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-black font-semibold hover:underline">
                  Faça login
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
