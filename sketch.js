const Engine = Matter.Engine
const World = Matter.World
const Bodies = Matter.Bodies
const Body = Matter.Body
const Constraint = Matter.Constraint

var motor, mundo
var chao
var fundoImagem
var canhao, baseCanhao, bolaCanhao
var torre, torreImagem
var angulo 
var bolas = []
var barcos = []

var barcoQuebradoDado,barcoQuebradoImagem
var barcoDados, barcoImagens
var aguaDados, aguaImagens

var barcoAnimacao = []
var barcoQuebradoAnimacao = []
var aguaAnimacao = []

var fimJogo = false

var pirataSom, jogoSom, canhaoSom, aguaSom
var estaRindo = false

var pontos = 0

function preload() {
  fundoImagem = loadImage('./assets/background.gif')
  torreImagem = loadImage('./assets/tower.png')
  barcoDados = loadJSON("./assets/boat/boat.json")
  barcoImagens = loadImage("./assets/boat/boat.png")
  barcoQuebradoDado = loadJSON("./assets/boat/broken_boat.json")
  barcoQuebradoImagem = loadImage("./assets/boat/broken_boat.png")
  aguaDados = loadJSON("./assets/water_splash/water_splash.json")
  aguaImagens = loadImage("./assets/water_splash/water_splash.png")
  jogoSom = loadSound("./assets/background_music.mp3")
  canhaoSom = loadSound("./assets/cannon_explosion.mp3")
  aguaSom = loadSound("./assets/cannon_water.mp3")
  pirataSom = loadSound("./assets/pirate_laugh.mp3")
}

function setup() {
  createCanvas(1200, 600)

  motor = Engine.create()
  mundo = motor.world
  
  angleMode(DEGREES)
  rectMode(CENTER)
  imageMode(CENTER)

  var opcoes = {
    isStatic: true
  }

  chao = Bodies.rectangle(600, 599, 1200, 2, opcoes)
  World.add(mundo, chao)

  torre = Bodies.rectangle(160, 350, 160, 310, opcoes)
  World.add(mundo, torre)

  angulo = 15
  canhao = new Canhao(angulo)
  
  var quadrosBarco = barcoDados.frames
  for (var index = 0; index < quadrosBarco.length; index++) {
    var posicao = quadrosBarco[index].position
    var imagem = barcoImagens.get(posicao.x,posicao.y,posicao.w,posicao.h)
    barcoAnimacao.push(imagem)
  }


  var quadrosBarcoQuebrado = barcoQuebradoDado.frames
  for (var index = 0; index < quadrosBarcoQuebrado.length; index++) {
    var posicao = quadrosBarcoQuebrado[index].position
    var imagem = barcoQuebradoImagem.get(posicao.x,posicao.y,posicao.w,posicao.h)
    barcoQuebradoAnimacao.push(imagem)
  }

  var quadrosAgua = aguaDados.frames
  for (var index = 0; index < quadrosAgua.length; index++) {
    var posicao = quadrosAgua[index].position
    var imagem = aguaImagens.get(posicao.x,posicao.y,posicao.w,posicao.h)
    aguaAnimacao.push(imagem)
  }
}

function draw() {
  background('red')
  image(fundoImagem, 600, 300, 1200, 600)

  if (!jogoSom.isPlaying()) {
    jogoSom.play()
    jogoSom.setVolume(0.1)
  }

  Engine.update(motor)

  rect(chao.position.x, chao.position.y, 1200, 2)

  image(torreImagem, torre.position.x, torre.position.y, 160, 310)

  desenhaBarcos ()
  
  for (var bola = 0; bola < bolas.length; bola++) {
    desenhaBolasCanhao (bolas[bola],bola)
    colisaoBarco(bola) 
  }
  
  canhao.desenha () 

  fill("#6d4c41")
  textSize(40)
  textAlign(CENTER,CENTER)
  text(`Pontos: ${pontos}`, width -200,50)
}

function keyReleased() {
   if(keyCode === DOWN_ARROW && !fimJogo) {
    bolas[bolas.length - 1].atira()
    canhaoSom.play()
   }
}

function keyPressed() {
  if(keyCode === DOWN_ARROW && !fimJogo) {
    bolaCanhao = new BolaCanhao(canhao.x,canhao.y)
    bolaCanhao.trajetoria = []
    bolas.push(bolaCanhao)
   }
}

function desenhaBolasCanhao(bola,indice) {
  if(bola){
    bola.desenha()
    bola.anima()
    if(bola.corpo.position.x >= width || bola.corpo.position.y >= height- 50 ) {
      aguaSom.play()
      aguaSom.setVolume(0.4)
      bola.afunda(indice)
    }
  }
}

function desenhaBarcos () {

  if (barcos.length >0) {  
    if (barcos[barcos.length -1] === undefined || 
        barcos[barcos.length -1].corpo.position.x < width -300
    ) {
      var posicoes = [-40,-60,-70,-20]
      var posicao = random(posicoes)
      var barco = new Barco(width,height - 100,posicao,barcoAnimacao)
      barcos.push(barco)
    }

    for (var index = 0; index < barcos.length; index++) {
      
      if (barcos[index]) {
        
        Body.setVelocity(barcos[index].corpo,{
          x: - 0.9,
          y: 0
        })
        
        barcos[index].desenha()
        barcos[index].anima()

        var colisao = Matter.SAT.collides(torre,barcos[index].corpo)
        if (colisao.collided && !barcos[index].estaQuebrado) {
          if (!estaRindo && !pirataSom.isPlaying()) {
            pirataSom.play()
            estaRindo = true
          }
          fimJogo = true
          finalJogo()
        }
      } else {
        
        barcos[index]
      }       
    }

  } else { 
    
    var barco = new Barco(width ,height - 60,-60,barcoAnimacao)
    barcos.push(barco)
  }
}

function colisaoBarco(posicaoBola){
    for (var posicao = 0; posicao < barcos.length; posicao++) {
      if (bolas[posicaoBola] !== undefined && barcos[posicao] !== undefined && !barcos[posicao].estaQuebrado ) {
        var colisao = Matter.SAT.collides(bolas[posicaoBola].corpo,barcos[posicao].corpo)
        if (colisao.collided) {
          barcos[posicao].afunda(posicao)
          pontos += 5
          World.remove(mundo,bolas[posicaoBola].corpo)
          delete bolas[posicaoBola]
        }
  
      }

    }

}

function finalJogo () {
swal({
  title: "fim de jogo",
  text: "obrigado por jogar",
  imageUrl: 'https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png',
  imageSize: "150x150",
  confirmButtonText: "jogar novamente"
},
(isConfirm) => {
if (isConfirm) {
location.reload()
}
})
}