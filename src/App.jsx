import React, { useEffect, useState } from 'react';
import { operarRsa } from './api.js';
import imagemGta from './gta-vi.jpeg';
import logoRsaVi from './rsa-vi-logo.jpeg';

const etapas = [
  { rota: 'chaves', nome: 'Gerar chaves', titulo: 'Gere seu par de chaves', descricao: 'Informe dois números primos diferentes e um expoente público.', acao: 'Gerar par de chaves' },
  { rota: 'criptografar', nome: 'Criptografar', titulo: 'Criptografe uma mensagem', descricao: 'Use a chave pública para transformar o texto em uma sequência de números.', acao: 'Criptografar mensagem' },
  { rota: 'descriptografar', nome: 'Descriptografar', titulo: 'Recupere a mensagem', descricao: 'Informe o texto cifrado e os valores da chave privada correspondente.', acao: 'Descriptografar mensagem' },
];

function Campo({ nome, valor, editar, dica, minimo = 2, opcional = false }) {
  return <label className="campo">
    <span>{nome} {opcional && <small>opcional</small>}</span>
    <input type="number" min={minimo} step="1" required={!opcional} value={valor} onChange={(evento) => editar(evento.target.value)} placeholder={dica} />
  </label>;
}

export function App() {
  const [aba, setAba] = useState(0);
  const [primo1, setPrimo1] = useState('');
  const [primo2, setPrimo2] = useState('');
  const [expoente, setExpoente] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [publica, setPublica] = useState({ e: '', n: '' });
  const [privada, setPrivada] = useState({ d: '', n: '' });
  const [cifra, setCifra] = useState('');
  const [resultados, setResultados] = useState({});
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rsaVi, setRsaVi] = useState(false);
  const nome = rsaVi ? 'RSA VI' : 'RSA Lab';

  useEffect(() => {
    document.title = nome + ' — Laboratório de criptografia';
  }, [nome]);

  const etapa = etapas[aba];
  const resultado = resultados[etapa.rota];

  function selecionar(indice) {
    setAba(indice);
    setErro('');
    setFeedback('');
  }

  function carregarExemplo() {
    setPrimo1('61');
    setPrimo2('53');
    setExpoente('17');
    setMensagem('OLA MUNDO');
    selecionar(0);
  }

  async function enviar(evento) {
    evento.preventDefault();
    setOcupado(true);
    setErro('');
    setFeedback('');
    try {
      let dados;
      if (aba === 0) {
        dados = { primo1: Number(primo1), primo2: Number(primo2) };
        if (expoente !== '') dados.expoente = Number(expoente);
      } else if (aba === 1) {
        dados = { mensagem, expoente: Number(publica.e), n: Number(publica.n) };
      } else {
        let texto;
        try {
          texto = JSON.parse(cifra);
        } catch {
          throw new Error('Digite uma lista JSON de números, como [1752, 134].');
        }
        if (!Array.isArray(texto) || !texto.every((numero) => Number.isSafeInteger(numero) && numero >= 0)) {
          throw new Error('A lista deve conter apenas inteiros não negativos.');
        }
        dados = { texto, expoente: Number(privada.d), n: Number(privada.n) };
      }
      const resposta = await operarRsa(etapa.rota, dados);
      setResultados((anteriores) => ({ ...anteriores, [etapa.rota]: resposta }));
      if (aba === 0) {
        setPublica(resposta.chavePublica);
        setPrivada(resposta.chavePrivada);
      } else if (aba === 1) {
        setCifra(JSON.stringify(resposta.texto));
        if (dados.mensagem === 'GTA VI') setRsaVi(true);
      }
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setOcupado(false);
    }
  }

  async function copiar() {
    try {
      const conteudo = aba === 0 ? JSON.stringify(resultado, null, 2) : aba === 1 ? JSON.stringify(resultado.texto) : resultado.texto;
      await navigator.clipboard.writeText(conteudo);
      setFeedback('Copiado.');
    } catch {
      setFeedback('Não foi possível copiar. Selecione o resultado manualmente.');
    }
  }

  return <div className="pagina">
    <header className="topo">
      <div className="marca">
        {rsaVi
          ? <img className="marca-vi" src={logoRsaVi} alt="RSA VI" width="1600" height="682" />
          : <><span className="logo" aria-hidden="true">⬡</span> RSA <span className="marca-lab">LAB</span></>}
      </div>
      <button className="botao exemplo" type="button" onClick={carregarExemplo} disabled={ocupado}>Carregar exemplo <span aria-hidden="true">↗</span></button>
    </header>
    <main>
      <section className={rsaVi ? 'hero hero-vi' : 'hero'} aria-labelledby="titulo">
        <div className="hero-texto">
          <h1 id="titulo">Laboratório<br />de criptografia<span>.</span></h1>
          <p>Gere chaves, transforme uma mensagem em números e recupere o texto original com RSA.</p>
        </div>
        {rsaVi
          ? <img className="arte-vi" src={imagemGta} alt="Ilustração de dois personagens de GTA VI" width="1280" height="1280" />
          : <div className="orbita" aria-hidden="true"><div className="anel"><div className="nucleo">⬡</div></div><span className="orbita-label">c = mᵉ mod n</span></div>}
      </section>
      <nav className="etapas" aria-label="Operações RSA">
        {etapas.map((item, indice) => <button type="button" key={item.rota} aria-pressed={aba === indice} disabled={ocupado} onClick={() => selecionar(indice)}>
          <span className="numero" aria-hidden="true">0{indice + 1}</span>{item.nome}
        </button>)}
      </nav>
      <div className="painel">
        <section className="entrada">
          <h2>{etapa.titulo}</h2><p>{etapa.descricao}</p>
          <form onSubmit={enviar}>
            <fieldset disabled={ocupado}>
              {aba === 0 && <>
                <div className="campos">
                  <Campo nome="Primeiro primo (p)" valor={primo1} editar={setPrimo1} dica="61" />
                  <Campo nome="Segundo primo (q)" valor={primo2} editar={setPrimo2} dica="53" />
                </div>
                <Campo nome="Expoente público (e)" valor={expoente} editar={setExpoente} dica="65537" opcional />
              </>}
              {aba === 1 && <>
                <label className="campo">Mensagem<textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="OLA MUNDO" required /></label>
                <div className="campos">
                  <Campo nome="Expoente público (e)" valor={publica.e} editar={(e) => setPublica({ ...publica, e })} dica="17" minimo={1} />
                  <Campo nome="Módulo (n)" valor={publica.n} editar={(n) => setPublica({ ...publica, n })} dica="3233" />
                </div>
              </>}
              {aba === 2 && <>
                <label className="campo">Texto cifrado (JSON)<textarea value={cifra} onChange={(e) => setCifra(e.target.value)} placeholder="[1752]" required /></label>
                <div className="campos">
                  <Campo nome="Expoente privado (d)" valor={privada.d} editar={(d) => setPrivada({ ...privada, d })} dica="2753" minimo={1} />
                  <Campo nome="Módulo (n)" valor={privada.n} editar={(n) => setPrivada({ ...privada, n })} dica="3233" />
                </div>
              </>}
              <button className="botao acao" type="submit">{ocupado ? 'Processando…' : etapa.acao} <span aria-hidden="true">→</span></button>
            </fieldset>
            {erro && <p className="erro" role="alert">{erro}</p>}
          </form>
        </section>
        <section className="saida" aria-labelledby="saida-titulo">
          <header><h2 id="saida-titulo">Resultado</h2>{resultado && <button className="botao copiar" type="button" onClick={copiar}>Copiar</button>}</header>
          <div className="console" aria-live="polite" aria-busy={ocupado}>
            {resultado ? aba === 0 ? <>
              <div className="chave"><span>Chave pública</span><code>e = {resultado.chavePublica.e}<br />n = {resultado.chavePublica.n}</code></div>
              <div className="chave"><span>Chave privada</span><code>d = {resultado.chavePrivada.d}<br />n = {resultado.chavePrivada.n}</code></div>
            </> : <pre>{aba === 1 ? JSON.stringify(resultado.texto) : resultado.texto || 'Mensagem vazia'}</pre> : <div className="vazio"><span aria-hidden="true">›_</span><p>O resultado aparece aqui.</p></div>}
          </div>
          <div className="saida-rodape">
            <span role="status">{feedback}</span>
            {resultado && aba < 2 && <button className="botao proxima" type="button" disabled={ocupado} onClick={() => selecionar(aba + 1)}>{etapas[aba + 1].nome} →</button>}
          </div>
        </section>
      </div>
    </main>
    <footer className="rodape"><span>{nome.toUpperCase()}</span><span>Ferramenta didática · Use dados de exemplo.</span></footer>
  </div>;
}
