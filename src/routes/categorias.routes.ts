import { Router } from 'express';
import { CategoriaService } from '../services/categoria.service';

export function categoriasRouter(service: CategoriaService): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(service.listar());
  });

  router.post('/', (req, res) => {
    res.status(201).json(service.criar(req.body));
  });

  router.delete('/:id', (req, res) => {
    service.excluir(req.params.id);
    res.status(204).send();
  });

  return router;
}
