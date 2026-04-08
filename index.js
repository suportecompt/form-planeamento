// index.js

window.survey = new Survey.Model(json);

if (typeof themeJson !== 'undefined') {
    window.survey.applyTheme(themeJson);
} else {
    window.survey.applyTheme(Survey.DefaultThemeJson);
}

window.survey.focusFirstQuestionAutomatic = false;
window.survey.checkErrorsMode = "onNextPage"; 

// =====================================================================
// GLOBAL VARIABLES & MAPPING
// =====================================================================
window.hiddenMailConfig = null; 
window.idDictionary = {};
window.peopleExtraData = {};

// Mapeo de la pregunta a su Endpoint correspondiente definido en config.js
const questionTableMapping = {
    "q103_ticket": window.AppConfig.ENDPOINTS.TICKETS,
    "q106_cliente": window.AppConfig.ENDPOINTS.COMPANY,
    "q107_local": window.AppConfig.ENDPOINTS.PLACES,
    "q108_pessoa_responsavel": window.AppConfig.ENDPOINTS.PEOPLE,
    "q309_nome_adicional": window.AppConfig.ENDPOINTS.PEOPLE
};

// Inicializar diccionarios
Object.keys(questionTableMapping).forEach(qName => {
    window.idDictionary[qName] = {};
});

// Função auxiliar para fazer chamadas GET à API REST do Supabase
async function fetchSupabaseGET(endpoint, queryString = "") {
    const url = `${window.AppConfig.SUPABASE_URL}${endpoint}${queryString}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': window.AppConfig.SUPABASE_ANON_KEY,
            'Authorization': `${window.AppConfig.SUPABASE_ANON_KEY}`, // Añadido Bearer
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalle del error:", errorData);
        throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
}
// =====================================================================
// INITIALIZATION FUNCTIONS
// =====================================================================

async function loadInitialData() {
    try {
        console.log("A ligar à base de dados via AJAX...");

        // 1. Load Emails (from hidden_data)
        const queryMails = "?select=data&data_type=eq.mails&formulario=eq.planeamento&limit=1";
        const mailData = await fetchSupabaseGET(window.AppConfig.ENDPOINTS.HIDDEN_DATA, queryMails);
        
        if (mailData && mailData.length > 0 && mailData[0].data) {
            window.hiddenMailConfig = {
                emailsto: mailData[0].data.emailsto,
                emailsbcc: mailData[0].data.emailsbcc,
                email_subject: mailData[0].data.email_subject
            };
            console.log("✅ Configuração de emails carregada com sucesso.");
        } else {
            console.warn("⚠️ Não foi encontrada nenhuma configuração de email ativa na tabela.");
        }

        // 2. Load Technicians
        const queryTecnicos = "?select=id,descricao";
        const tecData = await fetchSupabaseGET(window.AppConfig.ENDPOINTS.TECNICOS, queryTecnicos);
        
        const q105 = window.survey.getQuestionByName("q105_tecnico");
        if (q105 && tecData) {
            q105.choices = tecData.map(t => ({ value: t.id, text: t.descricao }));
        }

    } catch (err) {
        console.error("❌ Erro no carregamento inicial:", err.message);
    }
}

// =====================================================================
// EVENTS & LOGIC
// =====================================================================

// Handle value changes to autofill related fields
window.survey.onValueChanged.add((sender, options) => {
    if (options.name === "q108_pessoa_responsavel") {
        const sel = options.value;
        if (sel && window.peopleExtraData[sel]) {
            sender.setValue("q109_telemovel", window.peopleExtraData[sel].telemovel);
            sender.setValue("q1010_email", window.peopleExtraData[sel].email);
        }
    } else if (options.name === "q309_nome_adicional") {
        const sel = options.value;
        if (sel && window.peopleExtraData[sel]) {
            sender.setValue("q3010_email_adicional", window.peopleExtraData[sel].email);
        }
    }
});

// Handle lazy loading for dropdown choices from Supabase (AJAX)
window.survey.onChoicesLazyLoad.add((sender, options) => {
    const tableEndpoint = questionTableMapping[options.question.name];
    if (!tableEndpoint || options.skip > 0) return;
    
    const text = options.filter || "";
    if (text.length < 3) { options.setItems([], 0); return; }

    let lazyLoadTimeout;
    clearTimeout(lazyLoadTimeout); 
    
    // Debounce the request using value from AppConfig
    lazyLoadTimeout = setTimeout(async () => {
        try {
            // 1. Detectar columna de texto. Tickets usa 'title', las demás 'descricao'
            const isTicket = (tableEndpoint === window.AppConfig.ENDPOINTS.TICKETS);
            const isPeople = (tableEndpoint === window.AppConfig.ENDPOINTS.PEOPLE);
            const textField = isTicket ? 'title' : 'descricao';
            
            // 2. Construir campos a devolver
            let selectQuery = `id,${textField}`;
            if (isPeople) {
                selectQuery += ',telemovel,email';
            }

            // 3. Consulta: buscar texto (ilike) y aplicar límite de UI
            const query = `?select=${selectQuery}&${textField}=ilike.*${encodeURIComponent(text)}*&limit=${window.AppConfig.UI.DROPDOWN_SEARCH_LIMIT}`;
            
            // 4. Chamada AJAX
            const data = await fetchSupabaseGET(tableEndpoint, query);

            // 5. Mapear datos
            const formattedData = data.map(item => {
                const rId = String(item.id).trim(); 
                const rText = String(item[textField]).trim();
                window.idDictionary[options.question.name][rText] = rId;
                
                if (isPeople) {
                    window.peopleExtraData[rText] = { 
                        telemovel: item.telemovel || "", 
                        email: item.email || "" 
                    };
                }
                return { value: rText, text: rText };
            });
            options.setItems(formattedData, formattedData.length);
        } catch (e) { 
            console.error(`Erro na procura:`, e.message);
            options.setItems([], 0); 
        }
    }, window.AppConfig.UI.SEARCH_DELAY_MS);
});

// Handle server-side validation (Authentication via AJAX)
window.survey.onServerValidateQuestions.add(function (sender, options) {
    if (sender.currentPage.name === "step_login") {
        const email = options.data["login_email"];
        const password = options.data["login_password"];
        if (!email || !password) { options.complete(); return; }
        
        (async () => {
            try {
                const loginUrl = `${window.AppConfig.SUPABASE_URL}${window.AppConfig.ENDPOINTS.LOGIN}`;
                const response = await fetch(loginUrl, {
                    method: 'POST',
                    headers: {
                        'apikey': window.AppConfig.SUPABASE_ANON_KEY,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, password: password })
                });

                const data = await response.json();

                if (!response.ok || data.error) {
                    options.errors["login_password"] = "Credenciais inválidas.";
                }
                // Si el login es exitoso, podríamos guardar el token si lo necesitáramos más adelante
            } catch (err) { 
                console.error("Erro no login:", err);
                options.errors["login_password"] = "Erro de ligação. Tente novamente."; 
            } finally { 
                options.complete(); 
            }
        })();
    } else { 
        options.complete(); 
    }
});

// =====================================================================
// EXECUTION / RENDER
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    window.survey.render(document.getElementById("surveyElement"));
    loadInitialData(); // Load data on initialization
});