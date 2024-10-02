import { Request, Response } from "express";
import User from "../entities/User";
import { AppDataSource } from "../config/dataSource";
import { authSchema } from "../middleware/authSchema";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const userRepository = AppDataSource.getRepository(User)

export default class AuthController {
    static async signUp (req:Request,res:Response) {
        try{
            const formData = req.body;

            const validationResult = authSchema.validate(formData);
          
            if (validationResult.error) {
              return res
                .status(400)
                .json({
                  status: 'error',
                  message: validationResult.error.details[0].message,
                });
            }
          
            const user = await userRepository.findOne({where:{ email: formData.email }});
            if (user) {
              return res
                .status(409)
                .json({ status: 'error', message: 'Email already in use' });
            }
          
            const hashedPassword = await bcrypt.hash(formData.password, 10);
          
            const newUser = new User()

            newUser.email = formData.email
            newUser.password = hashedPassword
          
            const savedUser = await userRepository.save(newUser);
          
            return res
              .status(201)
              .json({ status: 'success', message: 'Signup successful!' });
        }catch(err){
            return res.status(500).json({message:"Internal Server Error"})
        }
    }

    static async login (req:Request,res:Response) {
        try{
            const formData = req.body;

            const validationResult = authSchema.validate(formData);
          
            if (validationResult.error) {
              return res
                .status(400)
                .json({
                  status: 'error',
                  message: validationResult.error.details[0].message,
                });
            }
          
            const user = await userRepository.findOne({where:{ email: formData.email }});
            if (!user) {
              return res
                .status(404)
                .json({ status: 'error', message: 'Account not found' });
            }
          
            const passwordMatch: boolean = await bcrypt.compare(
              formData.password,
              user.password
            );
            if (!passwordMatch) {
              return res
                .status(401)
                .json({ status: 'error', message: 'Incorrect password' });
            }

            const token = await jwt.sign({user}, process.env.JWT_SECRET as string, {expiresIn: '1h'})
          
            return res
              .status(200)
              .json({ status: 'success', message: 'Login successful', token });
        }catch(err){
            return res.status(500).json({message:"Internal Server Error"})
        }
    }
}