module.exports={
    "name":"default",
    "type": "postgres",
    "host": process.env.POSTGRES_HOST,
    "port": process.env.POSTGRES_PORT,
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "entities": ["dist/**/*.model{.ts,.js}"],
    "migrations": ["dist/migrations/*{.ts,.js}"],
    "synchronize": false,
    "migrationsTableName":"migrations",
    "migrationsRun":true,
    "cli":{
        "migrationsDir":"src/migrations"
    }
  }