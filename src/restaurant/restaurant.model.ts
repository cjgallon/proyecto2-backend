import mongoose, { Document, Schema, Types } from 'mongoose';

interface RestaurantModel extends Document {
    name: string;
    address: string;
    category: string;
    adminId: Types.ObjectId;
    active: boolean;
}

const restaurantSchema = new Schema<RestaurantModel>({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    adminId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    active: {
        type: Boolean,
        default: true,
    },
});

const Restaurant = mongoose.model<RestaurantModel>('Restaurant', restaurantSchema);

export default Restaurant;
