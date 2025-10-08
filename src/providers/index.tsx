import { Toaster } from "sonner";
import ClientQueryProvider from "./client-query-provider";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ClientQueryProvider>
        <Toaster />
        {children}
      </ClientQueryProvider>
    </div>
  );
}
