// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// import { SOCIAL } from "../data/social";
// import DevTreeInput from "../components/DevTreeInput";
// import { isValidUrl } from "../utils";
// import { updateProfile } from "../api/DevTreeAPI";

// import type { DevTreeLink, User } from "../types/index";

// export default function LinkTree() {
//   // Querys
//   const queryClient = useQueryClient();
//   const data = queryClient.getQueryData<User>(["user"])!;
//   console.log("data fetch: ", JSON.parse(data.links));
//   const parseSocialQuery = JSON.parse(data.links);

//   // State manage
//   const [devTreeLinks, setDevTreeLinks] =
//     useState<DevTreeLink[]>(parseSocialQuery);

//   const { mutate } = useMutation({
//     mutationFn: updateProfile,
//     onError: (error) => {
//       toast.error(error.message);
//     },
//     onSuccess: (response) => {
//       toast.success(response);
//       // re-make query to update user hanle in the pane view
//       //queryClient.invalidateQueries({ queryKey: ["user"] });
//     },
//   });

//   // Handlers
//   const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const updatedLinks = devTreeLinks.map((link) =>
//       link.name === e.target.name
//         ? {
//             ...link,
//             url: e.target.value,
//           }
//         : link
//     );

//     setDevTreeLinks(updatedLinks);
//   };

//   const handleEnabledLink = (socialNetwork: string) => {
//     const updatedLinks = devTreeLinks.map((link) => {
//       if (link.name === socialNetwork) {
//         if (isValidUrl(link.url)) return { ...link, enabled: !link.enabled };
//         else toast.error("Invalid URL");
//       }

//       return link;
//     });

//     setDevTreeLinks(updatedLinks);
//     const callback = (prevData: User) => ({
//       ...prevData,
//       links: JSON.stringify(updatedLinks),
//     });
//     queryClient.setQueryData(["user"], callback);
//   };

//   return (
//     <div className="space-y-5">
//       {devTreeLinks.map((link, index) => (
//         <DevTreeInput
//           key={index}
//           item={link}
//           handleUrlChange={handleUrlChange}
//           handleEnabledLink={handleEnabledLink}
//         />
//       ))}

//       <button
//         type="submit"
//         className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-sm font-bold"
//         onClick={() => mutate(data)}
//       >
//         Update
//       </button>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SOCIAL } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { updateProfile } from "../api/DevTreeAPI";

import type { DevTreeLink, SocialNetwork, User } from "../types/index";

export default function LinkTree() {
  // Querys
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(["user"])!;

  // State manage
  const [devTreeLinks, setDevTreeLinks] = useState<DevTreeLink[]>(SOCIAL);

  const devTreeEffect = () => {
    const updatedData = devTreeLinks.map((item) => {
      const userLink = JSON.parse(user.links).find(
        (link: SocialNetwork) => link.name === item.name
      );
      if (userLink) {
        return {
          ...item,
          url: userLink.url,
          enabled: userLink.enabled,
        };
      }

      return item;
    });

    setDevTreeLinks(updatedData);
    // console.log(devTreeLinks);
  };
  useEffect(devTreeEffect, []);

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response);
      // re-make query to update user hanle in the pane view
      //queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Handlers
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    );
    setDevTreeLinks(updatedLinks);
  };

  const links: SocialNetwork[] = JSON.parse(user.links);

  const handleEnabledLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) return { ...link, enabled: !link.enabled };
        else toast.error("Invalid URL");
      }

      return link;
    });
    setDevTreeLinks(updatedLinks);

    // Id for each item when select or unselect it
    let updatedItems: SocialNetwork[] = [];
    const selectedSocialNetwork = updatedLinks.find(
      (link) => link.name === socialNetwork
    );
    if (selectedSocialNetwork?.enabled) {
      const id = links.filter((link) => link.id).length + 1;
      if (links.some((link) => link.name === socialNetwork)) {
        updatedItems = links.map((link) => {
          if (link.name === socialNetwork) {
            return { ...link, enabled: true, id: id };
          } else {
            return link;
          }
        });
      } else {
        const newItem = { ...selectedSocialNetwork, id: id };
        updatedItems = [...links, newItem];
      }

      // console.log("Enable");
    } else {
      console.log("Disable");
      const indexToUpdate = links.findIndex(
        (link) => link.name === socialNetwork
      );

      updatedItems = links.map((link) => {
        if (link.name === socialNetwork) {
          return { ...link, id: 0, enabled: false };
        } else if (
          link.id > indexToUpdate &&
          (indexToUpdate !== 0 &&
          link.id === 1)
        ) {
          return { ...link, id: link.id - 1 };
        } else {
          return link;
        }
      });
    }
    console.log(updatedItems);

    // Storage in DB
    const callback = (prevData: User) => ({
      ...prevData,
      links: JSON.stringify(updatedItems),
    });
    queryClient.setQueryData(["user"], callback);
  };

  return (
    <div className="space-y-5">
      {devTreeLinks.map((link, index) => (
        <DevTreeInput
          key={index}
          item={link}
          handleUrlChange={handleUrlChange}
          handleEnabledLink={handleEnabledLink}
        />
      ))}

      <button
        type="submit"
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-sm font-bold"
        onClick={() => mutate(queryClient.getQueryData<User>(["user"])!)}
      >
        Update
      </button>
    </div>
  );
}
