export interface SessionProps {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

export class Session {
  constructor(public readonly props: SessionProps) {}
}
