import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    path: string[];
}

interface RouteContext {
    params: Promise<RouteParams>;
}

const API_BASE_URL = "https://apiquiz.ambisiusacademy.com/api/v1";

async function handleRequest(
    req: NextRequest,
    context: RouteContext
): Promise<NextResponse> {
    try {
        const { path } = await context.params;
        const urlString = `${API_BASE_URL}/${path.join("/")}`;

        let body: unknown = undefined;
        const contentType = req.headers.get("content-type");

        if (
            req.method !== "GET" &&
            req.method !== "DELETE" &&
            contentType?.includes("application/json")
        ) {
            try {
                body = await req.json();
            } catch {
                body = null;
            }
        }

        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");

        const authHeader = req.headers.get("Authorization");
        if (authHeader) {
            headers.set("Authorization", authHeader);
        }

        const backendResponse = await fetch(urlString, {
            method: req.method,
            headers: headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const resContentType = backendResponse.headers.get("content-type");
        let responseData;

        if (resContentType && resContentType.includes("application/json")) {
            responseData = await backendResponse.json();
        } else {
            const textBody = await backendResponse.text();
            console.error("[Proxy] Non-JSON Response:", textBody.substring(0, 200));
            responseData = {
                success: false,
                error: `Server Error (${backendResponse.status}). Backend mungkin sedang mengalami gangguan.`,
                details: textBody.substring(0, 100)
            };
        }

        return NextResponse.json(responseData, { status: backendResponse.status });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error
            ? error.message
            : "Unknown Internal Proxy Error";

        console.error("[Proxy Error]:", errorMessage);

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;