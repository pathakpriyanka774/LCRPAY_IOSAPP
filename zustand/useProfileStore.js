// src/store/useProfileStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Persist *only* non-sensitive, UX-critical status fields.
 * Avoid persisting MobileNumber / PII unless you encrypt at rest.
 */
export const useProfileStore = create()(
  persist(
    (set, get) => ({
      // --- KYC overall statuses (persisted)
      aadharkycStatus: null, // "pending" | "success" | "failed" | null
      pankycStatus: null,    // "pending" | "success" | "failed" | null

      // --- User status snapshot (persisted - minimal & safe)
      user: {
        member_id: null,
        introducer_id: null,
        fullname: null,
        email_verified: false,
        is_kyc_completed: false,
        aadhar_verified: false,
        pan_verified: false,
        activation_status: false,
        prime_status: false,
        prime_activation_date: null, // ISO string or null
        created_at: null,            // ISO string
        fingerprint_status: 0,       // number
        login_pin_set: false,
        txn_pin_set: false,
        total_packages: 0,
        profile_avatar: "",          // path or URL if you really need it
        // NOTE: deliberately omitted: MobileNumber (PII)
      },

      /**
       * Normalize and persist the server response you pasted.
       * Example payload shape:
       * {
       *   aadharkycStatus: "pending",
       *   pankycStatus: "pending",
       *   user: { ...fields... }
       * }
       */
      setFromServer(payload) {
        const u = payload?.user || {};

        set({
          aadharkycStatus: payload?.aadharkycStatus ?? null,
          pankycStatus: payload?.pankycStatus ?? null,
          user: {
            member_id: u.member_id ?? null,
            introducer_id: u.introducer_id ?? null,
            fullname: u.fullname ?? null,
            email_verified: !!u.email_verification_status,
            is_kyc_completed: !!u.IsKYCCompleted,
            aadhar_verified: !!u.aadhar_verification_status,
            pan_verified: !!u.pan_verification_status,
            activation_status: !!u.activation_status,
            prime_status: !!u.prime_status,
            prime_activation_date: u.prime_activation_date ?? null,
            created_at: u.CreatedAt ?? null,
            fingerprint_status: Number(u.fingerPrintStatus ?? 0),
            login_pin_set: !!u.LoginPIN,
            txn_pin_set: !!u.TransactionPIN,
            total_packages: Number(u.total_packages ?? 0),
            profile_avatar: u.profile ?? "",
          },
        });
      },

      clearProfile() {
        set({
          aadharkycStatus: null,
          pankycStatus: null,
          user: {
            member_id: null,
            introducer_id: null,
            fullname: null,
            email_verified: false,
            is_kyc_completed: false,
            aadhar_verified: false,
            pan_verified: false,
            activation_status: false,
            prime_status: false,
            prime_activation_date: null,
            created_at: null,
            fingerprint_status: 0,
            login_pin_set: false,
            txn_pin_set: false,
            total_packages: 0,
            profile_avatar: "",
          },
        });
      },
    }),
    {
      name: "profile-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Persist exactly these keys; ignores anything accidental
      partialize: (state) => ({
        aadharkycStatus: state.aadharkycStatus,
        pankycStatus: state.pankycStatus,
        user: state.user,
      }),
    }
  )
);
