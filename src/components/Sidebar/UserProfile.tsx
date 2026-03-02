import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAvatarUrl } from "@/lib/utils/cloudfront";
import { IAuthRoles } from "@/store/slices/authSlice";
import { getRolePrefix } from "./utils";

interface User {
  firstName?: string;
  lastName?: string;
  role?: string;
  avatar?: string;
  avatarKey?: string;
}

interface UserProfileProps {
  user: User;
  isCollapsed: boolean;
  isMobile: boolean;
}

export function UserProfile({ user, isCollapsed, isMobile }: UserProfileProps) {
  const rolePrefix = user.role ? getRolePrefix(user.role as IAuthRoles) : "";
  const profileLink = rolePrefix ? `${rolePrefix}/profile` : "#";
  const avatarUrl = getAvatarUrl(user.avatarKey, user.avatar);
  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;

  const collapsed = isCollapsed && !isMobile;

  return (
    <div className="border-t border-border p-3">
      <Link
        href={profileLink}
        className={`flex items-center rounded-lg hover:bg-muted transition-all duration-200 ${
          collapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
        }`}
      >
        <Avatar className="w-8 h-8 shrink-0">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={initials} />}
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              {user.role?.replace("_", " ")}
            </p>
          </div>
        )}
      </Link>
    </div>
  );
}
