import { Request, Response, NextFunction } from 'express';
import { WaitlistModel } from '../../infrastructure/database/models/waitlist.model';
import { ApiResponse } from '../../shared/utils/api-response';

export class WaitlistController {
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, phoneNumber, name, source } = req.body;

      if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
        res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
        return;
      }

      if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim().length < 7) {
        res.status(400).json({ success: false, message: 'Please provide a valid phone number.' });
        return;
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phoneNumber.trim();

      // Check if email already on waitlist
      const existing = await WaitlistModel.findOne({ email: cleanEmail });
      if (existing) {
        existing.phoneNumber = cleanPhone;
        if (name && typeof name === 'string') existing.name = name.trim();
        await existing.save();

        ApiResponse.success(
          res,
          {
            id: existing._id.toString(),
            email: existing.email,
            phoneNumber: existing.phoneNumber,
            createdAt: existing.createdAt.toISOString(),
          },
          "You're already on the waitlist! We have updated your contact details."
        );
        return;
      }

      const newEntry = await WaitlistModel.create({
        email: cleanEmail,
        phoneNumber: cleanPhone,
        name: typeof name === 'string' ? name.trim() : '',
        source: typeof source === 'string' ? source.trim() : 'adoption_packages_section',
        status: 'pending',
      });

      ApiResponse.created(
        res,
        {
          id: newEntry._id.toString(),
          email: newEntry.email,
          phoneNumber: newEntry.phoneNumber,
          createdAt: newEntry.createdAt.toISOString(),
        },
        '🎉 Successfully joined the waitlist! We will notify you as soon as adoption packages open.'
      );
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { search, status, limit = '200' } = req.query;
      const query: any = {};

      if (status && typeof status === 'string' && status !== 'all') {
        query.status = status;
      }

      if (search && typeof search === 'string' && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ email: regex }, { phoneNumber: regex }, { name: regex }];
      }

      const maxLimit = Math.min(parseInt(limit as string, 10) || 200, 500);
      const items = await WaitlistModel.find(query).sort({ createdAt: -1 }).limit(maxLimit);
      const total = await WaitlistModel.countDocuments();
      const pendingCount = await WaitlistModel.countDocuments({ status: 'pending' });
      const contactedCount = await WaitlistModel.countDocuments({ status: 'contacted' });

      ApiResponse.success(
        res,
        {
          items: items.map((doc) => ({
            id: doc._id.toString(),
            email: doc.email,
            phoneNumber: doc.phoneNumber,
            name: doc.name || '',
            source: doc.source,
            status: doc.status,
            notes: doc.notes || '',
            createdAt: doc.createdAt.toISOString(),
            updatedAt: doc.updatedAt.toISOString(),
          })),
          total,
          pendingCount,
          contactedCount,
        },
        'Waitlist entries retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updateData: any = {};
      if (status) updateData.status = status;
      if (typeof notes === 'string') updateData.notes = notes;

      const updated = await WaitlistModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        res.status(404).json({ success: false, message: 'Waitlist entry not found.' });
        return;
      }

      ApiResponse.success(
        res,
        {
          id: updated._id.toString(),
          email: updated.email,
          phoneNumber: updated.phoneNumber,
          status: updated.status,
        },
        'Waitlist entry updated successfully'
      );
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await WaitlistModel.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Waitlist entry not found.' });
        return;
      }
      ApiResponse.success(res, { id }, 'Waitlist entry removed successfully');
    } catch (error) {
      next(error);
    }
  };
}

