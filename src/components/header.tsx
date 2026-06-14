import { cookies } from "next/headers";
import HeaderUserMenu from "./header-user-menu";

const Header = async () => {
  const token = (await cookies()).get("token")?.value;
  return (
    <div className="h-12 bg-primary">
      <div className="flex items-center justify-between h-12 max-w-4xl px-4">
        <img src="/oshi-graphy-text-logo.png" className="h-8" />
        {token && <HeaderUserMenu />}
      </div>
    </div>
  );
};

export default Header;
