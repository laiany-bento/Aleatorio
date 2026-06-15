// Gerenciamento global de progresso (Gamificação)
let progressoGlobal = 20;
let topicosExplorados = new Set(['home']);

// Base de dados integral mapeando rigorosamente o roteiro fornecido
const paginas = {
    home: `
        <section class="hero">
            <h1>Tech<span>Future</span></h1>
            <p>"Uma viagem pela evolução da tecnologia e suas transformações no mundo moderno."</p>
            <button class="btn-neon" onclick="navegar('ia')">➡️ Explorar Conteúdo</button>
        </section>

        <section>
            <h2>Introdução</h2>
            <p>A tecnologia evoluiu de maneira avassaladora ao longo dos anos. Das primeiras ferramentas analógicas e mecânicas até as redes neurais integradas de hoje, a computação deixou de ser uma ferramenta de nicho laboratorial para se transformar no tecido conjuntivo da sociedade global. Ela redefine indústrias, dita dinâmicas econômicas e altera fundamentalmente a forma como nos comunicamos, trabalhamos e vivemos.</p>
        </section>

        <h2>Destaques dos Temas</h2>
        <div class="grid-temas">
            <div class="card-tema" onclick="navegar('ia')">
                <h3>🤖 História da IA</h3>
                <p>Do Teste de Turing até os modernos ecossistemas de Inteligência Artificial Generativa.</p>
            </div>
            <div class="card-tema" onclick="navegar('computadores')">
                <h3>💻 Evolução dos Computadores</h3>
                <p>A fantástica miniaturização do hardware, indo das válvulas aos microprocessadores.</p>
            </div>
            <div class="card-tema" onclick="navegar('seguranca')">
                <h3>🔒 Segurança na Internet</h3>
                <p>Aprenda a mitigar ameaças, prevenir engenharia social e blindar suas contas.</p>
            </div>
            <div class="card-tema" onclick="navegar('deepfakes')">
                <h3>🎭 Deepfakes: Desafios</h3>
                <p>O limiar entre a inovação cinematográfica e os riscos de manipulação informativa.</p>
            </div>
            <div class="card-tema" onclick="navegar('robotica')">
                <h3>🦾 Robótica no Cotidiano</h3>
                <p>A automação mecânica inteligente transformando indústrias, lares e a medicina.</p>
            </div>
        </div>

        <div style="background:var(--bg-card); padding:2rem; border-radius:8px; margin-top:2rem; border:1px solid var(--azul-neon);">
            <h3>🎲 Curiosidade do Dia</h3>
            <p id="curiosidade-texto">O ENIAC ocupava aproximadamente 167 m² e pesava cerca de 27 toneladas.</p>
        </div>
    `,
    ia: `
        <h2>🤖 História da Inteligência Artificial</h2>
        <p>A Inteligência Artificial (IA) refere-se ao desenvolvimento de sistemas de software capazes de executar tarefas que tradicionalmente exigiriam inteligência humana, como percepção visual, tomada de decisão e tradução de idiomas.</p>
        
        <h3>⏳ Linha do Tempo Interativa</h3>
        <div class="timeline">
            <div class="timeline-item">
                <h4>1950 → Teste de Turing</h4>
                <p>Alan Turing publica seu artigo propondo a imitação de jogos para avaliar a capacidade mecânica de pensar de forma indistinguível de um humano.</p>
            </div>
            <div class="timeline-item">
                <h4>1956 → Surgimento do Termo IA</h4>
                <p>John McCarthy cunha o termo oficialmente durante a lendária Conferência de Dartmouth.</p>
            </div>
            <div class="timeline-item">
                <h4>1997 → Vitória do Deep Blue</h4>
                <p>O supercomputador da IBM vence o campeão mundial de xadrez Garry Kasparov em uma partida formal.</p>
            </div>
            <div class="timeline-item">
                <h4>2010 → Popularização do Machine Learning</h4>
                <p>O aumento massivo de dados (Big Data) e capacidade de processamento impulsionam redes neurais profundas.</p>
            </div>
            <div class="timeline-item">
                <h4>Atualidade → IA Generativa</h4>
                <p>Modelos de larga escala transformam a produção textual, artística, de código e automação global.</p>
            </div>
        </div>

        <h3>💡 Aplicações da IA</h3>
        <ul>
            <li><strong>Assistentes Virtuais:</strong> Modelos conversacionais que processam linguagem natural corporativa ou residencial.</li>
            <li><strong>Reconhecimento Facial:</strong> Sistemas de segurança biométrica avançada em tempo real.</li>
            <li><strong>Tradução Automática:</strong> Redes neurais que traduzem idiomas de forma contextualizada instantaneamente.</li>
            <li><strong>Medicina e Educação:</strong> Diagnósticos por imagem assistidos e ecossistemas adaptativos de aprendizagem.</li>
        </ul>

        <blockquote><strong>Você sabia?</strong> A IA já auxilia médicos de todo o mundo na identificação precoce e mapeamento preditivo de anomalias celulares em exames de imagem.</blockquote>

        <h3>🗂️ Flashcards (Clique para descobrir)</h3>
        <div class="container-flashcards">
            <div class="flashcard" onclick="this.innerHTML='A simulação de inteligência em máquinas que realizam raciocínio complexo.'">O que é IA?</div>
            <div class="flashcard" onclick="this.innerHTML='Subcampo da IA focado no aprendizado automático de algoritmos a partir de grandes massas de dados.'">O que é Machine Learning?</div>
            <div class="flashcard" onclick="this.innerHTML='O cientista da computação John McCarthy na conferência de Dartmouth em 1956.'">Quem criou o termo Inteligência Artificial?</div>
        </div>

        <div class="quiz-box">
            <h3>🎯 Quiz: História da IA</h3>
            <p>Em qual ano o supercomputador Deep Blue derrotou o campeão mundial de xadrez Garry Kasparov?</p>
            <button class="opcao-quiz" onclick="validarQuiz(this, false)">1956</button>
            <button class="opcao-quiz" onclick="validarQuiz(this, true)">1997</button>
            <button class="opcao-quiz" onclick="validarQuiz(this, 2010)">2010</button>
            <span class="resultado-quiz"></span>
        </div>
    `,
    computadores: `
        <h2>💻 Evolução dos Computadores</h2>
        <p>A história dos computadores é marcada pela busca constante por maior poder de processamento combinado com a drástica redução física dos componentes.</p>

        <h3>⏳ Linha do Tempo: As Gerações</h3>
        <div class="timeline">
            <div class="timeline-item">
                <h4>Primeira Geração → Válvulas Eletrônicas</h4>
                <p>Máquinas gigantescas de uso puramente militar ou científico que consumiam energia massiva.</p>
            </div>
            <div class="timeline-item">
                <h4>Segunda Geração → Transistores</h4>
                <p>Substituíram as válvulas, diminuindo o aquecimento e aumentando a confiabilidade física.</p>
            </div>
            <div class="timeline-item">
                <h4>Terceira Geração → Circuitos Integrados</h4>
                <p>Múltiplos transistores miniaturizados em placas de silício, originando os sistemas operacionais primitivos.</p>
            </div>
            <div class="timeline-item">
                <h4>Quarta Geração → Microprocessadores</h4>
                <p>Surgimento dos computadores pessoais (PCs) comerciais devido à alta integração em um único chip.</p>
            </div>
            <div class="timeline-item">
                <h4>Quinta Geração → Computação Inteligente</h4>
                <p>Dispositivos de arquitetura paralela massiva, computação quântica experimental e alta conectividade móvel.</p>
            </div>
        </div>

        <h3>🖼️ Galeria Histórica & Comparação</h3>
        <p>A transição de máquinas imensas como o <strong>ENIAC</strong> e o <strong>UNIVAC</strong> para o advento do <strong>IBM PC</strong>, culminando nos modernos Notebooks e Smartphones ultraportáteis.</p>
        
        <table style="width:100%; background:var(--bg-card); border-collapse: collapse; margin: 1.5rem 0;">
            <tr style="border-bottom: 2px solid var(--roxo-tech); text-align: left;">
                <th style="padding: 10px;">Característica</th>
                <th style="padding: 10px;">Computador Antigo</th>
                <th style="padding: 10px;">Computador Atual</th>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 10px;">Dimensões</td>
                <td style="padding: 10px; color: var(--vermelho-alerta)">Grande (Salas Inteiras)</td>
                <td style="padding: 10px; color: var(--verde-sucesso)">Compacto (Bolso/Mesa)</td>
            </tr>
            <tr>
                <td style="padding: 10px;">Desempenho</td>
                <td style="padding: 10px; color: var(--vermelho-alerta)">Lento / Pouca Memória</td>
                <td style="padding: 10px; color: var(--verde-sucesso)">Rápido / Alta Capacidade</td>
            </tr>
        </table>

        <h3>📊 Dados e Estatísticas</h3>
        <ul>
            <li>A Lei de Moore ditou por décadas a duplicação de transistores a cada dois anos.</li>
            <li>Evolução do armazenamento: Disquetes magnéticos de 1.44 MB migraram para SSDs NVMe de múltiplos Terabytes.</li>
        </ul>

        <h3>🗂️ Flashcards</h3>
        <div class="container-flashcards">
            <div class="flashcard" onclick="this.innerHTML='O primeiro computador digital eletrônico de grande escala do mundo.'">O que foi o ENIAC?</div>
            <div class="flashcard" onclick="this.innerHTML='Um circuito integrado que executa as funções de uma CPU em um único chip.'">O que é um microprocessador?</div>
            <div class="flashcard" onclick="this.innerHTML='A era movida a válvulas eletrônicas de grandes dimensões.'">Qual foi a primeira geração?</div>
        </div>

        <div class="quiz-box">
            <h3>🎯 Quiz: Evolução das Máquinas</h3>
            <p>Qual componente físico define a Segunda Geração de computadores?</p>
            <button class="opcao-quiz" onclick="validarQuiz(this, false)">Válvulas Eletrônicas</button>
            <button class="opcao-quiz" onclick="validarQuiz(this, true)">Transistores</button>
            <button class="opcao-quiz" onclick="validarQuiz(this, false)">Microprocessadores</button>
            <span class="resultado-quiz"></span>
        </div>
    `,
    seguranca: `
        <h2>🔒 Segurança na Internet</h2>
        <p>No atual ecossistema globalizado, a segurança digital tornou-se obrigatória para a proteção de identidades digitais e ativos econômicos.</p>

        <h3>⚠️ Principais Ameaças Atuais</h3>
        <ul>
            <li><strong>Phishing:</strong> Mensagens fraudulentas projetadas para roubar credenciais sensíveis de acesso.</li>
            <li><strong>Malware e Vírus:</strong> Softwares maliciosos que se instalam sem consentimento para corromper sistemas.</li>
            <li><strong>Roubo de Dados & Engenharia Social:</strong> A manipulação psicológica de usuários para obter vazamentos voluntários.</li>
        </ul>

        <h3>🛡️ Como se Proteger</h3>
        <p>Utilize senhas fortes, habilite a verificação em duas etapas (2FA) em todos os serviços, evite clicar em links suspeitos e mantenha patches de atualizações de sistemas operacionais sempre em dia.</p>

        <div class="simulador-senha" style="background:var(--azul-escuro); padding:2rem; border-radius:8px; margin:2rem 0; border: 1px solid var(--roxo-tech);">
            <h3>🛠️ Simulador de Senha Segura</h3>
            <p>Insira uma senha hipotética abaixo para avaliar a força algorítmica:</p>
            <input type="password" oninput="testarSenha(this.value)" placeholder="Digite sua senha de teste aqui...">
            <div id="resultado-senha" class="status-senha">Aguardando entrada de dados...</div>
        </div>

        <h3>🗂️ Flashcards</h3>
        <div class="container-flashcards">
            <div class="flashcard" onclick="this.innerHTML='Uma técnica de fraude online usada para roubar dados confidenciais através de mensagens falsas.'">O que é phishing?</div>
            <div class="flashcard" onclick="this.innerHTML='Um método de segurança que exige duas formas de identificação para liberar o acesso.'">O que é autenticação em dois fatores?</div>
        </div>

        <div class="quiz-box">
            <h3>🎯 Quiz: Segurança Digital</h3>
            <p>Se você receber um e-mail urgente de um banco pedindo para atualizar seus dados através de um link, isso pode ser um ataque de:</p>
            <button class="opcao-quiz" onclick="validarQuiz(this, true)">Phishing</button>
            <button class="opcao-quiz" onclick="validarQuiz(this, false)">Malware</button>
            <button class="opcao-quiz" onclick="validarQuiz(this, false)">Criptografia</button>
            <span class="resultado-quiz"></span>
        </div>
    `,
    deepfakes: `
        <h2>🎭 Deepfakes: Riscos e Desafios</h2>
        <p>Deepfakes são mídias sintéticas nas quais uma pessoa tem sua imagem ou voz substituída pela IA, de forma extremamente convincente.</p>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; margin:2rem 0;">
            <div style="background:var(--bg-card); padding:1.5rem; border-radius:8px;">
                <h3>🟢 Benefícios e Usos Positivos</h3>
                <p>Dublagens realistas na indústria do cinema, restauração de materiais audiovisuais históricos e ferramentas educacionais interativas imersivas.</p>
            </div>
            <div style="background:var(--bg-card); padding:1.5rem; border-radius:8px;">
                <h3>🔴 Riscos e Ameaças</h3>
                <p>Disseminação massiva de Fake News em períodos eleitorais, golpes de engenharia financeira e difamação de reputações públicas.</p>
            </div>
        </div>

        <div class="detector-box">
            <h3>🕵️ Detector de Deepfake Interativo</h3>
            <p>Um vídeo de uma celebridade pedindo dinheiro em redes sociais promete retorno financeiro de 500% instantâneo. O vídeo tem boa qualidade visual, mas a voz soa ligeiramente robótica.</p>
            <div class="detector-opcoes">
                <button class="btn-neon" onclick="alert('Correto! Indícios de áudio inconsistente e promessas absurdas são alertas graves de Deepfake manipulado.')">Manipulado</button>
                <button class="btn-neon" onclick="alert('Incorreto. Promessas de ganhos milagrosos combinadas com falhas de áudio indicam fraude.')">Real</button>
            </div>
        </div>

        <h3>🔍 Como Identificar Sinais Comuns</h3>
        <p>Observe movimentos estranhos na região do pescoço ou boca, áudio desconectado ou inconsistente com as expressões e padrões incomuns de iluminação de fundo.</p>

        <h3>🗂️ Flashcards</h3>
        <div class="container-flashcards">
            <div class="flashcard" onclick="this.innerHTML='Um arquivo de vídeo ou áudio modificado digitalmente por redes de Inteligência Artificial.'">O que é uma deepfake?</div>
            <div class="flashcard" onclick="this.innerHTML='Analisando descontinuidades de iluminação, piscadas raras e áudio fora de sincronia.'">Como identificar?</div>
        </div>

        <div class="quiz-box">
            <h3>🎯 Quiz: Desafios da Mídia Sintética</h3>
            <p>Qual tecnologia de IA é a principal responsável pela geração realista de deepfakes?</p>
            <button class="opcao-quiz" onclick="validarQuiz(this, false)">Planilhas Eletrônicas</button>
            <button class="opcao-quiz" onclick="validarQuiz(this, true)">Redes Adversariais Generativas (GANs)</button>
            <span class="resultado-quiz"></span>
        </div>
    `,
    robotica: `
        <h2>🦾 Robótica no Cotidiano</h2>
        <p>A robótica integra mecânica estrutural e linhas lógicas de código para automatizar tarefas físicas no mundo real.</p>

        <h3>🌐 Áreas de Aplicação</h3>
        <ul>
            <li><strong>Saúde:</strong> Cirurgias robóticas de altíssima precisão guiadas remotamente por especialistas.</li>
            <li><strong>Indústria e Agricultura:</strong> Linhas automotivas pesadas e colheitadeiras autônomas guiadas por GPS.</li>
            <li><strong>Residências & Espaço:</strong> Aspiradores de pó inteligentes e sondas espaciais autônomas em terrenos extraterrestres.</li>
        </ul>

        <h3>🔮 O Futuro da Robótica</h3>
        <p>As próximas décadas apontam para o avanço de robôs humanoides multifuncionais e frotas autônomas integradas de entrega logística urbana.</p>

        <h3>🗂️ Flashcards</h3>
        <div class="container-flashcards">
            <div class="flashcard" onclick="this.innerHTML='A substituição do trabalho operacional humano por mecanismos controlados por software.'">O que é automação?</div>
            <div class="flashcard" onclick="this.innerHTML='Na saúde, linhas de montagem, agricultura de precisão, exploração espacial e eletrodomésticos.'">Onde a robótica é usada?</div>
        </div>

        <div class="quiz-box">
            <h3>🎯 Quiz: Automação Moderna</h3>
            <p>Qual tipo de robô ganhou grande adoção residencial nas últimas décadas?</p>
            <button class="opcao-quiz" onclick="validarQuiz(this, false)">Drones de Combate</button>
            <button class="opcao-quiz" onclick="validarQuiz(this, true)">Aspiradores de Pó Robóticos</button>
            <span class="resultado-quiz"></span>
        </div>
    `,
    extras: `
        <h2>📖 Glossário Tecnológico</h2>
        <p>Clique em qualquer termo abaixo para expandir o seu conceito técnico:</p>
        
        <div class="glossario-termo" onclick="this.querySelector('p').style.display = this.querySelector('p').style.display === 'block' ? 'none' : 'block'">
            <strong>⚡ Algoritmo</strong>
            <p>Sequência finita de regras e instruções lógicas estruturadas para resolver um problema.</p>
        </div>
        <div class="glossario-termo" onclick="this.querySelector('p').style.display = this.querySelector('p').style.display === 'block' ? 'none' : 'block'">
            <strong>🧠 Deep Learning</strong>
            <p>Modelagem de redes neurais profundas inspiradas na estrutura cerebral para reconhecimento de padrões complexos.</p>
        </div>
        <div class="glossario-termo" onclick="this.querySelector('p').style.display = this.querySelector('p').style.display === 'block' ? 'none' : 'block'">
            <strong>🛡️ Engenharia Social</strong>
            <p>Método de ataque focado na manipulação psicológica humana para obtenção de dados sigilosos.</p>
        </div>

        <h2>📰 Central de Notícias Recentes</h2>
        <div class="grid-extra">
            <div class="card-noticia">
                <h4>Avanço na Computação Quântica</h4>
                <p>Cientistas atingem novo recorde de estabilidade em qubits operando à temperatura ambiente.</p>
                <small>Fonte: TechFuture News</small>
            </div>
            <div class="card-noticia">
                <h4>Regulação de IAs Globais</h4>
                <p>Novos tratados internacionais entram em vigor visando mitigar fraudes por mídias sintéticas.</p>
                <small>Fonte: TechFuture News</small>
            </div>
        </div>

        <h2>📊 Estatísticas de Mercado</h2>
        <div class="grid-extra">
            <div class="card-stat" style="border-top: 3px solid var(--azul-neon)">
                <h3>+150B</h3>
                <p>Dispositivos IoT conectados previstos no mundo.</p>
            </div>
            <div class="card-stat" style="border-top: 3px solid var(--roxo-tech)">
                <h3>85%</h3>
                <p>Das indústrias automatizaram processos críticos.</p>
            </div>
        </div>

        <h2>🌎 Mapa da Tecnologia</h2>
        <div style="background:var(--bg-card); padding:1.5rem; border-radius:8px; border:1px solid var(--roxo-tech)">
            <p>📍 <strong>Vale do Silício (EUA):</strong> Polo global de inovação de software e grandes Big Techs.</p>
            <p>📍 <strong>Pensilvânia (EUA):</strong> Local de nascimento físico do histórico supercomputador ENIAC.</p>
            <p>📍 <strong>Tóquio (Japão):</strong> Epicentro mundial de automação de robótica industrial avançada.</p>
        </div>

        <h2>🔮 Tecnologia em 2050</h2>
        <p><strong>IA & Computação:</strong> Processamento molecular e interfaces diretas cérebro-computador estáveis.</p>
        <p><strong>Segurança & Robótica:</strong> Criptografia pós-quântica nativa e androides autônomos integrados aos serviços civis urbanos.</p>

        <h2>🏆 Sistema de Gamificação (Suas Conquistas)</h2>
        <div class="grid-conquistas">
            <div class="card-conquista desbloqueada" id="conq-1">
                <span>🥉</span>
                <div>
                    <h4>Primeiro Quiz Concluído</h4>
                    <p>Você iniciou sua trilha de aprendizado.</p>
                </div>
            </div>
            <div class="card-conquista" id="conq-2">
                <span>🥈</span>
                <div>
                    <h4>Explorador da Tecnologia</h4>
                    <p>Acesse todas as seções para desbloquear.</p>
                </div>
            </div>
            <div class="card-conquista" id="conq-3">
                <span>🥇</span>
                <div>
                    <h4>Mestre da Segurança</h4>
                    <p>Teste uma senha forte no simulador.</p>
                </div>
            </div>
        </div>

        <h2>📞 Página Sobre o Projeto</h2>
        <p><strong>Objetivo:</strong> Fornecer um ecossistema educacional simplificado sobre história e marcos tecnológicos.</p>
        <p><strong>Tecnologias Utilizadas:</strong> HTML5 Estrutural, CSS3 Fluido e JavaScript Funcional Nativo.</p>
    `
};

