import { AdminConsole } from "@/components/admin-console";
import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import { isAllowedAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
export const metadata = { title: "中文后台" };
export const dynamic = "force-dynamic";
export default async function AdminPage(){ const user = await requireChatGPTUser("/admin"); if (!isAllowedAdmin(user.email)) redirect("/"); return <AdminConsole userName={user.displayName} signOutHref={chatGPTSignOutPath("/")}/> }
