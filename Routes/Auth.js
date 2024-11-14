const Admin = require("../Models/Admin");
const { hashPassword, comparePassword } = require("../utils/bcryptUtils");
const { generateToken } = require("../utils/jwtUtils");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Admin]
 *     summary: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "strongpassword"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({
      email,
    });

    if (admin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();

    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Admin]
 *     summary: Login an existing admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "strongpassword"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login with access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       404:
 *         description: Admin not found
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      console.log("Admin not found");
      return res.status(404).json({ error: "Invalid admin or password" });
    }

    const isMatch = await comparePassword(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid admin or password" });
    }

    const accessToken = generateToken({ email: admin.email });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
