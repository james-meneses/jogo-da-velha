import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// Componente de Função Square
function Square (props) {
  return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}


class Board extends React.Component {

  renderSquare (i) {
   return <Square value={this.props.quadrados[i]}
                  onClick={() => this.props.onClick(i)} />
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
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
      xIsNext: true
    }
  }

   handleClick (i) {
    const history = this.state.history
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
      xIsNext: !this.state.xIsNext

    })   

  }

  render() {
   const historico = this.state.history
   const atual = historico[historico.length - 1]
   const vencedor = calcularVencedor(atual.quadrados)

   let status

   if (vencedor) {
      status = "Vencedor: " + vencedor
   } else {
    status = 'Próximo jogador: ' + (this.state.xIsNext ? 'X' : 'O')
   }


    return (
      <div className="game">
        <div className="game-board">
          <div className="status">{status}</div>
          <Board 
            quadrados={atual.quadrados}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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

  for (let i = 0; i < linhas.length; i++) {
    const [a,b,c] = linhas[i]
    //console.log('quadrados: ', quadrados[a])
    if (quadrados[a] && quadrados[a] === quadrados[b] && quadrados[a] === quadrados[c]) {
      return quadrados[a]
    }
  }
  return null
}