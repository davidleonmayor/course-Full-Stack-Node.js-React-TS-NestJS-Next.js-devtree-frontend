import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/DevTreeAPI";
import DevTree from "../components/DevTree";

const Loading = (
  <div className="flex items-center justify-center h-screen text-xl font-bold">
    Loading...
  </div>
);

export default function AppLayout() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  console.log({
    data,
    isLoading,
    isError,
  });

  if (isLoading) return Loading;
  if (isError) return <Navigate to="/auth/login" />;
  if (data) return <DevTree data={data} />;
}
