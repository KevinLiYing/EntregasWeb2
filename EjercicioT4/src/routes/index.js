import { Router } from 'express';
import tareasRoutes from "./tareas.routes.js";

const router = Router();

router.use("/tareas", tareasRoutes);

router.get("/", (req, res) => {
    res.json({
        mensaje: "Ejercicio de tareas",
        endpoints: {
            tareas: "/api/tareas/lista",
        }
    });
});

export default router;