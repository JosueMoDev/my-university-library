import { prisma } from '@config';
import { GenreDataSource } from '@domain/datasources';
import { CreateGenreDto, PatchGenreDto, PaginationDto } from '@domain/dtos';
import { GenreEntenty, PaginationEntity } from '@domain/entities';
import { CustomError } from '@handler-errors';

export class GenreDataSourceImpl implements GenreDataSource {
  async create({ name }: CreateGenreDto): Promise<GenreEntenty> {
    await this.checkIfNameExist(name!);
    try {
      const genre = await prisma.genre.create({ data: { name } });
      return GenreEntenty.fromObject(genre);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  async patch({ id, name }: PatchGenreDto): Promise<GenreEntenty> {
    if (!name) throw CustomError.badRequest('There is nothing to modify');
    try {
      await this.findOne(id);
      await this.checkIfNameExist(name!);
      const genre = await prisma.genre.update({
        where: { id },
        data: { name },
      });
      return GenreEntenty.fromObject(genre);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  async changeRecordStatus(id: string): Promise<Object> {
    try {
      const { name, isActive } = await this.findOne(id);
      await prisma.genre.update({
        where: { id },
        data: {
          isActive: !isActive,
        },
      });
      return {
        message: `The genre ${name} was ${
          isActive ? 'disabled' : 'enabled'
        } successfully`,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async findOne(id: string): Promise<GenreEntenty> {
    try {
      const genre = await prisma.genre.findFirst({ where: { id } });
      if (!genre) throw CustomError.badRequest('Genre not found');
      return GenreEntenty.fromObject(genre);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  async findMany(
    dto: PaginationDto,
  ): Promise<{ pagination: PaginationEntity; genres: GenreEntenty[] }> {
    try {
      const { page, pageSize } = dto;
      const [genres, total] = await Promise.all([
        prisma.genre.findMany({
          skip: PaginationEntity.dinamycOffset(page, pageSize),
          take: pageSize,
        }),
        prisma.genre.count(),
      ]);

      const pagination = PaginationEntity.setPagination({ ...dto, total });
      const genresMapped = genres.map(GenreEntenty.fromObject);
      return { pagination, genres: genresMapped };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  async checkIfNameExist(name: string) {
    try {
      const _name = await prisma.genre.findFirst({ where: { name } });
      if (_name) throw CustomError.badRequest(`${name} already exist`);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
