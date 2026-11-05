import { Router } from 'express';
import { TransacaoService } from '../services/transacao.service';

export function transacoesRouter(service: TransacaoService): Router {
  const router = Router();

  router.post('/', (req, res) => {
    res.status(201).json(service.criar(req.body));
  });

  return router;
}
