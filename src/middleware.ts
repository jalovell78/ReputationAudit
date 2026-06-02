import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    // 1. Resolve tenant
    let tenant: 'repstanding' | 'perception_mirror' = 'repstanding';
    const url = request.nextUrl;
    const tenantParam = url.searchParams.get('tenant');
    let hasNewOverride = false;

    if (tenantParam === 'perception_mirror' || tenantParam === 'repstanding') {
        tenant = tenantParam;
        hasNewOverride = true;
    } else {
        const cookieOverride = request.cookies.get('tenant_override')?.value;
        if (cookieOverride === 'perception_mirror' || cookieOverride === 'repstanding') {
            tenant = cookieOverride;
        } else {
            const host = request.headers.get('host') || '';
            if (host.includes('theperceptionmirror.com') || host.includes('perception-mirror') || host.includes('perceptionmirror')) {
                tenant = 'perception_mirror';
            }
        }
    }

    // 2. Set headers on the request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-source', tenant);
    
    const modifiedRequest = new NextRequest(request, {
        headers: requestHeaders,
    });

    // 3. Call updateSession (which handles Supabase auth session)
    const response = await updateSession(modifiedRequest);

    // 4. Set headers on response for client-side headers reading (if needed)
    response.headers.set('x-tenant-source', tenant);

    // 5. If we set a new override via query param, set it in the response cookies
    if (hasNewOverride && tenantParam) {
        response.cookies.set('tenant_override', tenantParam, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

