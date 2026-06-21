import { redirect } from "next/navigation";

/** Legacy route — PDP now lives at `/` */
export default function RedesignRedirect() {
  redirect("/");
}
