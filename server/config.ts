export class ConfigError extends Error {
  constructor(name: string) {
    super(`Missing or invalid environment variable: ${name}`);
    this.name = "ConfigError";
  }
}

const required = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) throw new ConfigError(name);

  return value;
};

export const getDatabaseUrl = (): string => required("DATABASE_URL");
