import { SequelizeModuleOptions } from '@nestjs/sequelize';

const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  autoLoadModels: true,
  synchronize: true,
  logging: console.log,
};

export default sequelizeConfig;
