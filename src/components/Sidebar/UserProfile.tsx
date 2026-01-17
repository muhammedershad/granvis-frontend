interface User {
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface UserProfileProps {
  user: User;
  isCollapsed: boolean;
  isMobile: boolean;
}

export function UserProfile({ user, isCollapsed, isMobile }: UserProfileProps) {
  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
          <span className="text-xs text-white">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </span>
        </div>
        {(!isCollapsed || isMobile) && (
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              {user.role?.replace("_", " ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
