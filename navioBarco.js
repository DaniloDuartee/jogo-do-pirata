class Barco {
  constructor (x,y,posicao,animacao) {
    this.imagem = loadImage('./assets/boat.png')
    this.posicao = posicao 
    this.animacao = animacao
    this.velocidade = 0.05
    this.largura = 170
    this.altura = 170
    this.estaQuebrado = false
    this.corpo = Bodies.rectangle(x,y,170,170)
    World.add(mundo,this.corpo)
  }

   anima () {
   this.velocidade += 0.05 
  }

  desenha () {
    var indice = floor(this.velocidade%this.animacao.length)
    push ()
    translate (this.corpo.position.x,this.corpo.position.y)
    rotate (this.corpo.angle) 
    image (this.animacao[indice],0,this.posicao,this.largura,this.altura)
    pop () 
  }

  afunda(indice) {
    this.largura = 300
    this.altura = 300
    this.animacao = barcoQuebradoAnimacao
    this.velocidade = 0.05
    this.estaQuebrado = true
  setTimeout(() =>{
      World.remove(mundo,barcos[indice].corpo)
      delete barcos [indice]
  },2000)
}
}