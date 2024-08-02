import compression from 'compression';
import express, { Router } from 'express';

interface serverConfig {
  port: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly routes: Router;

  constructor(args: serverConfig) {
    const { port, routes } = args;

    (this.port = port), (this.routes = routes);
  }

  async start() {
    //* Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
    //* Routes
    this.app.use('/api', this.routes);
    this.serverListener = this.app.listen(this.port, () =>
      console.log(`Server running on port ${this.port}`),
    );
  }

  public close() {
    this.serverListener?.close();
  }
}