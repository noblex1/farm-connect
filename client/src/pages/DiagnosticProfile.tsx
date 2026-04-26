import { useCurrentUser } from "@/hooks/useCurrentUser";
import { sessionStore } from "@/lib/session";
import type { ApiUser } from "@/types/api";

const DiagnosticProfile = () => {
  const { data, isLoading } = useCurrentUser();
  const token = sessionStore.getToken();
  const cachedUser = sessionStore.getUser<ApiUser>();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Profile Diagnostic</h1>

      <div className="space-y-4">
        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Token</h2>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {token ? `${token.substring(0, 50)}...` : "No token"}
          </pre>
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">localStorage User</h2>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(cachedUser, null, 2)}
          </pre>
          <p className="mt-2">
            <strong>profilePicture:</strong>{" "}
            {cachedUser?.profilePicture || "❌ Empty"}
          </p>
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">API Response (useCurrentUser)</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(data?.user, null, 2)}
              </pre>
              <p className="mt-2">
                <strong>profilePicture:</strong>{" "}
                {data?.user?.profilePicture || "❌ Empty"}
              </p>
            </>
          )}
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Image Display Test</h2>
          {data?.user?.profilePicture ? (
            <div>
              <p className="mb-2">✅ URL exists: {data.user.profilePicture}</p>
              <img
                src={data.user.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                onError={(e) => {
                  console.error("Image failed to load:", data.user.profilePicture);
                  e.currentTarget.style.border = "4px solid red";
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", data.user.profilePicture);
                }}
              />
            </div>
          ) : (
            <p>❌ No profilePicture URL</p>
          )}
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Actions</h2>
          <div className="space-x-2">
            <button
              onClick={() => {
                console.log("=== Manual localStorage Check ===");
                console.log("Raw value:", localStorage.getItem("farm-market-user"));
                console.log("Parsed:", sessionStore.getUser<ApiUser>());
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Log localStorage
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Clear & Reload
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiagnosticProfile;
