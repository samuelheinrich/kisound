// Thin song entry point; all resolution, encoding and validation logic is shared.
import {fileURLToPath} from 'node:url';
import {main} from '../../../../tools/export-video.mjs';
main(process.argv.slice(2),fileURLToPath(new URL('../..',import.meta.url))).catch(e=>{
 console.error(`Fehler: ${e.message}`);process.exitCode=1;
});
