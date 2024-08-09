import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ItemsModule } from './items/items.module';
import { ListItemModule } from './list-item/list-item.module';
import { ListsModule } from './lists/lists.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: false,
        plugins: [
          process.env.STATE === 'dev' ? ApolloServerPluginLandingPageLocalDefault() : ApolloServerPluginLandingPageProductionDefault()],
        context({ req }) {
          const token = req.headers.authorization?.replace('bearer ', '');

          if (!token) throw new Error('No token provided');

          const payload = jwtService.decode(token);
          if (!payload) throw new Error('Token expired');

        }
      })
    }),
    TypeOrmModule.forRoot({
      ssl: (process.env.STATE === 'prod') ? {
        rejectUnauthorized: false,
        sslmode: 'require',
      } : false as any,
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
