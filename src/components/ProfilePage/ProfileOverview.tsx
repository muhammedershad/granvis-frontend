"use client";

import { useRef, useState } from "react";
import {
  AtSign,
  Briefcase,
  Cake,
  Calendar,
  Camera,
  Clock,
  Edit2,
  Hash,
  Loader2,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  User as UserIcon,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ImageCropDialog } from "../ui/ImageCropDialog";
import { getAvatarUrl } from "@/lib/utils/cloudfront";
import { useImageCrop } from "@/hooks/useImageCrop";
import {
  type UserProfile,
  useUpdateMyProfileMutation,
} from "@/lib/api/profileApi";
import { useGetPresignedUrlMutation } from "@/lib/api/uploadApi";
import { uploadToS3 } from "@/lib/utils/uploadToS3";
import { UPLOAD_PATHS } from "@/lib/constants/uploadPaths";
import { useDispatch, useSelector } from "react-redux";
import { getAuthDetails, setUser } from "@/store/slices/authSlice";

interface ProfileOverviewProps {
  profile: UserProfile;
  onEdit: () => void;
}

function formatRole(role: string): string {
  return role.replace(/_/g, " ");
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) {
    return "N/A";
  }
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return "N/A";
  }
}

function ProfileInfoGrid({ profile }: { profile: UserProfile }) {
  const infoItems: {
    icon: React.ElementType;
    label: string;
    value: string;
    capitalize?: boolean;
  }[] = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone || "Not set" },
    {
      icon: AtSign,
      label: "Username",
      value: profile.username || profile.email.split("@")[0],
    },
  ];

  if (profile.gender) {
    infoItems.push({
      icon: Users,
      label: "Gender",
      value: profile.gender,
      capitalize: true,
    });
  }

  if (profile.dateOfBirth) {
    infoItems.push({
      icon: Cake,
      label: "Date of Birth",
      value: formatDate(profile.dateOfBirth),
    });
  }

  if (profile.employeeId) {
    infoItems.push({
      icon: Hash,
      label: "Employee ID",
      value: profile.employeeId,
    });
  }
  if (profile.department) {
    infoItems.push({
      icon: Briefcase,
      label: "Department",
      value: profile.department,
      capitalize: true,
    });
  }
  if (profile.position) {
    infoItems.push({
      icon: UserIcon,
      label: "Position",
      value: profile.position,
    });
  }
  if (profile.employmentType) {
    infoItems.push({
      icon: Briefcase,
      label: "Employment Type",
      value: profile.employmentType,
      capitalize: true,
    });
  }
  if (profile.address) {
    infoItems.push({
      icon: MapPin,
      label: "Location",
      value: `${profile.address.city}, ${profile.address.state}`,
    });
  }

  infoItems.push({
    icon: Calendar,
    label: "Joined",
    value: formatDate(profile.joinDate || profile.createdAt),
  });

  if (profile.lastLoginAt) {
    infoItems.push({
      icon: Clock,
      label: "Last Login",
      value: formatDate(profile.lastLoginAt),
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {infoItems.map((item) => (
        <InfoItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          capitalize={item.capitalize}
        />
      ))}
    </div>
  );
}

function EmploymentStatsRow({ profile }: { profile: UserProfile }) {
  const stats: React.ReactNode[] = [];

  if (profile.experience != null && profile.experience > 0) {
    stats.push(
      <StatCard
        key="experience"
        icon={Briefcase}
        label="Experience"
        iconColor="text-purple-600 dark:text-purple-400"
        bgColor="from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/10"
        borderColor="border-purple-200/50 dark:border-purple-800/30"
      >
        <span className="text-foreground text-lg font-semibold">
          {profile.experience}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            years
          </span>
        </span>
      </StatCard>
    );
  }

  if (profile.salary) {
    stats.push(
      <StatCard
        key="salary"
        icon={TrendingUp}
        label="Salary"
        iconColor="text-green-600 dark:text-green-400"
        bgColor="from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/10"
        borderColor="border-green-200/50 dark:border-green-800/30"
      >
        <span className="text-foreground text-lg font-semibold">
          ₹{profile.salary.toLocaleString("en-IN")}
        </span>
      </StatCard>
    );
  }

  if (profile.department) {
    stats.push(
      <StatCard
        key="department"
        icon={Users}
        label="Department"
        iconColor="text-blue-600 dark:text-blue-400"
        bgColor="from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10"
        borderColor="border-blue-200/50 dark:border-blue-800/30"
      >
        <span className="text-foreground text-lg font-semibold capitalize">
          {profile.department}
        </span>
      </StatCard>
    );
  }

  if (profile.hireDate) {
    stats.push(
      <StatCard
        key="hireDate"
        icon={Clock}
        label="Hire Date"
        iconColor="text-orange-600 dark:text-orange-400"
        bgColor="from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/10"
        borderColor="border-orange-200/50 dark:border-orange-800/30"
      >
        <span className="text-foreground text-lg font-semibold">
          {formatDate(profile.hireDate)}
        </span>
      </StatCard>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  return (
    <>
      <Separator className="my-6 bg-gray-200/60 dark:bg-white/10" />
      <div
        className={`grid grid-cols-2 ${stats.length >= 3 ? "md:grid-cols-4" : `md:grid-cols-${stats.length}`} gap-4`}
      >
        {stats}
      </div>
    </>
  );
}

function ProfileHeader({ profile, onEdit }: ProfileOverviewProps) {
  const avatarUrl = getAvatarUrl(profile.avatarKey, profile.avatar);
  const initials = `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`;
  const fullName = [profile.firstName, profile.middleName, profile.lastName]
    .filter(Boolean)
    .join(" ");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(getAuthDetails);

  const imageCrop = useImageCrop({
    onError: (error) => toast.error(error),
  });

  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [updateProfile] = useUpdateMyProfileMutation();

  const handleAvatarUpload = async (blob: Blob, previewUrl: string) => {
    imageCrop.handleCropComplete(blob, previewUrl);
    setIsUploading(true);

    try {
      const presigned = await getPresignedUrl({
        fileName: `avatar-${Date.now()}.jpg`,
        contentType: "image/jpeg",
        folder: UPLOAD_PATHS.USER_AVATARS,
      }).unwrap();

      await uploadToS3(presigned.uploadUrl, blob, "image/jpeg");

      await updateProfile({ avatarKey: presigned.objectKey }).unwrap();

      // Sync avatarKey to Redux so sidebar updates immediately
      if (authUser) {
        dispatch(setUser({ ...authUser, avatarKey: presigned.objectKey }));
      }

      toast.success("Profile picture updated");
    } catch {
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
      imageCrop.reset();
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar with camera button */}
        <div className="relative group shrink-0">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-white/50 dark:ring-white/10 shadow-lg">
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={profile.firstName} />
            )}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl sm:text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={imageCrop.handleInputChange}
          />
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight truncate max-w-full">
                    {fullName}
                  </h2>
                </TooltipTrigger>
                {fullName.length > 25 && (
                  <TooltipContent side="bottom" className="max-w-xs">
                    {fullName}
                  </TooltipContent>
                )}
              </Tooltip>
              <p className="text-muted-foreground text-sm mt-0.5 truncate">
                @{profile.username || profile.email.split("@")[0]}
                {profile.position && (
                  <span className="ml-2 text-foreground/70">
                    &middot; {profile.position}
                  </span>
                )}
              </p>
              <ProfileBadges profile={profile} />
            </div>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="shrink-0 w-full sm:w-auto"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Image Crop Dialog */}
      {imageCrop.originalImage && (
        <ImageCropDialog
          open={imageCrop.isDialogOpen}
          onOpenChange={imageCrop.setIsDialogOpen}
          imageSrc={imageCrop.originalImage}
          onCropComplete={handleAvatarUpload}
          aspectRatio={1}
          circularCrop
          title="Crop Profile Picture"
          description="Adjust the crop area for your profile picture"
        />
      )}
    </>
  );
}

