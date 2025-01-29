import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PokemonsService extends PrismaClient implements OnModuleInit {

	private readonly API_URL = 'https://pokeapi.co/api/v2/';

	constructor(private httpService: HttpService) {
		super();
	}

	onModuleInit() {
		this.$connect();
		console.log('Connected to the database');
	}

	create(createPokemonDto: CreatePokemonDto) {
		
		return this.pokemons.create({ data: createPokemonDto });
	}

	async findAll( paginationDto: PaginationDto) {

		const { page, limit } = paginationDto;
		const skip = (page - 1) * limit;
		const total_pokemons = await this.pokemons.count({where: {status : true}});

		const pages_total = Math.ceil(total_pokemons / limit);

		const data = await this.pokemons.findMany({
			skip,
			take: limit,
			where: { status: true },
		});

		return {
			total_pokemons,
			data,
			page,
			pages_total,
		}
	}

	async findTotal() {
		
		return this.pokemons.count();
	}

	async findOne(id: number) {
		
		const pokemon = await this.pokemons.findUnique({ where: { id,status:true } });

		if (!pokemon) {
			throw new RpcException(`Pokemon with id ${id} not found`);
		}

		return pokemon;
	}

	update(id: number, updatePokemonDto: UpdatePokemonDto) {

		const { id: idDto, ...data } = updatePokemonDto;
		
		return this.pokemons.update({ where: { id,status:true }, data: data });
	}

	async removesoft(id: number) {
		
		const pokemon = await this.pokemons.findUnique({ where: { id,status:true } });

		if (!pokemon) {
			throw new RpcException(`Pokemon with id ${id} not found`);
		}

		await this.pokemons.update({
			where: { id },
			data: { status: false },
		});

		return pokemon;
	}

	async remove() {

		const pokemon = await this.pokemons.deleteMany();

		return pokemon;
	}

	async getPokemonType(type: string = '') {
		
		try {
			const response = await lastValueFrom(
			  this.httpService.get(`${this.API_URL}type/${type}`)
			);
			
			return response.data;
		} catch (error) {
			throw new Error(`Error fetching Pokémon: ${error.message}`);
		}
	}
}
