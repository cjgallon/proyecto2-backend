import { Router } from 'express';
import {
    createRestaurant,
    readRestaurant,
    readRestaurants,
    updateRestaurant,
    deleteRestaurant,
} from './restaurant.controller';

const router = Router();

// Crear Restaurante
router.post('/', createRestaurant);

// Buscar restaurante
router.get('/:restaurantId', readRestaurant);

// Filtrar restaurantes por categoría
router.get('/', readRestaurants);

// Actualizar info de restaurante
router.patch('/:restaurantId', updateRestaurant);

// Inhabilitar restaurante
router.delete('/:restaurantId', deleteRestaurant);

export default router;
