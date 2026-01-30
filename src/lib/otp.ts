import mongoose, { Schema, models, Model } from "mongoose";

interface IOtp {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
}

const OtpSchema = new Schema<IOtp>({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
});

const Otp: Model<IOtp> = models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
