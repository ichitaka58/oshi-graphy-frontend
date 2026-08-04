import Link from "next/link";
import LoginForm from "./login-form";
import { ChevronLeft } from "lucide-react";

const Login = () => {
  return (
    <div>
      <div className="flex items-center max-w-4xl mx-auto px-4 py-3 text-muted-foreground text-sm">
        <Link href="/">
          <ChevronLeft />
        </Link>
      </div>
      <div className="max-w-md w-full mx-auto flex items-center justify-center p-4 mt-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
