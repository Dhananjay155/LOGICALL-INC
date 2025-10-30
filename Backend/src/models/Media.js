import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MediaModel {
  static async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [media, totalCount] = await Promise.all([
      prisma.media.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.media.count()
    ]);

    return {
      media,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + media.length < totalCount
      }
    };
  }

  static async findById(id) {
    return prisma.media.findUnique({
      where: { id }
    });
  }

  static async create(data) {
    return prisma.media.create({
      data: {
        title: data.title,
        type: data.type,
        director: data.director,
        budget: data.budget,
        location: data.location,
        duration: data.duration,
        year: data.year,
        imageUrl: data.imageUrl || ''
      }
    });
  }

  static async update(id, data) {
    return prisma.media.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        director: data.director,
        budget: data.budget,
        location: data.location,
        duration: data.duration,
        year: data.year,
        imageUrl: data.imageUrl || ''
      }
    });
  }

  static async delete(id) {
    return prisma.media.delete({
      where: { id }
    });
  }
}