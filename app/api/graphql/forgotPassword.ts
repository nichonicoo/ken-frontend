const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL + "/graphql";

const SEND_PASSWORD_RESET_EMAIL_MUTATION = `
  mutation SendPasswordResetEmail($username: String!) {
    sendPasswordResetEmail(input: { username: $username }) {
      user {
        databaseId
        email
      }
      origin
    }
  }
`;

export async function sendPasswordResetEmail(username: string) {
  const res = await fetch(WP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: SEND_PASSWORD_RESET_EMAIL_MUTATION,
      variables: { username },
    }),
    cache: "no-store",
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "Gagal mengirim email reset password.");
  }

  return json.data?.sendPasswordResetEmail;
}
