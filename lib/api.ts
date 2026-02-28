import { fetchHandler } from "@/lib/handlers/fetch";
import { IUser } from "@/database/user.model";
import { IAccount } from "@/database/account.model";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = {
  users: {
    getAll: () => fetchHandler(`${API_BASE_URL}/users`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
    getByEmail: (email: string) =>
      fetchHandler(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    create: (userData: IUser) =>
      fetchHandler(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: (id: string, userData: IUser) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),
    delete: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`, { method: "DELETE" }),
  },
  accounts: {
    getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/email`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
    create: (userData: IAccount) =>
      fetchHandler(`${API_BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: (id: string, userData: IAccount) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),
    delete: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`, { method: "DELETE" }),
  },
};
