import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { Review } from '../entities/Review';
import User from '../entities/User';
import { Service } from '../entities/Service';
import { createReviewSchema } from '../middleware/reviewSchema';

const reviewRepository = AppDataSource.getRepository(Review)
const userRepository = AppDataSource.getRepository(User)
const serviceRepository = AppDataSource.getRepository(Service)



export const leaveReview = async (req: Request, res: Response) => {
    const userId = req.user!.id
    const formData = req.body;

    const validationResult = createReviewSchema.validate(formData);
          
    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const { serviceId, rating, description } = formData

    try {
        const service = await serviceRepository.findOne({where:{
            id: serviceId
        }});

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const user = await userRepository.findOne({where:{
            id: userId
        }});

        const newReview = new Review()

        newReview.rating = rating
        newReview.description = description
        newReview.service = service
        newReview.user = user as User

        const savedReview = await reviewRepository.save(newReview);

        //calculate new avgRating
        const allReviews = await reviewRepository.find({where:{
            service: {
                id: serviceId
            }
        }})

        let sum: number = 0;
        for(const review of allReviews){
            sum += review.rating
        }

        const avgRating = Number((sum / allReviews.length).toPrecision(2))

        service.avgRating = avgRating
        await serviceRepository.save(service)

        return res.status(201).json(savedReview);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


export const getReviewsByServiceId = async (req: Request, res: Response) => {
    const { serviceId } = req.params;

    try {
        const reviews = await reviewRepository.find({
            where: {
                service: {
                    id: Number(serviceId)
                }
        },
            relations: ['user','service'],
        });

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this service' });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
