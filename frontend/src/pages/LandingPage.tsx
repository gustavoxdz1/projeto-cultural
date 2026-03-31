import { useEffect } from "react";
import { Link } from "react-router-dom";

const faqItems = [
  {
    question: "O que a SpotTech oferece?",
    answer:
      "A SpotTech oferece uma plataforma estruturada para apresentação de locais, curadoria administrativa, colaboração por sugestões e organização de informações institucionais de maneira clara e confiável.",
  },
  {
    question: "Como os locais entram na plataforma?",
    answer:
      "Os registros podem ser criados diretamente pela administração ou sugeridos por usuários autenticados. Em todos os casos, a publicação final permanece sob validação administrativa.",
  },
  {
    question: "Qual a diferença entre usuário e administrador?",
    answer:
      "O usuário autenticado pode consultar o portal e sugerir novos locais. O administrador aprova sugestões, cria categorias, edita registros e mantém a base oficial atualizada.",
  },
  {
    question: "Posso usar imagens reais de Manaus nesta página?",
    answer:
      "Sim. A estrutura foi preparada para receber imagens institucionais e fotografias reais dos espaços, substituindo facilmente os blocos visuais atuais.",
  },
];

export function LandingPage() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-rise"),
    );

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 },
    );

    elements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${index * 80}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="landing-page">
      <article className="landing-surface">
        <header className="landing-header">
          <div className="landing-brand">
            <img
              alt="SpotTech"
              className="brand-mark-image"
              src="/images/branding/spottech-logo.png"
            />
            <div>
              <strong>SpotTech</strong>
              <p>
                Plataforma de organização e guia de locais turisticos em Manaus
                !
              </p>
            </div>
          </div>

          <nav className="landing-nav">
            <Link className="landing-secondary-button" to="/login">
              Login
            </Link>
            <Link className="portal-menu-button" to="/admin/login">
              Administrador
            </Link>
          </nav>
        </header>

        <section className="landing-hero scroll-rise">
          <div className="landing-copy">
            <h1>
              Conectando locais, gestão e experiência pública em uma única
              plataforma digital.
            </h1>
            <p>
              A SpotTech foi criada para estruturar a presença digital de
              espaços relevantes, reunindo informações institucionais,
              visibilidade pública e uma operação administrativa organizada em
              um ambiente moderno e seguro.
            </p>
            <p>
              Mais do que um catálogo, a plataforma funciona como um ponto
              central de guia turistico online permitindo que usuários encontrem
              locais com mais facilidade e que mantenha a base oficial
              consistente ao longo do tempo.
            </p>

            <div className="landing-actions">
              <Link className="primary-button" to="/cadastro">
                Criar conta
              </Link>
              <Link className="landing-secondary-button" to="/login">
                Acessar plataforma
              </Link>
            </div>
          </div>

          <aside className="landing-visual-panel">
            <div className="landing-hero-photo">
              <img
                alt="Teatro Amazonas"
                className="landing-hero-photo-image"
                src="/images/landing/teatro.png"
              />
              <div className="landing-hero-photo-overlay">
                <span>Imagem principal do projeto</span>
                <small>
                  Substitua este espaço por uma foto forte de Manaus ou de um
                  local emblemático.
                </small>
              </div>
            </div>
          </aside>
        </section>

        <section className="landing-trusted-strip scroll-rise">
          <div className="landing-logo-row">
            <div>Curadoria</div>
            <div>Gestão</div>
            <div>Consulta pública</div>
            <div>Expansão digital</div>
            <div>Inovação</div>
          </div>
        </section>

        <section className="landing-section scroll-rise" id="sobre">
          <div className="landing-section-heading">
            <span className="eyebrow">Sobre a plataforma</span>
            <h2>
              Uma solução pensada para tornar o acesso a pontos turisticos mais
              confiável e de forma pratica !
            </h2>
            <p>
              A SpotTech é uma plataforma que une tecnologia e turismo para
              ajudar moradores e visitantes a encontrarem lugares de interesse
              de forma rápida e prática, como pontos turísticos, restaurantes,
              praças e espaços culturais. Seu objetivo é centralizar informações
              importantes em um só ambiente digital, oferecendo uma experiência
              simples, intuitiva e eficiente para quem deseja conhecer melhor a
              cidade e explorar novos locais com mais facilidade.
            </p>
          </div>
        </section>

        <section className="landing-services scroll-rise" id="solucoes">
          <article className="landing-service-card">
            <div className="landing-service-media" />

            <h3>Catálogo institucional</h3>
            <p>
              Estruturação de registros com foco em clareza, categorização e
              leitura pública de informações essenciais.
            </p>
          </article>

          <article className="landing-service-card">
            <div className="landing-service-media alt" />

            <h3>Curadoria administrativa</h3>
            <p>
              Aprovação, edição e atualização dos locais por perfis
              administrativos com controle mais seguro do conteúdo publicado.
            </p>
          </article>

          <article className="landing-service-card">
            <div className="landing-service-media muted" />
            <h3>Sugestões qualificadas</h3>
            <p>
              Participação do usuário autenticado por meio de sugestões que
              ampliam o alcance da base e fortalecem a atualização contínua do
              sistema.
            </p>
          </article>
        </section>

        <section className="landing-section landing-split-section scroll-rise">
          <div className="landing-text-block">
           
            <h2>
              Uma arquitetura preparada para valorizar presença digital e
              facilitar gestão.
            </h2>
            <p>
              O projeto foi desenhado para equilibrar apresentação pública e
              operação interna. Isso significa que a experiência do visitante
              pode ser elegante e objetiva, enquanto a gestão administrativa
              permanece focada em validação, consistência de dados e expansão do
              conteúdo com mais controle.
            </p>
            <p>
              Esse modelo favorece a construção de um acervo digital confiável,
              pronto para crescer com novas categorias, integrações, rotas de
              navegação e módulos futuros.
            </p>
          </div>

          <div className="landing-stat-stack">
            <div className="landing-stat-card">
              <strong>01</strong>
              <p>Experiência inicial institucional para visitantes.</p>
            </div>
            <div className="landing-stat-card">
              <strong>02</strong>
              <p>Área autenticada para consulta, sugestão e acompanhamento.</p>
            </div>
            <div className="landing-stat-card">
              <strong>03</strong>
              <p>Painel administrativo para manter a base viva e atualizada.</p>
            </div>
          </div>
        </section>

        <section className="landing-showcase scroll-rise" id="acervo">
          <div className="landing-section-heading">
            
            <h2>
              Locais e pontos turisticos no catalago e muito mais, com apenas um click você vai onde quiser !
            </h2>
            <p>
              A composição abaixo foi organizada para funcionar como vitrine
              visual. Você pode substituir cada bloco por fotos reais de Manaus,
              de espaços culturais, centros esportivos, áreas de convivência ou
              patrimônios relevantes para a narrativa do portal.
            </p>
          </div>

          <div className="landing-photo-grid">
            <article className="landing-photo-card large">
              <div className="landing-photo-placeholder">
                <span>Teatro Amazonas</span>
                <small>
                  Lugar iconico onde todo turista deve conhecer !
                </small>
              </div>
            </article>

            <article
              className="landing-photo-card"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(16, 16, 16, 0.08), rgba(16, 16, 16, 0.34)), url('/images/landing/pordosol-em-ponta-negra.png')",
              }}
            >
              <div className="landing-photo-placeholder">
                <span>Pôr do sol na Ponta Negra</span>
                <small>
                  Um dos cenários mais procurados por turistas para passeio,
                  contemplação e fim de tarde em Manaus.
                </small>
              </div>
            </article>

            <article className="landing-photo-card">
              <div className="landing-photo-placeholder">
                <span>Imagem complementar</span>
                <small>
                  Praças, áreas esportivas, fachadas históricas ou cenas
                  urbanas.
                </small>
              </div>
            </article>
          </div>
        </section>

        <section className="landing-faq scroll-rise" id="faq">
          <div className="landing-section-heading">
            <h2>
              Perguntas frequentes sobre a operação e o propósito da SpotTech.
            </h2>
            <p>
              Aqui você tira algumas duvidas de como operamos e como cadastramos
              os lugares ,para que você fique por dentro do melhor de Manaus !
            </p>
          </div>

          <div className="landing-faq-grid">
            {faqItems.map((item) => (
              <article className="landing-faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-cta scroll-rise">
          <div>
            <h2>
              Se cadastre na plataforma e ajude o proximo , SpotTech sempre lhe
              guiando .
            </h2>
            <p>
              A SpotTech já está pronta para receber novos usuários, validar
              conteúdos e expandir a presença digital, ajude a dar um norte para
              os novos usuarios !
            </p>
          </div>

          <div className="landing-actions">
            <Link className="primary-button" to="/cadastro">
              Criar conta
            </Link>
            <Link className="landing-secondary-button" to="/login">
              Login
            </Link>
          </div>
        </section>
      </article>
    </section>
  );
}
