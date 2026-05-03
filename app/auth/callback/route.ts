import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/b2c/workspace";
  const origin = requestUrl.origin;

  console.log(`Auth callback triggered: ${request.url}`);
  console.log(`Code present: ${!!code}, Next: ${next}, Origin: ${origin}`);

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      console.log("Successfully exchanged code for session");
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log(`Syncing user to DB: ${user.email} (ID: ${user.id})`);
          const { db } = await import("@/lib/db");
          
          const fullName = user.user_metadata.full_name || user.email!.split("@")[0];
          
          await db.$transaction(async (tx) => {
            const dbUser = await tx.user.upsert({
              where: { email: user.email! },
              update: { 
                fullName: fullName,
                updatedAt: new Date(),
              },
              create: {
                id: user.id,
                email: user.email!,
                fullName: fullName,
                role: "STUDENT",
              },
            });

            if (dbUser.role === "STUDENT") {
              await tx.studentProfile.upsert({
                where: { userId: dbUser.id },
                update: {},
                create: {
                  userId: dbUser.id,
                  status: "ONBOARDING",
                },
              });
            }
          });
          
          console.log("User and profile sync successful");
        }
      } catch (dbError) {
        console.error("Database sync error (non-fatal for login):", dbError);
      }

      const redirectUrl = new URL(next, origin);
      console.log(`Redirecting to final destination: ${redirectUrl.toString()}`);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.error("Auth exchange error:", exchangeError.message);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, origin));
    }
  }

  console.error("Authentication failed: No code provided in URL");
  return NextResponse.redirect(new URL("/login?error=no_code", origin));
}
