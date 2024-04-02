import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'fs';

export function initializeSwagger(app: INestApplication): void {
  // Configure Swagger UI with the DocumentBuilder and setup.
  const config = new DocumentBuilder()
    .setTitle('Boilerplate')
    .setDescription('Boilerplate Api description')
    .setVersion('v1')
    .addServer('http://localhost:5000/', 'Local environment')
    .addServer('https://staging.yourapi.com/', 'Staging')
    .addServer('https://production.yourapi.com/', 'Production')
    .addBearerAuth(
      {
        description:
          '[just text field] Please enter token in following format: Bearer <JWT>',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )

    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'local') {
    // Create the .postman folder if it doesn't exist
    mkdirSync('.backend-api', { recursive: true });

    // Write the Swagger JSON file to the .postman folder
    writeFileSync('.backend-api/swagger-spec.json', JSON.stringify(document));
  }

  SwaggerModule.setup('boilerplate', app, document);
}
