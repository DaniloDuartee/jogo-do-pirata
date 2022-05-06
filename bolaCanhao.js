class BolaCanhao {
    constructor(x,y){
        var opcoes = {
            isStatic: true     
          }

        this.imagem = loadImage("./assets/cannonball.png")
        this.animacao = [this.imagem]
        this.velocidade = 0.05
        this.raio = 30
        this.corpo = Bodies.circle(x,y,this.raio,opcoes)
        this.trajetoria = []
        World.add(mundo,this.corpo)
    }

    anima () {
      this.velocidade += 0.05
    }

    desenha() {
        var indice = floor(this.velocidade%this.animacao.length)
        push()
        translate (this.corpo.position.x,this.corpo.position.y)
        rotate (this.corpo.angle) 
        image(this.animacao[indice],0,0,this.raio,this.raio)
        pop()

        if (this.corpo.velocity.x > 0 && this.corpo.position.x > 10) {
        var posicao = [this.corpo.position.x, this.corpo.position.y]
        this.trajetoria.push(posicao)
        }

        for(var traj = 0; traj < this.trajetoria.length; traj++) {
        image(this.imagem,this.trajetoria[traj][0],this.trajetoria[traj][1],5,5)
         }

    }

    atira() {
    var novoAngulo = canhao.angulo - 28
    novoAngulo = novoAngulo *(3.14/180)

    var velocidade = p5.Vector.fromAngle(novoAngulo)
    velocidade.mult(0.5)

    Body.setStatic(this.corpo,false)
    Body.setVelocity(this.corpo,{
        x:velocidade.x *(180/3.14),
        y:velocidade.y *(180/3.14)
    })    
    }

  afunda(indice) {
    this.animacao = aguaAnimacao
    this.velocidade = 0.05
    this.raio = 150
      Body.setVelocity(this.corpo,{x:0,y:0})
    setTimeout(() =>{
        World.remove(mundo,this.corpo)
        delete bolas [indice]
    },1000)
  }
        
    
}