import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const username = creds?.username?.toString().trim() || "";
        const password = creds?.password?.toString() || "";

        if (process.env.ADMIN_DEFAULT_USERNAME && process.env.ADMIN_DEFAULT_PASSWORD) {
          const [ex] = await db.select().from(users).where(eq(users.username, process.env.ADMIN_DEFAULT_USERNAME)).limit(1);
          if (!ex) {
            const hash = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD, 10);
            await db.insert(users).values({ username: process.env.ADMIN_DEFAULT_USERNAME, passwordHash: hash });
          }
        }

        const [u] = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (!u) return null;

        const ok = await bcrypt.compare(password, u.passwordHash);
        if (!ok) return null;

        return { id: String(u.id), name: u.username };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.uid) {
        (session as any).user.id = token.uid;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
