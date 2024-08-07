import {
  CreateAuthorDto,
  MongoId,
  PaginationDto,
  PatchAuthorDto,
} from '@domain/dtos';
import { AuthorService } from './author.service';
import { Request, Response } from 'express';
import { HandlerError } from '@handler-errors';

export class AuthorController {
  constructor(private readonly service: AuthorService) {}
  create = (request: Request, response: Response) => {
    const [error, dto] = CreateAuthorDto.validate(request.body);
    if (error) return response.status(400).json({ error });
    this.service
      .create(dto!)
      .then((data) => response.json(data))
      .catch((error) => {
        const { statusCode, errorMessage } = HandlerError.hasError(error);
        return response.status(statusCode).json({ error: errorMessage });
      });
  };

  patch = (request: Request, response: Response) => {
    const [error, dto] = PatchAuthorDto.validate(request.body);
    if (error) return response.status(400).json({ error });
    this.service
      .patch(dto!)
      .then((data) => response.json(data))
      .catch((error) => {
        const { statusCode, errorMessage } = HandlerError.hasError(error);
        return response.status(statusCode).json({ error: errorMessage });
      });
  };

  changeRecordStatus = (request: Request, response: Response) => {
    const [error, id] = MongoId.validate(request.params.id);
    if (error) return response.status(400).json({ error });
    this.service
      .changeRecordStatus(id!)
      .then((data) => response.json(data))
      .catch((error) => {
        const { statusCode, errorMessage } = HandlerError.hasError(error);
        return response.status(statusCode).json({ error: errorMessage });
      });
  };

  findOne = (request: Request, response: Response) => {
    const [error, id] = MongoId.validate(request.params.id);
    if (error) return response.status(400).json({ error });
    this.service
      .findOne(id!)
      .then((data) => response.json(data))
      .catch((error) => {
        const { statusCode, errorMessage } = HandlerError.hasError(error);
        return response.status(statusCode).json({ error: errorMessage });
      });
  };

  findMany = (request: Request, response: Response) => {
    const [error, dto] = PaginationDto.validate(
      request.query,
      request.originalUrl,
    );
    if (error) return response.status(400).json({ error });
    this.service
      .findMany(dto!)
      .then((data) => response.json(data))
      .catch((error) => {
        const { statusCode, errorMessage } = HandlerError.hasError(error);
        return response.status(statusCode).json({ error: errorMessage });
      });
  };
}