// Gerenciador de navegação SPA
function navegar(paginaAlvo) {
    const mainContainer = document.getElementById('conteudo-principal');
    
    if (paginas[paginaAlvo]) {
        mainContainer.innerHTML = paginas[paginaAlvo];
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Contagem de páginas visualizadas para gamificação
        topicosExplorados.add(paginaAlvo);
        
        if (topicosExplorados.size >= 5) {
            const cardConq2 = document.getElementById('conq-2');
            if (cardConq2) cardConq2.classList.add('desbloqueada');
            
            if (progressoGlobal < 70) {
                progressoGlobal = 70;
                atualizarInterfaceGamificacao();
            }
        }
    }
}

// Mecanismo de Atualização da Barra e Badges de XP
function atualizarInterfaceGamificacao() {
    const barra = document.getElementById('progresso-interno');
    const badge = document.getElementById('badge-atual');
    
    if (barra && badge) {
        barra.style.width = `${progressoGlobal}%`;
        
        if (progressoGlobal >= 100) {
            badge.innerText = "🏆 Especialista Técnico Concluído";
            badge.style.color = "var(--azul-neon)";
        } else if (progressoGlobal >= 70) {
            badge.innerText = "🥇 Mestre da Segurança Digital";
            badge.style.color = "var(--azul-neon)";
        } else if (progressoGlobal >= 40) {
            badge.innerText = "🥈 Explorador da Tecnologia";
            badge.style.color = "var(--roxo-tech)";
        }
    }
}

