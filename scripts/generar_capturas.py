from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import math
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'capturas'; OUT.mkdir(exist_ok=True)
W,H=1600,940
REG='/usr/share/fonts/truetype/lato/Lato-Regular.ttf'; BOLD='/usr/share/fonts/truetype/lato/Lato-Bold.ttf'; HEAVY='/usr/share/fonts/truetype/lato/Lato-Heavy.ttf'
C={'navy':'#0A1930','navy2':'#142B49','blue':'#3075ED','muted':'#8190A5','dark':'#22334C','line':'#E7EDF5','page':'#F5F8FC','green':'#14865B','amber':'#B87916'}
def font(size=20,bold=False):return ImageFont.truetype(BOLD if bold else REG,size)
def create(bg='#F5F8FC'):
 im=Image.new('RGB',(W,H),'#FFFFFF'); return im,ImageDraw.Draw(im)
def rr(d,box,fill,r=14,outline=None,width=1):d.rounded_rectangle(box,radius=r,fill='#FFFFFF' if fill in ('white','#FFFFFF','#F5F8FC','#F7F9FC') else '#F0F0F0',outline='#AAAAAA' if outline else None,width=width)
def txt(d,x,y,s,size=20,color='#26374E',bold=False):
 s=str(s).translate(str.maketrans({'◉':'O','⑂':'/','▷':'>','◈':'*','▧':'#','▤':'#','✓':'v','●':'o','×':'x','≋':'=','◈':'*'})); d.text((x,y),s,font=font(size,bold),fill='#000000')
def txt_right(d,x,y,s,size=20,color='#26374E',bold=False):
 b=d.textbbox((0,0),str(s),font=font(size,bold));txt(d,x-(b[2]-b[0]),y,s,size,color,bold)
def pill(d,x,y,text,fill,text_color):
 w=int(d.textbbox((0,0),text,font=font(15,True))[2]+30);rr(d,(x,y,x+w,y+30),fill,15);txt(d,x+15,y+6,text,15,text_color,True);return w
def demo(d):
 rr(d,(W-285,H-49,W-18,H-15),'#E7ECF4',8);txt(d,W-269,H-42,'VISTA ILUSTRATIVA',16,'#667B95',True)
def save(im,name):im.convert('L').convert('RGB').save(OUT/name,optimize=True)
def base_app():
 im,d=create();rr(d,(0,0,250,H),'#091A31',0)
 rr(d,(31,30,78,78),'#3477F2',12);txt(d,43,38,'N',29,'white',True);txt(d,93,31,'NOVA',30,'white',True);txt(d,94,67,'INVENTARIO / SQA',12,'#94A8C4',True)
 txt(d,34,133,'ESPACIO DE TRABAJO',13,'#7C92B0',True)
 rr(d,(18,175,231,227),'#1F3A5E',10);txt(d,39,189,'[ ] Panel general',20,'white',True)
 txt(d,39,248,'[ ] Productos',19,'#A7B7CE');txt(d,34,335,'ASEGURAMIENTO',13,'#7C92B0',True)
 txt(d,39,382,'[+] Control de calidad',18,'#A7B7CE');txt(d,39,428,'[#] Reportes SQA',18,'#A7B7CE')
 rr(d,(22,812,230,902),'#142B47',11);txt(d,40,824,'●  API / MySQL',17,'#C3D5EB');txt(d,40,860,'Operativo · 2026',15,'#7CA4D1')
 rr(d,(250,0,1600,74),'white',0);d.line((250,74,1600,74),fill='#E4EAF2',width=2)
 txt(d,294,23,'Espacio de trabajo   /   Dashboard',18,'#73839C');txt(d,1310,23,'● Conexión estable',17,'#2E9775');rr(d,(1502,14,1550,63),'#E2EBF9',25);txt(d,1513,28,'AD',18,'#3B75B8',True)
 txt(d,297,118,'RESUMEN OPERATIVO  •  NOVIEMBRE 2026',15,'#4B86D6',True);txt(d,296,153,'Panel de inventario',37,'#142A47',True)
 txt(d,298,209,'Control de productos y existencias con validaciones integradas.',18,'#7F8CA2')
 rr(d,(1366,148,1565,201),'#3075ED',11);txt(d,1386,163,'+ Nuevo producto',17,'white',True)
 return im,d
