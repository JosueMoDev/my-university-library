import { LoanDataSource } from "@domain/datasources";
import { LoanRepository } from "@domain/repositories";
import { CreateLoanDto, PatchLoanDto, PaginationDto } from "@domain/dtos";
import { LoanEntity, PaginationEntity } from "@domain/entities";

export class LoanRepositoryImpl implements LoanRepository {
  constructor(private readonly datasource: LoanDataSource) {}

  async create(dto: CreateLoanDto): Promise<LoanEntity> {
    return await this.datasource.create(dto);
  }
  async patch(dto: PatchLoanDto): Promise<LoanEntity> {
    return await this.datasource.patch(dto);
  }
  async return(id: string): Promise<Object> {
    return await this.datasource.return(id);
  }
  async findOne(id: string): Promise<LoanEntity> {
    return await this.datasource.findOne(id);
  }
  async findMany(
    dto: PaginationDto,
  ): Promise<{ pagination: PaginationEntity; loans: LoanEntity[] }> {
    return await this.datasource.findMany(dto);
  }
}