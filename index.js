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
// GLOBAL VARIABLES
// =====================================================================
window.hiddenMailConfig = null; 
window.idDictionary = {};
window.peopleExtraData = {};

const questionTableMapping = {
    "q103_ticket": "tickets",
    "q106_cliente": "company", // <-- Changed to 'company'!
    "q107_local": "places",
    "q108_pessoa_responsavel": "people",
    "q309_nome_adicional": "people"
};

// Initialize dictionaries for each table mapping
Object.keys(questionTableMapping).forEach(qName => {
    window.idDictionary[qName] = {};
});

// =====================================================================
// INITIALIZATION FUNCTIONS
// =====================================================================

async function loadInitialData() {
    try {
        console.log("A ligar à Supabase...");

        // 1. Load Emails (Now from hidden_data with the new JSONB column 'data')
        const { data: mailData, error: mailError } = await window.supabaseClient
            .from('hidden_data')
            .select('data')
            .eq('data_type', 'mails')
            .eq('formulario', 'planeamento')
            .limit(1);

        if (mailError) throw mailError;
        
        if (mailData && mailData.length > 0 && mailData[0].data) {
            // Extract the data from the JSON 'data' and assign it to hiddenMailConfig
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
        const { data: tecData, error: tecError } = await window.supabaseClient
            .from('tecnicos')
            .select('id, descricao');

        if (tecError) throw tecError;
        
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

// Handle lazy loading for dropdown choices from Supabase
window.survey.onChoicesLazyLoad.add((sender, options) => {
    const tableName = questionTableMapping[options.question.name];
    if (!tableName || options.skip > 0) return;
    const text = options.filter || "";
    if (text.length < 3) { options.setItems([], 0); return; }

    let lazyLoadTimeout;
    clearTimeout(lazyLoadTimeout); 
    
    // Debounce the request
    lazyLoadTimeout = setTimeout(async () => {
        try {
            // 1. Detect which text column to use depending on the table
            const textField = (tableName === 'tickets') ? 'subject' : 'descricao';
            
            // 2. Build the select query
            let selectQuery = `id, ${textField}`;
            if (tableName === 'people') {
                selectQuery += ', telemovel, email';
            }

            // 3. Make the call to Supabase
            const { data, error } = await window.supabaseClient
                .from(tableName)
                .select(selectQuery)
                .ilike(textField, `%${text}%`) // Search in 'subject' or 'descricao'
                .limit(20);
            
            if (error) throw error;

            // 4. Map the data
            const formattedData = data.map(item => {
                const rId = String(item.id).trim(); 
                const rText = String(item[textField]).trim(); // Use the correct field dynamically
                window.idDictionary[options.question.name][rText] = rId;
                
                if (tableName === 'people') {
                    window.peopleExtraData[rText] = { 
                        telemovel: item.telemovel || "", 
                        email: item.email || "" 
                    };
                }
                return { value: rText, text: rText };
            });
            options.setItems(formattedData, formattedData.length);
        } catch (e) { 
            options.setItems([], 0); 
        }
    }, 200);
});

// Handle server-side validation (Authentication)
window.survey.onServerValidateQuestions.add(function (sender, options) {
    if (sender.currentPage.name === "step_login") {
        const email = options.data["login_email"];
        const password = options.data["login_password"];
        if (!email || !password) { options.complete(); return; }
        
        (async () => {
            try {
                const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
                if (error) options.errors["login_password"] = "Credenciais inválidas.";
            } catch (err) { 
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