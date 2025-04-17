import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { user_api, activities_api } from "@/services/api-service";
import { toast } from "sonner";
import ActivityType from "@/models/activityType-model";
import { Camera, ChevronLeft, Eye, EyeOff, Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Header from "@/components/header";
import UserModel from "@/models/user-model";
import ConfirmDeactivateModal from "@/components/deactivateModal";

const profileFormSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().optional(),
  preferences: z.array(z.string()).min(1, "Selecione pelo menos uma preferência"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<UserModel | null>(null);
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [userCpf, setUserCpf] = useState<string>("");
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      preferences: [],
    },
  });

  // Redireciona se não vier da página de perfil
  useEffect(() => {
    if (!location.state || location.state.fromProfile !== true) {
      navigate("/perfil");
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("@Auth.Token") || "";
        user_api.defaults.headers.common.Authorization = token;
        activities_api.defaults.headers.common.Authorization = token;

        const typesResponse = await activities_api.get("/types");
        setActivityTypes(typesResponse.data);

        const userResponse = await user_api.get("/");
        const userData = userResponse.data;
        setUser(userData);
        setUserAvatar(userData.avatar || "");
        setUserCpf(userData.cpf || "");

        form.reset({
          name: userData.name || "",
          email: userData.email || "",
          password: "",
          preferences: userData.preferences || [],
        });

        const preferencesResponse = await user_api.get("/preferences");
        form.setValue("preferences", preferencesResponse.data || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Não foi possível carregar seus dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form]);

  // envia novo avatar
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarLoading(true);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await user_api.put("/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUserAvatar(response.data.avatar);
        toast.success("Foto de perfil atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar avatar:", error);
        toast.error("Não foi possível atualizar sua foto de perfil.");
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      const updateData = {
        name: data.name,
        email: data.email,
        ...(data.password && { password: data.password }),
      };

      await user_api.put("/update", updateData);

      await user_api.post("/preferences/define", {
        preferences: data.preferences,
      });

      toast.success("Perfil atualizado com sucesso!");
      navigate("/perfil");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Não foi possível atualizar seu perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full">
      <Header avatar={user?.avatar || "https://github.com/shadcn.png"} name={user?.name} />
      <div className="w-full max-w-[calc(100%-13.75rem)] mx-auto">
        <div className="w-[20rem] min-h-[60.75rem] flex flex-col gap-10 mx-auto">
          <Button
            variant="ghost"
            className="mb-2 text-xl cursor-pointer"
            onClick={() => navigate("/perfil")}
          >
            <ChevronLeft /> Voltar para o perfil
          </Button>

          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img
                src={userAvatar || "https://github.com/shadcn.png"}
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                {avatarLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                ) : (
                  <Camera size={48} className="p-2" />
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex flex-col gap-10">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome Completo<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-[20rem] h-[3.5rem] rounded-lg border px-5"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>
                      CPF<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={userCpf}
                      disabled
                      className="w-[20rem] h-[3.5rem] rounded-lg border border-gray-300 px-5 bg-muted cursor-not-allowed"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          E-mail<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-[20rem] h-[3.5rem] rounded-lg border px-5"
                            {...field}
                          />
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
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Ex: joao123"
                              {...field}
                              className="w-[20rem] h-[3.5rem] rounded-lg border px-5"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Preferências<span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="flex flex-nowrap gap-2 overflow-x-auto my-1 mx-1 scrollbar-custom">
                          {activityTypes.map((type) => (
                            <div key={type.id} className="flex flex-col py-4 px-1 items-center">
                              <button
                                type="button"
                                className={cn(
                                  "w-[5.625rem] h-[5.625rem] border rounded-full bg-transparent transition",
                                  field.value.includes(type.id)
                                    ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-white"
                                    : "border-muted"
                                )}
                                onClick={() => {
                                  const newValue = field.value.includes(type.id)
                                    ? field.value.filter((id) => id !== type.id)
                                    : [...field.value, type.id];
                                  field.onChange(newValue);
                                }}
                              >
                                <img
                                  src={type.image}
                                  alt={type.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              </button>
                              <span className="text-xs mt-2">{type.name}</span>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-1.5 pt-4">
                    <Button
                      className="text-white h-12 w-[9.813rem] rounded-sm px-3"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Salvando..." : "Editar"}
                    </Button>
                    <Button
                      className="h-12 w-[9.813rem] rounded-sm px-3"
                      variant="outline"
                      type="button"
                      onClick={() => navigate("/perfil")}
                    >
                      Cancelar
                    </Button>
                  </div>

                  <div className=" text-center">
                    <Button
                      variant="link"
                      className="text-[#E7000B] text-sm"
                      onClick={() => {
                        setOpenDeactivateModal(true);
                      }}
                      type="button"
                    >
                      <Trash className="mr-2" /> Desativar minha conta
                    </Button>
                    <div className="justify-center items-center">
                      <ConfirmDeactivateModal
                        open={openDeactivateModal}
                        onClose={() => setOpenDeactivateModal(false)}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
