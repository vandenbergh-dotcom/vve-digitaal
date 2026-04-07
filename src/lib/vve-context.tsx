"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { VvE, Member } from "@/lib/types";

interface VvEContextValue {
  // Auth
  user: { id: string; email: string; full_name?: string } | null;
  loading: boolean;
  // VvE
  currentVvE: VvE | null;
  currentMember: Member | null;
  isBoard: boolean;
  // Supabase status
  isConnected: boolean;
  // Actions
  refreshVvE: () => Promise<void>;
  signOut: () => Promise<void>;
}

const VvEContext = createContext<VvEContextValue>({
  user: null,
  loading: true,
  currentVvE: null,
  currentMember: null,
  isBoard: false,
  isConnected: false,
  refreshVvE: async () => {},
  signOut: async () => {},
});

export function useVvE() {
  return useContext(VvEContext);
}

// Demo data for when Supabase is not configured
const DEMO_VVE: VvE = {
  id: "demo-vve-001",
  name: "Garagepark De Linden",
  address: "Lindenlaan 15",
  city: "Amsterdam",
  postal_code: "1234 AB",
  type: "garage",
  total_units: 24,
  kvk_number: "12345678",
  iban: "NL91ABNA0417164300",
  created_at: "2025-01-01T00:00:00Z",
  created_by: "demo-user",
};

const DEMO_USER = {
  id: "demo-user",
  email: "hidde@example.nl",
  full_name: "Hidde van den Bergh",
};

const DEMO_MEMBER: Member = {
  id: "demo-member-001",
  user_id: "demo-user",
  vve_id: "demo-vve-001",
  full_name: "Hidde van den Bergh",
  email: "hidde@example.nl",
  phone: "06-12345678",
  role: "board_chair",
  is_active: true,
  joined_at: "2025-01-01T00:00:00Z",
};

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function VvEProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VvEContextValue["user"]>(null);
  const [loading, setLoading] = useState(true);
  const [currentVvE, setCurrentVvE] = useState<VvE | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const connected = isSupabaseConfigured();

  const loadData = useCallback(async () => {
    if (!connected) {
      // Demo mode
      setUser(DEMO_USER);
      setCurrentVvE(DEMO_VVE);
      setCurrentMember(DEMO_MEMBER);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      let authUser = null;
      try {
        const { data } = await supabase.auth.getUser();
        authUser = data?.user;
      } catch {
        // Auth call failed - fall back to demo
        setUser(DEMO_USER);
        setCurrentVvE(DEMO_VVE);
        setCurrentMember(DEMO_MEMBER);
        setLoading(false);
        return;
      }

      if (!authUser) {
        setUser(null);
        setCurrentVvE(null);
        setCurrentMember(null);
        setLoading(false);
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || "",
        full_name: authUser.user_metadata?.full_name,
      });

      // Get the user's first VvE membership
      const { data: memberRows } = await supabase
        .from("members")
        .select("*, vves(*)")
        .eq("user_id", authUser.id)
        .eq("is_active", true)
        .limit(1);

      const memberData = memberRows?.[0];
      if (memberData) {
        setCurrentMember({
          id: memberData.id,
          user_id: memberData.user_id,
          vve_id: memberData.vve_id,
          full_name: memberData.full_name,
          email: memberData.email,
          phone: memberData.phone,
          role: memberData.role,
          is_active: memberData.is_active,
          joined_at: memberData.joined_at,
        });

        const vveData = memberData.vves as Record<string, unknown>;
        if (vveData) {
          setCurrentVvE({
            id: vveData.id as string,
            name: vveData.name as string,
            address: vveData.address as string,
            city: vveData.city as string,
            postal_code: vveData.postal_code as string,
            type: vveData.type as VvE["type"],
            total_units: vveData.total_units as number,
            kvk_number: vveData.kvk_number as string | undefined,
            iban: vveData.iban as string | undefined,
            created_at: vveData.created_at as string,
            created_by: vveData.created_by as string,
          });
        }
      }
    } catch (err) {
      console.error("Failed to load VvE context:", err);
    } finally {
      setLoading(false);
    }
  }, [connected]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isBoard = currentMember?.role?.startsWith("board") || false;

  async function handleSignOut() {
    if (connected) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setCurrentVvE(null);
    setCurrentMember(null);
  }

  return (
    <VvEContext.Provider
      value={{
        user,
        loading,
        currentVvE,
        currentMember,
        isBoard,
        isConnected: connected,
        refreshVvE: loadData,
        signOut: handleSignOut,
      }}
    >
      {children}
    </VvEContext.Provider>
  );
}
