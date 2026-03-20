const json = {
  "title": "Planeamento para Field Service",
  
  // Disable native progress bar because we will use our own custom bar in HTML
  "showProgressBar": "off", 
  
  "showPrevButton": true,
  "pagePrevText": "Anterior",
  "pageNextText": "Continuar",
  "completeText": "Submeter", 
  
  "clearInvisibleValues": "none",
  "logo": "./logo.png",
  "logoWidth": "auto",
  "logoHeight": "60",

  "pages": [
    // ==========================================
    // PAGE 0 - LOGIN
    // ==========================================
    {
      "name": "step_login",
      "navigationTitle": "Login",
      "elements": [
        {
          "type": "html",
          "name": "header_login",
          "html": `
            <div style="text-align: center; padding: 20px 0;">
              <h2 style="color: #4b8a2e; margin-bottom: 10px;">Acesso ao Sistema</h2>
              <p style="color: #666; font-size: 14px;">Por favor, introduza as suas credenciais para iniciar o planeamento.</p>
            </div>
            <hr style='border: 0; border-top: 1px solid #ddd; margin: 10px 0 30px 0;' />
          `
        },
        {
          "type": "text",
          "name": "login_email",
          "title": "Email do Técnico",
          "isRequired": true,
          "inputType": "email",
          "placeholder": "exemplo@empresa.pt"
        },
        {
          "type": "text",
          "name": "login_password",
          "title": "Palavra-passe",
          "isRequired": true,
          "inputType": "password",
          "placeholder": "••••••••"
        }
      ]
    },
    // ==========================================
    // PAGE 1 - INITIAL DATA
    // ==========================================
    {
      "name": "step1",
      // Removed "title" to control it in HTML alongside the custom progress bar
      "elements": [
        {
          "type": "html",
          "name": "header_p1",
          "html": `
            <h3 style='margin: 0 0 10px 0; font-size: 15px; color: #000;'>Página 1 de 4 - Dados Iniciais</h3>
            
            <div style='border: 1px solid #ccc; border-radius: 12px; height: 18px; width: 100%; background: #f9f9f9; overflow: hidden;'>
              <div style='background-color: #4b8a2e; width: 25%; height: 100%; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 18px;'>25%</div>
            </div>
            
            <hr style='border: 0; border-top: 1px dotted #999; margin: 20px 0;' />
          `
        },
        {
          "type": "dropdown",
          "name": "q103_ticket",
          "title": "103. Número do ticket",
          "isRequired": true,
          "width": "100%",
          "choicesLazyLoadEnabled": true,
          "choicesLazyLoadPageSize": 20,
          "placeholder": "Escreva pelo menos 3 caracteres..."
        },
        {
          "type": "dropdown",
          "name": "q105_tecnico",
          "title": "105. Técnico que irá ao local",
          "isRequired": true,
          "width": "50%"
        },
        {
          "type": "dropdown",
          "name": "q106_cliente",
          "title": "106. Cliente",
          "isRequired": true,
          "width": "50%",
          "startWithNewLine": false,
          "choicesLazyLoadEnabled": true,
          "choicesLazyLoadPageSize": 20,
          "placeholder": "Escreva pelo menos 3 caracteres..."
        },
        {
          "type": "dropdown",
          "name": "q107_local",
          "title": "107. Local",
          "isRequired": true,
          "width": "100%",
          "choicesLazyLoadEnabled": true,
          "choicesLazyLoadPageSize": 20,
          "placeholder": "Escreva pelo menos 3 caracteres..."
        },
        {
          "type": "dropdown",
          "name": "q108_pessoa_responsavel",
          "title": "108. Pessoa responsável no local",
          "isRequired": true,
          "choicesLazyLoadEnabled": true,
          "choicesLazyLoadPageSize": 20,
          "placeholder": "Escreva pelo menos 3 caracteres..."
        },
        {
          "type": "text",
          "name": "q109_telemovel",
          "title": "109. Telemóvel do Responsável no local",
          "isRequired": true,
          "width": "50%",
          "validators": [
            {
              "type": "regex",
              "regex": "^[0-9]{9}$",
              "text": "O telemóvel deve conter exatamente 9 dígitos."
            }
          ]
        },
        {
          "type": "text",
          "name": "q1010_email",
          "title": "1010. E-mail do Responsável no local",
          "inputType": "email",
          "isRequired": true,
          "startWithNewLine": false,
          "width": "50%",
          "validators": [
            {
              "type": "email",
              "text": "Por favor, insira um endereço de e-mail válido."
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "q1011_autorizacao",
          "title": "1011. Local requer pedido de autorização de entrada?",
          "colCount": 0,
          "choices": [
            { "value": "sim", "text": "Sim" },
            { "value": "nao", "text": "Não" }
          ]
        }
      ]
    },
    // ==========================================
    // PAGE 2 - INTERVENTION DETAILS
    // ==========================================
    {
      "name": "step2",
      "elements": [
        {
          "type": "html",
          "name": "header_p2",
          "html": `
            <h3 style='margin: 0 0 10px 0; font-size: 15px; color: #000;'>Página 2 de 4 - Detalhes da Intervenção</h3>
            
            <div style='border: 1px solid #ccc; border-radius: 12px; height: 18px; width: 100%; background: #f9f9f9; overflow: hidden;'>
              <div style='background-color: #4b8a2e; width: 50%; height: 100%; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 18px;'>50%</div>
            </div>
            
            <hr style='border: 0; border-top: 1px dotted #999; margin: 20px 0;' />
          `
        },
        {
          "type": "comment",
          "name": "q301_resultado_despiste",
          "title": "301. Resultado do despiste telefónico",
          "isRequired": true,
          "rows": 5
        },
        {
          "type": "text",
          "name": "q302_duracao_prevista",
          "title": "302. Duração prevista da intervenção no local",
          "isRequired": true,
          "width": "100%", 
          "size": 10
        },
        {
          "type": "radiogroup",
          "name": "q303_pessoa_informada",
          "title": "303. A pessoa responsável foi informada da duração prevista da intervenção?",
          "isRequired": false,
          "colCount": 0,
          "choices": [
            { "value": "sim", "text": "Sim" },
            { "value": "nao", "text": "Não" }
          ]
        },
        {
          "type": "text",
          "name": "q304_data_intervencao",
          "title": "304. Data para intervenção",
          "isRequired": true,
          "inputType": "date",
          "width": "50%"
        },
        {
          "type": "text",
          "name": "q305_hora_intervencao",
          "title": "305. Hora para intervenção",
          "isRequired": true,
          "inputType": "time",
          "width": "50%",
          "startWithNewLine": false
        },
        {
          "type": "checkbox",
          "name": "q306_data_autorizada_por",
          "title": "306. A data da intervenção foi autorizada por:",
          "isRequired": true,
          "colCount": 2,
          "choices": [
            { "value": "pessoa_local", "text": "Pessoa responsável no local (preferencial)" },
            { "value": "responsavel_informatica", "text": "Responsável da Informática" },
            { "value": "pf_jt", "text": "PF ou JT" }
          ]
        },
        {
          "type": "radiogroup",
          "name": "q307_pessoa_adicional",
          "title": "307. Será necessária intervenção de pessoa adicional?",
          "description": "Como apoio de um fornecedor ou apoio da informática do cliente",
          "isRequired": true,
          "colCount": 0,
          "choices": [
            { "value": "sim", "text": "Sim" },
            { "value": "nao", "text": "Não" }
          ]
        },
        {
          "type": "radiogroup",
          "name": "q308_pessoa_adicional_informada",
          "title": "308. A pessoa adicional foi informada e confirmou disponibilidade?",
          "isRequired": true,
          "visibleIf": "{q307_pessoa_adicional} = 'sim'",
          "colCount": 0,
          "choices": [
            { "value": "sim", "text": "Sim" },
            { "value": "nao", "text": "Não" }
          ]
        },
        {
          "type": "dropdown",
          "name": "q309_nome_adicional",
          "title": "309. Nome da pessoa adicional?",
          "isRequired": true,
          "visibleIf": "{q307_pessoa_adicional} = 'sim'",
          "width": "50%",
          "choicesLazyLoadEnabled": true,
          "choicesLazyLoadPageSize": 20,
          "placeholder": "Escreva pelo menos 3 caracteres..."
        },
        {
          "type": "text",
          "name": "q3010_email_adicional",
          "title": "3010. Email da pessoa adicional?",
          "isRequired": true,
          "inputType": "email",
          "visibleIf": "{q307_pessoa_adicional} = 'sim'",
          "width": "50%",
          "startWithNewLine": false
        }
      ] 
    },
    // ==========================================
    // PAGE 3 - CONDITIONS AND TOOLS
    // ==========================================
    {
      "name": "step3",
      "elements": [
        {
          "type": "html",
          "name": "header_p3",
          "html": `
            <h3 style='margin: 0 0 10px 0; font-size: 15px; color: #000;'>Página 3 de 4 - Verificação de Ferramentas</h3>
            
            <div style='border: 1px solid #ccc; border-radius: 12px; height: 18px; width: 100%; background: #f9f9f9; overflow: hidden;'>
              <div style='background-color: #4b8a2e; width: 75%; height: 100%; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 18px;'>75%</div>
            </div>
            
            <hr style='border: 0; border-top: 1px dotted #999; margin: 20px 0;' />
          `
        },
        {
          "type": "radiogroup",
          "name": "q501_condicoes_reunidas",
          "title": "501. Estão reunidas todas as condições para intervenção no local com sucesso?",
          "isRequired": true,
          "colCount": 0,
          "choices": [
            { "value": "sim", "text": "Sim" },
            { "value": "nao", "text": "Não" }
          ]
        },
        {
          "type": "radiogroup",
          "name": "q503_testados_oficina",
          "title": "503. Os equipamentos ou software foram testados em oficina antes da deslocação?",
          "isRequired": true,
          "colCount": 0,
          "choices": [
            { "value": "sim", "text": "Sim" },
            { "value": "nao", "text": "Não" }
          ]
        },
        {
          "type": "radiogroup",
          "name": "q505_ferramentas_acompanham",
          "title": "505. O técnico acompanha-se das ferramentas hardware e software para uma boa execução?",
          "isRequired": true,
          "colCount": 0,
          "choices": [
            { "value": "sim", "text": "Sim" },
            { "value": "nao", "text": "Não" }
          ]
        },
        {
          "type": "radiogroup",
          "name": "q507_guia_transporte",
          "title": "507. Caso seja necessário levar material para a intervenção, foi feita Guia de Transporte?",
          "isRequired": true,
          "colCount": 0,
          "choices": [
            { "value": "sim", "text": "Sim" },
            { "value": "nao", "text": "Não" }
          ]
        }
      ] 
    },
    // ==========================================
    // PAGE 4 - SUMMARY & CONFIRMATION
    // ==========================================
    {
      "name": "step4",
      "elements": [
        {
          "type": "html",
          "name": "header_p4",
          "html": `
            <h3 style='margin: 0 0 10px 0; font-size: 15px; color: #000; text-transform: uppercase; letter-spacing: 0.5px;'>Página 4 de 4 - Confirmação Final</h3>
            
            <div style='border: 1px solid #ccc; border-radius: 4px; height: 18px; width: 100%; background: #f9f9f9; overflow: hidden;'>
              <div style='background-color: #4b8a2e; width: 99%; height: 100%; color: white; text-align: center; font-size: 12px; font-weight: bold; line-height: 18px;'>99%</div>
            </div>
            
            <hr style='border: 0; border-top: 1px solid #ddd; margin: 20px 0;' />
            
            <h4 style="color: #4b8a2e; margin-bottom: 15px; font-weight: 600;">Quase pronto! Reveja todos os dados antes de submeter:</h4>
          `
        },
        // --- BLOCK 1: General Data (Always visible) ---
        {
          "type": "html",
          "name": "resumo_p1",
          "html": `
            <div style="background-color: #ffffff; border: 1px solid #ccc; border-bottom: none; padding: 20px 20px 0 20px; border-radius: 8px 8px 0 0; font-size: 14px; color: #333;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>103. Ticket / Responsável:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q103_ticket} ({login_email})</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>105. Técnico Destacado:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q105_tecnico}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>106/107. Cliente / Local:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q106_cliente} - {q107_local}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>108. Pessoa no Local:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q108_pessoa_responsavel} (109. Tel: {q109_telemovel} | 1010. Email: {q1010_email})</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>1011. Requer Autorização de Entrada:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q1011_autorizacao}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>301. Despiste Telefónico:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q301_resultado_despiste}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>302. Duração Prevista:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q302_duracao_prevista} (303. Informada: {q303_pessoa_informada})</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; background-color: #fff9f9;">
                <b style="color: #d32f2f;">304/305. Data da Intervenção:</b> <span style="color: #d32f2f; font-weight: bold; text-align: right; max-width: 65%; overflow-wrap: break-word;">{q304_data_intervencao} às {q305_hora_intervencao}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>306. Autorizado por:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q306_data_autorizada_por}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>307. Intervenção Pessoa Adicional:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q307_pessoa_adicional}</span>
              </div>
            </div>
          `
        },
        // --- BLOCK 2: Additional Person (HIDDEN if "Não" is selected in q307) ---
        {
          "type": "html",
          "name": "resumo_adicional",
          "visibleIf": "{q307_pessoa_adicional} = 'sim'",
          "html": `
            <div style="background-color: #f4f8fc; border-left: 1px solid #ccc; border-right: 1px solid #ccc; padding: 0 20px; font-size: 14px; color: #333;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #b3d4f5; color: #004085;">
                <b>308. Confirmou Disponibilidade?:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q308_pessoa_adicional_informada}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #b3d4f5; color: #004085;">
                <b>309. Nome Adicional:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q309_nome_adicional}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; color: #004085;">
                <b>3010. Email Adicional:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q3010_email_adicional}</span>
              </div>
            </div>
          `
        },
        // --- BLOCK 3: Checklist (Always visible) ---
        {
          "type": "html",
          "name": "resumo_p3",
          "html": `
            <div style="background-color: #ffffff; border: 1px solid #ccc; border-top: none; padding: 0 20px 20px 20px; border-radius: 0 0 8px 8px; font-size: 14px; color: #333;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>501. Condições Reunidas para Sucesso:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q501_condicoes_reunidas}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>503. Testados em Oficina:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q503_testados_oficina}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <b>505. Acompanha Ferramentas:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q505_ferramentas_acompanham}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <b>507. Guia de Transporte Feita:</b> <span style="text-align: right; max-width: 65%; overflow-wrap: break-word;">{q507_guia_transporte}</span>
              </div>
            </div>
          `
        }
      ] 
    }
  ],
  
  "questionErrorLocation": "bottom",
  "widthMode": "static",
  "width": "900px"
};