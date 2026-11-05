import { Router } from 'express';
import { ResumoService } from '../services/resumo.service';

export function resumoRouter(service: ResumoService): Router {
  const router = Router();

  router.get('/', (req, res) => {
    res.json(service.gerar(req.query.mes));
  });

  return router;
}