products=[
('Laptop Lenovo ThinkPad','TEC-001','Computación','Q 6,299.00','18','Disponible'),
('Monitor Samsung 24 pulgadas','TEC-002','Monitores','Q 1,299.00','12','Disponible'),
('Mouse Logitech M185','TEC-003','Accesorios','Q 115.00','4','Bajo'),
('Teclado mecánico Redragon','TEC-004','Accesorios','Q 395.00','9','Disponible'),
('Impresora Epson EcoTank','TEC-005','Impresoras','Q 2,499.00','3','Bajo'),
('SSD Kingston 1 TB','TEC-006','Almacenamiento','Q 549.00','25','Disponible'),
('Memoria RAM DDR4 16 GB','TEC-007','Componentes','Q 429.00','11','Disponible'),
('Webcam Logitech C270','TEC-009','Accesorios','Q 289.00','0','Agotado'),
]
def app_screen():
 im,d=base_app(); stats=[('PRODUCTOS','12','En catálogo','#E9F2FF','#3178E8'),('UNIDADES','108','Disponibles','#EEEAFE','#865ED4'),('POR REPONER','4','Stock igual o menor a 5','#FFF4DD','#C9901A'),('VALOR DE INVENTARIO','Q 173,770','Quetzales','#E2F8EE','#168A5D')]
 for i,(head,value,desc,fill,col) in enumerate(stats):
  x=297+i*318;rr(d,(x,268,x+298,412),'white',14,'#E8EDF4');txt(d,x+19,288,head,15,'#697C95',True);rr(d,(x+241,283,x+278,320),fill,9);txt(d,x+250,287,['#','+','!','Q'][i],23,col,True);txt(d,x+19,329,value,29 if i<3 else 26,'#152A44',True);txt(d,x+19,382,desc,15,'#9AA8BA')
 rr(d,(297,445,1568,895),'white',14,'#E6ECF4');txt(d,321,465,'ADMINISTRACIÓN',14,'#4381D5',True);txt(d,321,491,'Catálogo de productos',28,'#17304C',True);txt(d,321,529,'Consulta, edita y administra tu inventario.',16,'#8A9AB0');
 rr(d,(1380,474,1538,519),'white',9,'#D5E2F0');txt(d,1404,485,'Actualizar',17,'#47658D',True)
 d.line((297,564,1568,564),fill='#E8EDF5',width=2);rr(d,(323,576,766,616),'#F8FAFD',8,'#E6EDF6');txt(d,341,588,'Buscar por nombre, SKU o categoría...',16,'#9EAABE');txt(d,1442,590,'12 resultados',15,'#93A1B4');
 rr(d,(310,626,1555,663),'#F8FAFE',0);cols=[(330,'PRODUCTO'),(750,'SKU'),(897,'CATEGORÍA'),(1082,'PRECIO'),(1241,'STOCK'),(1360,'ESTADO'),(1470,'ACCIONES')];
 for x,h in cols:txt(d,x,637,h,13,'#9BA8B8',True)
 for i,row in enumerate(products[:5]):
  y=664+i*43;d.line((320,y+40,1548,y+40),fill='#EDF1F6',width=1);name,sku,cat,price,stock,st=row
  rr(d,(329,y+7,357,y+34),'#E7F0FC',7);txt(d,337,y+11,'+',15,'#3878D1',True)
  txt(d,366,y+11,name,16,'#233A57',True);txt(d,749,y+13,sku,15,'#77889C');txt(d,896,y+13,cat,15,'#77889C');txt(d,1081,y+13,price,16,'#263B58',True);txt(d,1240,y+13,stock,16,'#75869A')
  color=('#E4F8EF','#238B61') if st=='Disponible' else ('#FFF0D2','#A87918')
  pill(d,1349,y+7,st,*color);txt(d,1482,y+12,'Editar',14,'#397CC9',True);txt(d,1530,y+12,'×',17,'#C76B7A',True)
 demo(d);save(im,'01_inventario_dashboard.png')
 return im
app_screen()
def form_screen():
 im,d=base_app();overlay=Image.new('RGBA',(W,H),(255,255,255,60));im=Image.alpha_composite(im.convert('RGBA'),overlay).convert('RGB');d=ImageDraw.Draw(im)
 rr(d,(481,142,1122,821),'white',22);txt(d,522,178,'CATÁLOGO / PRODUCTOS',16,'#4381D5',True);txt(d,521,213,'Editar producto',34,'#182D49',True);txt(d,1070,202,'×',27,'#8094A8')
 fields=[('SKU','TEC-003',523,289),('CATEGORÍA','Accesorios',819,289),('NOMBRE DEL PRODUCTO','Mouse Logitech M185',523,417),('PRECIO (Q)','115.00',523,548),('EXISTENCIAS','4',819,548)]
 for lbl,value,x,y in fields:
  txt(d,x,y,lbl,16,'#506784',True);width=275 if x==819 or y!=417 else 567;rr(d,(x,y+32,x+width,y+91),'#FFFFFF',9,'#D9E4F0',2);txt(d,x+16,y+48,value,21,'#253951')
 rr(d,(772,704,896,763),'white',10,'#CAD7E8');txt(d,793,722,'Cancelar',18,'#5A6D88',True)
 rr(d,(915,704,1080,763),'#3075ED',10);txt(d,930,722,'Guardar producto',17,'white',True)
 demo(d);save(im,'02_edicion_producto.png')
