import tempfile,shutil,subprocess,os,json
from pathlib import Path
source=Path(__file__).resolve().parents[2];real=source.parents[1]/'videos/kisound'
with tempfile.TemporaryDirectory(prefix='kisound-global-test-') as tmp:
 root=Path(tmp)/'videos';(root/'tools').mkdir(parents=True)
 shutil.copy2(real/'tools/export-video.mjs',root/'tools/export-video.mjs')
 def stage(name):
  p=root/'Album'/name;p.mkdir(parents=True)
  original=real/'Network-Engineer-Album01/00_Network_Engineers'
  shutil.copytree(original/'src',p/'src')
  (p/'node_modules').symlink_to(original/'node_modules',target_is_directory=True)
  shutil.copytree(original/'assets',p/'assets')
  audio=source/'Network-Engineer-Album01/00_Network_Engineers/00_Network_Engineers_0.4-1.wav'
  (p/'assets/audio').mkdir(exist_ok=True)
  target=p/'assets/audio/network-engineers.wav'
  target.unlink(missing_ok=True)
  target.symlink_to(audio)
  data=json.loads((original/'package.json').read_text())
  data['scripts']={k:v for k,v in data['scripts'].items() if not k.startswith('export:')}
  (p/'package.json').write_text(json.dumps(data))
  return p
 first=stage('Existing Song');rc=Path(tmp)/'.zshrc';rc.write_text('# preserve my shell settings\n')
 cmd=['python3',str(source/'script/setup_code_video_exports.py'),'--video-root',str(root),'--zshrc',str(rc),'--apply']
 subprocess.run(cmd,check=True,stdout=subprocess.DEVNULL)
 assert rc.read_text().startswith('# preserve my shell settings\n')
 for res in ['1080p','4k']:
  subprocess.run(['npm','run','export:'+res,'--','--check'],cwd=first,check=True,stdout=subprocess.DEVNULL)
 future=stage('Future Song')
 subprocess.run(['zsh','-f','-c','source "$1"; kisound-render 4k --check','test',str(rc)],cwd=future/'src',check=True,stdout=subprocess.DEVNULL)
 assert not (future/'render-export.json').exists()
 assert 'export:4k' not in json.loads((future/'package.json').read_text())['scripts']
 subprocess.run(cmd,check=True,stdout=subprocess.DEVNULL)
 before=rc.read_bytes()
 archives=len(list((root/'_revisions').glob('*.tar.gz')))
 subprocess.run(cmd,check=True,stdout=subprocess.DEVNULL)
 assert rc.read_bytes()==before
 assert len(list((root/'_revisions').glob('*.tar.gz')))==archives
 assert not list(root.rglob('*.mp4'))
 print('PASS: Installation, vorhandene npm-Aufrufe, neue Projekte ohne Konfiguration/npm-Eintrag, Start aus Unterordnern, idempotente Shell-Einrichtung. Kein Render.')
