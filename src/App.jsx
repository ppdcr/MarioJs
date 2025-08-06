import { useState, useEffect, useRef, use} from 'react'
import './App.css'

function App() {

  const [comecou, setComecou] = useState(false)
  const [tentativas, setTentativas] = useState(0)
  const [pontos, setPontos] = useState(0)
  const [melhorPontuacao, setMelhorPontuacao] = useState(0)
  const [cenario, setCenario] = useState(true)
  const [tempo, setTempo] = useState(0)
  const [velocidade, setVelocidade] = useState(0)

  const cano = useRef(null)
  const nuvens = useRef(null)
  const mario = useRef(null)
  const gameBoard = useRef(null)
  const bloco = useRef(null)
  
  useEffect(() => {
    if (tentativas == 0) return
    if (cenario) {
      gameBoard.current.classList.remove('noite')
      gameBoard.current.classList.add('noite-dia')
      setTimeout(() => {
        gameBoard.current.classList.remove('noite-dia')
      }, 1000)
    } else {
      gameBoard.current.classList.remove('dia')
      gameBoard.current.classList.add('dia-noite')
      setTimeout(() => {
        gameBoard.current.classList.remove('dia-noite')
      }, 1000)
    }
  }, [cenario])

  useEffect(() => {
    if (!comecou) return
    const mudaCenario = setTimeout(() => {
      setCenario(!cenario)
    }, 7000)
    return () => clearTimeout(mudaCenario)
  }, [comecou, cenario])

  useEffect(() => {
    function pular(e) {
      if (e.code === 'Space') {
        if (!comecou) {

          setTentativas(tentativas + 1)
          setComecou(true)
          setTempo(0)
          setPontos(0)
          mario.current.src = "./imagens/mario.gif"
          mario.current.className = "mario"
          mario.current.style = ''

          cano.current.style = ''
          cano.current.className = "cano"

          nuvens.current.style = ''
          nuvens.current.className = "nuvens"
        }
        if (!mario.current.classList.contains('pulo')) {
          mario.current.classList.add('pulo')
          setTimeout(() => {
            mario.current.classList.remove('pulo')
          }, 500)
        }
        
      }
    }
    window.addEventListener('keydown', pular)
    return () => window.removeEventListener('keydown', pular)
  }, [comecou, mario])

  useEffect(() => {
    if (!comecou) return
    const loop = setInterval(() => {
      setTempo(prevTempo => prevTempo + 0.01)
      setPontos(prevPontos => prevPontos + 0.02)
      if (tentativas == 1 || pontos >= melhorPontuacao) {
        setMelhorPontuacao(prevMelhor => prevMelhor + 0.02)
      }

      if (!cenario) {
        setVelocidade(prev => prev + 0.00015)
      }
      cano.current.style.animationDuration = `${2 - (velocidade)}s`
      nuvens.current.style.animationDuration = `${2 - (velocidade)}s`

      const posicaoMario = +window.getComputedStyle(mario.current).bottom.replace('px', '')
      
      const posicaoCano = cano.current.offsetLeft
      const posicaoNuvens = nuvens.current.offsetLeft

      if (posicaoCano <= 120 && posicaoCano > 0 && posicaoMario < 80) {

        mario.current.style.bottom = `${posicaoMario}px`
        mario.current.style.animation = 'none'
        mario.current.src = "./imagens/game-over.png"
        mario.current.style.width = "75px"
        mario.current.style.marginLeft = "50px"
        mario.current.style.marginBottom = "20px"

        cano.current.style.animation = 'none'
        cano.current.style.left = `${posicaoCano}px`

        nuvens.current.style.animation = 'none'
        nuvens.current.style.left = `${posicaoNuvens}px`

        setComecou(false)
      }
    }, 10)
    return () => clearInterval(loop)
  }, [comecou, tentativas, pontos, melhorPontuacao])


  return (
    <>
      <div ref={gameBoard}  className={`game-board
        ${!comecou && tentativas != 0 ? 'perdeu' : ''}
        ${cenario ? 'dia' : 'noite'}`}>
        <img ref={mario} src="./imagens/mario.gif" alt='mario' className="mario"/>
        <img ref={bloco} src='./imagens/block.png' alt='bloco' className={`bloco ${comecou ? 'bloco-animado' : ''}`}/>
        <img ref={cano} src="./imagens/pipe.png" alt='cano' className={`cano ${comecou ? 'cano-animado' : ''}`}/>
        <img ref={nuvens} src="./imagens/clouds.png" alt='nuvens' className={`nuvens ${comecou ? 'nuvens-animadas' : ''}`}/>
      </div>
      <div className='informacoes'>
        <div className='esquerda'>
          <h2>Tempo: {`${Math.floor(tempo / 60).toString().padStart(2, '0')}:${Math.floor(tempo % 60).toString().padStart(2, '0')},${Math.floor((tempo % 1) * 100).toString().padStart(2, '0')}`}</h2>
          <h2>Tentativas: {tentativas}</h2>
          {!comecou && (
            <h3 className='piscar'>Clique espaço para começar</h3>)}
        </div>
        <div className='direita'>
          <h2>Pontos: {pontos.toFixed(2)}</h2>
          <h2>Melhor pontuação: {melhorPontuacao.toFixed(2)}</h2>
        </div>
      </div>
        
    </>
  )
}

export default App