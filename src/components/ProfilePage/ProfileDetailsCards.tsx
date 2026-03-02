"use client";

import {
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Shield,
  User as UserIcon,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { UserProfile } from "@/lib/api/profileApi";

interface ProfileDetailsCardsProps {
  profile: UserProfile;
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

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="relative overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">{children}</div>
    </Card>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">
        {value || "Not specified"}
      </span>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <CardTitle className="relative text-foreground flex items-center space-x-2">
      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      <span>{title}</span>
    </CardTitle>
  );
}

function AddressCard({ profile }: { profile: UserProfile }) {
  const { address } = profile;

  return (
    <GlassCard>
      <CardHeader className="relative">
        <SectionTitle icon={MapPin} title="Address" />
      </CardHeader>
      <CardContent className="relative space-y-1">
        {address ? (
          <>
            <DetailRow label="Street" value={address.street} />
            <DetailRow label="City" value={address.city} />
            <DetailRow label="State" value={address.state} />
            <DetailRow label="Pin Code" value={address.pinCode} />
            <DetailRow label="Country" value={address.country} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No address details added
          </p>
        )}
      </CardContent>
    </GlassCard>
  );
}

function EmergencyContactCard({ profile }: { profile: UserProfile }) {
  const contact = profile.emergencyContact;

  return (
    <GlassCard>
      <CardHeader className="relative">
        <SectionTitle icon={Shield} title="Emergency Contact" />
      </CardHeader>
      <CardContent className="relative space-y-1">
        {contact?.name ? (
          <>
            <DetailRow label="Name" value={contact.name} />
            <DetailRow label="Relationship" value={contact.relationship} />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                {contact.phone || "Not specified"}
              </span>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No emergency contact added
          </p>
        )}
      </CardContent>
    </GlassCard>
  );
}

function EducationCard({ profile }: { profile: UserProfile }) {
  const { education } = profile;

  return (
    <GlassCard>
      <CardHeader className="relative">
        <SectionTitle icon={GraduationCap} title="Education" />
      </CardHeader>
      <CardContent className="relative space-y-1">
        {education?.degree ? (
          <>
            <DetailRow label="Degree" value={education.degree} />
            <DetailRow label="University" value={education.university} />
            <DetailRow
              label="Year of Passing"
              value={
                education.dateOfPassing
                  ? new Date(education.dateOfPassing).getFullYear().toString()
                  : undefined
              }
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No education details added
          </p>
        )}
      </CardContent>
    </GlassCard>
  );
}

function SkillsCard({ profile }: { profile: UserProfile }) {
  const { skills } = profile;
  const { certifications } = profile;
  const hasSkills = skills && skills.length > 0;
  const hasCertifications = certifications && certifications.length > 0;

  return (
    <GlassCard>
      <CardHeader className="relative">
        <SectionTitle icon={Zap} title="Skills & Certifications" />
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">
            Technical Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {hasSkills ? (
              skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills added</p>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">
            Certifications
          </h4>
          <div className="flex flex-wrap gap-2">
            {hasCertifications ? (
              certifications.map((cert, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {cert}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No certifications added
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );
}

function PersonalDetailsCard({ profile }: { profile: UserProfile }) {
  return (
    <GlassCard>
      <CardHeader className="relative">
        <SectionTitle icon={UserIcon} title="Personal Details" />
      </CardHeader>
      <CardContent className="relative space-y-1">
        <DetailRow
          label="Gender"
          value={profile.gender ? capitalize(profile.gender) : undefined}
        />
        <DetailRow
          label="Date of Birth"
          value={
            profile.dateOfBirth ? formatDate(profile.dateOfBirth) : undefined
          }
        />
        <DetailRow label="Member Since" value={formatDate(profile.createdAt)} />
        <DetailRow
          label="Email Verified"
          value={profile.emailVerified ? "Yes" : "No"}
        />
      </CardContent>
    </GlassCard>
  );
}

function EmployeeDataCard({ profile }: { profile: UserProfile }) {
  return (
    <GlassCard>
      <CardHeader className="relative">
        <SectionTitle icon={Briefcase} title="Employee Data" />
      </CardHeader>
      <CardContent className="relative space-y-1">
        <DetailRow label="Employee ID" value={profile.employeeId} />
        <DetailRow label="Position" value={profile.position} />
        <DetailRow
          label="Department"
          value={
            profile.department ? capitalize(profile.department) : undefined
          }
        />
        <DetailRow label="Employment Type" value={profile.employmentType} />
        <DetailRow label="Employment Status" value={profile.employmentStatus} />
        <DetailRow label="Hire Date" value={formatDate(profile.hireDate)} />
        <DetailRow
          label="Experience"
          value={
            profile.experience !== undefined
              ? `${profile.experience} years`
              : undefined
          }
        />
        <DetailRow
          label="Salary"
          value={
            profile.salary
              ? `₹${profile.salary.toLocaleString("en-IN")}`
              : undefined
          }
        />
      </CardContent>
    </GlassCard>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function ProfileDetailsCards({ profile }: ProfileDetailsCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PersonalDetailsCard profile={profile} />
      <EmployeeDataCard profile={profile} />
      <AddressCard profile={profile} />
      <EmergencyContactCard profile={profile} />
      <SkillsCard profile={profile} />
      <EducationCard profile={profile} />
    </div>
  );
}
