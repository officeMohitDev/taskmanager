import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";

export async function middleware(request: NextRequest) {
  const protectedRoutes = [
    "/leaderboards",
    "/update",
    "/tasks",
    "/about",
    "/users",
    "/profile",
    "/copyform",
    "/projects",
  ];

  const publicRoutes = ["/login", "/register"];
  const { pathname } = request.nextUrl;
  const session = await auth();

  if (pathname === "/") {
    if (session?.user) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url).toString());
    }
  }

  const isPrivateRoute = (pathname: string) => {
    for (let route of protectedRoutes) {
      if (pathname.includes(route)) {
        return true;
      }
    }
    return false;
  };

  const isPublicRoute = (pathname: string) => {
    for (let route of publicRoutes) {
      if (pathname.includes(route as string)) {
        return true;
      }
    }
    return false;
  };

  if (isPrivateRoute(pathname)) {
    if (session?.user) {
      // If the route is protected and the user has a token, continue to the next middleware or route handler.
      return NextResponse.next();
    } else {
      // If the route is protected and the user doesn't have a token, redirect to the login page.
      return NextResponse.redirect(new URL("/login", request.url).toString());
    }
  }

  if (isPublicRoute(pathname)) {
    if (session?.user) {
      // If the route is public and the user has a token, redirect to the "mypage" route.
      return NextResponse.redirect(new URL("/", request.url).toString());
    } else {
      // If the route is public and the user doesn't have a token, proceed without any specific response modification.
      return;
    }
  }

  // For all other routes that are neither protected nor public, continue to the next middleware or route handler.
  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
