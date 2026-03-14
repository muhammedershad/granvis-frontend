"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, User as UserIcon } from "lucide-react";
import { type UserProfile, useGetMyProfileQuery } from "@/lib/api/profileApi";
import {
  type IAuthRoles,
  getAuthDetails,
  setUser,
} from "@/store/slices/authSlice";
import { ProfileOverview } from "./ProfileOverview";
import { ProfileDetailsCards } from "./ProfileDetailsCards";
import { EditProfileDialog } from "./EditProfileDialog";
import { ChangePasswordCard } from "./ChangePasswordCard";

export function ProfilePage() {
  const { data, isLoading } = useGetMyProfileQuery();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(getAuthDetails);

  const profile = data?.user;

  // Sync profile data to Redux so sidebar avatar stays up-to-date
  useEffect(() => {
    if (profile && authUser) {
      const needsSync =
        authUser.avatarKey !== profile.avatarKey ||
        authUser.avatar !== profile.avatar ||
        authUser.firstName !== profile.firstName ||
        authUser.lastName !== profile.lastName;

      if (needsSync) {
        dispatch(
          setUser({
            ...authUser,
            firstName: profile.firstName,
            lastName: profile.lastName,
            avatar: profile.avatar,
            avatarKey: profile.avatarKey,
            role: profile.role as IAuthRoles,
          })
        );
      }
    }
  }, [profile, authUser, dispatch]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto animate-spin" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Profile Not Found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Unable to load your profile. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
            <UserIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-foreground">Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Profile Overview */}
      <ProfileOverview
        profile={profile}
        onEdit={() => setShowEditDialog(true)}
      />

      {/* Detailed Information Cards */}
      <ProfileDetailsCards profile={profile} />

      {/* Change Password */}
      <ChangePasswordCard />

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        profile={profile}
      />
    </div>
  );
}

export type { UserProfile };
