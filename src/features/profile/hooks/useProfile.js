import { useState, useEffect, useCallback } from "react";
import { getProfile, updateProfile as updateProfileApi } from "../api/profileApi";
import { useAuth } from "../../auth/hooks/useAuth";

export function useProfile() {
  const { user: authUser, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    fullName: "",
    lastName: "",
    email: "",
    gender: "",
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
        fullName: res?.fullName || res?.name || authUser?.fullName || authUser?.name || "",
        lastName: res?.lastName || authUser?.lastName || "",
        email: res?.email || authUser?.email || "",
        gender: res?.gender || authUser?.gender || "prefer_not_to_say",
        avatar: res?.avatar || authUser?.avatar || "",
        createdAt: res?.createdAt || authUser?.createdAt || new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Could not fetch /api/profile, using current auth user state:", err?.message);
      // Graceful fallback from AuthContext
      setProfile({
        fullName: authUser?.fullName || authUser?.name || "",
        lastName: authUser?.lastName || "",
        email: authUser?.email || "",
        gender: authUser?.gender || "prefer_not_to_say",
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
            name: `${merged.fullName} ${merged.lastName}`.trim() || merged.fullName,
            fullName: merged.fullName,
            lastName: merged.lastName,
            email: merged.email,
            gender: merged.gender,
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