// Lógica Funcional dos Quizzes
function validarQuiz(botaoClicado, eCorreto) {
    const container = botaoClicado.parentElement;
    const botoes = container.querySelectorAll('.opcao-quiz');
    const feedback = container.querySelector('.resultado-quiz');
    
    botoes.forEach(btn => btn.disabled = true);
    
    if (eCorreto) {
        botaoClicado.style.backgroundColor = "var(--verde-sucesso)";
        botaoClicado.style.borderColor = "var(--verde-sucesso)";
        feedback.innerText = "🟢 Resposta Correta! Você absorveu o conteúdo.";
        feedback.style.color = "var(--verde-sucesso)";
        
        progressoGlobal += 10;
        if (progressoGlobal > 100) progressoGlobal = 100;
        atualizarInterfaceGamificacao();
    } else {
        botaoClicado.style.backgroundColor = "var(--vermelho-alerta)";
        botaoClicado.style.borderColor = "var(--vermelho-alerta)";
        feedback.innerText = "🔴 Resposta incorreta. Revise o material de estudo acima.";
        feedback.style.color = "var(--vermelho-alerta)";
    }
}

// Lógica do Simulador Analisador de Senhas
function testarSenha(senha) {
    const output = document.getElementById('resultado-senha');
    if (!output) return;

    if (senha.length === 0) {
        output.innerText = "Aguardando entrada de dados...";
        output.style.color = "var(--texto-cinza)";
        return;
    }

    const temLetras = /[a-zA-Z]/.test(senha);
    const temNumeros = /[0-9]/.test(senha);
    const temEspeciais = /[!@#$%^&*(),.?":{}|<>|]/.test(senha);

    if (senha.length >= 10 && temLetras && temNumeros && temEspeciais) {
        output.innerText = "🟢 Força: ALTA. Excelente padrão de proteção algorítmica.";
        output.style.color = "var(--verde-sucesso)";
        
        const cardConq3 = document.getElementById('conq-3');
        if (cardConq3) cardConq3.classList.add('desbloqueada');
        
        progressoGlobal = 100;
        atualizarInterfaceGamificacao();
    } else if (senha.length >= 6 && temLetras && temNumeros) {
        output.innerText = "🟣 Força: MÉDIA. Melhore adicionando símbolos especiais.";
        output.style.color = "var(--roxo-tech)";
    } else {
        output.innerText = "🔴 Força: FRACA. Extremamente vulnerável a ataques de dicionário.";
        output.style.color = "var(--vermelho-alerta)";
    }
}

// Execução imediata ao carregar a página
window.onload = () => {
    navegar('home');
    atualizarInterfaceGamificacao();
};