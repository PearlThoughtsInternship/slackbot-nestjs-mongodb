export const config = () => ({
    database: {
        "type": "postgres",
        "host": process.env.POSTGRES_HOST,
        "port": parseInt(process.env.POSTGRES_PORT),
        "username": process.env.POSTGRES_USER,
        "password": process.env.POSTGRES_PASSWORD,
        "database": process.env.POSTGRES_DATABASE,
        "autoLoadEntities": true,
        "migrations": ["dist/migrations/*{.ts,.js}"],
        "logging":true,
        "synchronize": false,
        "migrationsTableName":"migrations",
        "migrationsRun":true,
        "cli":{
            "migrationsDir":"src/migrations"
        }
  }
});