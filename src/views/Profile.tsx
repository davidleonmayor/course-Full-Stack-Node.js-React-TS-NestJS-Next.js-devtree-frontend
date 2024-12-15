import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ProfileForm, User } from "../types/index";
import ErrorMessage from "../components/ErrorMessage";
import { updateProfile, updateImageProfile } from "../api/DevTreeAPI";

export default function Profile() {
  // Querys
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<User>(["user"])!;
  // console.log(data);
  const { handle, description } = data;

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
      // re-make query to update user hanle in the pane view
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: updateImageProfile,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onSuccess: (response) => {
      console.info(response);
      // Optimistic Updates
      const test = (prevData: User) => ({
        ...prevData,
        image: response.image,
        message: response.message,
      });
      // re-make query to update user hanle in the pane view
      queryClient.invalidateQueries({ queryKey: ["user"], test });

      toast.success(response.message);
    },
  });

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      handle,
      description,
    },
  });

  // handlers
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // console.log(URL.createObjectURL(event.target.files[0]));
      uploadImageMutation.mutate(event.target.files[0]);
    }
  };

  const handleUserProfileForm = (formData: ProfileForm) => {
    console.log(formData);
    const user: User = queryClient.getQueryData(["user"])!;
    user.handle = formData.handle;
    updateProfileMutation.mutate(user);
  };

  return (
    <form
      className="bg-white p-10 rounded-lg space-y-5"
      onSubmit={handleSubmit(handleUserProfileForm)}
    >
      <legend className="text-2xl text-slate-800 text-center">
        Editar Información
      </legend>
      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Handle:</label>
        <input
          type="text"
          className="border-none bg-slate-100 rounded-lg p-2"
          placeholder="handle o Nombre de Usuario"
          {...register("handle", {
            required: "Handle user is needed",
            minLength: 8,
          })}
        />

        {errors.handle && <ErrorMessage children={errors.handle.message} />}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="description">Descripción:</label>
        <textarea
          className="border-none bg-slate-100 rounded-lg p-2"
          placeholder="Tu Descripción"
          {...register("description")}
        />

        {errors.description && (
          <ErrorMessage children={errors.description.message} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Imagen:</label>
        <input
          id="image"
          type="file"
          className="border-none bg-slate-100 rounded-lg p-2"
          accept="image/*"
          {...register("image", {
            onChange: handleImageChange,
          })}
        />
      </div>

      <input
        type="submit"
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        value="Guardar Cambios"
      />
    </form>
  );
}
