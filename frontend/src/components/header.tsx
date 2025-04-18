import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, ImageIcon, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "@/assets/logoFitmeet.png";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "./modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import ActivityType from "@/models/activityType-model";
import { activities_api } from "@/services/api-service";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";

type headerProps = {
  avatar: string;
  name?: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const containerStyle = {
  width: "100%",
  height: "15rem",
};

const formSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  scheduledDate: z.date({
    required_error: "Data é obrigatória.",
    invalid_type_error: "Formato de data inválido.",
  }),
  activityType: z.string(),
  image: z
    .instanceof(File, { message: "Imagem é obrigatória." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Tamanho máximo é 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Apenas .jpg, .jpeg, .png e .webp são aceitos."
    ),
  requiresApproval: z.boolean(),
  location: z
    .object({
      latitude: z.string().min(1, "Selecione um ponto no mapa."),
      longitude: z.string().min(1, "Selecione um ponto no mapa."),
    })
    .optional(),
});

const defaultCenter = {
  lat: -23.010758,
  lng: -43.306053,
};

export default function Header({ avatar, name }: headerProps) {
  const [open, setOpen] = useState(false);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter); // Estado para centro do mapa
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleModalOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
      setMarkerPosition(null);
      setImagePreview(null); // Reset preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview); // Clean up old preview
      }
    }
  };
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
      scheduledDate: undefined,
      location: {
        latitude: "",
        longitude: "",
      },
      requiresApproval: false,
      activityType: "",
    },
  });

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(currentLocation);
          console.log("Localização atual obtida:", currentLocation);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          toast.error("Não foi possível obter sua localização atual. Usando localização padrão.");
        }
      );
    } else {
      console.log("Geolocalização não é suportada por este navegador.");
      toast.info("Geolocalização não suportada. Usando localização padrão.");
    }
  }, []);

  useEffect(() => {
    async function fetchActivityTypes() {
      try {
        const response = await activities_api.get("/types");

        setActivityTypes(response.data.types || response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de atividade:", error);
        toast.error("Não foi possível carregar os tipos de atividade.");
      }
    }
    fetchActivityTypes();
  }, []);

  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarkerPosition({ lat, lng });
        form.setValue("location.latitude", lat.toString());
        form.setValue("location.longitude", lng.toString());
      }
    },
    [form]
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("scheduledDate", values.scheduledDate.toISOString());
    formData.append("typeId", values.activityType); // Chave já corrigida
    formData.append("private", String(values.requiresApproval)); // Chave já corrigida

    if (values.location?.latitude && values.location?.longitude) {
      const addressObject = {
        latitude: parseFloat(values.location.latitude),
        longitude: parseFloat(values.location.longitude),
      };

      formData.append("address", JSON.stringify(addressObject));
    }

    if (values.image) {
      formData.append("image", values.image);
    }

    console.log("Enviando FormData com address como JSON string:", {
      title: values.title,
      typeId: values.activityType,
      private: String(values.requiresApproval),
      address:
        values.location?.latitude && values.location?.longitude
          ? JSON.stringify({
              latitude: parseFloat(values.location.latitude),
              longitude: parseFloat(values.location.longitude),
            })
          : undefined,
      image_present: !!values.image,
    });

    try {
      await activities_api.post("/new", formData);

      toast.success("Atividade criada com sucesso!");
      setOpen(false);
      form.reset();
      setMarkerPosition(null);
      setImagePreview(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar atividade:", error);
      console.error("Detalhes do erro da API:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Erro ao criar atividade. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Fitmeet Logo" className="w-8 h-8" />
          <h1 className="text-lg font-bold text-primary">FITMEET</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="text-base cursor-pointer bg-primary hover:bg-primary-foreground"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Plus size={16} />
            Criar atividade
          </Button>
          <Modal
            open={open}
            onOpenChange={handleModalOpenChange}
            title="Nova Atividade"
            footer={
              <>
                <Button
                  type="submit"
                  form="create-activity-form"
                  disabled={isLoading || !isLoaded}
                  onClick={form.handleSubmit(onSubmit)}
                  className="bg-primary text-white py-3 px-8"
                >
                  Criar
                </Button>
              </>
            }
          >
            <Form {...form}>
              <form id="create-activity-form" className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="image"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>
                          Imagem <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            className="hidden"
                            id="image-upload"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                onChange(file);
                                if (imagePreview) {
                                  URL.revokeObjectURL(imagePreview);
                                }
                                setImagePreview(URL.createObjectURL(file));
                              } else {
                                // Caso o usuário cancele a seleção
                                onChange(undefined);
                                if (imagePreview) {
                                  URL.revokeObjectURL(imagePreview);
                                }
                                setImagePreview(null);
                              }
                            }}
                            {...rest}
                          />
                        </FormControl>

                        <Label
                          htmlFor="image-upload"
                          className={cn(
                            "border-2 border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer text-gray-500 hover:border-primary hover:text-primary transition-colors",
                            imagePreview && "border-solid border-gray-400"
                          )}
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-full w-auto object-cover rounded-md"
                            />
                          ) : (
                            <ImageIcon className="h-10 w-10" strokeWidth={1.5} />
                          )}
                        </Label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Título <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aula de Yoga" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Descrição <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Como será a atividade? Quais os requisitos? O que é necessário para participar?"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Data <span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal flex items-center",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                ) : (
                                  <span>Escolha uma data</span>
                                )}
                                {/* ml-auto deve funcionar corretamente com flex */}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />{" "}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date: Date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="activityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tipo da atividade <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex space-x-2 overflow-x-auto p-2">
                            {" "}
                            {activityTypes.map((type) => (
                              <div
                                key={type.id}
                                className="flex flex-col items-center w-[5.625rem] h-[7.625rem] gap-3 cursor-pointer flex-shrink-0"
                                onClick={() => field.onChange(type.id)}
                              >
                                <div
                                  className={cn(
                                    "w-[5.625rem] h-[5.625rem] rounded-full overflow-hidden relative flex items-center justify-center bg-gray-100",
                                    field.value === type.id
                                      ? "ring-2 ring-offset-2 ring-primary"
                                      : ""
                                  )}
                                >
                                  <img
                                    src={type.image}
                                    alt={type.name}
                                    className="w-[5.625rem] h-[5.625rem] object-cover"
                                  />
                                </div>
                                <span className="text-xs text-center font-medium">{type.name}</span>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          Ponto de encontro <span className="text-red-500">*</span>
                        </FormLabel>
                        {loadError && (
                          <div>Erro ao carregar o mapa. Verifique sua chave de API e conexão.</div>
                        )}
                        {!isLoaded && !loadError && <div>Carregando mapa...</div>}
                        {isLoaded && !loadError && (
                          <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={mapCenter}
                            zoom={15}
                            onClick={onMapClick}
                            options={{
                              streetViewControl: false,
                              mapTypeControl: false,
                              fullscreenControl: false,
                            }}
                          >
                            {markerPosition && <MarkerF position={markerPosition} />}
                          </GoogleMap>
                        )}
                        {markerPosition && (
                          <div className="text-xs text-gray-500 mt-1">
                            Lat: {markerPosition.lat.toFixed(6)}, Lng:{" "}
                            {markerPosition.lng.toFixed(6)}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiresApproval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Requer aprovação para participar? <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant={field.value ? "default" : "outline"}
                              className={cn(
                                "px-4 py-2 rounded-md cursor-pointer focus:ring-0 focus:outline-none",
                                field.value
                                  ? "bg-gray-800 text-white hover:bg-gray-700 border-none outline-none"
                                  : "border"
                              )}
                              onClick={() => field.onChange(true)}
                            >
                              Sim
                            </Button>

                            <Button
                              type="button"
                              variant={!field.value ? "default" : "outline"}
                              className={cn(
                                "px-4 py-2 rounded-md cursor-pointer focus:ring-0 focus:outline-none",
                                !field.value ? "bg-gray-800 text-white hover:bg-gray-700" : ""
                              )}
                              onClick={() => field.onChange(false)}
                            >
                              Não
                            </Button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </Modal>

          <Avatar className="border-1 border-white outline-2 outline-primary">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name || "Username"}</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </>
  );
}
