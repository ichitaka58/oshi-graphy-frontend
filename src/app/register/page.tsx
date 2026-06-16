import { ChevronLeft } from "lucide-react";
import RegisterForm from "./register-form";
import Link from "next/link";

const Register = () => {
  return (
    <div>
      <div className="flex items-center mt-1">
        <Link href="/" className="text-muted-foreground">
          <ChevronLeft />
        </Link>
      </div>
      <div className="max-w-md w-full mx-auto flex items-center justify-center p-4 mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;