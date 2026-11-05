import { Router } from 'express';
import { TransacaoService } from '../services/transacao.service';

export function transacoesRouter(service: TransacaoService): Router {
  const router = Router();

  router.post('/', (req, res) => {
    res.status(201).json(service.criar(req.body));
  });

  router.get('/', (req, res) => {
    res.json(service.listar(req.query));
  });

  router.get('/:id', (req, res) => {
    res.json(service.buscarPorId(req.params.id));
  });

  return router;
}
