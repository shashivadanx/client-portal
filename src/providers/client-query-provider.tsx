import React from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { handleServerError } from "@/lib/handle-server-error";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function ClientQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: (error) => {
          handleServerError(error);
          if (error instanceof AxiosError) {
            if (error.response?.status === 304) {
              // optional toast
            }
          }
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof AxiosError) {
          switch (error.response?.status) {
            case 401: {
              toast.error("Session expired!");
              const redirect = encodeURIComponent(window.location.href);
              window.location.assign(`/login?redirect=${redirect}`);
              break;
            }
            case 403: {
              window.location.replace("/403");
              break;
            }
            case 500: {
              toast.error("Internal Server Error");
              break;
            }
          }
        }
      },
    }),
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
