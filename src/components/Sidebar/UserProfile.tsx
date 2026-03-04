import Link from "next/link";
import { cn } from "../ui/utils";
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

  const showDetails = !isCollapsed || isMobile;

  return (
    <div
      className={cn(
        "border-t border-border transition-all duration-300 ease-in-out",
        showDetails ? "p-3" : "p-2"
      )}
    >
      <Link
        href={profileLink}
        className={cn(
          "flex items-center rounded-lg hover:bg-muted transition-all duration-300",
          showDetails ? "px-3 py-2" : "px-0 py-2 justify-center"
        )}
      >
        <Avatar className="w-8 h-8 shrink-0">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={initials} />}
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div
          className="min-w-0 overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            width: showDetails ? "140px" : "0px",
            opacity: showDetails ? 1 : 0,
            marginLeft: showDetails ? "12px" : "0px",
          }}
        >
          <p className="text-sm text-foreground truncate whitespace-nowrap">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate capitalize whitespace-nowrap">
            {user.role?.replace("_", " ")}
          </p>
        </div>
      </Link>
    </div>
  );
}
