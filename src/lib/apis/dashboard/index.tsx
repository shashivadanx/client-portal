export type UserData = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  avatarUrl?: string;
  createdAt: string;
};

export async function getUserData(): Promise<UserData> {
  await new Promise((r) => setTimeout(r, 300));

  return {
    id: "u_12345",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "admin",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
    createdAt: new Date("2024-01-15T10:20:30Z").toISOString(),
  };
}
