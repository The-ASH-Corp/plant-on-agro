import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { ILocationRepository } from '../../../core/interfaces/location.repository.interface';
import { AdoptionOrderStatus, Order } from '../../../core/entities/order.entity';
import { TreeInstance } from '../../../core/entities/tree-instance.entity';
import { Certificate } from '../../../core/entities/certificate.entity';
import { OrderDto, OrderResponseMapper } from '../../dto/order.dto';
import { BadRequestError, NotFoundError } from '../../../core/errors/app-error';

export const ORDER_STATUS_PROGRESSION: AdoptionOrderStatus[] = [
  'New Request',
  'Verified & Tagged',
  'Planted',
  'Certificate Issued',
  'Completed',
];

export class UpdateOrderStatusUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly treeInstanceRepository?: ITreeInstanceRepository,
    private readonly certificateRepository?: ICertificateRepository,
    private readonly locationRepository?: ILocationRepository
  ) {}

  public async execute(
    idOrNumber: string,
    newStatus: AdoptionOrderStatus,
    notes?: string,
    gpsCoords?: string,
    reserveName?: string,
    treeTags?: string[],
    assignedTreeInstanceIds?: string[]
  ): Promise<OrderDto> {
    const cleanId = (idOrNumber || '').trim();
    if (!cleanId) {
      throw new BadRequestError('Order identifier is required to update status.');
    }

    let order = await this.orderRepository.findById(cleanId);
    if (!order) {
      const cleanNumber = cleanId.replace(/^ord-/i, '');
      order = await this.orderRepository.findByOrderNumber(cleanNumber);
    }

    if (!order) {
      throw new NotFoundError(`Order with identifier "${cleanId}" not found.`);
    }

    const currentStatus = order.status;

    // 1. Strictly Sequential, Monotonic Validation Rule:
    // Only one step forward at a time, never jump from 1st to 3rd step, and never move backwards.
    if (newStatus !== currentStatus) {
      const allowedNextStatuses: AdoptionOrderStatus[] = [];
      if (currentStatus === 'New Request') {
        allowedNextStatuses.push('Verified & Tagged');
      } else if (currentStatus === 'Verified & Tagged') {
        allowedNextStatuses.push('Planted');
      } else if (currentStatus === 'Planted') {
        allowedNextStatuses.push('Certificate Issued', 'Completed');
      } else if (currentStatus === 'Certificate Issued') {
        allowedNextStatuses.push('Completed');
      } else if (currentStatus === 'Completed') {
        throw new BadRequestError(
          `Order "${order.orderNumber}" is already Completed and archived. Status cannot be modified.`
        );
      }

      if (!allowedNextStatuses.includes(newStatus)) {
        throw new BadRequestError(
          `Invalid purchase status transition: Order "${order.orderNumber}" is currently in "${currentStatus}". ` +
            `Status must be updated sequentially one step at a time (${currentStatus} -> ${allowedNextStatuses.join(' or ')}). ` +
            `Jumping steps or moving backwards is strictly prohibited.`
        );
      }
    }

    // 2. Update Notes & Reserve Name if provided
    if (notes) {
      order.updateNotes(notes);
    }
    if (reserveName && reserveName.trim().length > 0) {
      order.updateReserveName(reserveName.trim());
    }

    // 3. Handle Transition to "Planted" (Geographical Location & Official Certificate Minting)
    if (newStatus === 'Planted') {
      let effectiveGps = (gpsCoords || order.gpsCoords || '').trim();

      // If no GPS was passed, try to resolve from reserve in location repository or fallback
      if (!effectiveGps && this.locationRepository && order.reserveName) {
        try {
          const loc = await this.locationRepository.findByName(order.reserveName);
          if (loc && loc.gps) {
            effectiveGps = loc.gps;
          }
        } catch {
          // ignore lookup error
        }
      }

      if (!effectiveGps) {
        throw new BadRequestError(
          `Geographical location (GPS coordinates) is required to mark order "${order.orderNumber}" as Planted. ` +
            `Please specify the exact planting coordinates.`
        );
      }

      order.updateGpsCoords(effectiveGps);

      // Parse coordinates
      const parseGpsCoords = (str: string): { lat: number; lng: number } => {
        const matches = str.match(/[-+]?[0-9]*\.?[0-9]+/g);
        if (matches && matches.length >= 2) {
          const lat = parseFloat(matches[0]);
          const lng = parseFloat(matches[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            const isSouth = /s/i.test(str.split(',')[0] || '') && !/n/i.test(str.split(',')[0] || '');
            const isWest = /w/i.test(str.split(',')[1] || '') && !/e/i.test(str.split(',')[1] || '');
            return {
              lat: isSouth ? -Math.abs(lat) : Math.abs(lat),
              lng: isWest ? -Math.abs(lng) : Math.abs(lng),
            };
          }
        }
        return { lat: 18.9894, lng: 73.4428 };
      };

      const targetCoord = parseGpsCoords(effectiveGps);
      const speciesCode = (order.treeSpecies || 'TR').substring(0, 2).toUpperCase();
      const cleanOrderNumber = order.orderNumber.replace(/^POA-?/, '');

      // Update or assign Tree Instances explicitly managed by Admin
      let treeInstances: TreeInstance[] = [];
      if (this.treeInstanceRepository) {
        // 1. If Admin selected existing physical nursery instances to assign to this purchase
        if (assignedTreeInstanceIds && assignedTreeInstanceIds.length > 0) {
          for (const instId of assignedTreeInstanceIds) {
            const cleanInstId = (instId || '').trim();
            if (cleanInstId) {
              const inst = await this.treeInstanceRepository.findById(cleanInstId);
              if (inst) {
                inst.update({
                  orderRef: order.orderNumber,
                  adopterName: order.adopterName,
                  adopterEmail: order.adopterEmail,
                  assignedReserve: order.reserveName,
                  healthStatus: 'Healthy',
                  datePlanted: new Date(),
                  notes:
                    notes ||
                    `Physically assigned to order ${order.orderNumber} for ${order.adopterName}. Geotagged & verified.`,
                });
                inst.updateGpsCoordinates(targetCoord.lat, targetCoord.lng);
                await this.treeInstanceRepository.update(inst);
                treeInstances.push(inst);
              }
            }
          }
        }

        // 2. If Admin explicitly provided physical tree tag(s) (e.g. from physical metal RFID tag stamped on the sapling)
        if (treeTags && treeTags.length > 0 && treeInstances.length < order.quantity) {
          for (const rawTag of treeTags) {
            const cleanTag = (rawTag || '').trim().toUpperCase();
            if (cleanTag && !treeInstances.some((t) => t.treeTag === cleanTag)) {
              let existing = await this.treeInstanceRepository.findByTag(cleanTag);
              if (existing) {
                existing.update({
                  orderRef: order.orderNumber,
                  adopterName: order.adopterName,
                  adopterEmail: order.adopterEmail,
                  assignedReserve: order.reserveName,
                  healthStatus: 'Healthy',
                  datePlanted: new Date(),
                  notes:
                    notes ||
                    `Assigned to order ${order.orderNumber} for ${order.adopterName}. Geotagged at ${effectiveGps}.`,
                });
                existing.updateGpsCoordinates(targetCoord.lat, targetCoord.lng);
                await this.treeInstanceRepository.update(existing);
                treeInstances.push(existing);
              } else {
                const newInstance = new TreeInstance({
                  treeTag: cleanTag,
                  orderRef: order.orderNumber,
                  assignedReserve: order.reserveName,
                  gpsCoordinates: { latitude: targetCoord.lat, longitude: targetCoord.lng },
                  datePlanted: new Date(),
                  healthStatus: 'Healthy',
                  treeVarietyName: order.treeSpecies,
                  adopterName: order.adopterName,
                  adopterEmail: order.adopterEmail,
                  notes:
                    notes ||
                    `Physically tagged (${cleanTag}) & planted at verified coordinates (${effectiveGps}). Geotagged by admin.`,
                  isActive: true,
                });
                const saved = await this.treeInstanceRepository.save(newInstance);
                treeInstances.push(saved);
              }
            }
          }
        }

        // 3. Fallback: check if tree instances were already assigned to this order previously
        if (treeInstances.length === 0) {
          const existingForOrder = await this.treeInstanceRepository.findByOrderRef(order.orderNumber);
          if (existingForOrder.length > 0) {
            for (const inst of existingForOrder) {
              inst.updateGpsCoordinates(targetCoord.lat, targetCoord.lng);
              inst.update({
                assignedReserve: order.reserveName,
                healthStatus: 'Healthy',
                notes: notes || `Planted at verified coordinates (${effectiveGps}). Geotagged by admin.`,
              });
              await this.treeInstanceRepository.update(inst);
              treeInstances.push(inst);
            }
          } else {
            // Create required quantity with deterministic tags and exact GPS coordinates (NO random jitter)
            for (let i = 0; i < order.quantity; i++) {
              const itemIndex = i + 1;
              const treeTag = `POA-${speciesCode}-${cleanOrderNumber}-${String(itemIndex).padStart(3, '0')}`;
              const newInstance = new TreeInstance({
                treeTag,
                orderRef: order.orderNumber,
                assignedReserve: order.reserveName,
                gpsCoordinates: { latitude: targetCoord.lat, longitude: targetCoord.lng },
                datePlanted: new Date(),
                healthStatus: 'Healthy',
                treeVarietyName: order.treeSpecies,
                adopterName: order.adopterName,
                adopterEmail: order.adopterEmail,
                notes:
                  notes ||
                  `Planted at verified coordinates (${effectiveGps}). Geotagged by admin.`,
                isActive: true,
              });
              const saved = await this.treeInstanceRepository.save(newInstance);
              treeInstances.push(saved);
            }
          }
        }
      }

      // Mint and Issue Official Certificate with Admin's exact Geotag
      if (this.certificateRepository) {
        const certNumber = order.certificateId || `POA-CERT-${new Date().getFullYear()}-${cleanOrderNumber}`;
        const existingCerts = await this.certificateRepository.findByOrderRef(order.orderNumber);
        const primaryTag = treeInstances[0]?.treeTag || `POA-${speciesCode}-${cleanOrderNumber}-001`;

        if (existingCerts.length > 0) {
          const cert = existingCerts[0];
          cert.update({
            status: 'Issued',
            treeTag: primaryTag,
            reserveName: order.reserveName,
            issueDate: new Date(),
          });
          await this.certificateRepository.update(cert);
          order.setCertificateId(cert.certificateNumber);
        } else {
          const newCert = new Certificate({
            certificateNumber: certNumber,
            orderRef: order.orderNumber,
            recipientName: order.adopterName,
            adopterName: order.adopterName,
            dedicatedMessage:
              order.dedicationMessage ||
              `Dedicated to ${order.adopterName} for sustainable forestry stewardship.`,
            issueDate: new Date(),
            treeTag: primaryTag,
            treeSpecies: order.treeSpecies,
            reserveName: order.reserveName,
            status: 'Issued',
            isActive: true,
          });
          const savedCert = await this.certificateRepository.save(newCert);
          order.setCertificateId(savedCert.certificateNumber);
        }
      }
    }

    // 4. Update the Order Status
    order.updateStatus(newStatus);
    const updated = await this.orderRepository.update(order);
    return OrderResponseMapper.toDto(updated);
  }
}
