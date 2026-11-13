export async function operarRsa(rota, dados) {
  let resposta;
  try {
    resposta = await fetch('/api/' + rota, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    throw new Error('A conexão com a API falhou. Tente novamente.');
  }

  const resultado = await resposta.json().catch(() => null);
  if (!resposta.ok || !resultado) {
    throw new Error(resultado?.erro || 'A API não conseguiu processar a operação.');
  }
  return resultado;
}
