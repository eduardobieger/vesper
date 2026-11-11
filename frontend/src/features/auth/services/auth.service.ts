import { api } from "../../../lib/api";

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  const response = await api.post("/users", {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  });

  return response.data;
}
