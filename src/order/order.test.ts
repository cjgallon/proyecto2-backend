//Imports
import {
	createOrder,
	getOrderById,
	getOrderbyDateAndUser,
	updatedOrder
} from "./Order.controller";
import orderRoutes from "./order.routes";
const mongoose = require("mongoose");
const cors = require("cors");
import express, { Request, Response } from "express";
import {
	describe,
	expect,
	test,
	beforeAll,
	afterAll,
	jest,
} from "@jest/globals";
import request from "supertest";
import User from '../user/user.model';
import Product from '../product/product.model';

//Vars
const app = express();
let session: any = {};

/* Opening database connection before all tests. */
beforeAll(async () => {
	mongoose.model('user', User.schema);
	mongoose.model('product', Product.schema);
	app.use(cors());
	app.use(express.json());
	app.use("/",orderRoutes);
	const url = `mongodb+srv://cjgc:h3nt3DTE804Kdx76@proyecto2backend.yunr3x4.mongodb.net/`;
	await mongoose.connect(url);
	session = await mongoose.startSession();
	session.startTransaction();
});

/* Closing database connection after all tests. */
afterAll(async () => {
	await session.abortTransaction();
	session.endSession();
	await mongoose.connection.close();
});

describe('create order', () => {
	test("controller OK", async () => {
		const req: Partial<Request> = {
			body: {
				client:"64740e1ec53e3a458d1b4175",
				seller:"646cf3445f783334b5e91092",
				products:[{product:"64753d8481a4f535567542fb", quantity:1}],
				totalPrice:10000,
				session
			},
		};
		const res: Partial<Response> = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
			json: jest.fn(),
		} as unknown as Response;
		await createOrder(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test("controller ERROR", async () => {
		const req: Partial<Request> = {
			body: {
				client:"1",
				seller:"646cf3445f783334b5e91092",
				products:[{id:"64753d8481a4f535567542fb", quantity:1}],
				totalPrice:10000,
				session
			},
		};
		const res: Partial<Response> = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
			json: jest.fn(),
		} as unknown as Response;
		await createOrder(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(500);
	});
});

describe("readOrder", () => {
  test("controller OK", async () => {
		const req: Partial<Request> = {
				params: { userId: "647569f3f151bd7554a78272" },
		};
		const res: Partial<Response> = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
		} as unknown as Response;
		await getOrderById(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(200);
	});
});