import { hash, verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

export const register = async (req, res) => {
    try {
        const data = req.body;
        const { name, surname, userName, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "Email ya en uso" });
    }
        const encryptedPassword = await hash(data.password);
        data.password = encryptedPassword;
        const user = await User.create(data);
        return res.status(201).json({
            message: "Usuario creado",
            name: user.name,
            email: user.email
        });
    } catch (errorr) {
        return res.status(500).json({
            message: "Error al registrar usuario",
            error: errorr.message
        });
    }
};

export const login = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });
        if (!user) {
            return res.status(400).json({
                message: "Credenciales invalidas",
                error: "Email invalido"
            });
        }
        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Credenciales invalidas",
                error: "Contraseña incorrecta"
            });
        }
        const token = await generateJWT(user.id);
        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            userDetails: {
                token: token,
                role: user.role 
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al iniciar sesión",
            error: err.message
        });
    }
};
