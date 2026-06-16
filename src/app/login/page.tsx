import Link from "next/link";
import LoginForm from "./login-form";
import { ChevronLeft } from "lucide-react";

const Login = () => {
  return (
    <div>
      <div className="flex items-center mt-1">
        <Link href="/" className="text-muted-foreground">
          <ChevronLeft />
        </Link>
      </div>
      <div className="max-w-md w-full mx-auto flex items-center justify-center p-4 mt-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
