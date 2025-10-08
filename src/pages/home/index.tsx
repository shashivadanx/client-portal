import useGetUserData from "@/hooks/use-get-user-data";

export default function Home() {
  const { data, isLoading, isError } = useGetUserData();
  if (isLoading) return <div>Loading user...</div>;
  if (isError || !data) return <div>Failed to load user.</div>;

  const { name, email, role, avatarUrl, createdAt } = data;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          maxWidth: 420,
          width: "100%",
          padding: 24,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          background: "#fff",
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${name} avatar`}
            width={88}
            height={88}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            }}
          />
        ) : null}
        <h1 style={{ margin: 0 }}>Welcome, {name}</h1>
        <p style={{ margin: 0, color: "#6b7280" }}>{email}</p>
        <p style={{ margin: 0 }}>Role: {role}</p>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Member since: {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
