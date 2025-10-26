// Defines the TypeScript types for the Message model

export type TMessage = {
  _id: string;
  session: string; // A Session ObjectId
  sender: string; // A User ObjectId. API can populate this.
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
