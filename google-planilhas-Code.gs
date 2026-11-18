/**
 * MAIA CONSTRUÇÃO — Sincronização com Google Planilhas
 * Cole este código em: Planilha Google > Extensões > Apps Script
 * Troque a SENHA abaixo e use a MESMA senha no sistema (Mais > Google Planilhas).
 */
const SENHA = 'TROQUE-ESTA-SENHA';
const ARQUIVO_BACKUP = 'maia-sistema-backup.json';

function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    if (req.token !== SENHA) return resposta({ ok: false, erro: 'senha incorreta' });
    if (req.action === 'push') {
      salvarBackup(req.data);
      escreverPlanilhas(req.data);
      return resposta({ ok: true });
    }
    return resposta({ ok: false, erro: 'ação inválida' });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  }
}

function doGet(e) {
  if ((e.parameter.token || '') !== SENHA) return resposta({ ok: false, erro: 'senha incorreta' });
  if (e.parameter.action === 'pull') return resposta({ ok: true, data: lerBackup() });
  return resposta({ ok: true, msg: 'Sistema Maia conectado' });
}

function resposta(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function salvarBackup(data) {
  const txt = JSON.stringify(data);
  const it = DriveApp.getFilesByName(ARQUIVO_BACKUP);
  if (it.hasNext()) it.next().setContent(txt);
  else DriveApp.createFile(ARQUIVO_BACKUP, txt, MimeType.PLAIN_TEXT);
}

function lerBackup() {
  const it = DriveApp.getFilesByName(ARQUIVO_BACKUP);
  return it.hasNext() ? JSON.parse(it.next().getBlob().getDataAsString()) : null;
}

function aba(ss, nome, cab, linhas) {
  const sh = ss.getSheetByName(nome) || ss.insertSheet(nome);
  sh.clearContents();
  sh.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold').setBackground('#242629').setFontColor('#ffffff');
  if (linhas.length) sh.getRange(2, 1, linhas.length, cab.length).setValues(linhas);
  sh.setFrozenRows(1);
}

function escreverPlanilhas(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const P = d.produtos || [], V = d.vendas || [], D = d.despesas || [], C = d.clientes || [];
  aba(ss, 'Produtos', ['Nome', 'Código', 'Categoria', 'Unidade', 'Custo', 'Preço venda', 'Preço desconto', 'Estoque', 'Estoque mín.', 'Ativo'],
    P.map(p => [p.nome, String(p.codigo || ''), p.categoria || '', p.unidade || '', +p.custo || 0, +p.preco || 0, +p.precoDesc || '', +p.estoque || 0, +p.estoqueMin || 0, p.ativo === false ? 'não' : 'sim']));
  aba(ss, 'Vendas', ['Nº', 'Data', 'Cliente', 'Pagamento', 'Subtotal', 'Desconto extra', 'Total', 'Custo', 'Lucro', 'Status'],
    V.map(v => [v.num, new Date(v.data), v.clienteNome || '', v.pagamento, v.subtotal, v.descontoExtra || 0, v.total, v.custoTotal, v.lucro, v.status]));
  const itens = [];
  V.forEach(v => (v.itens || []).forEach(i => itens.push([v.num, new Date(v.data), i.nome, String(i.codigo || ''), i.qtd, i.preco, i.desc ? 'sim' : 'não', i.custo, i.preco * i.qtd, (i.preco - i.custo) * i.qtd, v.status])));
  aba(ss, 'Itens vendidos', ['Venda', 'Data', 'Produto', 'Código', 'Qtd', 'Preço unit.', 'Com desconto', 'Custo unit.', 'Total', 'Lucro', 'Status'], itens);
  aba(ss, 'Despesas', ['Data', 'Descrição', 'Categoria', 'Valor'], D.map(x => [x.data, x.descricao, x.categoria, x.valor]));
  aba(ss, 'Clientes', ['Nome', 'WhatsApp', 'Tipo', 'Saldo fiado', 'Obs'], C.map(c => [c.nome, c.telefone || '', c.tipo || '', c.saldo || 0, c.obs || '']));
  const O = d.orcamentos || [];
  aba(ss, 'Orçamentos', ['Nº', 'Data', 'Cliente', 'WhatsApp', 'Obra', 'Itens', 'Total', 'Validade', 'Status', 'Motivo perda'],
    O.map(o => [o.num, new Date(o.data), o.clienteNome || '', o.clienteTel || '', o.ref || '', (o.itens || []).length, o.total, o.validade, (o.status === 'aberto' && o.validade < Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd')) ? 'vencido' : o.status, o.motivo || '']));
  const m = {};
  V.filter(v => v.status !== 'cancelada').forEach(v => { const k = v.data.slice(0, 7); m[k] = m[k] || [0, 0, 0, 0]; m[k][0]++; m[k][1] += v.total; m[k][2] += v.custoTotal; });
  D.forEach(x => { const k = x.data.slice(0, 7); m[k] = m[k] || [0, 0, 0, 0]; m[k][3] += x.valor; });
  aba(ss, 'Resumo mensal', ['Mês', 'Vendas', 'Faturamento', 'Custo mercadoria', 'Lucro bruto', 'Despesas', 'Lucro líquido'],
    Object.keys(m).sort().map(k => [k.slice(5) + '/' + k.slice(0, 4), m[k][0], m[k][1], m[k][2], m[k][1] - m[k][2], m[k][3], m[k][1] - m[k][2] - m[k][3]]));
}
