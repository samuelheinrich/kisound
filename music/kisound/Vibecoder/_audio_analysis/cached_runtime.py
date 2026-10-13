"""Use compatible, already cached Python wheels without network or installation.

This bootstrap is specific to the local Apple Silicon/Python 3.12 environment.
With a conventional venv, the same dependencies can be installed normally.
"""
from pathlib import Path
import sys, os
base=Path.home()/'.cache/uv/archive-v0'
pins={'mlx':'0.32.3','numpy':'2.3.5','numba':'0.63.1','torch':'2.10.0','huggingface_hub':'0.36.0'}
choices={}
for p in base.iterdir():
    for d in p.glob('*.dist-info'):
        wh=d/'WHEEL'
        tags=[x[5:].strip() for x in wh.read_text().splitlines() if x.startswith('Tag:')] if wh.exists() else []
        if not any(t.startswith(('py3-none-any','py2.py3-none-any','cp312-','cp39-abi3','cp310-abi3','cp311-abi3','cp38-abi3')) for t in tags): continue
        name,version=d.name[:-10].rsplit('-',1)
        if name in pins and version!=pins[name]: continue
        if name not in choices: choices[name]=(p,version)
sys.path[:0]=[str(p) for p,v in choices.values()]
os.environ.setdefault('PYTHONDONTWRITEBYTECODE','1')
os.environ.setdefault('HF_HUB_OFFLINE','1')
os.environ.setdefault('NUMBA_CACHE_DIR','/tmp/kisound-token-burn-numba')
if __name__=='__main__':
    print({n:v for n,(p,v) in choices.items() if n in pins or n in {'mlx_whisper','transformers','safetensors'}},flush=True)
