// Defines the TypeScript types for the Report model

export type TReport = {
  _id: string;
  reportedUser: string; // A User ObjectId. API can populate this.
  reportedBy: string; // A User ObjectId. API can populate this.
  reason: string;
  createdAt: string; // ISO date string
};
