import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(input: {
      username: $username
      password: $password
    }) {
      authToken
      refreshToken
      user {
        id
        databaseId
        name
        email
      }
    }
  }
`;

const REFRESH_MUTATION = `
  mutation RefreshToken($token: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $token }) {
      authToken
    }
  }
`;

async function gql(query: string, variables: Record<string, string>, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_URL + "/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  // add new to debug
  const result = await res.json();
  if (result.errors) {
    console.error("DEBUG GraphQL Errors:", JSON.stringify(result.errors, null, 2));
  }

  return res.json();
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "WooCommerce",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const { data, errors } = await gql(LOGIN_MUTATION, {
            username: credentials.username,
            password: credentials.password,
          });

          if (errors || !data?.login) return null;

          const { authToken, refreshToken, user } = data.login;

          return {
            id: String(user.databaseId),
            name: user.name,
            email: user.email,
            authToken,
            refreshToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // First sign in — attach WP tokens
      if (user) {
        token.authToken = (user as any).authToken;
        token.refreshToken = (user as any).refreshToken;
        token.authTokenExpiry = Date.now() + 5 * 60 * 1000; // 5 min
      }

      // Refresh authToken if expired
      const isExpired = Date.now() > (token.authTokenExpiry as number);
      if (isExpired && token.refreshToken) {
        try {
          const { data } = await gql(REFRESH_MUTATION, {
            token: token.refreshToken as string,
          });
          if (data?.refreshJwtAuthToken?.authToken) {
            token.authToken = data.refreshJwtAuthToken.authToken;
            token.authTokenExpiry = Date.now() + 5 * 60 * 1000;
          }
        } catch {
          // refresh failed — user needs to re-login
          return { ...token, error: "RefreshTokenError" };
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.authToken = token.authToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };