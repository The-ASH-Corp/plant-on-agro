import {
  ICertificateRepository,
  CertificateFilter,
} from '../../core/interfaces/certificate.repository.interface';
import { Certificate } from '../../core/entities/certificate.entity';
import { CertificateModel } from '../database/models/certificate.model';
import { CertificateMapper } from '../database/mappers/certificate.mapper';
import { Nullable } from '../../shared/types';

export class MongoCertificateRepository implements ICertificateRepository {
  private buildQuery(filter?: CertificateFilter): Record<string, any> {
    const query: Record<string, any> = {};

    if (!filter) return query;

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }

    if (filter.status && filter.status !== 'All') {
      query.status = filter.status;
    }

    if (filter.orderRef && filter.orderRef.trim().length > 0) {
      query.orderRef = filter.orderRef.trim();
    }

    if (filter.search && filter.search.trim().length > 0) {
      const searchRegex = new RegExp(filter.search.trim(), 'i');
      query.$or = [
        { certificateNumber: searchRegex },
        { certificateHash: searchRegex },
        { orderRef: searchRegex },
        { recipientName: searchRegex },
        { adopterName: searchRegex },
        { treeTag: searchRegex },
        { treeSpecies: searchRegex },
        { dedicatedMessage: searchRegex },
      ];
    }

    return query;
  }

  public async findById(id: string): Promise<Nullable<Certificate>> {
    const doc = await CertificateModel.findById(id).exec();
    if (!doc) return null;
    return CertificateMapper.toDomain(doc);
  }

  public async findByCertificateNumber(certificateNumber: string): Promise<Nullable<Certificate>> {
    const doc = await CertificateModel.findOne({
      certificateNumber: certificateNumber.trim().toUpperCase(),
    }).exec();
    if (!doc) return null;
    return CertificateMapper.toDomain(doc);
  }

  public async findByCertificateHash(certificateHash: string): Promise<Nullable<Certificate>> {
    const doc = await CertificateModel.findOne({
      certificateHash: certificateHash.trim(),
    }).exec();
    if (!doc) return null;
    return CertificateMapper.toDomain(doc);
  }

  public async findByOrderRef(orderRef: string): Promise<Certificate[]> {
    const docs = await CertificateModel.find({
      orderRef: orderRef.trim(),
    })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map(CertificateMapper.toDomain);
  }

  public async findAll(
    filter?: CertificateFilter,
    limit = 50,
    skip = 0
  ): Promise<Certificate[]> {
    const query = this.buildQuery(filter);
    const docs = await CertificateModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return docs.map(CertificateMapper.toDomain);
  }

  public async count(filter?: CertificateFilter): Promise<number> {
    const query = this.buildQuery(filter);
    return CertificateModel.countDocuments(query).exec();
  }

  public async save(certificate: Certificate): Promise<Certificate> {
    const persistenceData = CertificateMapper.toPersistence(certificate);
    const doc = await CertificateModel.create(persistenceData);
    return CertificateMapper.toDomain(doc);
  }

  public async update(certificate: Certificate): Promise<Certificate> {
    if (!certificate.id) {
      throw new Error('Cannot update certificate without an ID');
    }
    const persistenceData = CertificateMapper.toPersistence(certificate);
    const doc = await CertificateModel.findByIdAndUpdate(
      certificate.id,
      persistenceData,
      { returnDocument: 'after' }
    ).exec();

    if (!doc) {
      throw new Error(`Certificate with ID ${certificate.id} not found`);
    }

    return CertificateMapper.toDomain(doc);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await CertificateModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