form_screen()

def workflow(title,failed=False):
 im,d=create('#0D1117');rr(d,(0,0,W,80),'#161B22',0);txt(d,58,22,'◉',31,'#E6EDF3',True);txt(d,108,27,'codehost / inventario-nova-sqa',22,'#E6EDF3',True);txt(d,1280,26,'Code   Issues   Pull requests',16,'#ADB9C7');
 rr(d,(0,80,W,141),'#0D1117',0);txt(d,81,101,'<> Code',18,'#A1ABBB');txt(d,242,101,'⑂ Pull requests',18,'#D8E1EA',True);txt(d,454,101,'▷ Actions',18,'#A1ABBB');txt(d,600,101,'◈ Security',18,'#A1ABBB')
 txt(d,83,178,title,34,'#E7EEF7',True);txt(d,85,239,'#24  ·  feature/validacion-de-precios  →  main',19,'#94A9BE')
 bar='#9D3947' if failed else '#258B69';head='Hay validaciones que no cumplen los criterios' if failed else 'Todas las verificaciones obligatorias aprobaron';
 rr(d,(83,290,1091,372),'#151E27',11,'#343E4B',2);rr(d,(96,303,147,357),bar,12);txt(d,113,310,'×' if failed else '✓',34,'white',True);txt(d,170,306,head,23,'#F0F4F8',True);txt(d,170,341,'Revisión automática de cambios / Pull request #24',16,'#92A5BB')
 rr(d,(82,403,1092,792),'#151B23',12,'#343E4B',2);txt(d,113,427,'Checks',23,'#F0F4F7',True);d.line((101,467,1077,467),fill='#313C49',width=2)
 names=['build / Frontend + API','test / Jest + Supertest + React Testing Library','analyze / ESLint + cobertura + Sonar','report / Resumen y decisión']
 dur=['1m 04s','2m 18s','54s','7s']
 for i,n in enumerate(names):
  y=487+i*70;rowfailed=(failed and i in (1,2,3));symbol='×' if rowfailed else '✓';col='#FA737C' if rowfailed else '#40CE9C';txt(d,114,y,symbol,24,col,True);txt(d,156,y,n,21,'#D9E3EF',True);txt_right(d,1052,y,dur[i],18,'#8B9AAE');
  if i<3:d.line((103,y+53,1078,y+53),fill='#2D3946',width=1)
 rr(d,(1127,291,1537,792),'#151B23',12,'#343E4B',2);txt(d,1161,324,'Estado de la revisión',23,'#F3F6FA',True)
 txt(d,1160,378,'◉   Pull request listo' if not failed else '◉   Merge bloqueado',21,'#58D8A8' if not failed else '#F4818C',True)
 for j,s in enumerate(['1 revisor obligatorio','4 comprobaciones de calidad','Sin commits directos a main']):txt(d,1160,441+j*44,'✓ ' + s,17,'#9CB5C7')
 rr(d,(1154,636,1507,689),'#258B69' if not failed else '#56323A',9);txt(d,1191,654,'Permitir merge' if not failed else 'Merge no disponible',20,'white',True)
 txt(d,1158,719,'Regla de protección: main',16,'#8396AB')
 demo(d);save(im,'03_pipeline_aprobado.png' if not failed else '04_quality_gate_rechazado.png')
workflow('Validar reglas de inventario',False);workflow('Rechazo ante cobertura insuficiente',True)

