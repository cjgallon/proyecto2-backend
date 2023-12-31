import { Request, Response } from "express";
import Order from "./order.model"; // Importa el modelo de usuario definido en Mongoose


export const createOrder = async (req: Request, res: Response) => {
  try {
    const { client, seller, products, totalPrice, session } = req.body; // Obtén las propiedades del cuerpo de la solicitud

    // Crea un nuevo pedido utilizando el modelo de Mongoose
    const order = new Order({
      client,
      seller,
      products,
      totalPrice,
    });

    // Guarda el usuario en la base de datos
    if (session && typeof session === 'object' && typeof session.startTransaction === 'function' && typeof session.commitTransaction === 'function' && typeof session.abortTransaction === 'function') {
      await order.save({ session: session });
    } else {
      await order.save();
    }

    res.status(201).json({ message: "Pedido creado exitosamente", order: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el pedido", error });
  }
};

export async function getOrderById(req: Request, res: Response) {
  try {
    const { _id } = req.params;

    const order = await Order.findOne({ _id: _id, active: true });

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el pedido" });
  }
}

export async function getOrderbyDateAndUser(req: Request, res: Response) {

  try {
    const { user, startDate, endDate } = req.query;
    const filtro: any = {};

    if (startDate && endDate) {
      filtro.startDate = startDate;
      filtro.endDate = endDate;
    }

    filtro.user = user;
    //Buscamos solo los que estén activos
    filtro.active = true;
    const order = await Order.find(filtro);
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
}

export async function updatedOrder(req: Request, res: Response) {
  //Aquí opto por usar tanto params como body
  const { _id } = req.params;
  const { comments, score } = req.body;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: _id, active: true },
      { comments: comments, score: score },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al actualizar el pedido." });
  }
}


