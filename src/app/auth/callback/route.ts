import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Create user profile in Prisma if it doesn't exist and we have a session
    if (data?.session) {
      const userId = data.session.user.id;

      const existingProfile = await prisma.profile.findUnique({
        where: { userId },
      });

      if (!existingProfile) {
        await prisma.profile.create({
          data: {
            userId,
            role: "IMPORTADOR",
          },
        });
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
