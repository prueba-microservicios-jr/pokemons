import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {

    @IsNumber({
		maxDecimalPlaces: 0,
	})
    @IsPositive()
    id: number;
}
