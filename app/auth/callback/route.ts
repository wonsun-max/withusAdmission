import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/b2c/workspace";

  console.log(`Auth callback triggered with code: ${code ? "present" : "absent"}`);

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      console.log("Successfully exchanged code for session");
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log(`Syncing user to DB: ${user.email}`);
          const { db } = await import("@/lib/db");
          
          const fullName = user.user_metadata.full_name || user.email!.split("@")[0];
          
          // Use a transaction to ensure both User and StudentProfile are created
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

            // If it's a student, ensure they have a profile
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
        // We continue anyway so the user is at least logged into Supabase
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
      const redirectUrl = new URL(next, baseUrl);
      
      console.log(`Redirecting authenticated user to: ${redirectUrl.toString()}`);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.error("Auth exchange error:", exchangeError);
    }
  }

  console.error("Authentication failed or no code provided");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
  return NextResponse.redirect(new URL("/login?error=auth_failed", baseUrl));
}
