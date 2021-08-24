import AdmZip from "adm-zip";
import { Response } from "express";
import * as yup from 'yup';
import { isUuid } from 'uuidv4';

const saveUnzippedFiles = (zip: AdmZip, entryName: string, targetDir: string, res: Response, userEntry: boolean = false) => {
  const userJsonEntry = zip.getEntry(entryName);

  if (userJsonEntry && !userEntry) zip.extractEntryTo(userJsonEntry, targetDir);

  else if (userJsonEntry && userEntry) {
    const schema = yup.object().shape({
      id: yup.string().required(),
      name: yup.string().required(),
      os: yup.string().required(),
      browser: yup.string().required(),
      language: yup.string().required(),
      viewport: yup.string().required(),
    });

    const jsonAux = JSON.parse(zip.readAsText(userJsonEntry));

    schema.isValid(jsonAux).then(function (valid) {
      if (valid && isUuid(jsonAux.id)) {
        zip.extractEntryTo(userJsonEntry, targetDir);
      }

      else res.status(400).send('Arquivo inválido.');
    })
  }

  else res.status(400).send('Arquivo inválido.');
}

export default saveUnzippedFiles;