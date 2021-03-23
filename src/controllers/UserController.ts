import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UserRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function genToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: 86400,
  });
}
async function verifyToken(token: string) {
  return await jwt.verify(token, process.env.JWT_SECRET || "secret");
}

class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required()
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (userAlreadyExists) throw new AppError("User already exists.");

    bcrypt.hash(password, 10, async function (err, hash) {
      const user = usersRepository.create({
        name,
        email,
        password: hash,
      });

      await usersRepository.save(user);
      const token = genToken(user.id)
      return res.status(201).json({ message: "User Created", user, token: `Bearer ${token}` });
    })
  }
}

export { UserController };
