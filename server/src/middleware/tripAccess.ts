import { Request, Response, NextFunction } from 'express';
import { canAccessTrip, isOwner } from '../db/database';
import { AuthRequest } from '../types';

function consumeAndRespond(req: Request, res: Response, status: number, body: any): void {
  if (req.complete || typeof req.on !== 'function') {
    res.status(status).json(body);
  } else {
    req.on('data', () => {});
    const done = () => res.status(status).json(body);
    req.on('end', done);
    req.on('error', done);
    if (typeof req.resume === 'function') {
      req.resume();
    }
  }
}

/** Middleware: verifies the authenticated user is an owner or member of the trip, then attaches trip to req. */
function requireTripAccess(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthRequest;
  const tripId = req.params.tripId || req.params.id;
  if (!tripId) {
    consumeAndRespond(req, res, 400, { error: 'Trip ID required' });
    return;
  }
  const trip = canAccessTrip(Number(tripId), authReq.user.id);
  if (!trip) {
    consumeAndRespond(req, res, 404, { error: 'Trip not found' });
    return;
  }
  authReq.trip = trip;
  next();
}

/** Middleware: verifies the authenticated user is the trip owner (not just a member). */
function requireTripOwner(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthRequest;
  const tripId = req.params.tripId || req.params.id;
  if (!tripId) {
    consumeAndRespond(req, res, 400, { error: 'Trip ID required' });
    return;
  }
  if (!isOwner(Number(tripId), authReq.user.id)) {
    consumeAndRespond(req, res, 403, { error: 'Only the trip owner can do this' });
    return;
  }
  next();
}

export { requireTripAccess, requireTripOwner };
