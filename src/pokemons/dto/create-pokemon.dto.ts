import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreatePokemonDto {
	@IsString()
	public name: string;

	@IsString()
	public type: string;

	@IsNumber({
		maxDecimalPlaces: 0,
	})
	@IsPositive()
	@Min(1)
	@Type(() => Number)
	public level: number;

	@IsString()
	public trainer: string;
}
