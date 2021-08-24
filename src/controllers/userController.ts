import fs from 'fs';
import { json, Request, Response } from 'express';
import AdmZip from 'adm-zip';

import { User } from '../models/User';
import deleteFolderRecursive from '../utils/deleteFolderRecursive';
import Certificate, { Entry } from '../utils/Certificate';
import saveUnzippedFiles from '../utils/saveUnzippedFiles';

export const UserController = {

  create(req: Request, res: Response) {
    const data = req.body;
    fs.writeFileSync(`./users/${data.email}.json`, JSON.stringify(data));
    res.send(data);
  },

  findAll(req: Request, res: Response) {
    try {
      const data = fs.readdirSync('./users');
      const json = [];
      for (const file of data) {
        const fileData = fs.readFileSync(`./users/${file}`);
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
      const data = fs.readFileSync(`./users/${req.params.email}.json`);
      res.send(data);
    } catch (error) {
      res.status(400).send('Email inválido.');
    }
  },

  delete(req: Request, res: Response) {
    try {
      if (fs.existsSync(`./users/${req.params.email}.json`)) {
        fs.unlinkSync(`./users/${req.params.email}.json`);

        if (fs.existsSync(`./tmp/${req.params.email}`)) {
          deleteFolderRecursive(`./tmp/${req.params.email}`);
          
          res.send(200);
        }

        res.send(200);
      }
      else res.status(400).send('Email inválido.');
    } catch {
      res.status(400).send('Email inválido.');
    }
  },

  export(req: Request, res: Response) {
    try {
      if (fs.existsSync(`./users/${req.params.email}.json`)) {
        const zip = new AdmZip();

        zip.addLocalFile(`./users/${req.params.email}.json`);

        const _jsonEntry = zip.getEntries()[0];

        if (fs.existsSync(`./tmp/${req.params.email}`)) zip.addLocalFolder(`./tmp/${req.params.email}`, req.params.email);
        
        let _cache = zip.getEntries();
        _cache = [];
        
        zip.getEntries().forEach((entry, index) => {
          if (index > 0) _cache.push(entry);
        });

        zip.addFile('certificate.json', Buffer.from(JSON.stringify(new Certificate({_isLegit: true, _jsonEntry, _cache}), null, '\t')));

        zip.writeZip(`./${req.params.email}.zip`);

        res.send(200);
      } else res.status(400).send('Email inválido.');
    } catch (error) {
      res.status(400).send('Email inválido.');
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
            saveUnzippedFiles(zip, jsonEntry.entryName, './users', res);
            
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
      const data = fs.readFileSync(`./users/${req.params.email}.json`);
      const formatter = Buffer.from(data).toString();
      const user = new User(JSON.parse(formatter));
      await user.start();
      res.send(user);
    } catch (error) {
      res.status(400).send('Email inválido.');
    }
  },

};
