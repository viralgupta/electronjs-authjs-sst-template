import type { NextFunction, Request, Response } from "express"
import fs from 'fs';
import crypto from 'crypto';

export async function allowedToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const timestamp = req.headers.timestamp;
  const signature = req.headers.signature;

  if(!timestamp || !signature || typeof timestamp !== 'string' || typeof signature !== 'string') {
    return res.status(401).json({ message: "Not Authenticated" })
  }

  const publicKey = fs.readFileSync('public_key.pem', 'utf8');

  const verify = crypto.createVerify('SHA256');
  verify.update(timestamp);
  verify.end();

  const isValid = verify.verify(publicKey, signature, 'hex');

  const currentTime = Date.now();
  const oneMinute = 60 * 1000; 

  const timestampAge = currentTime - parseInt(timestamp, 10);

  if(isValid && timestampAge < oneMinute) {
    return next();
  }

  res.status(401).json({ message: "Not Authenticated" })
}
