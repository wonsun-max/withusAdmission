import { redirect } from "next/navigation";

/** Root page — redirects to /spec */
export default function RootPage() {
  redirect("/spec");
}
