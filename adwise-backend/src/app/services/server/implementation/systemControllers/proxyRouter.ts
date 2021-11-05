import { Request, Response, Router } from "express";
import proxy from "express-http-proxy";
import { configProps } from "../../../config";
import { notificationService } from "../../../notificationService";

export const proxyRouter = Router();

proxyRouter.get('/qr-code', proxy('api.qrserver.com', {
    proxyReqPathResolver: (req: Request) => {
      const query = req.url.split('?')[1];
      return '/v1/create-qr-code?'+query;
    }
}));


proxyRouter.get('/media/:name', proxy(`${configProps.storageBucketUrl.replace('/'+configProps.storageBucketName, '')}`, {
  // proxyReqPathResolver: (req: Request) => {
    

  //   //;return path;
  // },
  preserveHostHdr: true,
  proxyReqOptDecorator: (req, srcReq) => {
    const path = `/${configProps.storageBucketName}/${configProps.storageBucketFolder}/${srcReq.params.name}`;
    
    console.log(`${configProps.storageBucketUrl.replace('/'+configProps.storageBucketName, '')}`);
    console.log(path);

    delete req.headers!['host'];
    req.path = path;

    delete (<any>req).params

    console.log(req);
    
    return req;
  }
}));

export const push = async (req: Request, res: Response) => {
  const result = await notificationService.sendNotification(req.body.app, req.body.pushToken, req.body.deviceToken, req.body.type, req.body.values, req.body.data);
  if (result.isFailure) {
    console.log(result.getError());
  }
  res.send('тутутутух');
};

export const ping = async (_: Request, res: Response) => {
  res.send('pong '+ process.pid);
};