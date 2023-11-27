// src/restaurant/restaurant.controller.test.ts

import { Request, Response } from 'express';
import { Document } from 'mongoose';
import * as restaurantController from './restaurant.controller';
import * as restaurantModel from './restaurant.model';
import * as orderModel from '../order/order.model';
import { mockRequest, mockResponse } from 'jest-mock-extended';

jest.mock('./restaurant.model');
jest.mock('../order/order.model');

describe('Restaurant Controller', () => {
    const mockData = {
        userId: 'someUserId',
        // Add other mock data properties
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createRestaurant', () => {
        it('should create a restaurant successfully', async () => {
            const req = mockRequest<restaurantController.CreateRestaurantRequest>({ body: mockData });
            const res = mockResponse<Response>();

            const saveSpy = jest.spyOn(restaurantModel.default.prototype, 'save');
            saveSpy.mockResolvedValueOnce(mockData); // Mock the save method

            await restaurantController.createRestaurant(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Restaurante creado exitosamente',
                restaurant: mockData,
            });
        });

        it('should handle errors during restaurant creation', async () => {
            const req = mockRequest<restaurantController.CreateRestaurantRequest>({ body: mockData });
            const res = mockResponse<Response>();

            const saveSpy = jest.spyOn(restaurantModel.default.prototype, 'save');
            saveSpy.mockRejectedValueOnce(new Error('Mocked save error'));

            await restaurantController.createRestaurant(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear un restaurante' });
        });
    });

    // Add similar test blocks for readRestaurant, readRestaurants, updateRestaurant, and deleteRestaurant
});
