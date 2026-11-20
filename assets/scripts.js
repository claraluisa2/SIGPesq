
const STORAGE_KEY = "sigpesq_demo_v1";

const emptyData = () => ({
  projects: [],
  participants: [],
  participations: [],
  agencies: [],
  fundings: [],
  productions: []
});

let data = loadData();
let toastTimer;
let cpfEmEdicao = null;

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyData(), ...JSON.parse(saved) } : emptyData();
  } catch (e) {
    return emptyData();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderAll();
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function labelType(type) {
  return ({
    DOCENTE: "Docente",
    DISCENTE: "Discente",
    TECNICO_ADMINISTRATIVO: "Técnico-administrativo",
    EM_ANDAMENTO: "Em andamento",
    CONCLUIDO: "Concluído",
    CANCELADO: "Cancelado",
    BOLSA: "Bolsa",
    AUXILIO: "Auxílio",
    CONVENIO: "Convênio",
    ARTIGO: "Artigo",
    CAPITULO_LIVRO: "Capítulo de livro",
    SOFTWARE: "Software",
    RELATORIO_TECNICO: "Relatório técnico",
    OUTRO: "Outro"
  })[type] || type || "—";
}

function formatDate(value) {
  if (!value) return "—";
  const parts = value.split("-");
  return parts.length === 3
    ? `${parts[2]}/${parts[1]}/${parts[0]}`
    : value;
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function showToast(message) {
  const toast = byId("toast");
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function emptyRow(id, show, colspan) {
  const node = byId(id);
  if (node) node.style.display = show ? "" : "none";
}

function statusPill(status) {
  const cls = status === "EM_ANDAMENTO"
    ? "green-pill"
    : status === "CONCLUIDO"
      ? "blue-pill"
      : "red-pill";

  return `<span class="pill ${cls}">${escapeHtml(labelType(status))}</span>`;
}

function personName(id) {
  return data.participants.find(p => p.id === id)?.name || "Participante removido";
}

function projectName(id) {
  const p = data.projects.find(x => x.code === id);
  return p ? p.title : "Projeto removido";
}

function agencyName(id) {
  return data.agencies.find(a => a.id === id)?.name || "Agência removida";
}

function fillSelect(id, items, valueFn, labelFn, firstLabel) {
  const select = byId(id);
  if (!select) return;

  const old = select.value;
  const isMultiple = select.multiple;
  const selected = isMultiple
    ? Array.from(select.selectedOptions).map(o => o.value)
    : [];

  select.innerHTML =
    (firstLabel
      ? `<option value="">${escapeHtml(firstLabel)}</option>`
      : "") +
    items.map(item =>
      `<option value="${escapeHtml(valueFn(item))}">${escapeHtml(labelFn(item))}</option>`
    ).join("");

  if (isMultiple) {
    Array.from(select.options).forEach(o => {
      o.selected = selected.includes(o.value);
    });
  } else if (items.some(item => String(valueFn(item)) === old)) {
    select.value = old;
  }
}

// ALTERAÇÃO: qualquer participante pode ser coordenador.
function renderSelects() {
  fillSelect(
    "projectCoordinator",
    data.participants,
    p => p.id,
    p => `${p.name} (${labelType(p.type)})`,
    "Selecione um participante"
  );

  fillSelect(
    "participationProject",
    data.projects,
    p => p.code,
    p => `${p.code} — ${p.title}`,
    "Selecione um projeto"
  );

  fillSelect(
    "participationPerson",
    data.participants,
    p => p.id,
    p => p.name,
    "Selecione um participante"
  );

  fillSelect(
    "fundingProject",
    data.projects,
    p => p.code,
    p => `${p.code} — ${p.title}`,
    "Selecione um projeto"
  );

  fillSelect(
    "productionProject",
    data.projects,
    p => p.code,
    p => `${p.code} — ${p.title}`,
    "Selecione um projeto"
  );

  const authorsList = byId("productionAuthors");
  authorsList.innerHTML = "";
  if (!data.participants.length) {
    authorsList.innerHTML = '<p class="authors-empty">Cadastre participantes antes de associá-los à produção.</p>';
  } else {
    data.participants.forEach(p => {
      const label = document.createElement("label");
      label.className = "author-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "productionAuthor";
      checkbox.value = p.id;
      checkbox.className = "production-author-checkbox";
      const name = document.createElement("span");
      name.textContent = `${p.name} (${labelType(p.type)})`;
      label.append(checkbox, name);
      authorsList.appendChild(label);
    });
  }
}

function renderDashboard() {
  byId("countProjetos").textContent = data.projects.length;
  byId("countParticipantes").textContent = data.participants.length;
  byId("countFinanciamentos").textContent = data.fundings.length;
  byId("countProducoes").textContent = data.productions.length;

  const wrap = byId("recentProjects");
  const projects = [...data.projects].slice(-5).reverse();

  if (!projects.length) {
    wrap.className = "empty-state";
    wrap.innerHTML = `
      <div class="empty-icon">▤</div>
      <strong>Nenhum projeto cadastrado</strong>
      <p>Cadastre o primeiro projeto para começar a organizar as informações.</p>
      <button class="btn btn-primary" data-go="projetos">Cadastrar projeto</button>`;
    return;
  }

  wrap.className = "table-wrap";
  wrap.innerHTML = `
    <table>
      <thead>
        <tr><th>CÓDIGO</th><th>PROJETO</th><th>COORDENADOR</th><th>SITUAÇÃO</th></tr>
      </thead>
      <tbody>
        ${projects.map(p => `
          <tr>
            <td><strong>${escapeHtml(p.code)}</strong></td>
            <td>${escapeHtml(p.title)}</td>
            <td>${escapeHtml(personName(p.coordinator))}</td>
            <td>${statusPill(p.status)}</td>
          </tr>`).join("")}
      </tbody>
    </table>`;
}

function renderProjects() {
  const query = (byId("projectSearch")?.value || "").toLowerCase();

  const list = [...data.projects]
    .filter(p =>
      `${p.code} ${p.title} ${personName(p.coordinator)}`
        .toLowerCase().includes(query)
    )
    .reverse();

  byId("projectTableCount").textContent = `${list.length} registro(s)`;

  byId("projectsTable").innerHTML = list.map(p => `
    <tr>
      <td><strong>${escapeHtml(p.code)}</strong></td>
      <td>
        <strong>${escapeHtml(p.title)}</strong>
        <small>${escapeHtml(p.description || "Sem descrição")}</small>
      </td>
      <td>${escapeHtml(personName(p.coordinator))}</td>
      <td>
        ${formatDate(p.start)}
        <small style="display:block;margin-top:4px">até ${formatDate(p.end)}</small>
      </td>
      <td>${statusPill(p.status)}</td>
      <td>
        <div class="action-group">
          <button class="text-action" data-edit-project="${escapeHtml(p.code)}">Editar</button>
          <button class="text-action delete" data-delete-project="${escapeHtml(p.code)}">Excluir</button>
        </div>
      </td>
    </tr>`).join("");

  emptyRow("projectsEmpty", list.length === 0, 6);
}

function renderParticipants() {
  const query = (byId("participantSearch")?.value || "").toLowerCase();

  const list = [...data.participants]
    .filter(p =>
      `${p.name} ${p.email} ${p.cpf} ${p.type}`
        .toLowerCase().includes(query)
    )
    .reverse();

  byId("participantTableCount").textContent = `${list.length} registro(s)`;

  byId("participantsTable").innerHTML = list.map(p => `
    <tr>
      <td><strong>${escapeHtml(p.name)}</strong></td>
      <td>${escapeHtml(p.email)}</td>
      <td>${escapeHtml(p.cpf)}</td>
      <td><span class="pill">${escapeHtml(labelType(p.type))}</span></td>
      <td>
        <div class="action-group">
            <button class="text-action" data-edit-person="${escapeHtml(p.id)}">Editar</button>
            <button class="text-action delete" data-delete-person="${escapeHtml(p.id)}">Excluir</button>
            </div>
        </td>    </tr>`).join("");

  emptyRow("participantsEmpty", list.length === 0, 5);
}

function renderParticipations() {
  byId("participationsTable").innerHTML =
    [...data.participations].reverse().map(p => `
      <tr>
        <td>${escapeHtml(projectName(p.project))}</td>
        <td>${escapeHtml(personName(p.person))}</td>
        <td>${escapeHtml(p.role)}</td>
        <td>${formatDate(p.start)}</td>
        <td>${formatDate(p.end)}</td>
        <td><button class="text-action delete" data-delete-participation="${escapeHtml(p.id)}">Excluir</button></td>
      </tr>`).join("");

  emptyRow("participationsEmpty", data.participations.length === 0, 6);
}

function renderFundings() {
  byId("fundingTableCount").textContent = `${data.fundings.length} registro(s)`;

  byId("fundingsTable").innerHTML =
    [...data.fundings].reverse().map(f => `
      <tr>
        <td>${escapeHtml(agencyName(f.agency))}</td>
        <td>${escapeHtml(projectName(f.project))}</td>
        <td><span class="pill">${escapeHtml(labelType(f.type))}</span></td>
        <td><strong>${formatMoney(f.amount)}</strong></td>
        <td>
          ${formatDate(f.start)}
          <small style="display:block;margin-top:4px">até ${formatDate(f.end)}</small>
        </td>
        <td><button class="text-action delete" data-delete-funding="${escapeHtml(f.id)}">Excluir</button></td>
      </tr>`).join("");

  emptyRow("fundingsEmpty", data.fundings.length === 0, 6);
}

function renderProductions() {
  byId("productionTableCount").textContent = `${data.productions.length} registro(s)`;

  byId("productionsTable").innerHTML =
    [...data.productions].reverse().map(p => `
      <tr>
        <td>
          <strong>${escapeHtml(p.title)}</strong>
          <small>${escapeHtml(p.medium)}</small>
        </td>
        <td>${escapeHtml(projectName(p.project))}</td>
        <td>
          ${escapeHtml(labelType(p.type))}
          <small style="display:block;margin-top:4px">${escapeHtml(p.year)}</small>
        </td>
        <td>${p.authors.map(personName).map(escapeHtml).join(", ")}</td>
        <td><button class="text-action delete" data-delete-production="${escapeHtml(p.id)}">Excluir</button></td>
      </tr>`).join("");

  emptyRow("productionsEmpty", data.productions.length === 0, 5);
}

function consultationOptions() {
  const type = byId("consultationType").value;
  const select = byId("consultationValue");
  const previous = select.value;
  let options = [];
  if (type === "projectsByCoordinator") {
    options = data.participants.filter(p => p.type === "DOCENTE").map(p => [p.id, p.name]);
  } else if (type === "participantsByProject" || type === "productionsByProject") {
    options = data.projects.map(p => [p.code, `${p.code} — ${p.title}`]);
  } else if (type === "fundingsByAgency") {
    const agencyIds = [...new Set(data.fundings.map(f => f.agency))];
    options = agencyIds.map(id => [id, agencyName(id)]);
  }
  select.innerHTML = '<option value="">Selecione um valor</option>' + options.map(([value, label]) =>
    `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("");
  if (options.some(([value]) => value === previous)) select.value = previous;
  select.disabled = options.length === 0;
  if (!options.length) {
    const messages = {
      projectsByCoordinator: "Cadastre docentes para consultar os projetos coordenados.",
      participantsByProject: "Cadastre projetos para consultar seus participantes.",
      productionsByProject: "Cadastre projetos para consultar suas produções.",
      fundingsByAgency: "Cadastre financiamentos para consultar por agência."
    };
    select.innerHTML = `<option value="">${messages[type]}</option>`;
  }
}

function runConsultation() {
  const type = byId("consultationType").value;
  const value = byId("consultationValue").value;
  if (!value) {
    showToast("Selecione um valor para aplicar a consulta.");
    return;
  }
  let rows = [];
  let title = "Resultados da consulta";
  let summary = "";
  let headers = [];
  if (type === "projectsByCoordinator") {
    const person = data.participants.find(p => p.id === value);
    rows = data.projects.filter(p => p.coordinator === value);
    title = "Projetos coordenados por docente";
    summary = `Docente: ${person?.name || "—"} · ${rows.length} projeto(s) encontrado(s)`;
    headers = ["CÓDIGO", "PROJETO", "PERÍODO", "SITUAÇÃO"];
    rows = rows.map(p => [p.code, p.title, `${formatDate(p.start)} até ${formatDate(p.end)}`, labelType(p.status)]);
  } else if (type === "participantsByProject") {
    const project = data.projects.find(p => p.code === value);
    const links = data.participations.filter(p => p.project === value);
    title = "Participantes vinculados ao projeto";
    summary = `Projeto: ${project ? `${project.code} — ${project.title}` : value} · ${links.length} participante(s) vinculado(s)`;
    headers = ["PARTICIPANTE", "TIPO", "FUNÇÃO", "DATA DE ENTRADA", "DATA DE SAÍDA"];
    rows = links.map(link => {
      const person = data.participants.find(p => p.id === link.person);
      return [person?.name || "Participante não encontrado", labelType(person?.type), link.role, formatDate(link.start), formatDate(link.end)];
    });
  } else if (type === "productionsByProject") {
    const project = data.projects.find(p => p.code === value);
    rows = data.productions.filter(p => p.project === value);
    title = "Produções científicas do projeto";
    summary = `Projeto: ${project ? `${project.code} — ${project.title}` : value} · ${rows.length} produção(ões) encontrada(s)`;
    headers = ["TÍTULO", "TIPO", "ANO", "MEIO DE DIVULGAÇÃO", "AUTORES"];
    rows = rows.map(p => [p.title, labelType(p.type), p.year, p.medium, p.authors.map(personName).join(", ")]);
  } else if (type === "fundingsByAgency") {
    rows = data.fundings.filter(f => f.agency === value);
    title = "Financiamentos por agência";
    summary = `Agência: ${agencyName(value)} · ${rows.length} financiamento(s) encontrado(s)`;
    headers = ["PROJETO", "TIPO DE FOMENTO", "VALOR TOTAL", "INÍCIO", "TÉRMINO"];
    rows = rows.map(f => [projectName(f.project), labelType(f.type), formatMoney(f.amount), formatDate(f.start), formatDate(f.end)]);
  }
  byId("consultationSummary").textContent = summary;
  byId("consultationResultTitle").textContent = title;
  byId("consultationResultCount").textContent = `${rows.length} registro(s)`;
  const wrap = byId("consultationResultWrap");
  if (!rows.length) {
    wrap.innerHTML = '<div class="table-empty">Nenhum resultado encontrado para os filtros selecionados.</div>';
    return;
  }
  wrap.innerHTML = `<table><thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function clearConsultation() {
  byId("consultationForm").reset();
  consultationOptions();
  byId("consultationSummary").textContent = "Selecione um filtro e um valor e clique em Aplicar para visualizar os resultados.";
  byId("consultationResultTitle").textContent = "Resultados da consulta";
  byId("consultationResultCount").textContent = "Nenhuma consulta aplicada";
  byId("consultationResultWrap").innerHTML = '<div class="table-empty">Os resultados aparecerão aqui.</div>';
}

function renderAll() {
  renderSelects();
  renderDashboard();
  renderProjects();
  renderParticipants();
  renderParticipations();
  renderFundings();
  renderProductions();
  consultationOptions();
}

function showPage(name) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.toggle("active", p.id === `page-${name}`);
  });

  document.querySelectorAll(".nav-link").forEach(b => {
    b.classList.toggle("active", b.dataset.page === name);
  });

  const active = document.querySelector(`.nav-link[data-page="${name}"]`);

  byId("breadcrumb").textContent = active
    ? active.textContent.trim().replace(/^[⌂▤♙↔▦▧]+\s*/, "")
    : "Visão geral";

  byId("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closePanel(id) {
  byId(id)?.classList.add("hidden");
}

function openPanel(id) {
  byId(id)?.classList.remove("hidden");
  byId(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetProjectForm() {
  byId("projectForm").reset();
  byId("projectEditCode").value = "";
  byId("projectCode").disabled = false;
  byId("projectFormTitle").textContent = "Novo projeto";
}

function validDates(start, end) {
  if (start && end && end < start) {
    showToast("A data final não pode ser anterior à data inicial.");
    return false;
  }
  return true;
}

document.addEventListener("click", e => {
  const nav = e.target.closest("[data-page]");
  if (nav) showPage(nav.dataset.page);

  const go = e.target.closest("[data-go]");
  if (go) showPage(go.dataset.go);

  const quick = e.target.closest("[data-quick-page]");
  if (quick) {
    const page = quick.dataset.quickPage;
    showPage(page);
    const targetId = quick.dataset.quickForm;
    if (targetId === "projectFormPanel") {
      resetProjectForm();
      renderSelects();
      openPanel(targetId);
    } else if (targetId === "participantFormPanel") {
      byId(targetId)?.classList.remove("hidden");
      openPanel(targetId);
    } else if (targetId) {
      byId(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" });
      byId(targetId)?.querySelector("input, select, textarea")?.focus({ preventScroll: true });
    }
  }

  const close = e.target.closest("[data-close]");

if (close) {
    const painel = close.dataset.close;

    closePanel(painel);

    if (painel === "participantFormPanel") {
        byId("participantForm").reset();
        cpfEmEdicao = null;
        byId("participantCpf").readOnly = false;

        byId("participantFormTitle").textContent = "Novo participante";
        byId("participantSubmitButton").textContent = "Salvar participante";
    }
  }
});

byId("menuToggle").addEventListener("click", () => {
  byId("sidebar").classList.toggle("open");
});

byId("showProjectForm").addEventListener("click", () => {
  resetProjectForm();
  renderSelects();
  openPanel("projectFormPanel");
});

byId("showParticipantForm").addEventListener("click", () => {
    byId("participantForm").reset();
    cpfEmEdicao = null;
    byId("participantCpf").readOnly = false;

    byId("participantFormTitle").textContent = "Novo participante";
    byId("participantSubmitButton").textContent = "Salvar participante";

    openPanel("participantFormPanel");
});

byId("projectSearch").addEventListener("input", renderProjects);
byId("participantSearch").addEventListener("input", renderParticipants);
byId("consultationType").addEventListener("change", () => {
  consultationOptions();
  byId("consultationSummary").textContent = "Filtro alterado. Selecione um valor e clique em Aplicar.";
});
byId("consultationForm").addEventListener("submit", e => {
  e.preventDefault();
  runConsultation();
});
byId("clearConsultation").addEventListener("click", clearConsultation);

byId("projectForm").addEventListener("reset", () => {
  setTimeout(() => {
    byId("projectCode").disabled = false;
  }, 0);
});

// Cadastro e edição de projetos.
// ALTERAÇÃO: aceita qualquer tipo de participante como coordenador.
byId("projectForm").addEventListener("submit", e => {
  e.preventDefault();

  const oldCode = byId("projectEditCode").value;
  const code = byId("projectCode").value.trim();

  if (data.projects.some(p =>
    p.code.toLowerCase() === code.toLowerCase() && p.code !== oldCode
  )) {
    return showToast("Já existe um projeto com esse código.");
  }

  if (!validDates(
    byId("projectStart").value,
    byId("projectEnd").value
  )) return;

  const coordinator = data.participants.find(
    p => p.id === byId("projectCoordinator").value
  );

  if (!coordinator) {
    return showToast("Selecione um participante cadastrado.");
  }

  const item = {
    code,
    title: byId("projectTitle").value.trim(),
    description: byId("projectDescription").value.trim(),
    start: byId("projectStart").value,
    end: byId("projectEnd").value,
    status: byId("projectStatus").value,
    coordinator: coordinator.id
  };

  if (oldCode) {
    const index = data.projects.findIndex(p => p.code === oldCode);

    if (index !== -1) {
      data.projects[index] = item;
    }

    data.participations.forEach(x => {
      if (x.project === oldCode) x.project = code;
    });

    data.fundings.forEach(x => {
      if (x.project === oldCode) x.project = code;
    });

    data.productions.forEach(x => {
      if (x.project === oldCode) x.project = code;
    });

    showToast("Projeto atualizado com sucesso.");
  } else {
    data.projects.push(item);
    showToast("Projeto cadastrado com sucesso.");
  }

  saveData();
  resetProjectForm();
  closePanel("projectFormPanel");
});

byId("projectsTable").addEventListener("click", e => {
  const edit = e.target.closest("[data-edit-project]");

  if (edit) {
    const p = data.projects.find(x => x.code === edit.dataset.editProject);
    if (!p) return;

    byId("projectEditCode").value = p.code;
    byId("projectCode").value = p.code;
    byId("projectCode").disabled = true;
    byId("projectTitle").value = p.title;
    byId("projectDescription").value = p.description;
    byId("projectStart").value = p.start;
    byId("projectEnd").value = p.end;
    byId("projectStatus").value = p.status;

    renderSelects();
    byId("projectCoordinator").value = p.coordinator;

    byId("projectFormTitle").textContent = "Editar projeto";
    openPanel("projectFormPanel");
  }

  const del = e.target.closest("[data-delete-project]");

  if (del) {
    const code = del.dataset.deleteProject;

    if (!confirm(
      "Excluir este projeto? Os vínculos, financiamentos e produções associados a ele também serão removidos."
    )) return;

    data.projects = data.projects.filter(p => p.code !== code);
    data.participations = data.participations.filter(p => p.project !== code);
    data.fundings = data.fundings.filter(p => p.project !== code);
    data.productions = data.productions.filter(p => p.project !== code);

    saveData();
    showToast("Projeto excluído.");
  }
});



byId("participantForm").addEventListener("submit", async e => {
    e.preventDefault();

    const dados = new URLSearchParams({
        nome: byId("participantName").value.trim(),
        email: byId("participantEmail").value.trim(),
        cpf: byId("participantCpf").value,
        tipo: byId("participantType").value
    });

    // Define qual arquivo PHP será chamado
    let arquivo;

    if (cpfEmEdicao !== null) {
        arquivo = "pages/participantes/editar.php";
        dados.set("cpf_original", cpfEmEdicao);
    } else {
        arquivo = "pages/participantes/cadastrar.php";
    }

    try {
        const resposta = await fetch(arquivo, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: dados
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            showToast(resultado.erro);
            return;
        }

        // Limpa o formulário e encerra o modo de edição
        byId("participantForm").reset();
        cpfEmEdicao = null;
        byId("participantCpf").readOnly = false;

        byId("participantFormTitle").textContent = "Novo participante";
        byId("participantSubmitButton").textContent = "Salvar participante";

        closePanel("participantFormPanel");

        // Atualiza a tabela consultando novamente o MySQL
        await carregarParticipantesDoBanco();

        showToast(resultado.mensagem);

    } catch (erro) {
        console.error(erro);
        showToast("Erro ao comunicar com o servidor.");
    }
});




byId("participantsTable").addEventListener("click", async e => {

  const botaoExcluir = e.target.closest("[data-delete-person]");

  if (!botaoExcluir) return;

  const cpf = botaoExcluir.dataset.deletePerson;

  if (!confirm("Deseja realmente excluir este participante?")) {
    return;
  }

  const dados = new URLSearchParams({ cpf });

  try {
    const resposta = await fetch(
      "pages/participantes/excluir.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: dados
      }
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
      return showToast(resultado.erro);
    }

    // Atualizar a lista consultando o MySQL
    await carregarParticipantesDoBanco();

    showToast(resultado.mensagem);

  } catch (erro) {
    console.error(erro);
    showToast("Erro ao comunicar com o servidor.");
  }
});


byId("participationForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!validDates(
    byId("participationStart").value,
    byId("participationEnd").value
  )) return;

  const project = byId("participationProject").value;
  const person = byId("participationPerson").value;

  if (data.participations.some(p =>
    p.project === project && p.person === person
  )) {
    return showToast("Esse participante já possui vínculo com este projeto.");
  }

  data.participations.push({
    id: uid(),
    project,
    person,
    role: byId("participationRole").value.trim(),
    start: byId("participationStart").value,
    end: byId("participationEnd").value
  });

  saveData();
  byId("participationForm").reset();
  showToast("Vínculo registrado com sucesso.");
});

byId("participationsTable").addEventListener("click", e => {
  const del = e.target.closest("[data-delete-participation]");
  if (!del) return;

  if (!confirm("Excluir este vínculo?")) return;

  data.participations = data.participations.filter(
    p => p.id !== del.dataset.deleteParticipation
  );

  saveData();
  showToast("Vínculo excluído.");
});

byId("fundingForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!validDates(
    byId("fundingStart").value,
    byId("fundingEnd").value
  )) return;

  const agencyNameInput = byId("fundingAgencyName").value.trim();
  const acronym = byId("fundingAgencyAcronym").value.trim().toUpperCase();

  if (!agencyNameInput || !acronym) {
    return showToast("Informe o nome e a sigla da agência financiadora.");
  }

  // Reutiliza a agência se a sigla já estiver cadastrada; caso contrário, cadastra automaticamente.
  let agency = data.agencies.find(a =>
    a.acronym.toLowerCase() === acronym.toLowerCase()
  );

  if (agency && agency.name.toLowerCase() !== agencyNameInput.toLowerCase()) {
    return showToast("Essa sigla já está vinculada a outra agência. Confira os dados.");
  }

  if (!agency) {
    agency = { id: uid(), name: agencyNameInput, acronym };
    data.agencies.push(agency);
  }

  data.fundings.push({
    id: uid(),
    agency: agency.id,
    project: byId("fundingProject").value,
    type: byId("fundingType").value,
    amount: Number(byId("fundingAmount").value),
    start: byId("fundingStart").value,
    end: byId("fundingEnd").value
  });

  saveData();
  byId("fundingForm").reset();
  showToast("Financiamento cadastrado com sucesso.");
});

