import HeaderUserMenu from "./header-user-menu";
import { User } from "@/types/user";
import Image from "next/image";

// user取得や未読件数取得は行わず、layout.tsxから渡されたuserを表示するだけの
// シンプルなコンポーネントになった(未読件数はUnreadCountProvider経由でHeaderUserMenuが直接読む)
const Header = ({ user }: { user: User | null }) => {
  return (
    <div className="h-12 bg-primary">
      <div className="flex items-center justify-between h-12 max-w-4xl mx-auto px-4">
        <Image
          src="/oshi-graphy-text-logo.png"
          alt="推しグラフィー"
          width={1992}
          height={1059}
          priority
          className="h-8 w-auto"
        />
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
