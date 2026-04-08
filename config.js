// config.js
// Configuración global para el Formulario de Planeamiento (AJAX/Fetch)

window.AppConfig = {
    // 1. Base de Dados e Autenticação
    SUPABASE_URL: 'https://supabase1.myserver.pt',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjEyMzQ1Njc4LCJleHAiOjI2MTIzNDU2Nzh9.szPPmYS9Pa9WENwHSgsrd7i_YaYLmmORiVqA9jguyGc',

    // 2. Rotas da API (Endpoints) de las tablas de este proyecto
    ENDPOINTS: {
        LOGIN: '/auth/v1/token?grant_type=password',
        
        // Tablas
        TICKETS: '/rest/v1/tickets',
        TECNICOS: '/rest/v1/tecnicos',
        PEOPLE: '/rest/v1/people',
        PLACES: '/rest/v1/places',
        COMPANY: '/rest/v1/company',
        
        // Configuración interna y guardado
        HIDDEN_DATA: '/rest/v1/hidden_data',
        RESPONSES: '/rest/v1/planeamento_field_service_responses'
    },

    // 3. Configuração da Interface (UI)
    UI: {
        DROPDOWN_SEARCH_LIMIT: 20,
        SEARCH_DELAY_MS: 300
    }
};

console.log("⚙️ Configuração carregada: AppConfig inicializado.");