import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { Service } from '../entities/Service';
import User from '../entities/User';
import { createServiceSchema } from '../middleware/serviceSchema';
import imageUpload from '../middleware/cloudinary';

const serviceRepository = AppDataSource.getRepository(Service)
const userRepository = AppDataSource.getRepository(User)

export const createService = async (req: Request, res: Response) => {
    const userId = req.user!.id
    const formData = req.body

    const validationResult = createServiceSchema.validate(formData);
          
    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    try {
        const { type, location, availability, pricing, name, description, image } = formData;

        const user = await userRepository.findOneBy({ id: userId });

        const service = new Service();
        service.type = type;
        service.location = location;
        service.availability = availability;
        service.pricing = pricing;
        service.name = name;
        service.description = description;
        service.image = (await imageUpload(
            req.file,
            "service-images"
          )) as string;
        service.serviceProvider = user as User;

        const savedService = await serviceRepository.save(service);
        return res.status(201).json(savedService);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create service', error });
    }
};

// Get all services
export const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await serviceRepository.find({ relations: ['serviceProvider'] });
        return res.json(services);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve services', error });
    }
};

export const getAllOwnServices = async (req: Request, res: Response) => {
    const userId = req.user!.id
    try {
        const services = await serviceRepository.find({
            where:{
                serviceProvider:{
                    id: userId
                }
            },
            relations: ['serviceProvider']
        });
        return res.json(services);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve services', error });
    }
};

// Get a single service by ID
export const getServiceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const service = await serviceRepository.findOne({
            where: { id: Number(id) },
            relations: ['serviceProvider','reviews','reviews.user']
        });

        if (!service) return res.status(404).json({ message: 'Service not found' });

        return res.json(service);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve service', error });
    }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const formData = req.body

        const validationResult = createServiceSchema.validate(formData);
          
        if (validationResult.error) {
            return res
            .status(400)
            .json({
                status: 'error',
                message: validationResult.error.details[0].message,
            });
        }

        const { type, location, availability, pricing, name, description, image } = formData;

        const service = await serviceRepository.findOne({ 
            where:{
                id: Number(id)
            }
        });

        if (!service) return res.status(404).json({ message: 'Service not found' });

        service.type = type ?? service.type;
        service.location = location ?? service.location;
        service.availability = availability ?? service.availability;
        service.pricing = pricing ?? service.pricing;
        service.name = name ?? service.name;
        service.description = description ?? service.description;
        service.image = image ?? service.image;

        await serviceRepository.save(service);

        const updatedService = await serviceRepository.findOne({ 
            where:{
                id: Number(id)
            },
            relations: ['reviews','serviceProvider','reviews.user']
        });

        return res.json(updatedService);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update service', error });
    }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const service = await serviceRepository.findOneBy({ id: Number(id) });
        if (!service) return res.status(404).json({ message: 'Service not found' });

        await serviceRepository.remove(service);
        return res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete service', error });
    }
};