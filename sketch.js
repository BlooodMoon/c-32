const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var blower;
var bg_img;
var food;
var rabbit;

var button;
var bunny;

var mute_btn;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation ('blink_1.png', 'blink_2.png', 'blink_3.png');
  eat = loadAnimation ('eat_0.png', 'eat_1.png', 'eat_2.png', 'eat_3.png', 'eat_4.png');
  sad = loadAnimation ('sad_1.png', 'sad_2.png', 'sad_3.png');

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound('sad.wav');
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound ('eating_sound.mp3');
  air = loadSound ('air.wav');

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;

}

function setup() {
  createCanvas(500,700);
  frameRate(144);

  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(420,620,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation ('blinking', blink);
  bunny.addAnimation ('eating', eat);
  bunny.addAnimation ('crying', sad);
  bunny.changeAnimation ('blinking');
  
  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);
  
  rope = new Rope(7,{x:245,y:30});
  ground = new Ground(200,690,600,20);

  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);

  blower = createImg('balloon.png');
  blower.position (10, 250);
  blower.size (150, 100);
  blower.mouseClicked (airblow);

  mute_btn = createImg ('mute.png');
  mute_btn.position(450, 20);
  mute_btn.size (50, 50);
  mute_btn.mouseClicked (mute);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,width/2,height/2,490,690);

  if(fruit!=null){
  image(food,fruit.position.x,fruit.position.y,70,70);
  }

  rope.show();
  Engine.update(engine);
  ground.show();

  if(collide(fruit,bunny)===true){
    bunny.changeAnimation('eating');
    eating_.play ();
  }

  if(fruit!=null && fruit.position.y >= 650){
    bunny.changeAnimation('crying')
    bk_song.stop();
    sad_sound.play();
    sad_sound.setVolume(0.2);
  }

   drawSprites();
}

function drop()
{
  cut_sound.play ();
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

function collide(body,sprite){
  if(body!=null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    
    if (d<=80){
      World.remove(engine.world,fruit);
      fruit = null;
      return true;
    }
    else{
      return false;
    }
  }
}

function airblow(){
  Matter.Body.applyForce (fruit, {x:0, y:0}, {x:0.01, y:0});
  air.play();
}

function mute(){
  if (bk_song.isPlaying()){
    bk_song.stop();
  }
  else {
    bk_song.play()
  }
}
