import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string;
      email?: string;
    };
  }

  interface User {
    role: string;
    id: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: string;
    id: string;
  }
}