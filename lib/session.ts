// lib/session.ts
import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "myapp_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// helper type untuk user session
export type UserSession = {
  id: number;
  nama: string;
  email: string;
  isAdmin: boolean;
};
