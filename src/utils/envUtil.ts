export const getEnv = (key: string) => {
  const value = process.env[key]
  return value
}
