export type FormErrors<T> = {
  _errors?: string[];
} & {
  [K in keyof T]?: FormErrors<T[K]>;
};
