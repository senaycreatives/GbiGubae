// Routes/api/gbigubae.js
const express = require("express");
const Gbigubae = require("../Models/GbiGubae");
const Abal = require("../Models/Abal");
const authMiddleware = require("../Middleware/AuthMiddleware");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/Abal/:id", authMiddleware, async (req, res) => {
  try {
    const abals = await Abal.find({ gbigubae: req.params.id });
    res.status(200).json(abals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gbigubae/withcount:
 *   get:
 *     summary: Retrieve a list of Gbigubae with the count of related Abals
 *     tags: [Gbigubae]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Gbigubae with Abal counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   place:
 *                     type: string
 *                   abalCount:
 *                     type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get("/withcount", authMiddleware, async (req, res) => {
  try {
    const gbigubaes = await Gbigubae.find();

    const results = await Promise.all(
      gbigubaes.map(async (gbigubae) => {
        // Ensure _id is an ObjectId
        const abalCount = await Abal.countDocuments({
          gbigubae: new mongoose.Types.ObjectId(gbigubae._id),
        });
        return { ...gbigubae.toObject(), abalCount };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching Gbigubae with count:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gbigubae:
 *   post:
 *     summary: Create a new Gbigubae
 *     tags: [Gbigubae]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               place:
 *                 type: string
 *             required:
 *               - name
 *               - place
 *     responses:
 *       201:
 *         description: Gbigubae created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gbigubae'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newGbigubae = new Gbigubae(req.body);
    console.log(req.body);
    const savedGbigubae = await newGbigubae.save();
    res.status(201).json(savedGbigubae);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gbigubae:
 *   get:
 *     summary: Retrieve a list of Gbigubae
 *     tags: [Gbigubae]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Gbigubae
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gbigubae'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const gbigubaes = await Gbigubae.find();
    res.status(200).json(gbigubaes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gbigubae/{id}:
 *   get:
 *     summary: Retrieve a single Gbigubae by ID
 *     tags: [Gbigubae]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gbigubae found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gbigubae'
 *       404:
 *         description: Gbigubae not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const gbigubae = await Gbigubae.findById(req.params.id);
    if (!gbigubae) {
      return res.status(404).json({ error: "Gbigubae not found" });
    }
    res.status(200).json(gbigubae);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gbigubae/{id}:
 *   put:
 *     summary: Update an existing Gbigubae by ID
 *     tags: [Gbigubae]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               place:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gbigubae updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gbigubae'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Gbigubae not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedGbigubae = await Gbigubae.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedGbigubae) {
      return res.status(404).json({ error: "Gbigubae not found" });
    }
    res.status(200).json(updatedGbigubae);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gbigubae/{id}:
 *   delete:
 *     summary: Delete a Gbigubae by ID
 *     tags: [Gbigubae]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Gbigubae deleted successfully
 *       404:
 *         description: Gbigubae not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedGbigubae = await Gbigubae.findByIdAndDelete(req.params.id);
    if (!deletedGbigubae) {
      return res.status(404).json({ error: "Gbigubae not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
