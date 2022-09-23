import express, { NextFunction, Request, Response } from 'express';
import State from '../models/stateSchema';
import LGA from '../models/LGASchema';

const getStates = async (req: Request, res: Response, next: NextFunction) => {
    const doc = await State.find().exec();

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc,
        },
    });
};

const getLGAs = async (req: Request, res: Response, next: NextFunction) => {
      const doc = await State.find({ state: req.body.state })
          .select('-state')
          .select('-alias')
          .select('-_id')
          .select('-__v')
          .exec();

      // SEND RESPONSE
      res.status(200).json({
          status: 'success',
          results: doc.length,
          data: {
              data: doc,
          },
      });
}

export const otherControllerExports = {
    getStates,
    getLGAs
};
