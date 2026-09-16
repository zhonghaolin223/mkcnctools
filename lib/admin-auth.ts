import { getChatGPTUser } from "@/app/chatgpt-auth";
import { env } from "cloudflare:workers";

export function isAllowedAdmin(email: string) {
  const allowedEmails = env.ADMIN_EMAILS?.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean) || [];
  return allowedEmails.includes(email.trim().toLowerCase());
}

export async function requireAdminApi() {
  const user = await getChatGPTUser();
  if (!user) {
    return { user: null, response: Response.json({ error: "Administrator sign-in required" }, { status: 401 }) };
  }
  if (!isAllowedAdmin(user.email)) {
    return { user: null, response: Response.json({ error: "Administrator access denied" }, { status: 403 }) };
  }
  return { user, response: null };
}
