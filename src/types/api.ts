export interface ApiResponse<T> {
  message: string;
  user?: T;
}
