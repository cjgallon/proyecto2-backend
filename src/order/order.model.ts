import { Schema, model } from "mongoose";

export interface IOrder {
  client: Schema.Types.ObjectId;
  seller: Schema.Types.ObjectId;
  products: [{ product: Schema.Types.ObjectId, quantity: Number }];
  totalPrice: Number;
  comments: String;
  score: Number;
  active: boolean;
}

const orderSchema = new Schema<IOrder>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      validate: {
        validator: async function (value: string) {
          const user = await model("user").findOne({
            _id: value,
          });
          return user !== null || user.active == true;
        },
        message: "Usuario no encontrado",
      },
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      validate: {
        validator: async function (value: string) {
          const user = await model("user").findOne({
            _id: value,
          });
          return user !== null || user.active == true;
        },
        message: "Usuario no encontrado",
      },
    },
    products: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
        validate: {
          validator: async function (value: string) {
            const product = await model("product").findOne({
              _id: value
            });
            if (product == null || product.active != true) {
              throw new Error('No se encontro el producto');
            }
          }
        }
      },
      quantity: { type: Number, required: true }
    }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    comments: {
      type: String,
    },
    score: {
      type: Number
    },

    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "orders" }
);

export default model<IOrder>("order", orderSchema);
