export interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(public readonly props: UserProps) {}
}
