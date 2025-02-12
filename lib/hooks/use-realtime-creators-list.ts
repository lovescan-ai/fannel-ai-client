import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Creator } from "@prisma/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useRealtimeCreators = (userId?: string) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (userId) {
          const { data: creatorsData, error: creatorsError } = await supabase
            .from("Creator")
            .select("*")
            .eq("userId", userId);

          if (creatorsError) {
            console.error("Error fetching creators:", creatorsError);
          } else {
            setCreators(creatorsData as Creator[]);
          }
        }
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const channel = supabase
      .channel("creators-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Creator" },
        (payload: any) => {
          console.log("Change received!", payload);
          if (userId && payload.new.userId === userId) {
            setCreators((prevCreators) => {
              switch (payload.eventType) {
                case "INSERT":
                  return [...prevCreators, payload.new];
                case "UPDATE":
                  return prevCreators.map((creator) =>
                    creator.id === payload.new.id ? payload.new : creator
                  );
                case "DELETE":
                  return prevCreators.filter(
                    (creator) => creator.id !== payload.old.id
                  );
                default:
                  return prevCreators;
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  return { creators, loading };
};