byId("fundingsTable").addEventListener("click", e => {
  const del = e.target.closest("[data-delete-funding]");
  if (!del) return;

  if (!confirm("Excluir este financiamento?")) return;

  data.fundings = data.fundings.filter(
    f => f.id !== del.dataset.deleteFunding
  );

  saveData();
  showToast("Financiamento excluído.");
});

byId("productionForm").addEventListener("submit", e => {
  e.preventDefault();

  const authors = Array.from(
    byId("productionAuthors").querySelectorAll("input[name='productionAuthor']:checked")
  ).map(input => input.value);

  if (!authors.length) {
    return showToast("Selecione pelo menos um autor.");
  }

  data.productions.push({
    id: uid(),
    title: byId("productionTitle").value.trim(),
    project: byId("productionProject").value,
    type: byId("productionType").value,
    year: Number(byId("productionYear").value),
    medium: byId("productionMedium").value.trim(),
    authors
  });

  saveData();
  byId("productionForm").reset();
  showToast("Produção científica cadastrada com sucesso.");
});

byId("productionsTable").addEventListener("click", e => {
  const del = e.target.closest("[data-delete-production]");
  if (!del) return;

  if (!confirm("Excluir esta produção científica?")) return;

  data.productions = data.productions.filter(
    p => p.id !== del.dataset.deleteProduction
  );

  saveData();
  showToast("Produção excluída.");
});


