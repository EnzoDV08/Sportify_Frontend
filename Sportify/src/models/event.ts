export interface Event {
  title: string;
  date: string; // Use `string` if you're returning ISO date from the API
  description?: string;
  location: string;
  type?: string;
  visibility?: string;
  status?: string;
}