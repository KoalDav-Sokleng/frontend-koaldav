import React, { useState, useEffect } from "react";

export function getInitials(firstName, lastName, fallbackText = "U") {
  const f = (firstName || "").trim();
  const l = (lastName || "").trim();

  if (f && l) {
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
  }
  if (f) {
    return f.charAt(0).toUpperCase();
  }
  if (l) {
    return l.charAt(0).toUpperCase();
  }
  if (fallbackText) {
    return fallbackText.charAt(0).toUpperCase();
  }
  return "U";
}

export default function UserAvatar({
  user,
  firstName,
  lastName,
  email,
  avatar,
  alt = "User Avatar",
  className = "w-10 h-10 text-sm",
  textClassName = "",
  rounded = "rounded-full",
  onClick,
}) {
  const [imageError, setImageError] = useState(false);

  const fName =
    firstName || user?.firstName || user?.fullName?.split(" ")[0] || "";
  const lName =
    lastName ||
    user?.lastName ||
    (user?.fullName?.split(" ").length > 1
      ? user?.fullName?.split(" ").slice(1).join(" ")
      : "") ||
    "";
  const avatarUrl =
    avatar !== undefined ? avatar : user?.profileImageUrl || user?.avatar || "";

  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const initials = getInitials(fName, lName, email || user?.email || "User");

  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={alt}
        referrerPolicy="no-referrer"
        onClick={onClick}
        onError={() => setImageError(true)}
        className={`${rounded} object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${rounded} bg-gradient-to-tr from-[#5B52E6] to-[#8B7CFF] text-white font-extrabold flex items-center justify-center shrink-0 shadow-xs select-none ${className}`}
      aria-label={alt}
    >
      <span className={textClassName}>{initials}</span>
    </div>
  );
}
