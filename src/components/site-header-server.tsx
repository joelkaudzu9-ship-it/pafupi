import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import SiteHeader from "./site-header";

export async function SiteHeaderServer() {
  await connection();

  const user = await getCurrentUser();

  return <SiteHeader initialSignedIn={Boolean(user)} />;
}