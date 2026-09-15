import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getWallets,
  createWallet as createWalletApi,
  updateWallet as updateWalletApi,
  depositToWallet as depositWalletApi,
  deleteWallet as deleteWalletApi,
} from "../api/financeApi";

export function useWallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWallets();
      const list = Array.isArray(data) ? data : data?.wallets || [];
      setWallets(list);
    } catch (err) {
      console.error("Failed to load wallets:", err);
      setError(err?.message || "Failed to load wallets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const addWallet = useCallback(
    async (payload) => {
      const created = await createWalletApi(payload);
      await fetchWallets();
      return created;
    },
    [fetchWallets]
  );

  const editWallet = useCallback(
    async (walletId, payload) => {
      const updated = await updateWalletApi(walletId, payload);
      await fetchWallets();
      return updated;
    },
    [fetchWallets]
  );

  const depositWallet = useCallback(
    async (walletId, { amount, note }) => {
      const res = await depositWalletApi(walletId, {
        amount: parseFloat(amount) || 0,
        note: note || "",
      });
      await fetchWallets();
      return res;
    },
    [fetchWallets]
  );

  const removeWallet = useCallback(
    async (walletId) => {
      const res = await deleteWalletApi(walletId);
      await fetchWallets();
      return res;
    },
    [fetchWallets]
  );

  const totalBalance = useMemo(() => {
    return wallets.reduce((acc, w) => acc + (Number(w.balance) || 0), 0);
  }, [wallets]);

  const defaultWallet = useMemo(() => {
    return wallets.find((w) => w.isDefault) || wallets[0] || null;
  }, [wallets]);

  return {
    wallets,
    loading,
    error,
    totalBalance,
    defaultWallet,
    reload: fetchWallets,
    addWallet,
    editWallet,
    depositWallet,
    removeWallet,
  };
}