def sonar():
 im,d=create('#F7F9FC');rr(d,(0,0,1600,77),'#FFFFFF',0);rr(d,(28,17,77,58),'#16639F',10);txt(d,42,20,'S',26,'white',True);txt(d,94,24,'Quality dashboard   /   Inventario Nova',24,'#2B4765',True);txt(d,1310,26,'Análisis de código',17,'#72869A');
 rr(d,(0,77,252,940),'#FFFFFF',0);d.line((252,77,252,940),fill='#E1E8F1',width=2);txt(d,39,122,'PROYECTO',14,'#89A0B6',True);txt(d,35,169,'◉  Resumen',20,'#27639A',True);txt(d,35,235,'≋  Métricas',20,'#7890A6');txt(d,35,300,'◈  Problemas',20,'#7890A6');txt(d,35,365,'▧  Cobertura',20,'#7890A6');txt(d,35,429,'▤  Duplicaciones',20,'#7890A6')
 txt(d,296,120,'RESUMEN DE CALIDAD',15,'#4684C4',True);txt(d,295,158,'Análisis de Inventario Nova',36,'#24425E',True);txt(d,298,212,'Rama main   •   Análisis de ejemplo: 05 nov 2026',18,'#889AB0')
 rr(d,(1218,145,1532,226),'#E2F7ED',16);txt(d,1240,155,'QUALITY GATE',15,'#247452',True);txt(d,1240,179,'✓  PASSED',27,'#168358',True)
 nums=[('Cobertura','82.4%','+54.4 puntos','% de código probado','#1C9673'),('Bugs','0','−3 incidencias','Fallos detectados','#3476CB'),('Code smells','4','−14 observaciones','Mantenibilidad','#A77B24'),('Duplicación','1.1%','−5.1 puntos','Duplicación en el código','#795AC8')]
 for i,(h,v,diff,desc,col) in enumerate(nums):
  x=296+i*310;rr(d,(x,283,x+286,468),'white',14,'#E0E9F2',2);txt(d,x+21,306,h,19,'#71849B',True);txt(d,x+20,350,v,41,col,True);txt(d,x+19,408,diff,17,'#2E9775',True);txt(d,x+19,438,desc,14,'#91A2B7')
 rr(d,(296,502,1532,827),'white',14,'#E0E9F2',2);txt(d,322,522,'Evolución de calidad (cifras de demostración)',23,'#2C465F',True)
 d.line((360,747,1450,747),fill='#B8C5D5',width=2)
 bars=[('Antes',28,18,6.2),('Después',82.4,4,1.1)]
 for i,(lb,cov,issues,dup) in enumerate(bars):
  x=580+i*482;w=145;h=int(cov/100*170);rr(d,(x,747-h,x+w,747),'#B9D0EF' if i==0 else '#3978D1',8)
  txt(d,x+23,740-h-41,f'{cov}%',23,'#446E9F',True);txt(d,x+32,758,lb,20,'#596C85',True);txt(d,x+175,583,f'{issues} code smells',17,'#7A8BA0');txt(d,x+175,612,f'{dup}% duplicación',17,'#7A8BA0')
 demo(d);save(im,'05_sonar_dashboard_ilustrativo.png')
sonar()

def branches():
 im,d=create('#0F141C');rr(d,(0,0,1600,83),'#18212D',0);txt(d,80,23,'◉  Repository Settings',27,'#E5EFF8',True)
 rr(d,(47,128,373,897),'#192331',14);txt(d,80,171,'General',20,'#AAB9C7');txt(d,80,230,'Access',20,'#AAB9C7');txt(d,80,300,'Code and automation',18,'#AAB9C7',True);rr(d,(62,354,347,408),'#2A3B50',10);txt(d,94,368,'Branches',20,'white',True);txt(d,80,441,'Actions',20,'#AAB9C7');
 txt(d,424,145,'Reglas de protección de ramas',34,'#E8F0F9',True);txt(d,425,206,'Rama principal: main',20,'#9BAEC1')
 rr(d,(424,272,1524,788),'#192331',14,'#3B4C5E',2)
 checks=['Requerir un pull request antes de fusionar','Requerir 1 aprobación de revisor','Requerir comprobaciones de estado antes de fusionar','Requerir que las ramas estén actualizadas','Bloquear force-push y eliminación de main']
 for i,c in enumerate(checks):
  y=318+75*i;rr(d,(462,y,490,y+28),'#225C56',7,'#49B6A2',2);txt(d,466,y+1,'✓',22,'#A9F8D9',True);txt(d,511,y,c,21,'#D9E6F3')
 rr(d,(470,713,1190,754),'#26394A',8);txt(d,490,722,'Required checks: build  ·  test  ·  analyze  ·  report',18,'#C6DAF2',True)
 demo(d);save(im,'06_proteccion_main_ilustrativa.png')
branches()
print('Capturas generadas:',*[p.name for p in OUT.glob('*.png')],sep='\n')
