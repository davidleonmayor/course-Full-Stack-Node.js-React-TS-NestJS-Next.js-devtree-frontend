import { ToastContainer } from "react-toastify";
import { Link, Outlet } from "react-router-dom";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import NavigationTabs from "./NavigationTabs";
import DevTreeLink from "./DevTreeLink";
import Header from './Header'


import type { User, SocialNetwork } from "../types/index";

import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type DevTreeProps = {
  data: User;
};

export default function DevTree({ data }: DevTreeProps) {
  const [enableLinks, setEnableLinks] = useState<SocialNetwork[]>(
    JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
  );

  useEffect(() => {
    setEnableLinks(
      JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
    );
  }, [data]);

  const queryClient = useQueryClient();

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (over && over.id) {
      const prevIndex = enableLinks.findIndex((link) => link.id === active.id);
      const newIndex = enableLinks.findIndex((link) => link.id === over.id);
      const order = arrayMove(enableLinks, prevIndex, newIndex);

      setEnableLinks(order);

      const desabledLinks: SocialNetwork[] = JSON.parse(data.links).filter(
        (item: SocialNetwork) => !item.enabled
      );

      const links = order.concat(desabledLinks);

      queryClient.setQueryData(["user"], (prevData: User) => {
        return {
          ...prevData,
          links: JSON.stringify(links),
        };
      });
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100  min-h-screen py-10">
        <NavigationTabs />
        <main className="mx-auto max-w-5xl p-10 md:p-0">
          <div className="flex justify-end">
            <Link
              className="font-bold text-right text-slate-800 text-2xl"
              to={`/${data.handle}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visitar Mi Perfil /{data.handle}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1 ">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
              <p className="text-4xl text-centert text-white">{data.handle}</p>
              {data.image && (
                <img
                  src={data.image}
                  alt="Image profile"
                  className="mx-auto max-w-[250px]"
                />
              )}
              <p className="text-center text-lg font-black text-white">
                {data.description}
              </p>

              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="mt-20 flex flex-col gap-5">
                  <SortableContext
                    items={enableLinks}
                    strategy={verticalListSortingStrategy}
                  >
                    {enableLinks.map((link) => (
                      <DevTreeLink key={link.name} link={link} />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>
            </div>
          </div>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        draggablePercent={60}
      />
    </>
  );
}