async function carregarParticipantesDoBanco() {
  try {
    const resposta = await fetch(
      "pages/participantes/listar.php"
    );

    if (!resposta.ok) {
      throw new Error("Erro ao consultar participantes.");
    }

    const participantes = await resposta.json();

    // Adaptar os nomes das colunas do MySQL
    // ao formato utilizado pela interface
    data.participants = participantes.map(p => ({
      id: p.cpf,
      name: p.nome,
      email: p.email_institucional,
      cpf: p.cpf,
      type: p.tipo
    }));

    // Atualizar as telas
    renderAll();

  } catch (erro) {
    console.error(erro);
    showToast("Não foi possível carregar os participantes.");
  }
}

// Carregar participantes ao abrir o sistema
carregarParticipantesDoBanco();


function editarParticipante(cpf) {
    // Procura o participante na lista carregada do banco
    const participante = data.participants.find(p => p.cpf === cpf);

    if (!participante) {
        showToast("Participante não encontrado.");
        return;
    }

    // Guarda o CPF original para identificar o registro no UPDATE
    cpfEmEdicao = participante.cpf;

    // Preenche o formulário
    byId("participantName").value = participante.name;
    byId("participantEmail").value = participante.email;
    byId("participantCpf").value = participante.cpf;
    byId("participantType").value = participante.type;

    // Bloqueia a alteração do CPF
    byId("participantCpf").readOnly = true;

    // Altera o título e o botão
    byId("participantFormTitle").textContent = "Editar participante";
    byId("participantSubmitButton").textContent = "Salvar alterações";

    // Abre o formulário
    openPanel("participantFormPanel");
}


byId("participantsTable").addEventListener("click", e => {
    const botaoEditar = e.target.closest("[data-edit-person]");

    if (!botaoEditar) return;

    const cpf = botaoEditar.dataset.editPerson;

    editarParticipante(cpf);
});


