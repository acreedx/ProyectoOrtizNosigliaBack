import mongoose from "mongoose";
const { Schema } = mongoose;
const PersonsSchema = new Schema(
  {
    resourceType: { type: String, default: "Patient" },
    active: { type: Boolean, required: true },
    name: {
      given: [{ type: String, required: true }],
      family: { type: String, required: true },
    },
    gender: { type: String, required: true },
    birthDate: { type: String, required: true },
    telecom: [
      {
        value: { type: String, required: true },
      },
      {
        value: { type: String, required: true },
      },
      {
        value: { type: String, required: true },
      },
    ],
    photo: {
      _url: {
        id: { type: String, required: true },
      },
    },
    address: {
      line: [{ type: String }],
      city: { type: String, required: true },
    },
    maritalStatus: {
      coding: [
        {
          code: { type: String, enum: ["M", "S"], required: true },
          display: { type: String, required: true },
        },
      ],
    },
    carnetDeIdentidad: { type: String, required: true, unique: true },
    systemUser: {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      roles: [{ type: Schema.Types.ObjectId, ref: "Rol", required: true }],
      lastLogin: { type: String },
      passwordExpiration: { type: String },
      status: { type: Boolean, default: true },
    },
    allergies: [
      {
        substance: { type: String, required: true },
        reaction: { type: String, required: true },
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
          required: true,
        },
        notes: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Persons = mongoose.model("Persons", PersonsSchema);

export default Persons;
