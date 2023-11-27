// src/restaurant/restaurant.controller.ts
import { Request, Response } from 'express';
import { Document } from 'mongoose';
import RestaurantModel from './restaurant.model';
import OrderModel from '../order/order.model';

interface CreateRestaurantRequest extends Request {
    body: {
        userId: string;
        // Add other properties with their types
    };
}

interface UpdateRestaurantRequest extends Request {
    params: {
        restaurantId: string;
    };
    body: {
        // Add properties you expect to update with their types
    };
}

const createRestaurant = async (req: CreateRestaurantRequest, res: Response) => {
    try {
        const { userId, ...restaurantData } = req.body;
        restaurantData.adminId = userId;
        const restaurant = new RestaurantModel(restaurantData);
        const newRestaurant = await restaurant.save();
        res.status(201).json({
            success: true,
            message: 'Restaurante creado exitosamente',
            restaurant: newRestaurant,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear un restaurante' });
    }
};

const readRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.restaurantId;

        if (!restaurantId) {
            res.status(400).json({ error: 'Se requiere un ID de restaurante' });
            return;
        }

        const restaurant = await RestaurantModel.findOne({ _id: restaurantId, active: true });

        if (!restaurant) {
            res.status(404).json({ error: 'Restaurante no encontrado o inhabilitado' });
            return;
        }

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el restaurante por ID' });
    }
};

const readRestaurants = async (req: Request, res: Response) => {
    try {
        const { category, name } = req.query;
        const query: any = { active: true };

        if (category) query.category = category;
        if (name) query.name = { $regex: new RegExp(name, 'i') };

        const restaurants = await RestaurantModel.find(query);

        const calculatePopularity = async (restaurant: Document & { popularity?: number }) => {
            const count = await OrderModel.countDocuments({
                restaurant: restaurant._id,
                status: 'completed',
            });
            restaurant._doc.popularity = count;
            return restaurant;
        };

        const restaurantsPopularityList = await Promise.all(
            restaurants.map(calculatePopularity)
        );

        restaurantsPopularityList.sort((a, b) => (b._doc.popularity || 0) - (a._doc.popularity || 0));

        res.status(200).json(restaurantsPopularityList);
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateRestaurant = async (req: UpdateRestaurantRequest, res: Response) => {
    try {
        const restaurantId = req.params.restaurantId;

        if (!restaurantId) {
            res.status(400).json({ error: 'Se requiere un ID de restaurante' });
            return;
        }

        const updates = req.body;

        const existingRestaurant = await RestaurantModel.findOne({ _id: restaurantId, active: true });

        if (!existingRestaurant) {
            res.status(404).json({ error: 'Restaurante no encontrado o inactivo' });
            return;
        }

        const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
            restaurantId,
            updates,
            { new: true }
        );

        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el restaurante' });
    }
};

const deleteRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.restaurantId;

        if (!restaurantId) {
            res.status(400).json({ error: 'Se requiere un ID de restaurante' });
            return;
        }

        const restaurant = await RestaurantModel.findById(restaurantId);

        if (!restaurant) {
            res.status(404).json({ error: 'Restaurante no encontrado' });
            return;
        }

        if (!restaurant.active) {
            res.status(200).json({ message: 'El restaurante ya está inactivo' });
            return;
        }

        restaurant.active = false;

        await restaurant.save();

        res.status(200).json({ message: 'Restaurante inhabilitado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al inhabilitar el restaurante' });
    }
};

export {
    createRestaurant,
    readRestaurant,
    readRestaurants,
    updateRestaurant,
    deleteRestaurant,
};
