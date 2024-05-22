enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

export type EnvironmentVariable = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

const getConfig = (
  environmentVariables: EnvironmentVariable,
  currentEnvironment: Environments,
) => {
  return {
    apiSettings: {
      PORT: Number.parseInt(environmentVariables.PORT || '3000'),
      LOCAL_HOST: environmentVariables.LOCAL_HOST || 'http://localhost:3000',
    },

    databaseSettings: {
      USE_MONGO: false,
      HOST: environmentVariables.POPOSTGRES_HOST,
      PORT: environmentVariables.POSTGRES_PORT,
      USER_NAME: environmentVariables.POSTGRES_USERNAME,
      PASSWORD: environmentVariables.POSTGRES_PASSWORD,
      DATABASE_NAME: environmentVariables.DATA_BASE,
    },

    environmentSettings: {
      currentEnv: currentEnvironment,
      isProduction: currentEnvironment === Environments.PRODUCTION,
      isStaging: currentEnvironment === Environments.STAGING,
      isTesting: currentEnvironment === Environments.TEST,
      isDevelopment: currentEnvironment === Environments.DEVELOPMENT,
    },

    jwtSettings: {
      jwtSecret: environmentVariables.JWT_SECRET,
      jwtRefreshSecret: environmentVariables.JWT_REFRESH_SECRET,
      accessTokenExpirationTime:
        environmentVariables.ACCESS_TOKEN_EXPIRATION_TIME!.toString() || `10s`,
      refreshTokenExpirationTime:
        environmentVariables.REFRESH_TOKEN_EXPIRATION_TIME!.toString() || `20s`,
      refreshTokenCookieMaxAge: 7 * 24 * 60 * 60 * 1000,
    },
  };
};

export default () => {
  const environmentVariables = process.env;

  console.log('process.env.ENV =', environmentVariables.ENV);
  const currentEnvironment: Environments =
    environmentVariables.ENV as Environments;

  return getConfig(environmentVariables, currentEnvironment);
};
