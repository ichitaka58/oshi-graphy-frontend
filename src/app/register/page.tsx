import { ChevronLeft } from "lucide-react";
import RegisterForm from "./register-form";
import Link from "next/link";
import { getCurrentUserOrNull } from "@/lib/auth";
import { redirect } from "next/navigation";

const Register = async () => {
  const user = await getCurrentUserOrNull();
  if (user) {
    redirect("/diaries");
  }
  return (
    <div>
      <div className="flex items-center max-w-4xl mx-auto px-4 py-3 text-muted-foreground text-sm">
        <Link href="/" className="text-muted-foreground">
          <ChevronLeft />
        </Link>
      </div>
      <div className="max-w-md w-full mx-auto flex items-center justify-center p-4 mt-4">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
