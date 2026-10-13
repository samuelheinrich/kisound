# Contact sheet: python3 src/tools/sheet.py out.png img1.png img2.png … (2 columns, labels = file names)
import sys
from PIL import Image,ImageDraw
out,files=sys.argv[1],sys.argv[2:]
ims=[Image.open(f).convert('RGB') for f in files];w,h=ims[0].size;cols=2 if len(ims)>1 else 1;rows=(len(ims)+cols-1)//cols
sheet=Image.new('RGB',(cols*w,rows*(h+22)),'#222')
d=ImageDraw.Draw(sheet)
for i,(im,f) in enumerate(zip(ims,files)):
    x,y=(i%cols)*w,(i//cols)*(h+22);sheet.paste(im,(x,y+22));d.text((x+6,y+4),f.split('/')[-1],fill='#fff')
sheet.save(out)
