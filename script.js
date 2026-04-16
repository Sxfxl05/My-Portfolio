/* ═══════════════════════════════
   CURSOR
══════════════════════════════ */
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur2.style.left=mx+'px';cur2.style.top=my+'px';});
(function animCur(){cx+=(mx-cx)*0.1;cy+=(my-cy)*0.1;cur.style.left=cx+'px';cur.style.top=cy+'px';requestAnimationFrame(animCur);})();

/* ═══════════════════════════════
   HERO PARTICLE FIELD
══════════════════════════════ */
const hc=document.getElementById('hero-canvas');
const hx=hc.getContext('2d');
function resizeHero(){hc.width=window.innerWidth;hc.height=window.innerHeight;}
resizeHero();
window.addEventListener('resize',resizeHero);

const CHARS='01アイウエオカキ<>[]{}#$%&*ABCDEFsec';
const cols=Math.floor(window.innerWidth/18);
const drops=Array(cols).fill(0).map(()=>Math.random()*-100);
const speeds=Array(cols).fill(0).map(()=>0.3+Math.random()*0.7);
const opacities=Array(cols).fill(0).map(()=>0.3+Math.random()*0.7);

function drawMatrix(){
  hx.fillStyle='rgba(3,8,10,0.06)';
  hx.fillRect(0,0,hc.width,hc.height);
  for(let i=0;i<cols;i++){
    const ch=CHARS[Math.floor(Math.random()*CHARS.length)];
    const brightness=Math.random()>0.97?1:0.25;
    hx.fillStyle=`rgba(0,255,65,${brightness*opacities[i]})`;
    hx.font=`${11+Math.random()*4}px JetBrains Mono`;
    hx.fillText(ch,i*18,drops[i]*18);
    drops[i]+=speeds[i];
    if(drops[i]*18>hc.height&&Math.random()>0.97)drops[i]=0;
  }
}
setInterval(drawMatrix,60);

/* ═══════════════════════════════
   RADAR
══════════════════════════════ */
const rc=document.getElementById('radar-canvas');
const rx=rc.getContext('2d');
const cx2=150,cy2=150,R=120;
const skills=['SOC','SIEM','Cloud','PenTest','ML/AI','Forensics'];
const vals=[0.92,0.88,0.80,0.82,0.85,0.72];
const cols2=['#00ff41','#00cc33','#00aa28','#007a1f','#005c18','#003d10'];
let radarAngle=0;

function drawRadar(){
  rx.clearRect(0,0,300,300);
  const n=6;
  for(let ring=1;ring<=4;ring++){
    const r=(R/4)*ring;
    rx.beginPath();
    for(let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2-Math.PI/2;
      const x=cx2+r*Math.cos(a),y=cy2+r*Math.sin(a);
      i===0?rx.moveTo(x,y):rx.lineTo(x,y);
    }
    rx.closePath();
    rx.strokeStyle=`rgba(0,255,65,${0.06+ring*0.03})`;
    rx.lineWidth=0.5;
    rx.stroke();
  }
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2-Math.PI/2;
    rx.beginPath();
    rx.moveTo(cx2,cy2);
    rx.lineTo(cx2+R*Math.cos(a),cy2+R*Math.sin(a));
    rx.strokeStyle='rgba(0,255,65,0.1)';
    rx.lineWidth=0.5;
    rx.stroke();
  }
  // scan line
  rx.save();
  rx.translate(cx2,cy2);
  rx.rotate(radarAngle);
  const grad=rx.createLinearGradient(0,0,R,0);
  grad.addColorStop(0,'rgba(0,255,65,0.4)');
  grad.addColorStop(1,'rgba(0,255,65,0)');
  rx.beginPath();
  rx.moveTo(0,0);
  rx.arc(0,0,R,-0.5,0,false);
  rx.fillStyle=grad;
  rx.fill();
  rx.restore();
  radarAngle+=0.025;

  // skill fill
  rx.beginPath();
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2-Math.PI/2;
    const r=R*vals[i];
    const x=cx2+r*Math.cos(a),y=cy2+r*Math.sin(a);
    i===0?rx.moveTo(x,y):rx.lineTo(x,y);
  }
  rx.closePath();
  rx.fillStyle='rgba(0,255,65,0.08)';
  rx.fill();
  rx.strokeStyle='rgba(0,255,65,0.5)';
  rx.lineWidth=1.5;
  rx.stroke();

  // dots + labels
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2-Math.PI/2;
    const r=R*vals[i];
    const dx=cx2+r*Math.cos(a),dy=cy2+r*Math.sin(a);
    rx.beginPath();
    rx.arc(dx,dy,3.5,0,Math.PI*2);
    rx.fillStyle=cols2[0];
    rx.fill();
    rx.shadowColor=cols2[0];
    rx.shadowBlur=8;
    rx.fill();
    rx.shadowBlur=0;

    const lx=cx2+(R+22)*Math.cos(a);
    const ly=cy2+(R+22)*Math.sin(a);
    rx.fillStyle='rgba(0,255,65,0.55)';
    rx.font='9px JetBrains Mono';
    rx.textAlign='center';
    rx.textBaseline='middle';
    rx.fillText(skills[i],lx,ly);
  }
  requestAnimationFrame(drawRadar);
}
drawRadar();

/* ═══════════════════════════════
   TYPED TEXT
══════════════════════════════ */
const msgs=[
  'Building AI-powered SOC systems that think before threats strike.',
  'Detecting LotL attacks with 90%+ ML precision on 50K event corpora.',
  'Architecting AWS deception grids — catching adversaries in under 2 minutes.',
  'Automating triage: 40% reduction in manual incident response overhead.',
];
let ti=0,ci=0,del=false;
const tel=document.getElementById('typed-line');
function typer(){
  const cur2t=msgs[ti];
  if(!del){tel.textContent=cur2t.slice(0,ci++);if(ci>cur2t.length){del=true;setTimeout(typer,2200);return;}}
  else{tel.textContent=cur2t.slice(0,ci--);if(ci<0){del=false;ti=(ti+1)%msgs.length;ci=0;}}
  setTimeout(typer,del?18:40);
}
typer();

/* ═══════════════════════════════
   SCROLL REVEAL
══════════════════════════════ */
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in'),i*70);}
  });
},{threshold:0.08});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

/* ═══════════════════════════════
   SKILL BARS ON SCROLL
══════════════════════════════ */
const sobs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.sfill').forEach(b=>{
        setTimeout(()=>{b.style.width=b.dataset.w+'%';},200);
      });
    }
  });
},{threshold:0.3});
document.querySelectorAll('.skill-block').forEach(b=>sobs.observe(b));

/* ═══════════════════════════════
   NAV ACTIVE SCROLL
══════════════════════════════ */
const navLinks=document.querySelectorAll('.nlinks a');
window.addEventListener('scroll',()=>{
  const pos=window.scrollY+200;
  document.querySelectorAll('section[id]').forEach(s=>{
    if(pos>=s.offsetTop&&pos<s.offsetTop+s.offsetHeight){
      navLinks.forEach(a=>{
        a.style.color=a.getAttribute('href')==='#'+s.id?'var(--g)':'';
      });
    }
  });
});
