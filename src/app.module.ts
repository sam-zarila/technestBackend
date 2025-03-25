import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from './payments/payments.module';


import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true
      }
    ),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',  // Change from 'mysql' to 'postgres'
    //   host: 'localhost', // Keep as 'localhost' for local development
    //   port: 5432,        // Default PostgreSQL port
    //   username: 'postgres',  // Change to your PostgreSQL username
    //   password: 'tech-nest265', // Change to your PostgreSQL password
    //   database: 'snapbacks_db',  // Same database name
    //   entities: [], // Keep your entities
    //   synchronize: true, // Auto-sync entities (disable in production)
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-cv6t0g56l47c73dbilr0-a.oregon-postgres.render.com',
      port: 5432,
      username: 'paysmart_backend_user',
      password: 'bLg5kfZXFLcuywytNftc566Q7yV0SsY5',
      database: 'paysmart_backend',
      entities: [ ], // Add all your entities
      synchronize: true, // Set to false in production
      ssl: true, // Required for Render-hosted PostgreSQL
      extra: {
        ssl: {
          rejectUnauthorized: false, // Avoids SSL issues
        },
      },
    }),
  
    PaymentsModule,
    

    
   
  ],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {}
