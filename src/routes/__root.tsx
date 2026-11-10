import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { PropStoreProvider } from "@/components/prop/store";
import { Toaster } from "@/components/ui/sonner";

const SUPPORT_EMAIL = "support@sentinel.example";
const NODE_ID = "relay-07";

function NotFoundComponent() {
  const timestamp = new Date().toISOString();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left text-xs text-muted-foreground">
          <dt className="font-medium text-foreground">Status</dt>
          <dd>404 Not Found</dd>
          <dt className="font-medium text-foreground">Node</dt>
          <dd>{NODE_ID}</dd>
          <dt className="font-medium text-foreground">Timestamp</dt>
          <dd><time dateTime={timestamp}>{timestamp}</time></dd>
          <dt className="font-medium text-foreground">Support</dt>
          <dd><a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></dd>
        </dl>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const timestamp = new Date().toISOString();
  const reference = `ERR-${timestamp.slice(0, 10).replace(/-/g, "")}-${Math.abs(
    hashString(String(error?.message ?? "unknown")),
  )
    .toString(16)
    .slice(0, 6)
    .toUpperCase()}`;

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left text-xs text-muted-foreground">
          <dt className="font-medium text-foreground">Reference</dt>
          <dd><code>{reference}</code></dd>
          <dt className="font-medium text-foreground">Node</dt>
          <dd>{NODE_ID}</dd>
          <dt className="font-medium text-foreground">Timestamp</dt>
          <dd><time dateTime={timestamp}>{timestamp}</time></dd>
          <dt className="font-medium text-foreground">Support</dt>
          <dd><a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></dd>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          Hint: include the reference code above if you contact support.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return h;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0b0f14" },
      { name: "robots", content: "noindex, nofollow" },
      { title: "Sentinel" },
      { name: "description", content: "Sentinel console." },
      { name: "author", content: "Sentinel Operations" },
      { name: "application-name", content: "Sentinel" },
      { property: "og:site_name", content: "Sentinel" },
      { property: "og:title", content: "Sentinel" },
      { property: "og:description", content: "Sentinel console." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@sentinel" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "canonical", href: "/" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <PropStoreProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="bottom-right" />
      </PropStoreProvider>
    </QueryClientProvider>
  );
}
