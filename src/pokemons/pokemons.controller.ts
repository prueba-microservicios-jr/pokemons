import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseIntPipe,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('pokemons')
export class PokemonsController {
	constructor(private readonly pokemonsService: PokemonsService) {}

	//@Post()
	@MessagePattern({ cmd: 'create_pokemon' })
	create(@Payload() createPokemonDto: CreatePokemonDto) {
		return this.pokemonsService.create(createPokemonDto);
	}

	//@Get()
	@MessagePattern({ cmd: 'get_all_pokemons' })
	findAll(@Payload() paginationDto: PaginationDto) {
		console.log(paginationDto);
		return this.pokemonsService.findAll(paginationDto);
	}

	@MessagePattern({ cmd: 'get_total_pokemons' })
	findTotal() {
		return this.pokemonsService.findTotal();
	}

	//@Get(':id')
	@MessagePattern({ cmd: 'get_one_pokemon' })
	findOne(@Payload('id', ParseIntPipe) id: number) {
		return this.pokemonsService.findOne(+id);
	}

	//@Patch(':id')
	@MessagePattern({ cmd: 'update_pokemon' })
	//update(@Payload('id', ParseIntPipe) id: number, @Body() updatePokemonDto: UpdatePokemonDto) {
	update(@Payload() updatePokemonDto: UpdatePokemonDto) {
		return this.pokemonsService.update(updatePokemonDto.id, updatePokemonDto);
	}

	//@Delete(':id')
	@MessagePattern({ cmd: 'delete_pokemon' })
	removesoft(@Payload('id', ParseIntPipe) id: number) {
		return this.pokemonsService.removesoft(+id);
	}

	//@Delete(':id')
	@MessagePattern({ cmd: 'delete_all_pokemon' })
	remove() {
		return this.pokemonsService.remove();
	}

	// Execute migrate
	//@Get('execute/migrate')
	@MessagePattern({ cmd: 'execute_migrate_pokemon' })
	async migrate() {

		const types = await this.pokemonsService.getPokemonType();

		for (const type of types.results) {

			const result_type = await this.pokemonsService.getPokemonType(type.name);

			
			for (const data of result_type.pokemon) {

				const { name } = data.pokemon;
				
				const data_create:CreatePokemonDto = {
					name,
					type: type.name,
					level: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
					trainer: 'Ash Ketchum',
				}

				await this.pokemonsService.create(data_create);
			}
		}

		return 'Migrate success';
		
	}
}
