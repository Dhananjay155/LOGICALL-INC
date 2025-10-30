import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getAllMedia = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const type = req.query.type || '';

    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { director: { contains: search } },
        { location: { contains: search } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.media.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      media,
      pagination: {
        total,
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};



export const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json(media);
  } catch (error) {
    console.error('Error fetching media by ID:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

export const createMedia = async (req, res) => {
  try {
    const media = await prisma.media.create({
      data: req.body
    });
    res.status(201).json(media);
  } catch (error) {
    console.error('Error creating media:', error);
    res.status(500).json({ error: 'Failed to create media' });
  }
};

export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.update({
      where: { id },
      data: req.body
    });
    res.json(media);
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ error: 'Failed to update media' });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.media.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};