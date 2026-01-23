export type PrismaTaskRecord = {
  id: string;
  title: string;
  status: string;
  ownerProfileId: string;
  createdAt: Date;
  completedAt: Date | null;
};
