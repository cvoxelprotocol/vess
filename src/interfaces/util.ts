interface RemoveKeys {
  [k: string]: unknown
}

export type RemoveUnknown<T> = Omit<T, keyof RemoveKeys>
