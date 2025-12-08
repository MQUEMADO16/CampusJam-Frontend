// Defines the TypeScript types for the Message model
import { TUser } from "./user.types";

export type TMessage = {
  _id: string;
  content: string;
  // Sender can be just an ID string OR a populated User object
  sender: string | TUser; 
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // Present only if it's a message in a Jam Session
  session?: string; 

  // Present only if it's a DM between users
  recipient?: string | TUser; 
  read?: boolean; // To track if the DM has been read
};