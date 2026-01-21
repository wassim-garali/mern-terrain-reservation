const express = require("express");
const axios = require("axios");

const router = express.Router();

// GET → insights automatiques
router.get("/bi-insights", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5001/ai");
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "IA non disponible" });
    }
});

// POST → question libre
router.post("/bi-insights", async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Aucune question fournie" });

    try {
        const response = await axios.post("http://localhost:5001/ai", { question });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "IA non disponible" });
    }
});

module.exports = router;
