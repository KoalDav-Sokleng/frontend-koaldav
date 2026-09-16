import { useState, useEffect, useCallback } from "react";
import { getProfile, updateProfile as updateProfileApi } from "../api/profileApi";
import { useAuth } from "../../auth/hooks/useAuth";

export function useProfile() {
  const { user: authUser, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProfile();
      const res = data?.data ?? data?.user ?? data;
      setProfile({
        firstName:
          res?.firstName ||
          res?.fullName?.split(" ")[0] ||
          authUser?.firstName ||
          authUser?.name?.split(" ")[0] ||
          "",
        lastName:
          res?.lastName ||
          (res?.fullName?.split(" ").length > 1
            ? res?.fullName?.split(" ").slice(1).join(" ")
            : "") ||
          authUser?.lastName ||
          (authUser?.name?.split(" ").length > 1
            ? authUser?.name?.split(" ").slice(1).join(" ")
            : "") ||
          "",
        email: res?.email || authUser?.email || "",
        avatar: res?.avatar || authUser?.avatar || "",
        createdAt: res?.createdAt || authUser?.createdAt || new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Using local auth user state for profile:", err?.message);
      // Graceful fallback from AuthContext
      setProfile({
        firstName:
          authUser?.firstName ||
          authUser?.name?.split(" ")[0] ||
          "",
        lastName:
          authUser?.lastName ||
          (authUser?.name?.split(" ").length > 1
            ? authUser?.name?.split(" ").slice(1).join(" ")
            : "") ||
          "",
        email: authUser?.email || "",
        avatar: authUser?.avatar || "",
        createdAt: authUser?.createdAt || new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfileData = useCallback(
    async (formData) => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response = await updateProfileApi(formData);
        const updated = response?.data || response?.user || response || formData;

        const merged = {
          ...profile,
          ...formData,
          ...(typeof updated === "object" ? updated : {}),
        };

        setProfile(merged);
        if (updateUser) {
          updateUser({
            firstName: merged.firstName,
            lastName: merged.lastName,
            name: `${merged.firstName} ${merged.lastName}`.trim() || merged.firstName,
            email: merged.email,
            avatar: merged.avatar,
          });
        }

        setSuccessMessage("Profile updated successfully!");
        return merged;
      } catch (err) {
        const msg = err.message || "Failed to update profile.";
        setError(msg);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [profile, updateUser]
  );

  return {
    profile,
    loading,
    saving,
    error,
    successMessage,
    clearMessages: () => {
      setError(null);
      setSuccessMessage(null);
    },
    refresh: fetchProfile,
    updateProfile: updateProfileData,
  };
}

export default useProfile;
