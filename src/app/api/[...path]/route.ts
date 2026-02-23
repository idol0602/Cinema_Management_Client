import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * BFF Proxy: Forward all /api/* requests to the backend.
 * - Forwards cookies (access_token) to backend for authentication
 * - Re-sets access_token cookie on the Next.js domain so middleware can read it
 * - Handles JSON, FormData, and other content types
 */
async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const backendPath = path.join("/");

  // Build backend URL with query params
  const url = new URL(`${BACKEND_URL}/${backendPath}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  // Build headers to forward
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  // Forward access_token cookie to backend
  const accessToken = request.cookies.get("access_token")?.value;
  if (accessToken) {
    headers.set("Cookie", `access_token=${accessToken}`);
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  // Forward body for non-GET/HEAD requests
  if (request.method !== "GET" && request.method !== "HEAD") {
    if (contentType?.includes("multipart/form-data")) {
      // For file uploads: forward as-is
      const formData = await request.formData();
      headers.delete("Content-Type"); // Let fetch set the boundary
      fetchOptions.body = formData;
    } else {
      // For JSON and other types
      fetchOptions.body = await request.text();
    }
  }

  try {
    const backendResponse = await fetch(url.toString(), fetchOptions);

    // Parse response
    const responseData = await backendResponse.text();
    let jsonData;
    try {
      jsonData = JSON.parse(responseData);
    } catch {
      jsonData = responseData;
    }

    const response =
      typeof jsonData === "string"
        ? new NextResponse(jsonData, { status: backendResponse.status })
        : NextResponse.json(jsonData, { status: backendResponse.status });

    // Forward Set-Cookie headers from backend → re-set on Next.js domain
    const setCookies = backendResponse.headers.getSetCookie();
    for (const cookie of setCookies) {
      if (cookie.startsWith("access_token=")) {
        const tokenMatch = cookie.match(/access_token=([^;]*)/);
        if (tokenMatch) {
          const tokenValue = tokenMatch[1];
          if (tokenValue) {
            // Set cookie on Next.js domain
            response.cookies.set("access_token", tokenValue, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 7 * 24 * 60 * 60, // 7 days (matches JWT_EXPIRES_IN)
            });
          } else {
            // Clear cookie (logout)
            response.cookies.set("access_token", "", {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 0,
            });
          }
        }
      }
    }

    return response;
  } catch (error) {
    console.error("[BFF Proxy Error]", error);
    return NextResponse.json(
      { success: false, message: "Backend service unavailable" },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}
