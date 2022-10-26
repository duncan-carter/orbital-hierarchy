var newParticle = {
  Name: "default",
  Size: 10,
  fillStyle: "#ffff00",
  Mass: 10
};

var panelTitle = "Orbital Hierarchy";
var settings = QuickSettings.create(350,50, panelTitle);



var particleNames = [];


class Particle {
// setting the co-ordinates, radius and the
// speed of a particle in both the co-ordinates axes.
  constructor(){
    //this.x = random(0,400);
    //this.y = random(0,400);
    this.x = width/2;
    this.y = height/2;
    //this.r = random(5,25);
    this.r = newParticle.Size;
    this.pos = new p5.Vector(this.x,this.y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(0.01);
    this.m = this.r*this.r*0.05;
    this.name = newParticle.Name;
  }
  update(){
    this.pos.add(this.velocity);
    
  }

// creation of a particle.
  createParticle() {
    noStroke();
    fill('rgba(255,255,255,1.0)');
    circle(this.pos.x,this.pos.y,this.r);
    textSize(11);
    fill(255);
    text(this.name,this.pos.x + this.r/2 + 3, this.pos.y - this.r/2 + 3);
  }
  

  applyForce(force){
    let F = force.copy();
    F.div(this.m);
    this.velocity.add(F);
      
    
  }
  attract(target){
    let F = this.pos.copy();
    F = F.sub(target.pos).normalize();
    let d = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
    F.setMag(1/d);
    target.applyForce(F);
    
  }


// this function creates the connections (lines)
// between particles which are less than a certain distance apart
  joinParticles(particles) {
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if(dis<85) {
        stroke('rgba(255,255,255,0.04)');
        line(this.x,this.y,element.x,element.y);
      }
    });
  }
}

// an array to add multiple particles
let particles = [];

function removeElem(index){
    
  settings.removeControl("Mass"+str(index));
  let name = particles[index].name;
  //print(name)
  settings.removeControl(name)
  particles.splice(index,1);
}
function addElem(){
  
  particles.push(new Particle());
  particleNames.push(newParticle.Name);
  //settings.setValue("Particle",particleNames);
  
  settings.addBoolean(newParticle.Name,1,function(){
    let index = particles.length - 1;
    removeElem(index)
  });
  let index = particles.length - 1;
  //settings.bindRange("Mass"+str(index),1,100,10,1,particles[index]);
  settings.bindRange("r",1,100,10,1,particles[index]);
  settings.hideTitle("r");
  //print(particleNames);
  print("New Particle Created");
}



function setup() {
  createCanvas(width, height);
  //particles.push(new Particle());
  //settings.addDropDown("Particle", particleNames);
  settings.bindText("Name", "default", newParticle);
  //settings.bindRange("Size",1,100,10,1,newParticle);
  //settings.bindColor("Colour", "#FFFFFF", newParticle)
  settings.addButton("Add Element", function() {
			//particles.push(new Particle());
    addElem();
		});
}




function draw() {
  background(0);
  
  for(let i = 0;i<particles.length;i++) {
    particles[i].update();
    particles[i].createParticle();
    particles[i].joinParticles(particles.slice(i));
    for (let j = 0; j<particles.length;j++){
      if (j != i) {
        particles[i].attract(particles[j]);
      }
      
    }
    
    
  }
}




