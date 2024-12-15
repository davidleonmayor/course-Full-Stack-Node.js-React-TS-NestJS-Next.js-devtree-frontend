// User
export type User = {
  name: string;
  email: string;
  handle: string;
  _id: string;
  description: string;
  image: string;
  links: string;
};

export type RegisterInputs = Pick<User, "name" | "email" | "handle"> & {
  password: string;
  repeatPassword: string;
};

export type LoginInputs = Pick<User, "email"> & {
  password: string;
};

export type ProfileForm = Pick<User, "handle" | "description" | "image">;

// DevTreeLinks
export type SocialNetwork = {
  id: number;
  name: string;
  url: string;
  enabled: boolean;
};

export type DevTreeLink = Pick<SocialNetwork, "name" | "url" | "enabled">;

// Profile page
export type UserHandle = Pick<
  User,
  "description" | "handle" | "image" | "links" | "name"
>;
