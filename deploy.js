//npm install ssh2-sftp-client --save-dev


import 'dotenv/config';
import Client from 'ssh2-sftp-client';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sftp = new Client();

const config = {
  host: process.env.SFTP_HOST,
  port: 22,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_KEY, 
};

const localDir = path.join(__dirname, 'dist');
const remoteDir = './website/'; 

async function uploadDir(local, remote) {
    try {
      await sftp.connect(config);
      console.log('✅ Verbunden mit SFTP');
  
      try {
        await sftp.rmdir(remote, true); 
      } catch (err) {
        console.log('ℹ️ Kein altes Remote-Verzeichnis zum Löschen.');
      }
      console.log("Verzeichnis gelöscht");
  
      await sftp.mkdir(remote, true);
      console.log("Wir sind drin :)");
      await sftp.uploadDir(local, remote);
      console.log('🚀 Upload abgeschlossen!');
    } catch (err) {
      console.error('❌ Fehler beim Upload:', err.message);
    } finally {
      sftp.end();
    }
  }
  
  uploadDir(localDir, remoteDir);