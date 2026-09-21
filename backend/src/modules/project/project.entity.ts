export interface ProjectProps {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Project {
  constructor(public readonly props: ProjectProps) {}
}
