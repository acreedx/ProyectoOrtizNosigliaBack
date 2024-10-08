import express from "express";
import Appointment from "../models/appointment.js";
import cron from "node-cron";
import sendWhatsAppMessage from "../messages/SendWhatsappMessage.js";
const router = express.Router();
const isTwoDaysBefore = (date) => {
  const now = new Date();
  const twoDaysFromNow = new Date(now.setDate(now.getDate() + 2));
  return date.toDateString() === twoDaysFromNow.toDateString();
};
cron.schedule("0 8 * * *", async () => {
  console.log("Verificando citas para enviar recordatorios...");
  try {
    const citas = await Appointment.find({ status: "pending" });
    citas.forEach(async (cita) => {
      const participante = cita.participant[0];
      if (participante) {
        const formateador = new Intl.DateTimeFormat("es-ES", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "UTC",
        });
        const messageParams = {
          nombre: participante.actor.display,
          mensaje: `Recordatorio: Hola ${
            participante.actor.display
          }, tienes una cita programada para el ${formateador.format(
            cita.start
          )}.
          El pago de la cita es de 100bs. 
          Puedes confirmar tu cita en http://localhost:3000/paginaweb/pages/citas.`,
          destino: "+59173744202",
        };
        await sendWhatsAppMessage(messageParams);
      }
    });
  } catch (error) {
    console.error("Error al enviar recordatorios:", error);
  }
});
router.use((req, res, next) => {
  next();
});
//Listar
router.get("/", async (req, res) => {
  try {
    const citas = await Appointment.find();
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/pendientes", async (req, res) => {
  try {
    const citas = await Appointment.find({ status: "booked" });
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/confirmadas", async (req, res) => {
  try {
    const citas = await Appointment.find({ status: "pending" });
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/canceladas", async (req, res) => {
  try {
    const citas = await Appointment.find({ status: "cancelled" });
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/confirmar", async (req, res) => {
  try {
    const cita = await Appointment.findOneAndUpdate(
      { _id: req.body._id },
      { status: "pending" }
    );
    res.status(200).json(cita);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/cancelar", async (req, res) => {
  try {
    const cita = await Appointment.findOneAndUpdate(
      { _id: req.body._id },
      { status: "cancelled" }
    );
    res.status(200).json(cita);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Crear
router.post("/", async (req, res) => {
  const {
    resourceType,
    status,
    description,
    start,
    end,
    participant,
    created,
    reasonCode,
    serviceType,
  } = req.body;
  try {
    const nuevaCita = new Appointment({
      resourceType,
      status,
      description,
      start,
      end,
      participant,
      created,
      reasonCode,
      serviceType,
    });
    const citaGuardada = await nuevaCita.save();
    res.status(200).json(citaGuardada);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
//Actualizar
router.put("/", async (req, res) => {
  try {
    const citas = await Appointment.findOneAndUpdate(
      { _id: req.body._id },
      req.body
    );
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Deshabilitar
router.put("/deshabilitar", async (req, res) => {
  try {
    const citas = await Appointment.find();
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Habilitar
router.put("/habilitar", async (req, res) => {
  try {
    const citas = await Appointment.find();
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/confirmar", async (req, res) => {
  try {
    const citas = await Appointment.find();
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/cancelar", async (req, res) => {
  try {
    const citas = await Appointment.find();
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
