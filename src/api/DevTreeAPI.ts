import { isAxiosError } from "axios";
import API from "../config/axios";
import type { User, UserHandle } from "../types";

export async function getUser() {
  try {
    const { data: response } = await API<User>("/user");
    return response;
  } catch (error) {
    let errorMessage = "Ocurrió un error al iniciar sesión";
    if (isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
}

export async function updateProfile(formData: User) {
  try {
    const { data: response } = await API.patch<string>("/user", formData);
    return response;
  } catch (error) {
    let errorMessage = "Ocurrió un error al iniciar sesión";
    if (isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
}

type responseImageUpload = {
  message: string;
  image: string;
};
export async function updateImageProfile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log(file);
    const { data: response } = await API.post<responseImageUpload>(
      "/user/image",
      formData
    )!;
    return response;
  } catch (error) {
    let errorMessage = "Ocurrió un error al iniciar sesión";
    if (isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
}

export async function getUserByHandle(handle: string) {
  try {
    const { data: response } = await API<UserHandle>(`/${handle}`)!;
    return response;
  } catch (error) {
    let errorMessage = "Ocurrió un error al iniciar sesión";
    if (isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
}

export async function searchByHandle(handle: string) {
    try {
        const { data } = await API.post<string>('/search', {handle})
        return data
    } catch (error) {
        if (isAxiosError (error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}