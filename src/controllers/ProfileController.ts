import fs from 'fs';
import { Request, Response } from 'express';
import Profile from '../models/Profile';
import deleteFolderRecursive from '../utils/deleteFolderRecursive';
import saveUnzippedFiles from '../utils/saveUnzippedFiles';
import AdmZip from 'adm-zip';
import Certificate from '../utils/Certificate';

export const ProfileController = {

  create(req: Request, res: Response) {
    const data = req.body;
    const profile = new Profile(data);
    fs.writeFileSync(`./profiles/${profile.id}.json`, profile.toJSON());
    res.send(profile);
  },

  findAll(req: Request, res: Response) {
    try {
      const data = fs.readdirSync('./profiles');
      const json = [];
      for (const file of data) {
        const fileData = fs.readFileSync(`./profiles/${file}`);
        const formattedFileData = Buffer.from(fileData).toString();
        json.push(JSON.parse(formattedFileData));
      }
      res.send(json);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  findOne(req: Request, res: Response) {
    try {
      const data = fs.readFileSync(`./profiles/${req.params.name}.json`);
      res.send(data);
    } catch (error) {
      res.status(400).send('Nome inválido.');
    }
  },

  delete(req: Request, res: Response) {
    try {
      if (fs.existsSync(`./profiles/${req.params.id}.json`)) {
        fs.unlinkSync(`./profiles/${req.params.id}.json`);

        if (fs.existsSync(`./tmp/${req.params.id}`)) {
          deleteFolderRecursive(`./tmp/${req.params.id}`);
          
          res.send(200);
        }

        res.send(200);
      }
      else res.status(400).send('Perfil inválido.');
    } catch {
      res.status(400).send('Perfil inválido.');
    }
  },

  export(req: Request, res: Response) {
    try {
      if (fs.existsSync(`./profiles/${req.params.id}.json`)) {
        const zip = new AdmZip();

        zip.addLocalFile(`./profiles/${req.params.id}.json`);

        const _jsonEntry = zip.getEntries()[0];

        if (fs.existsSync(`./tmp/${req.params.id}`)) zip.addLocalFolder(`./tmp/${req.params.id}`, req.params.id);
        
        let _cache = zip.getEntries();
        _cache = [];
        
        zip.getEntries().forEach((entry, index) => {
          if (index > 0) _cache.push(entry);
        });

        zip.addFile('certificate.json', Buffer.from(JSON.stringify(new Certificate({_isLegit: true, _jsonEntry, _cache}), null, '\t')));

        const buffer = zip.toBuffer()

        res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-disposition': 'attachment;filename=' + `./${req.params.id}.zip`,
          'Content-Length': buffer.length
        });
        res.end(buffer);
      } else res.status(400).send('Perfil inválido.');
    } catch (error) {
      res.status(400).send('Perfil inválido.');
    }
  },

  import(req: Request, res: Response) {
    try {
      if (!!req.file) {
        const zip = new AdmZip(req.file.buffer);

        const certificateData = zip.getEntry('certificate.json');

        if (certificateData) {
          const certificateJSON = JSON.parse(zip.readAsText(certificateData));
          const { isLegit, cache, jsonEntry } = new Certificate(certificateJSON);

          if (isLegit) {
            saveUnzippedFiles(zip, jsonEntry.entryName, './profiles', res, true);
            
            if (cache) {
              cache.forEach((entry, index) => {
                saveUnzippedFiles(zip, entry.entryName, './tmp', res);
              });

              res.send(200);
            }

            res.send(200);
          }

          else res.status(400).send('Arquivo inválido.');
        }
      } else res.status(400).send('Erro na importação.');
    } catch (error) {
      res.status(400).send('Erro na importação.');
    }
  },

  async stealth(req: Request, res: Response) {
    try {
      const data = fs.readFileSync(`./profiles/${req.params.id}.json`);
      const formatter = Buffer.from(data).toString();
      const profile = new Profile(JSON.parse(formatter));
      await profile.start();
      res.send(profile);
    } catch (error) { 
      res.status(400).send('Nome inválido.');
    }
  },

};
