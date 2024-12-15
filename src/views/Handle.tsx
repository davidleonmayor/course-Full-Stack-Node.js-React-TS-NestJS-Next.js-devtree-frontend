import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { getUserByHandle } from "../api/DevTreeAPI";
import HandleData from "../components/HandleData";

const Loading = (
  <div className="flex items-center justify-center h-screen text-xl font-bold">
    Loading...
  </div>
);

export default function Handle() {
  const params = useParams();
  const handle = params.handle!;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["handle", handle],
    queryFn: () => getUserByHandle(handle),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return Loading;
  if (isError) return <Navigate to="/404" />;
  if (data) return <HandleData data={data} />;
}
