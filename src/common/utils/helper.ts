import bcrypt from 'bcryptjs';
import { randomBytes, randomInt } from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { encode } from 'hi-base32';
import { ENVIRONMENT } from '../config';
import { IHashData, IToken } from '../interfaces';
import type { CookieOptions, Response, Request } from 'express';
import { promisify } from 'util';

const generateRandomString = () => {
	return randomBytes(32).toString('hex');
};

const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, 12);
};

const comparePassword = async (password: string, hashedPassword: string) => {
	return await bcrypt.compare(password, hashedPassword);
};

const generateRandomBase32 = () => {
	const buffer = randomBytes(15);
	return encode(buffer).replace(/=/g, '').substring(0, 24);
};

const generateRandom6DigitKey = () => {
	let randomNum = randomInt(0, 999999);

	// Ensure the number is within the valid range (000000 to 999999)
	while (randomNum < 100000) {
		randomNum = randomInt(0, 999999);
	}
	// Convert the random number to a string and pad it with leading zeros if necessary
	return randomNum.toString().padStart(6, '0');
};

// const toJSON = <T extends object>(obj: T, excludeFields: (keyof T)[] = []): Partial<T> => {
// 	const sanitizedObj: Partial<T> = JSON.parse(JSON.stringify(obj));

// 	// Default fields to exclude
// 	const defaultExclusions: (keyof T)[] = [
// 		'loginRetries',
// 		'lastLogin',
// 		'password',
// 		'updated_at',
// 		'ipAddress',
// 		'otp',
// 		'passwordResetRetries',
// 	] as (keyof T)[];

// 	// Merge provided fields with defaults (if not empty)
// 	const finalExclusions = excludeFields.length > 0 ? excludeFields : defaultExclusions;

// 	finalExclusions.forEach((field) => delete sanitizedObj[field]);

// 	return sanitizedObj;
// };

const toJSON = <T extends object>(obj: T | T[], excludeFields: (keyof T)[] = []): Partial<T> | Partial<T>[] => {
	// Helper function to sanitize a single object
	const sanitizeObject = (item: T): Partial<T> => {
		const sanitized: Partial<T> = JSON.parse(JSON.stringify(item));
		finalExclusions.forEach((field) => delete sanitized[field]);
		return sanitized;
	};

	// Default fields to exclude
	const defaultExclusions: (keyof T)[] = [
		'loginRetries',
		'lastLogin',
		'password',
		'updated_at',
		'ipAddress',
		'otp',
		'passwordResetRetries',
		'ownerId',
	] as (keyof T)[];

	// Use provided exclusions or default ones
	const finalExclusions = excludeFields.length > 0 ? excludeFields : defaultExclusions;

	// Handle array or single object
	if (Array.isArray(obj)) {
		return obj.map(sanitizeObject);
	} else {
		return sanitizeObject(obj);
	}
};

const parseTokenDuration = (duration: string): number => {
	const match = duration.match(/(\d+)([smhd])/);
	if (!match) return 0;

	const value = parseInt(match[1]);
	const unit = match[2];

	switch (unit) {
		case 's':
			return value * 1000;
		case 'm':
			return value * 60 * 1000;
		case 'h':
			return value * 60 * 60 * 1000;
		case 'd':
			return value * 24 * 60 * 60 * 1000;
		default:
			return 0;
	}
};

const isMobile = (req: Request): 'mobile' | 'browser' => {
	const customHeader = req.headers['100minds'];
	const userAgentHeader = req.headers['user-agent'];

	const customUserAgent = Array.isArray(customHeader) ? customHeader.join(' ') : customHeader || '';
	const browserUserAgent = Array.isArray(userAgentHeader) ? userAgentHeader.join(' ') : userAgentHeader || '';

	const userAgent = customUserAgent || browserUserAgent || '';
	if (userAgent.includes('mobile') || /android|iphone|ipad|mobile/i.test(userAgent)) {
		return 'mobile';
	}
	return 'browser';
};

const setCookie = (
	req: Request,
	res: Response,
	name: string,
	value: string,
	//options: CookieOptions = {},
	maxAge: number
) => {
	const clientType = isMobile(req);
	if (clientType === 'mobile') {
		if (name === 'accessToken') res.locals.newAccessToken = value;
		if (name === 'refreshToken') res.locals.newRefreshToken = value;
	} else {
		res.cookie(name, value, {
			httpOnly: true,
			secure: ENVIRONMENT.APP.ENV === 'production',
			path: '/',
			sameSite: ENVIRONMENT.APP.ENV === 'production' ? 'none' : 'lax',
			partitioned: ENVIRONMENT.APP.ENV === 'production',
			maxAge,
		});
	}
};

const dateFromString = async (value: string) => {
	const date = new Date(value);

	if (isNaN(date?.getTime())) {
		return false;
	}

	return date;
};

const createToken = (data: IHashData, options?: SignOptions, secret?: string) => {
	return jwt.sign({ ...data }, secret ? secret : ENVIRONMENT.JWT.AUTH_SECRET, {
		algorithm: 'HS256',
		expiresIn: options?.expiresIn,
	});
};

const verifyToken = async (token: string, secret?: string) => {
	const verifyAsync: (arg1: string, arg2: string) => jwt.JwtPayload = promisify(jwt.verify);

	const verify = verifyAsync(token, secret ? secret : ENVIRONMENT.JWT.AUTH_SECRET!);
	return verify;
};

const generateAccessToken = (userId: string): string => {
	return createToken(
		{ id: userId },
		{ expiresIn: parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS) },
		ENVIRONMENT.JWT.ACCESS_SECRET
	);
};

const generateRefreshToken = (userId: string): string => {
	return createToken(
		{ id: userId },
		{ expiresIn: parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH) },
		ENVIRONMENT.JWT.REFRESH_SECRET
	);
};

const isValidFileNameAwsUpload = (fileName: string): boolean => {
	const regex = /^([a-zA-Z0-9\s\-+_!@#$%^&*(),.\/]+)(?:\.(mp4|mov|webm|avi))$/i;
	return regex.test(fileName);
};

// const generateQrCode = async (data: string | Record<string, string[]>) => {
// 	const code = new Promise((resolve, reject) => {
// 		const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
// 		qrcode.toDataURL(dataString, (err, url) => {
// 			if (err) {
// 				reject(err);
// 			} else {
// 				resolve(url);
// 			}
// 		});
// 	});
// 	return code;
// };

const getDomainReferer = (req: Request) => {
	try {
		const referer = req.get('x-referer');

		if (!referer) {
			return `${ENVIRONMENT.FRONTEND_URL}`;
		}

		return referer;
	} catch (error) {
		return null;
	}
};

export {
	dateFromString,
	generateRandom6DigitKey,
	generateRandomBase32,
	generateRandomString,
	hashPassword,
	comparePassword,
	toJSON,
	parseTokenDuration,
	setCookie,
	createToken,
	verifyToken,
	isValidFileNameAwsUpload,
	generateAccessToken,
	generateRefreshToken,
	getDomainReferer,
};
