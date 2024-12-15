import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import API from "../config/axios";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import type { LoginInputs } from "../types/index";
import ErrorMessage from "../components/ErrorMessage";

const URL = "auth/login";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInputs>();

  const navigate = useNavigate();

  const onSubmit = async (inputs: LoginInputs) => {
    try {
      const { data: response } = await API.post(URL, inputs);
      localStorage.setItem("AUTH_TOKEN", response.token);
      toast.success(response.message || "Login exitoso", {
        draggablePercent: 60,
        position: "top-right",
        autoClose: 5000,
      });
      reset();
      navigate("/admin/");
    } catch (error) {
      let errorMessage = "Ocurrió un error al iniciar sesión";
      if (isAxiosError(error) && error.response) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage, {
        draggablePercent: 60,
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
        noValidate
      >
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
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
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
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe tener al menos 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value="Iniciar Sesión"
        />
      </form>

      <nav className="mt-10">
        <Link
          to="/auth/register"
          className="text-slate-300 text-center text-lg block hover:text-blue-600"
        >
          No tienes cuenta, Regístrate
        </Link>
      </nav>
    </>
  );
}
