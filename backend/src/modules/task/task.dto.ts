export interface TaskResponseDTO {
  id: string;
  title: string;
  projectId: string;
  ownerId: string;
  status: string;
  priority: string | null;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
