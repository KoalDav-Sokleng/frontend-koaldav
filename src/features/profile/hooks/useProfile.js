import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile as updateProfileApi,
  uploadProfileImage as uploadProfileImageApi,
  deleteProfileImage as deleteProfileImageApi,
} from "../api/profileApi";
import { useAuth } from "../../auth/hooks/useAuth";

function extractAvatar(obj) {
  if (!obj || typeof obj !== "object") return "";
  return (
    obj.avatar ||
    obj.profileImageUrl ||
    obj.imageUrl ||
    obj.profileImage ||
    obj.photo ||
    ""
  );
}

function getCachedProfile() {
  try {
    const stored =
      localStorage.getItem("authUser") || localStorage.getItem("user");
    const u = stored ? JSON.parse(stored) : null;
    if (!u) return null;
    const fName = u.firstName || u.name?.split(" ")[0] || "";
    const lName =
      u.lastName ||
      (u.name && u.name.split(" ").length > 1
        ? u.name.split(" ").slice(1).join(" ")
        : "") ||
      "";
    const avatar = extractAvatar(u);
    return {
      id: u.id || null,
      firstName: fName,
      lastName: lName,
      email: u.email || "",
      avatar,
      profileImageUrl: avatar,
      createdAt: u.createdAt || "",
    };
  } catch {
    return null;
  }
}

export function useProfile() {
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() => {
    const cached = getCachedProfile();
    return (
      cached || {
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",
        profileImageUrl: "",
        createdAt: "",
      }
    );
  });

  const [loading, setLoading] = useState(() => {
    const cached = getCachedProfile();
    return !cached?.email;
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const updateUserRef = useRef(updateUser);
  useEffect(() => {
    updateUserRef.current = updateUser;
  }, [updateUser]);

  const fetchProfile = useCallback(
    async (isSilent = false) => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      if (!token || token === "undefined" || token === "null") {
        navigate("/login", { replace: true });
        return;
      }

      if (!isSilent) {
        setProfile((prev) => {
          if (!prev.email) setLoading(true);
          return prev;
        });
      }
      setError(null);

      try {
        const data = await getProfile();
        const res = data?.data ?? data?.user ?? data;
        const avatarVal = extractAvatar(res);
        const fName =
          res?.firstName ||
          (res?.fullName ? res.fullName.split(" ")[0] : "") ||
          (res?.name ? res.name.split(" ")[0] : "");
        const lName =
          res?.lastName ||
          (res?.fullName && res.fullName.split(" ").length > 1
            ? res.fullName.split(" ").slice(1).join(" ")
            : "") ||
          (res?.name && res.name.split(" ").length > 1
            ? res.name.split(" ").slice(1).join(" ")
            : "") ||
          "";

        const loadedProfile = {
          id: res?.id || null,
          firstName: fName,
          lastName: lName,
          email: res?.email || "",
          avatar: avatarVal,
          profileImageUrl: avatarVal,
          createdAt: res?.createdAt || new Date().toISOString(),
        };

        setProfile(loadedProfile);

        // Sync with global auth state
        if (updateUserRef.current) {
          updateUserRef.current({
            id: loadedProfile.id,
            firstName: loadedProfile.firstName,
            lastName: loadedProfile.lastName,
            name: `${loadedProfile.firstName} ${loadedProfile.lastName}`.trim() || loadedProfile.firstName,
            email: loadedProfile.email,
            avatar: loadedProfile.avatar,
            profileImageUrl: loadedProfile.profileImageUrl,
          });
        }
      } catch (err) {
        if (err?.status === 401 || err?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          localStorage.removeItem("authUser");
          navigate("/login", { replace: true });
          return;
        }
        setError(err?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    fetchProfile(true);
  }, [fetchProfile]);

  const updateProfileData = useCallback(
    async (formData) => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const rawAvatar = formData.avatar ? formData.avatar.trim() : "";
        const avatarToSend = rawAvatar === "" ? null : rawAvatar;

        const payload = {
          firstName: formData.firstName?.trim() || "",
          lastName: formData.lastName?.trim() || "",
          avatar: avatarToSend,
          profileImageUrl: avatarToSend,
          imageUrl: avatarToSend,
        };

        const response = await updateProfileApi(payload);
        const updated = response?.data || response?.user || response || payload;
        const avatarVal = extractAvatar(updated) || rawAvatar;

        const fName =
          updated?.firstName !== undefined
            ? updated.firstName
            : payload.firstName;
        const lName =
          updated?.lastName !== undefined ? updated.lastName : payload.lastName;

        setProfile((prev) => {
          const merged = {
            ...prev,
            firstName: fName,
            lastName: lName,
            avatar: avatarVal,
            profileImageUrl: avatarVal,
          };

          try {
            localStorage.setItem("authUser", JSON.stringify(merged));
            localStorage.setItem("user", JSON.stringify(merged));
          } catch {
            // ignore
          }

          if (updateUserRef.current) {
            updateUserRef.current({
              id: merged.id,
              firstName: merged.firstName,
              lastName: merged.lastName,
              name: `${merged.firstName} ${merged.lastName}`.trim() || merged.firstName,
              email: merged.email,
              avatar: merged.avatar,
              profileImageUrl: merged.profileImageUrl,
            });
          }

          return merged;
        });

        setSuccessMessage("Profile updated successfully!");
        return updated;
      } catch (err) {
        const msg = err.message || "Failed to update profile.";
        setError(msg);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const uploadImage = useCallback(
    async (file) => {
      setUploadingImage(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response = await uploadProfileImageApi(file);
        const updated = response?.data || response?.user || response;
        const avatarVal = extractAvatar(updated) || (typeof updated === "string" ? updated : "");

        setProfile((prev) => {
          const merged = {
            ...prev,
            avatar: avatarVal,
            profileImageUrl: avatarVal,
          };
          if (updateUserRef.current) {
            updateUserRef.current({
              id: merged.id,
              firstName: merged.firstName,
              lastName: merged.lastName,
              name: `${merged.firstName} ${merged.lastName}`.trim() || merged.firstName,
              email: merged.email,
              avatar: avatarVal,
              profileImageUrl: avatarVal,
            });
          }
          return merged;
        });

        setSuccessMessage("Profile image uploaded successfully!");
        return avatarVal;
      } catch (err) {
        const msg = err.message || "Failed to upload profile image.";
        setError(msg);
        throw err;
      } finally {
        setUploadingImage(false);
      }
    },
    []
  );

  const deleteImage = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteProfileImageApi();
      setProfile((prev) => {
        const merged = {
          ...prev,
          avatar: "",
          profileImageUrl: "",
        };
        if (updateUserRef.current) {
          updateUserRef.current({
            id: merged.id,
            firstName: merged.firstName,
            lastName: merged.lastName,
            email: merged.email,
            avatar: "",
            profileImageUrl: "",
          });
        }
        return merged;
      });

      setSuccessMessage("Profile image removed.");
    } catch (err) {
      const msg = err.message || "Failed to delete profile image.";
      setError(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    profile,
    loading,
    saving,
    uploadingImage,
    error,
    successMessage,
    clearMessages: () => {
      setError(null);
      setSuccessMessage(null);
    },
    refresh: () => fetchProfile(false),
    updateProfile: updateProfileData,
    uploadImage,
    deleteImage,
  };
}

export default useProfile;
