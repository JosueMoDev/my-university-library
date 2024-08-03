import { BcryptJsPlugin, prisma } from '@config';
import { UserDataSource } from '@domain/datasources';
import { CreateUserDto, PatchUserDto, PaginationDto } from '@domain/dtos';
import { UserEntity, PaginationEntity, LoanEntity } from '@domain/entities';
import { CustomError } from '@handler-errors';

export class UserDataSourceImpl implements UserDataSource {
  async create({
    password: _password,
    ...dto
  }: CreateUserDto): Promise<UserEntity> {
    await this.#findUserByEmail(dto.email);
    try {
      const password = BcryptJsPlugin.hashPassword(_password);
      const user = await prisma.user.create({
        data: {
          ...dto,
          password,
        },
      });
      return UserEntity.fromObject(user);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  async patch({ id, ...rest }: PatchUserDto): Promise<UserEntity> {
    await this.findOne(id);
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...rest,
        },
      });
      return UserEntity.fromObject(user);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  async hardDelete(id: string): Promise<any> {
    const { name } = await this.findOne(id);
    try {
      await prisma.user.delete({ where: { id } });
      return {
        message: `User '${name}' deleted successfully`,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  async SoftDelete(id: string): Promise<any> {
    const { isActive, name } = await this.findOne(id);
    try {
      await prisma.user.update({
        where: { id },
        data: {
          isActive: !isActive,
        },
      });
    
      return {
        message: `User '${name}' ${
          isActive ? 'inactivated' : 'activated'
        } successfully`,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  async findOne(id: string): Promise<UserEntity> {
    const existUser = await prisma.user.findFirst({
      where: { id },
    });
    if (!existUser) throw CustomError.badRequest('Any user was found');
    return UserEntity.fromObject(existUser);
  }
  async findMany(
    dto: PaginationDto,
  ): Promise<{ pagination: PaginationEntity; users: UserEntity[] }> {
    const { page, pageSize } = dto;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: PaginationEntity.dinamycOffset(page, pageSize),
        take: pageSize,
        where: {},
      }),
      prisma.user.count(),
    ]);

    const pagination = PaginationEntity.setPagination({ ...dto, total });
    const userMapped = users.map(UserEntity.fromObject);
    return { pagination, users: userMapped };
  }

  async getLoanBooks(dto: PaginationDto): Promise<{
    pagination: PaginationEntity;
    loans: LoanEntity[];
  }> {
    throw 'Not Implemented'
  }

  async #findUserByEmail(email: string): Promise<void> {
    const emailExist = await prisma.user.findFirst({
      where: { email },
    });
    if (emailExist) throw CustomError.badRequest('User already exist');
  }
}
