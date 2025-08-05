import { Request } from "../web_server/core/Request";
import { Response } from "../web_server/core/Response";
import { MiddlewareFunction } from "../web_server/interfaces/middlewareFunction";
import { ImageDao } from "../dao/ImageDao";
import { Image } from "../model/Image";
import { staticPath } from "../app";
import { cacheClient } from "../utill/CacheClient";

const CHANNEL = 'image';
cacheClient.subscribe(CHANNEL);


export const getImage: MiddlewareFunction = async (req: Request, res: Response, next) => {
    const imageDao = new ImageDao(req.dbConnection);
    const images = await imageDao.findByPostId(parseInt(req.params.postId));
    images.forEach((image: Image) => {
        image.file_path = image.file_path.replace(staticPath, '');
    });

    cacheClient.setCache(req, images);
    res.status(200).json(images);
}

export const createImage: MiddlewareFunction = async (req: Request, res: Response, next) => {
    const imageDao = new ImageDao(req.dbConnection);
    const imageId = [];

    req.files.forEach(async (file: any) => {
        const image = new Image({
            postId: req.params.postId, 
            author: req.session.user.id,
            fileName: file.name,
            fileOriginalName: file.originalName,
            filePath: file.path,
            fileSize: file.size
        });
        imageId.push(await imageDao.create(image));
    });
    
    cacheClient.publish(CHANNEL, req);
    res.status(201).json({ imageId });
}