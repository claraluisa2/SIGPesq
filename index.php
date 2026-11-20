
<?php
require_once __DIR__ . "/config/conexao.php";
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIGPesq | Gestão de Pesquisa</title>
    <link rel="stylesheet" href="assets/styles.css">
    <script src="assets/scripts.js" defer></script>
</head>

<body>
  <div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-mark">S</div>
        <div><strong>SIGPesq</strong><span>Gestão de Pesquisa</span></div>
      </div>
      <div class="nav-label">MENU PRINCIPAL</div>
      <nav class="nav">
        <button class="nav-link active" data-page="dashboard"><span class="nav-icon">⌂</span> Visão geral</button>
        <button class="nav-link" data-page="projetos"><span class="nav-icon">▤</span> Projetos</button>
        <button class="nav-link" data-page="participantes"><span class="nav-icon">♙</span> Participantes</button>
        <button class="nav-link" data-page="financiamentos"><span class="nav-icon">R$</span> Financiamentos</button>
        <button class="nav-link" data-page="producoes"><span class="nav-icon">▧</span> Produções científicas</button>
        <button class="nav-link" data-page="consultas"><span class="nav-icon">⌕</span> Consultas</button>
      </nav>
      <div class="sidebar-bottom">
        <div class="help-mark">i</div>
        <div><strong>Projeto acadêmico</strong><span>Protótipo de interface</span></div>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <button class="menu-toggle" id="menuToggle" aria-label="Abrir menu">☰</button>
        <div class="breadcrumbs">SIGPesq <span>/</span> <strong id="breadcrumb">Visão geral</strong></div>
        <div class="topbar-right"><span class="status-dot"></span><span>Ambiente de demonstração</span><div class="avatar">U</div></div>
      </header>

      <div class="content">
        <section class="page active" id="page-dashboard">
          <div class="page-heading">
            <div><p class="eyebrow">PAINEL DE CONTROLE</p><h1>Visão geral</h1><p class="subtitle">Acompanhe os dados cadastrados no SIGPesq.</p></div>
            <button class="btn btn-primary" data-go="projetos">＋ Novo projeto</button>
          </div>
          <div class="notice"><span class="notice-icon">i</span><div><strong>Bem-vinda ao SIGPesq</strong><p>Cadastre e gerencie as informações da pesquisa em um só lugar. Escolha uma ação abaixo para ir diretamente ao cadastro ou à consulta desejada.</p></div></div>
          <div class="quick-section">
            <div class="section-intro"><div><p class="eyebrow">ATALHOS</p><h2>Cadastros e consultas</h2><p>Acesse rapidamente cada área do sistema.</p></div></div>
            <div class="quick-grid">
              <button class="quick-card" type="button" data-quick-page="projetos" data-quick-form="projectFormPanel"><span class="quick-icon purple">▤</span><span class="quick-copy"><strong>Cadastrar projeto</strong><small>Dados, coordenação e vínculos com participantes</small></span><span class="quick-arrow">→</span></button>
              <button class="quick-card" type="button" data-quick-page="participantes" data-quick-form="participantFormPanel"><span class="quick-icon blue">♙</span><span class="quick-copy"><strong>Cadastrar participante</strong><small>Docentes, discentes e técnicos-administrativos</small></span><span class="quick-arrow">→</span></button>
              <button class="quick-card" type="button" data-quick-page="financiamentos" data-quick-form="fundingForm"><span class="quick-icon orange">R$</span><span class="quick-copy"><strong>Cadastrar financiamento</strong><small>Agência, projeto apoiado e valores</small></span><span class="quick-arrow">→</span></button>
              <button class="quick-card" type="button" data-quick-page="producoes" data-quick-form="productionForm"><span class="quick-icon green">▧</span><span class="quick-copy"><strong>Cadastrar produção científica</strong><small>Produções e associação de um ou mais autores</small></span><span class="quick-arrow">→</span></button>
              <button class="quick-card quick-card-consult" type="button" data-quick-page="consultas"><span class="quick-icon teal">⌕</span><span class="quick-copy"><strong>Fazer uma consulta</strong><small>Filtre projetos, participantes, produções e financiamentos</small></span><span class="quick-arrow">→</span></button>
            </div>
          </div>
          <div class="stats-grid">
            <article class="stat-card"><div class="stat-top"><span>Projetos cadastrados</span><span class="stat-icon purple">▤</span></div><strong id="countProjetos">0</strong><small>Total de projetos de pesquisa</small></article>
            <article class="stat-card"><div class="stat-top"><span>Participantes</span><span class="stat-icon blue">♙</span></div><strong id="countParticipantes">0</strong><small>Pessoas registradas no sistema</small></article>
            <article class="stat-card"><div class="stat-top"><span>Financiamentos</span><span class="stat-icon orange">R$</span></div><strong id="countFinanciamentos">0</strong><small>Registros de apoio financeiro</small></article>
            <article class="stat-card"><div class="stat-top"><span>Produções científicas</span><span class="stat-icon green">▧</span></div><strong id="countProducoes">0</strong><small>Publicações e resultados cadastrados</small></article>
          </div>
          <div class="panel">
            <div class="panel-heading"><div><h2>Projetos recentes</h2><p>Projetos registrados na interface</p></div><button class="btn btn-light" data-go="projetos">Ver projetos <span>→</span></button></div>
            <div id="recentProjects" class="empty-state"><div class="empty-icon">▤</div><strong>Nenhum projeto cadastrado</strong><p>Cadastre o primeiro projeto para começar a organizar as informações.</p><button class="btn btn-primary" data-go="projetos">Cadastrar projeto</button></div>
          </div>
          <p class="disclaimer">Protótipo acadêmico: os dados são armazenados localmente no navegador e ainda não são enviados a um banco MySQL.</p>
        </section>

        <section class="page" id="page-projetos">
          <div class="page-heading"><div><p class="eyebrow">GERENCIAMENTO</p><h1>Projetos de pesquisa</h1><p class="subtitle">Cadastre e consulte os projetos da universidade.</p></div><button class="btn btn-primary" id="showProjectForm">＋ Cadastrar projeto</button></div>
          <div class="panel form-panel hidden" id="projectFormPanel">
            <div class="panel-heading"><div><h2 id="projectFormTitle">Novo projeto</h2><p>Preencha os dados de identificação do projeto.</p></div><button class="icon-button" data-close="projectFormPanel" aria-label="Fechar">×</button></div>
            <form id="projectForm" class="form-grid">
              <input type="hidden" id="projectEditCode">
              <label>Código único <span>*</span><input id="projectCode" required maxlength="30" placeholder="Ex.: PESQ-001"></label>
              <label>Título do projeto <span>*</span><input id="projectTitle" required placeholder="Digite o título"></label>
              <label class="full">Descrição<textarea id="projectDescription" rows="3" placeholder="Descreva os objetivos do projeto"></textarea></label>
              <label>Data de início <span>*</span><input id="projectStart" type="date" required></label>
              <label>Data de término <span>*</span><input id="projectEnd" type="date" required></label>
              <label>Situação <span>*</span><select id="projectStatus" required><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDO">Concluído</option><option value="CANCELADO">Cancelado</option></select></label>
              <label>Docente coordenador principal <span>*</span><select id="projectCoordinator" required><option value="">Selecione um docente cadastrado</option></select><small>Cadastre primeiro o participante e classifique-o como docente.</small></label>
              <div class="form-actions full"><button type="button" class="btn btn-light" data-close="projectFormPanel">Cancelar</button><button class="btn btn-primary" type="submit">Salvar projeto</button></div>
            </form>
          </div>
          <div class="panel">
            <div class="table-toolbar"><div><h2>Todos os projetos</h2><p id="projectTableCount">0 registros</p></div><input class="search-input" id="projectSearch" placeholder="⌕  Buscar projeto..." aria-label="Buscar projeto"></div>
            <div class="table-wrap"><table><thead><tr><th>CÓDIGO</th><th>PROJETO</th><th>COORDENADOR</th><th>PERÍODO</th><th>SITUAÇÃO</th><th>AÇÕES</th></tr></thead><tbody id="projectsTable"></tbody></table></div>
            <div id="projectsEmpty" class="table-empty">Nenhum projeto encontrado. Clique em “Cadastrar projeto” para adicionar o primeiro.</div>
          </div>
          <div class="panel form-panel" id="projectParticipationPanel">
            <div class="panel-heading"><div><h2>Vincular participantes a projetos</h2><p>Associe participantes cadastrados a um projeto e informe a função e o período de participação.</p></div></div>
            <form id="participationForm" class="form-grid">
              <label>Projeto <span>*</span><select id="participationProject" required><option value="">Selecione um projeto</option></select></label>
              <label>Participante <span>*</span><select id="participationPerson" required><option value="">Selecione um participante</option></select></label>
              <label>Função desempenhada <span>*</span><input id="participationRole" required placeholder="Ex.: pesquisador, bolsista"></label>
              <label>Data de entrada <span>*</span><input id="participationStart" type="date" required></label>
              <label>Data de saída<input id="participationEnd" type="date"></label>
              <div class="form-actions full"><button type="reset" class="btn btn-light">Limpar</button><button type="submit" class="btn btn-primary">Salvar vínculo</button></div>
            </form>
          </div>
          <div class="panel">
            <div class="table-toolbar"><div><h2>Participantes vinculados</h2><p>Vínculos registrados nos projetos</p></div></div>
            <div class="table-wrap"><table><thead><tr><th>PROJETO</th><th>PARTICIPANTE</th><th>FUNÇÃO</th><th>ENTRADA</th><th>SAÍDA</th><th>AÇÕES</th></tr></thead><tbody id="participationsTable"></tbody></table></div>
            <div id="participationsEmpty" class="table-empty">Nenhum vínculo registrado.</div>
          </div>
        </section>

        <section class="page" id="page-participantes">
          <div class="page-heading"><div><p class="eyebrow">CADASTROS</p><h1>Participantes</h1><p class="subtitle">Gerencie docentes, discentes e técnicos-administrativos.</p></div><button class="btn btn-primary" id="showParticipantForm">＋ Cadastrar participante</button></div>
          <div class="panel form-panel hidden" id="participantFormPanel">
            <div class="panel-heading"><div><h2 id="participantFormTitle">Novo participante</h2><p>Informe os dados pessoais e institucionais.</p></div><button class="icon-button" data-close="participantFormPanel">×</button></div>
            <form id="participantForm" class="form-grid">
              <label>Nome completo <span>*</span><input id="participantName" required placeholder="Nome do participante"></label>
              <label>E-mail institucional <span>*</span><input id="participantEmail" type="email" required placeholder="nome@universidade.edu.br"></label>
              <label>CPF <span>*</span><input id="participantCpf" required inputmode="numeric" maxlength="14" placeholder="000.000.000-00"></label>
              <label>Tipo de participante <span>*</span><select id="participantType" required><option value="DOCENTE">Docente</option><option value="DISCENTE">Discente</option><option value="TECNICO_ADMINISTRATIVO">Técnico-administrativo</option></select></label>
              <div class="form-actions full"><button type="button" class="btn btn-light" data-close="participantFormPanel">Cancelar</button><button id="participantSubmitButton" class="btn btn-primary" type="submit">Salvar participante</button></div>
            </form>
          </div>
          <div class="panel"><div class="table-toolbar"><div><h2>Participantes cadastrados</h2><p id="participantTableCount">0 registros</p></div><input class="search-input" id="participantSearch" placeholder="⌕  Buscar participante..." aria-label="Buscar participante"></div><div class="table-wrap"><table><thead><tr><th>NOME</th><th>E-MAIL INSTITUCIONAL</th><th>CPF</th><th>TIPO</th><th>AÇÕES</th></tr></thead><tbody id="participantsTable"></tbody></table></div><div id="participantsEmpty" class="table-empty">Nenhum participante cadastrado.</div></div>
        </section>

        <section class="page" id="page-financiamentos">
          <div class="page-heading"><div><p class="eyebrow">RECURSOS FINANCEIROS</p><h1>Financiamentos</h1><p class="subtitle">Registre financiamentos e associe-os aos projetos apoiados.</p></div></div>
          <div class="panel form-panel"><div class="panel-heading"><div><h2>Cadastrar financiamento</h2><p>Selecione a agência e informe o apoio financeiro.</p></div></div>
            <form id="fundingForm" class="form-grid">
              <label>Nome da agência financiadora <span>*</span><input id="fundingAgencyName" required placeholder="Ex.: Conselho Nacional de Desenvolvimento Científico e Tecnológico"></label>
              <label>Sigla da agência <span>*</span><input id="fundingAgencyAcronym" required maxlength="20" placeholder="Ex.: CNPq"></label>
              <label>Projeto apoiado <span>*</span><select id="fundingProject" required><option value="">Selecione um projeto</option></select><small>Para associar o mesmo financiamento a outros projetos, cadastre o financiamento e use a associação adicional na lista.</small></label>
              <label>Tipo de fomento <span>*</span><select id="fundingType" required><option value="BOLSA">Bolsa</option><option value="AUXILIO">Auxílio</option><option value="CONVENIO">Convênio</option></select></label>
              <label>Valor total (R$) <span>*</span><input id="fundingAmount" type="number" min="0.01" step="0.01" required placeholder="0,00"></label>
              <label>Início da vigência <span>*</span><input id="fundingStart" type="date" required></label>
              <label>Fim da vigência <span>*</span><input id="fundingEnd" type="date" required></label>
              <div class="form-actions full"><button type="reset" class="btn btn-light">Limpar</button><button type="submit" class="btn btn-primary">Salvar financiamento</button></div>
            </form>
          </div>
          <div class="panel"><div class="table-toolbar"><div><h2>Financiamentos cadastrados</h2><p id="fundingTableCount">0 registros</p></div></div><div class="table-wrap"><table><thead><tr><th>AGÊNCIA</th><th>PROJETO</th><th>TIPO</th><th>VALOR</th><th>VIGÊNCIA</th><th>AÇÕES</th></tr></thead><tbody id="fundingsTable"></tbody></table></div><div id="fundingsEmpty" class="table-empty">Nenhum financiamento cadastrado.</div></div>
        </section>

        <section class="page" id="page-producoes">
          <div class="page-heading"><div><p class="eyebrow">RESULTADOS DE PESQUISA</p><h1>Produções científicas</h1><p class="subtitle">Cadastre artigos, capítulos, softwares e relatórios relacionados aos projetos.</p></div></div>
          <div class="panel form-panel"><div class="panel-heading"><div><h2>Cadastrar produção científica</h2><p>Todos os autores selecionados precisam estar cadastrados como participantes.</p></div></div>
            <form id="productionForm" class="form-grid">
              <label class="full">Título da produção <span>*</span><input id="productionTitle" required placeholder="Título do artigo, software ou relatório"></label>
              <label>Projeto relacionado <span>*</span><select id="productionProject" required><option value="">Selecione um projeto</option></select></label>
              <label>Tipo de produção <span>*</span><select id="productionType" required><option value="ARTIGO">Artigo</option><option value="CAPITULO_LIVRO">Capítulo de livro</option><option value="SOFTWARE">Software</option><option value="RELATORIO_TECNICO">Relatório técnico</option><option value="OUTRO">Outro</option></select></label>
              <label>Ano de publicação <span>*</span><input id="productionYear" type="number" min="1900" max="2100" required placeholder="2026"></label>
              <label>Meio de divulgação <span>*</span><input id="productionMedium" required placeholder="Ex.: revista científica, evento"></label>
              <div class="full authors-field"><label>Autores <span>*</span></label><div id="productionAuthors" class="authors-list" role="group" aria-describedby="authorHelp"></div><small id="authorHelp">Marque a caixa ao lado de cada autor. Você pode selecionar um ou vários autores cadastrados como participantes.</small></div>
              <div class="form-actions full"><button type="reset" class="btn btn-light">Limpar</button><button type="submit" class="btn btn-primary">Salvar produção</button></div>
            </form>
          </div>
          <div class="panel"><div class="table-toolbar"><div><h2>Produções cadastradas</h2><p id="productionTableCount">0 registros</p></div></div><div class="table-wrap"><table><thead><tr><th>TÍTULO</th><th>PROJETO</th><th>TIPO / ANO</th><th>AUTORES</th><th>AÇÕES</th></tr></thead><tbody id="productionsTable"></tbody></table></div><div id="productionsEmpty" class="table-empty">Nenhuma produção científica cadastrada.</div></div>
        </section>

        <section class="page" id="page-consultas">
          <div class="page-heading"><div><p class="eyebrow">PESQUISA E ACOMPANHAMENTO</p><h1>Consultas</h1><p class="subtitle">Consulte projetos, participantes, produções científicas e financiamentos com filtros.</p></div></div>
          <div class="panel consultation-panel">
            <div class="panel-heading"><div><h2>Filtrar consulta</h2><p>Escolha o tipo de consulta e depois selecione o valor desejado.</p></div></div>
            <form id="consultationForm" class="consultation-filters">
              <label>Filtro<select id="consultationType"><option value="projectsByCoordinator">Projetos por docente coordenador</option><option value="participantsByProject">Participantes de projeto</option><option value="productionsByProject">Produções de projeto</option><option value="fundingsByAgency">Financiamentos por agência</option></select></label>
              <label class="consultation-value-label">Valor<select id="consultationValue" required><option value="">Selecione um valor</option></select></label>
              <div class="consultation-buttons"><button class="btn btn-primary" type="submit">Aplicar</button><button class="btn btn-light" type="button" id="clearConsultation">Limpar</button></div>
            </form>
          </div>
          <div class="consultation-summary" id="consultationSummary">Selecione um filtro e um valor e clique em Aplicar para visualizar os resultados.</div>
          <div class="panel consultation-results"><div class="table-toolbar"><div><h2 id="consultationResultTitle">Resultados da consulta</h2><p id="consultationResultCount">Nenhuma consulta aplicada</p></div></div><div class="table-wrap" id="consultationResultWrap"><div class="table-empty">Os resultados aparecerão aqui.</div></div></div>
        </section>
      </div>
    </main>
  </div>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
  <footer class="mobile-footer">SIGPesq • Protótipo acadêmico</footer>
</body>
</html>
