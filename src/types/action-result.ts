export type ActionResult<T extends object = object> =
  | ({ success: true } & T)
  | { success: false; message: string; errors?: Record<string, string[]> };
