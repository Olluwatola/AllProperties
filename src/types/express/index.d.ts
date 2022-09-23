import express from 'express';

declare global {
    namespace Express {
        interface Request {
            token?: string;
            user?: Record<string, any>;
            id?: string;
            images?: Array<File>;
            verificationStatus?: string;
        }
    }
}
