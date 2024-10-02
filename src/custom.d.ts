export interface IUser {
    id:number,
    email:string,
    password:string,
    createdAt:Date,
    updatedAt: Date
}

declare module 'express-serve-static-core' {
    interface Request {
      user?: IUser
    }
}