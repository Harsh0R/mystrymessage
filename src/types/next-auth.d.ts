import "next-auth";
import { DefaultSession } from "next-auth";
import { decl } from "postcss";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    email: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    messages: any[];
  }
  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {

    interface JWT {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }

}