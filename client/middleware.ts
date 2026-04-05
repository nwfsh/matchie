import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        const session = await auth()
        session.protect()
    }
})

export const config = {
    matcher: ['/((?!_next|.*\\..*).*)'],
}