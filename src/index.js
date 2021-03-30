import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// Componente de Função Square
function Square (props) {
  //console.log(props)

  return (
      <button className={`square ${props.vencedor ? 'square--winner' : '' }`} onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare (i) {
    //console.log('the i', i)

  let vencedor = false; 

  if (this.props.vencedor)       
      vencedor = this.props.vencedor.indexOf(i) >= 0


   return <Square key={i} vencedor={vencedor} value={this.props.quadrados[i]} onClick={() => this.props.onClick(i)} />
  }

  // renderiza a linha do tabuleiro
  // i = linha atual do tabuleiro
  renderRow (i) { 

    // vamos mutiplicar a linha atual do tabuleiro por 3
    // e atribuir a i, assim cada coluna tem um id único
    let rowItems = [];
        i = i * 3

    // loop renderiza cada coluna da linha atual
    for (let n = 0; n < 3; n++, i++ ) {
      rowItems[n] = this.renderSquare(i)
    }
   // console.log('rowItems ', rowItems)
    return <div key={i} className="board-row">{rowItems}</div>
  }


  render() {
    //matriz bidimensional que será nosso tabuleiro
    let matrix = [[],[]]

    // vamos processar 3 linhas, armazenando cada uma
    // em matrix[m]

     for ( let m = 0; m < 3; m++ ) 
      matrix[m] = this.renderRow(m)

    return (
      <div>
        {matrix}
      </div>
    )
  }
}

// Instância que controla o jogo e sua renderização
class Game extends React.Component {

  constructor (props) {
    super (props)
    this.state = {
      history: [{
        quadrados: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

   handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const atual = history[history.length - 1]

    // criamos uma array com o state de cada quadrado
    const quadrados = atual.quadrados.slice();

    if ( calcularVencedor(quadrados) || quadrados[i]  ) {
      return;
    }

  // mudamos o state do quadrado clicado
    quadrados[i] = this.state.xIsNext ? 'X' : 'O';
    // atualizamos o status da array no componente Game
    this.setState({
      history: history.concat([{
        quadrados: quadrados
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length

    })   

  }

  //criandoo método jumpTo
  jumpTo (jogada) {
    this.setState ({
      stepNumber: jogada,
      xIsNext: (jogada % 2) === 0  
    })
  }

  render() {
   const historico = this.state.history
   const atual = historico[this.state.stepNumber]
   const vencedor = calcularVencedor(atual.quadrados)
   let nomeVencedor
   if (vencedor) {
     nomeVencedor = atual.quadrados[vencedor[0]]
    // vencedor.map((i) =>  )
   }

   console.log(atual)

   //console.log(nomeVencedor)
   // Mapeando o histórico de jogadas
  const jogadas = historico.map((step, jogada) => {
    const desc = jogada ? 
    "Jogada #" + jogada : 
    "Início do Jogo"

    let jogadaAtual = jogada === this.state.stepNumber  

    return(
      <li className={`item item-jogada ${jogadaAtual ?
                     "item-jogada--atual" : ""} `} key={jogada}> 
        <button className="botao botao-jogada" onClick={() => this.jumpTo(jogada)}>{desc}</button>
      </li>
      )
   })

   let status

   if (vencedor) {
      status = "Vencedor: " + nomeVencedor
   } else if (this.state.stepNumber === 9) {
      status = "Empate!"
   } else {
    status = 'Próximo jogador: ' + (this.state.xIsNext ? 'X' : 'O')
   }


    return (
      <div className="game">
        <div className="game-board">
          <div className="status" >{status}</div>
          <Board 
            quadrados={atual.quadrados}
            vencedor={vencedor}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          
          <h2 className="title">Jogadas</h2>
          <ol>{jogadas}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calcularVencedor (quadrados) {
  // possíveis combinações (para ganhar o jogo)
  const linhas = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  // vamos avaliar se há match em alguma combinação
  // se houver, retornamos o vencedor
  for (let i = 0; i < linhas.length; i++) {
    const [a,b,c] = linhas[i]
    //console.log('quadrados: ', quadrados[a])
    if (quadrados[a] && quadrados[a] === quadrados[b] && quadrados[a] === quadrados[c]) {
      return linhas[i]
    }
  }
  return null
}