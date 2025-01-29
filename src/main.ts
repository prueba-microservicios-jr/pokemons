import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { evns } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
	/*const app = await NestFactory.create(AppModule);*/

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
		  transport: Transport.TCP,
		  options: {
			port: evns.port,
		  },
		},
	  );

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	await app.listen();
	//await app.listen(evns.port);
	console.log(`Microservices is running on: ${evns.port}`);
}
bootstrap();
