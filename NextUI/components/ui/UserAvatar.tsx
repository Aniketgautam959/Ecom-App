"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { resolveUserProfileImageUrl } from "@/lib/userProfileImage";

type UserAvatarSize = "sm" | "md" | "lg";

const sizeMap: Record<UserAvatarSize, { box: string; icon: string; border: string; dim: number }> = {
  sm: { box: "w-8 h-8", icon: "w-4 h-4", border: "border border-gray-200 dark:border-gray-600", dim: 32 },
  md: { box: "w-12 h-12", icon: "w-6 h-6", border: "border-2 border-gray-200 dark:border-gray-700", dim: 48 },
  lg: { box: "w-24 h-24", icon: "w-12 h-12", border: "border-4 border-gray-200 dark:border-gray-700", dim: 96 },
};

export interface UserAvatarProps {
  profilePic?: string | null;
  firstName?: string;
  lastName?: string;
  size?: UserAvatarSize;
  className?: string;
}

export default function UserAvatar({
  profilePic,
  firstName,
  lastName,
  size = "sm",
  className = "",
}: UserAvatarProps) {
  const [broken, setBroken] = useState(false);
  const url = resolveUserProfileImageUrl(profilePic);
  const showImage = Boolean(url) && !broken;
  const styles = sizeMap[size];

  const alt = `${firstName || "User"}${lastName ? ` ${lastName}` : ""}`.trim();

  if (showImage) {
    return (
      <Image
        key={url ?? ""}
        src={url!}
        alt={alt}
        width={styles.dim}
        height={styles.dim}
        className={`${styles.box} rounded-full object-cover ${styles.border} ${className}`}
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <div
      className={`${styles.box} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 ${styles.border} ${className}`}
      aria-hidden
    >
      <User className={`${styles.icon} text-white`} />
    </div>
  );
}
