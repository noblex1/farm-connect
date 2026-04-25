import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export const OfflineNotice = () => {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border bg-accent px-4 py-3 font-bold text-accent-foreground shadow-touch" role="status">
      <WifiOff className="size-6" aria-hidden="true" />
      <span>Offline mode. Saved data still shows.</span>
    </div>
  );
};
