export interface CreativeWork {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;

  size?: "small" | "medium" | "large";

  tools?: string[];
}