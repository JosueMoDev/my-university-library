import { CreateLoanDto, PatchLoanDto, MongoId, PaginationDto } from "@domain/dtos";
import { LoanEntity, PaginationEntity } from "@domain/entities";
import { LoanRepository } from "@domain/repositories";

export class LoanService {
  constructor(private readonly repository: LoanRepository) {}

  async create(dto: CreateLoanDto): Promise<LoanEntity> {
    return await this.repository.create(dto);
  }
  async patch(dto: PatchLoanDto): Promise<LoanEntity> {
    return await this.repository.patch(dto);
  }
  async return(id: MongoId): Promise<boolean> {
    return await this.repository.return(id);
  }
  async findOne(id: MongoId): Promise<LoanEntity> {
    return await this.repository.findOne(id);
  }
  async findMany(
    dto: PaginationDto,
  ): Promise<{ pagination: PaginationEntity; loans: LoanEntity[] }> {
    return await this.repository.findMany(dto);
  }
}