export function maxValidationMessage(item: string, max: number) {
  return `${item} must be at most ${max} characters long`;
}

export function minValidationMessage(item: string, min: number) {
  return `${item} must be at least ${min} characters long`;
}
