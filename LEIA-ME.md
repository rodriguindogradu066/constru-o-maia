# Sistema Maia Construção v2.0 — como instalar

**Novidade da v2.0 — Dados na nuvem (Firebase):** produtos, estoque, vendas, orçamentos, clientes e despesas ficam num banco só, e aparecem iguais em todos os aparelhos, na hora. Entre com a conta Google liberada nas regras do Firestore. Sem internet o sistema continua funcionando e envia quando a conexão voltar.

**Primeira vez:** abra primeiro no aparelho que tem os dados CERTOS e aceite "Enviar estes dados para a nuvem". Nos outros aparelhos, os dados antigos são substituídos pelos da nuvem (uma cópia fica guardada no aparelho por segurança).

**Novidades da v1.5:** foto pequena do produto (tirada pela câmera) na lista, no caixa e na entrada; **custo real = compra + ICMS + frete**, usado na margem e no lucro; na entrada de mercadoria o frete da nota é dividido entre os produtos pelo valor; ICMS padrão em Mais → Loja e segurança. A margem sugerida agora é margem de verdade (40% = 40% do preço de venda).

**Novidade da v1.4 — Entrada de mercadoria:** em **Produtos → 📥 Entrada**, escaneie ou busque o que chegou, coloque quantidade, custo e preço de venda (ou use *Sugerir preços* pela margem) e toque *Dar entrada*: produtos novos são cadastrados e o estoque sobe de uma vez, com custo médio. Entregas preparadas no arquivo `entradas.json` aparecem sozinhas no sistema como "Chegou mercadoria para conferir".

**Novidade da v1.3:** botão próprio **📝 Orçamento** na barra de baixo (ao lado do Vender), com carrinho separado do caixa e a lista de orçamentos na mesma tela.

**Novidades da v1.2 — Orçamentos:** monte o carrinho e toque em *Salvar como orçamento*; envie em PDF (com a logo) ou em texto pelo WhatsApp; cobre o cliente com mensagens prontas; quando ele aprovar, *virar venda* com 1 toque (mantém os preços do orçamento). O painel mostra taxa de aprovação, orçamentos parados e o principal motivo de perda. Configure WhatsApp, endereço, validade, desconto no Pix e condições em **Mais → Loja e segurança**.

> Na atualização para a v1.2, envie também o novo arquivo `logo.png` e substitua o código do Apps Script (ganhou a aba Orçamentos).

**Novidades da v1.1:** barra fixa de pagamento perto do polegar, botões maiores e com mais contraste (melhor no sol), painel com comparação ▲▼, meta do mês com projeção, ponto de equilíbrio, alertas e explicação de cada número. Para atualizar: substitua os arquivos na Hostinger (os dados no celular continuam).

## O que tem no sistema
- **Vender (caixa):** leitor de código de barras pela câmera, busca por nome/código, preço normal ou preço de desconto por item, desconto extra no total, Pix/Dinheiro (com troco)/Débito/Crédito/Fiado, comprovante pelo WhatsApp. Cada venda baixa o estoque e entra no faturamento na hora.
- **Produtos:** cadastro com código de barras (escaneia pela câmera), custo, preço de venda, preço com desconto, margem automática, estoque e alerta de estoque baixo, entrada de mercadoria com custo médio, importação de planilha.
- **Financeiro:** faturamento, custo das mercadorias, lucro bruto, despesas, lucro líquido, por forma de pagamento e por setor, histórico de vendas (com cancelamento), despesas (com opção de repetir todo mês) e controle de fiado.
- **Início:** painel com os números do dia/semana/mês, gráfico de 14 dias, mais vendidos e estoque baixo.
- **Mais:** clientes, Excel completo, Google Planilhas, backup e PIN do dono.

## 1. Colocar no ar (Hostinger)
1. No hPanel, crie um subdomínio, ex.: `sistema.seudominio.com.br` (ou uma pasta `/sistema`).
2. Ative o **SSL (https)**. A câmera **só funciona com https**.
3. No Gerenciador de Arquivos, envie **todos** os arquivos desta pasta (index.html, manifest.json, sw.js, icon-192.png, icon-512.png, logo.png, entradas.json, fotos-produtos.json) para a pasta do subdomínio.
4. Abra o endereço no Chrome do celular.

## 2. Deixar como aplicativo no Samsung
1. No Chrome, toque nos **3 pontinhos → Instalar app** (ou "Adicionar à tela inicial").
2. Abra pelo ícone: ele abre em tela cheia, sem barra de endereço.
3. Para travar o celular só no sistema: use **Fixar aplicativo** (Configurações → pesquise "Fixar") ou o **Fully Kiosk Browser** com o endereço do sistema.

## 3. Primeiro uso
1. **Mais → Loja e segurança:** defina a **meta de faturamento mensal** e crie um **PIN do dono**. Com o PIN, o funcionário só consegue vender; Início, Financeiro, Mais e cadastro de produtos ficam travados.
2. Cadastre os produtos um por um (botão 📷 lê o código) ou use **Mais → Baixar modelo de produtos**, preencha no Excel e **Importar produtos**.

## 4. Google Planilhas (recomendado: backup + ver de qualquer lugar)
1. Crie uma planilha nova no Google Drive, ex.: "Maia Construção — Sistema".
2. Menu **Extensões → Apps Script**. Apague o que tiver e cole o conteúdo do arquivo `google-planilhas-Code.gs`.
3. Na linha `const SENHA = 'TROQUE-ESTA-SENHA';` coloque uma senha sua. Salve.
4. **Implantar → Nova implantação → tipo: App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   - Clique em Implantar e autorize com sua conta Google.
5. Copie o link que termina em `/exec`.
6. No sistema: **Mais → Google Planilhas**, cole o link, digite a mesma senha, marque "Enviar automaticamente" e toque **Enviar agora**.
7. A planilha vai ganhar as abas: Produtos, Vendas, Itens vendidos, Despesas, Clientes e Resumo mensal.

Para usar em outro aparelho (ex.: seu celular pessoal): configure o mesmo link e senha e toque **Baixar da planilha**.
O ideal é ter **um aparelho principal** (o celular do caixa) fazendo as vendas.

## Importante
- Os dados ficam salvos **no próprio celular**. Por isso deixe a sincronização com o Google ligada ou faça **Mais → Salvar backup** toda semana.
- Não limpe os "dados do site" do Chrome no celular do caixa.
- O sistema funciona sem internet depois de aberto a primeira vez. O leitor de código e o Excel precisam de internet só na primeira vez que forem usados.
- **Compra de mercadoria** entra pelo botão *Entrada de estoque* (não como despesa). O custo do produto é descontado do lucro quando ele é vendido.
