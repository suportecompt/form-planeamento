// submitData.js

window.survey.onComplete.add(async function (sender, options) {
    options.showDataSaving("A guardar os dados no sistema, por favor aguarde...");

    // 1. CRITICAL RETRY: If emails weren't loaded initially, try one last time
    if (!window.hiddenMailConfig) {
        console.log("A tentar carregar os e-mails novamente na submissão...");
        try {
            const { data, error } = await window.supabaseClient
                .from('hidden_data') 
                .select('data')
                .eq('data_type', 'mails') 
                .eq('formulario', 'planeamento') 
                .limit(1);
            
            if (error) throw error;
            
            if (data && data.length > 0 && data[0].data) {
                window.hiddenMailConfig = {
                    emailsto: data[0].data.emailsto,
                    emailsbcc: data[0].data.emailsbcc,
                    email_subject: data[0].data.email_subject
                };
            }
        } catch (e) {
            console.error("Erro no retry dos emails:", e);
        }
    }

    // 2. Clone survey data
    let surveyData = JSON.parse(JSON.stringify(sender.data));
    
    // 3. EMAIL INJECTION (Failsafe)
    if (window.hiddenMailConfig) {
        surveyData["emailsto"] = window.hiddenMailConfig.emailsto;
        surveyData["emailsbcc"] = window.hiddenMailConfig.emailsbcc;
        surveyData["email_subject"] = window.hiddenMailConfig.email_subject;
        console.log("✅ E-mails associados com sucesso.");
    } else {
        console.error("❌ Falha crítica: Não foi possível obter os endereços de e-mail.");
    }

    // 4. CLEANUP FOR QUESTION 307
    if (surveyData["q307_pessoa_adicional"] === "nao") {
        surveyData["q308_pessoa_adicional_informada"] = null;
        surveyData["q309_nome_adicional"] = null;
        surveyData["q3010_email_adicional"] = null;
    }

    // 5. TECHNICAL FIELDS ASSIGNMENT
    const emailTecnico = surveyData.login_email;
    surveyData["q104_responsavel"] = emailTecnico;
    delete surveyData.login_password;

    // 6. SWAP TEXT FOR ID
    const fieldsToSwap = ["q103_ticket", "q106_cliente", "q107_local", "q108_pessoa_responsavel", "q309_nome_adicional"];
    fieldsToSwap.forEach(field => {
        const text = surveyData[field];
        if (text && window.idDictionary[field] && window.idDictionary[field][text]) {
            surveyData[field] = window.idDictionary[field][text];
        }
    });

    // 7. PREPARE DATA PAYLOAD FOR DATABASE
    const payload = {
        tecnico_email: emailTecnico, 
        respostas: surveyData, // Keep the full JSON intact as backup
        
        // Individual column mapping (Injects null if the field doesn't exist):
        emailsto: surveyData.emailsto ?? null,
        emailsbcc: surveyData.emailsbcc ?? null,
        email_subject: surveyData.email_subject ?? null,
        login_email: surveyData.login_email ?? null,
        q103_ticket: surveyData.q103_ticket ?? null,
        q104_responsavel: surveyData.q104_responsavel ?? null,
        q105_tecnico: surveyData.q105_tecnico ?? null,
        q106_cliente: surveyData.q106_cliente ?? null,
        q107_local: surveyData.q107_local ?? null,
        q108_pessoa_responsavel: surveyData.q108_pessoa_responsavel ?? null,
        q109_telemovel: surveyData.q109_telemovel ?? null,
        q1010_email: surveyData.q1010_email ?? null,
        q1011_autorizacao: surveyData.q1011_autorizacao ?? null,
        q301_resultado_despiste: surveyData.q301_resultado_despiste ?? null,
        q302_duracao_prevista: surveyData.q302_duracao_prevista ?? null,
        q303_pessoa_informada: surveyData.q303_pessoa_informada ?? null,
        q304_data_intervencao: surveyData.q304_data_intervencao ?? null,
        q305_hora_intervencao: surveyData.q305_hora_intervencao ?? null,
        q306_data_autorizada_por: surveyData.q306_data_autorizada_por ?? null,
        q307_pessoa_adicional: surveyData.q307_pessoa_adicional ?? null,
        q308_pessoa_adicional_informada: surveyData.q308_pessoa_adicional_informada ?? null,
        q309_nome_adicional: surveyData.q309_nome_adicional ?? null,
        q3010_email_adicional: surveyData.q3010_email_adicional ?? null,
        q501_condicoes_reunidas: surveyData.q501_condicoes_reunidas ?? null,
        q503_testados_oficina: surveyData.q503_testados_oficina ?? null,
        q505_ferramentas_acompanham: surveyData.q505_ferramentas_acompanham ?? null,
        q507_guia_transporte: surveyData.q507_guia_transporte ?? null
    };

    // 8. SUBMISSION LOGIC
    try {
        const { error } = await window.supabaseClient
            .from('planeamento_field_service_responses')
            .insert([payload]);

        if (error) throw error;
        options.showDataSavingSuccess("Os dados foram guardados com sucesso!");

    } catch (err) {
        console.error("❌ Erro na Supabase:", err.message);
        options.showDataSavingError("Erro ao guardar os dados. Por favor, tente novamente.");
    }
});