export function maxValidationMessage(item: string, max: number) {
  return `${item} must be less than ${max} characters`;
}

export function minValidationMessage(item: string, min: number) {
  return `${item} should be more than ${min} characters`;
}
