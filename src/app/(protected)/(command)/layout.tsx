import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@/queries/roles.query";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const origin = process.env.ORIGIN;

  let commanders;
  try {
    const response = await fetch(`${origin}/api/roles`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    commanders = await response.json();
  } catch (error) {
    console.error("Error fetching commanders:", error);
    commanders = []; // or handle the error as needed
  }
  const data: Role[] | undefined = commanders.roles;

  if (data && !data.some((e: Role) => e.discordId === session?.user.id))
    redirect("/");
  return children;
}
