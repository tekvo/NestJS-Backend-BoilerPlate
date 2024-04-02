export function isValidEmail(email: string): boolean {
  const pattern = /^[^@+]*@[^@+]+$/;
  return pattern.test(email);
}
