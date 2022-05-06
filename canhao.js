class Canhao {
  constructor(angulo) {
    var opcoes = {
      isStatic: true
    }

    this.x = 180
    this.y = 110
    this.angulo = angulo
    this.canhaoImagem = loadImage("./assets/canon.png")
    this.baseImagem = loadImage("./assets/cannonBase.png")
    this.corpo = Bodies.rectangle(this.x, this.y, 100, 50, opcoes)
    World.add(mundo, this.corpo)
  }

  desenha() {
    if(keyIsDown(LEFT_ARROW) && this.angulo >-30) {
        this.angulo = this.angulo -1
              }
      if(keyIsDown(RIGHT_ARROW) && this.angulo <70) {
        this.angulo = this.angulo +1
      }
    push()
    translate(this.corpo.position.x, this.corpo.position.y)
    rotate(this.angulo)
    image(this.canhaoImagem,0,0,130, 100)
    pop()
    image(this.baseImagem,160,127,200,200)
  }
}