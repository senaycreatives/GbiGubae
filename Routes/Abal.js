const express = require("express");
const Abal = require("../Models/Abal");
const authMiddleware = require("../Middleware/AuthMiddleware");
const router = express.Router();
/**
 * @swagger
 * /api/abal/transferGroupToAlmuni:
 *   put:
 *     summary: Transfer multiple members to alumni
 *     description: Marks multiple members as completed, indicating they have been transferred to alumni.
 *     tags:
 *       - Members
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               abalids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of member IDs to be transferred to alumni.
 *     responses:
 *       200:
 *         description: Successfully transferred members to alumni.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: No member IDs provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: No members found for the provided IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while transferring members.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/transferGroupToAlmuni", authMiddleware, async (req, res) => {
  try {
    const abalIds = req.body.abalids;

    if (!Array.isArray(abalIds) || abalIds.length === 0) {
      return res.status(400).json({ message: "No member IDs provided." });
    }

    const updatedMembers = await Abal.updateMany(
      { _id: { $in: abalIds } },
      { $set: { isCompleted: true } }
    );

    if (updatedMembers.nModified === 0) {
      return res
        .status(404)
        .json({ message: "No members found for the provided IDs." });
    }

    res.status(200).json({
      message: `${updatedMembers.nModified} member(s) transferred to alumni successfully.`,
    });
  } catch (error) {
    console.error("Error transferring members:", error);
    res
      .status(500)
      .json({ message: "An error occurred while transferring members." });
  }
});

/**
 * @swagger
 * /api/abal:
 *   post:
 *     summary: Create a new Abal
 *     tags: [Abal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 pattern: '^\d{10}$'
 *               gbigubae:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *                 format: uuid
 *             required:
 *               - fullname
 *               - email
 *               - phone
 *               - gbigubae
 *               - role
 *     responses:
 *       201:
 *         description: Abal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Abal'
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
    const newAbal = new Abal(req.body);
    const savedAbal = await newAbal.save();
    res.status(201).json(savedAbal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/all/Almuni", authMiddleware, async (req, res) => {
  try {
    const abals = await Abal.find({ isCompleted: true }).populate(
      "gbigubae role"
    );
    res.status(200).json(abals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/abal:
 *   get:
 *     summary: Retrieve a list of Abal
 *     tags: [Abal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fullname
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: phone
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Abal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Abal'
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
    const { fullname, email, phone } = req.query;
    const filter = {};

    if (fullname) {
      filter.fullname = { $regex: fullname, $options: "i" };
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }
    if (phone) {
      filter.phone = { $regex: phone, $options: "i" };
    }

    const abals = await Abal.find(filter).populate("gbigubae role");
    res.status(200).json(abals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/abal/{id}:
 *   get:
 *     summary: Retrieve a single Abal by ID
 *     tags: [Abal]
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
 *         description: Abal found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Abal'
 *       404:
 *         description: Abal not found
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
    const abal = await Abal.findById(req.params.id).populate("gbigubae role");
    if (!abal) {
      return res.status(404).json({ error: "Abal not found" });
    }
    res.status(200).json(abal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/abal/{id}:
 *   put:
 *     summary: Update an existing Abal by ID
 *     tags: [Abal]
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
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 pattern: '^\d{10}$'
 *               gbigubae:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Abal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Abal'
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
 *         description: Abal not found
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
    const updatedAbal = await Abal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("gbigubae role");

    if (!updatedAbal) {
      return res.status(404).json({ error: "Abal not found" });
    }
    res.status(200).json(updatedAbal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/abal/{id}:
 *   delete:
 *     summary: Delete an Abal by ID
 *     tags: [Abal]
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
 *         description: Abal deleted successfully
 *       404:
 *         description: Abal not found
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
    const deletedAbal = await Abal.findByIdAndDelete(req.params.id);
    if (!deletedAbal) {
      return res.status(404).json({ error: "Abal not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Abal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fullname:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           pattern: '^\d{10}$'
 *         gbigubae:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           format: uuid
 *         Date:
 *           type: string
 *           format: date-time
 */
module.exports = router;
