import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import API from "../config/axios";

import ErrorMessage from "../components/ErrorMessage";
import type { RegisterInputs } from "../types/index";

const URL = "/auth/register";

function Register() {
  const location = useLocation()
  const navigate = useNavigate()
  const obtions = {
    defaultValues: {
      name: "",
      email: "",
      handle:  location?.state?.handle || '',
      password: "",
      repeatPassword: "",
    },
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterInputs>(obtions);

  const onSubmit = async (inputs: RegisterInputs) => {
    try {
      const { data: response } = await API.post(URL, inputs);
      toast.success(response.message || "Login exitoso", {
        draggablePercent: 60,
        position: "top-right",
        autoClose: 5000,
      });
      reset();
      navigate('/auth/login')
    } catch (error) {
      let errorMessage = "Ocurrió un error en el registro";
      if (isAxiosError(error) && error.response) {
        console.error(error.response?.data);
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage, {
        draggablePercent: 60,
      });
    }
  };

  return (
    <>
      <h1 className="text-white text-4xl font-bold">Crear Cuenta</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="name" className="text-2xl text-slate-500">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu Nombre"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("name", { required: "Name field is required" })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-500">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("email", {
              required: "Email field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="handle" className="text-2xl text-slate-500">
            Handle
          </label>
          <input
            id="handle"
            type="text"
            placeholder="Nombre de usuario: sin espacios"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("handle", { required: "Handle field is required" })}
          />
          {errors.handle && (
            <ErrorMessage>{errors.handle.message}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("password", {
              required: "Password field is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="repeatPassword" className="text-2xl text-slate-500">
            Repetir Password
          </label>
          <input
            id="repeatPassword"
            type="password"
            placeholder="Repetir Password"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("repeatPassword", {
              required: "Repeat Password field is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.repeatPassword && (
            <ErrorMessage>{errors.repeatPassword.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value="Crear Cuenta"
        />
      </form>
      <nav className="mt-10">
        <Link
          to="/auth/login"
          className="text-slate-300 text-center text-lg block hover:text-blue-600"
        >
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
      </nav>
    </>
  );
}

export default Register;
