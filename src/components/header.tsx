// import { cookies } from "next/headers";
import HeaderUserMenu from "./header-user-menu";
import { getCurrentUserOrNull } from "@/lib/auth";

const Header = async () => {
  const user = await getCurrentUserOrNull();
  return (
    <div className="h-12 bg-primary">
      <div className="flex items-center justify-between h-12 max-w-4xl mx-auto px-4">
        <img src="/oshi-graphy-text-logo.png" className="h-8" />
        {user && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-primary-foreground">{user.name}</p>
            <HeaderUserMenu user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
