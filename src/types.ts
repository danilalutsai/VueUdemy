export interface Photo {
  id: number;
  url: string;
  isFavourite: boolean;
}

export interface Task {
  id: number;
  description: string;
  done: boolean;
  priority: Priority;
}

export type Priority = "high" | "medium" | "low" | ""