function ProfileBadges({ profile }: { profile: UserProfile }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <Badge variant="secondary" className="capitalize text-xs">
        {formatRole(profile.role)}
      </Badge>
      <Badge
        variant={profile.isActive ? "default" : "destructive"}
        className="text-xs"
      >
        {profile.isActive ? "Active" : "Inactive"}
      </Badge>
      {profile.employmentStatus && profile.employmentStatus !== "Active" && (
        <Badge variant="outline" className="text-xs capitalize">
          {profile.employmentStatus}
        </Badge>
      )}
      {profile.emailVerified && (
        <Badge variant="outline" className="text-xs">
          Email Verified
        </Badge>
      )}
    </div>
  );
}

export function ProfileOverview({ profile, onEdit }: ProfileOverviewProps) {
  return (
    <Card className="relative overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />

      <CardContent className="relative z-10 p-6">
        <ProfileHeader profile={profile} onEdit={onEdit} />
        <Separator className="my-6 bg-gray-200/60 dark:bg-white/10" />
        <ProfileInfoGrid profile={profile} />
        <EmploymentStatsRow profile={profile} />
      </CardContent>
    </Card>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  capitalize,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
        <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-sm font-medium text-foreground truncate ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  iconColor,
  bgColor,
  borderColor,
  children,
}: {
  icon: React.ElementType;
  label: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-br ${bgColor} border ${borderColor}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
