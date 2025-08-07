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
  const [acertouBloco, setAcertouBloco] = useState(false)

  const cano = useRef(null)
  const nuvens = useRef(null)
  const mario = useRef(null)
  const gameBoard = useRef(null)
  const bloco = useRef(null)
  const pontosBloco = useRef(null)
  
  useEffect(() => {
    setTimeout(() => {
      if (!acertouBloco) return
      setAcertouBloco(false)
      pontosBloco.current.src = ''
      pontosBloco.current.style = ''
      bloco.current.src = './imagens/bloco-morto.gif'
    }, 2000)
  }, [acertouBloco])

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

      const posicaoEmbaixoMario = +window.getComputedStyle(mario.current).bottom.replace('px', '') // posicao do pé do mario

      const posicaoEsquerdaBloco = bloco.current.offsetLeft // posicao do bloco

      const posicaoEsquerdaCano = cano.current.offsetLeft // posicao cano

      const posicaoEsquerdaNuvens = nuvens.current.offsetLeft //posicao nuvem

      if (posicaoEsquerdaCano <= 120 && posicaoEsquerdaCano > 0 && posicaoEmbaixoMario < 100) {
        setComecou(false)
        mario.current.style.bottom = `${posicaoEmbaixoMario}px`
        mario.current.src = "./imagens/game-over.png"
        mario.current.style.width = "75px"
        mario.current.style.marginLeft = "50px"

        cano.current.style.left = `${posicaoEsquerdaCano}px`

        nuvens.current.style.left = `${posicaoEsquerdaNuvens}px`

        bloco.current.style.left = `${posicaoEsquerdaBloco}px`

      }

      if (posicaoEmbaixoMario >= 130 && posicaoEsquerdaBloco <= 120 && posicaoEsquerdaBloco > 0) {
        console.log("oi")
        const listaImagens = ['cem', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos']
        let numero = Math.floor(Math.random() * 5)
        
        pontosBloco.current?.style.left = `${posicaoEsquerdaBloco}px`
        pontosBloco.current?.src = `./imagens/${listaImagens[numero]}-pontos.gif`

        bloco.current.src = './imagens/bloco-transicao.gif'
        numero++
        if (melhorPontuacao == pontos) {
          setMelhorPontuacao(prev => prev + numero * 100)
        }

        setPontos(prev => prev + numero * 100)
        setAcertouBloco(true)
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
        {acertouBloco && <img ref={pontosBloco} alt='pontosBloco' className="pontosBloco"></img>}
        <img ref={bloco} src='./imagens/bloco-vivo.gif' alt='bloco' className={`bloco ${comecou ? 'bloco-animado' : ''}`}/>
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