// ==========================================
// BASE DE DATOS OFICIAL DE PELEADORES
// ==========================================

const listaPeleadoresOficial = [
    { 
        id: "viruzz", 
        nombreReal: "Víctor Mélida", 
        alias: "ByViruzz", 
        record: "3 - 1 - 0", 
        pais: "España 🇪🇸",
        foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        redes: { instagram: "https://instagram.com/byviruzz", twitter: "https://twitter.com/byviruzz" },
        peleas: [
            { fecha: "26/05/2021", evento: "La Velada del Año I", oponente: "Jagger", resultado: "L (Derrota)", metodo: "DU", video: "https://www.youtube.com" },
            { fecha: "25/06/2022", evento: "La Velada del Año II", oponente: "Momo", resultado: "W (Victoria)", metodo: "TKO", video: "https://www.youtube.com" },
            { fecha: "13/05/2023", evento: "Misfits Boxing 006", oponente: "DK Money", resultado: "W (Victoria)", metodo: "KO", video: "https://www.youtube.com" },
            { fecha: "20/04/2024", evento: "Misfits Boxing 15", oponente: "Sheek Louch", resultado: "W (Victoria)", metodo: "DU", video: "https://www.youtube.com" }
        ]
    },
    { 
        id: "jagger", 
        nombreReal: "Álvaro Carrió", 
        alias: "Jagger", 
        record: "2 - 0 - 0", 
        pais: "España 🇪🇸",
        foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        redes: { instagram: "https://instagram.com/jagger", twitter: "https://twitter.com/jagger" },
        peleas: [
            { fecha: "26/05/2021", evento: "La Velada del Año I", oponente: "ByViruzz", resultado: "W (Victoria)", metodo: "DU", video: "https://www.youtube.com" },
            { fecha: "25/06/2022", evento: "La Velada del Año II", oponente: "David Bustamante", resultado: "W (Victoria)", metodo: "DD", video: "https://www.youtube.com" }
        ]
    },
    { 
        id: "momo", 
        nombreReal: "Gerardo Beltrán", 
        alias: "Momo", 
        record: "0 - 1 - 0", 
        pais: "Argentina 🇦🇷",
        foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        redes: { instagram: "https://instagram.com/momo", twitter: "https://twitter.com/momo" },
        peleas: [
            { fecha: "25/06/2022", evento: "La Velada del Año II", oponente: "ByViruzz", resultado: "L (Derrota)", metodo: "TKO", video: "https://www.youtube.com" }
        ]
    },
    { 
        id: "gari", 
        nombreReal: "Garier", 
        alias: "", 
        record: "50 - 0 - 0", 
        pais: "México",
        foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        redes: { instagram: "https://instagram.com/gar1er", twitter: "https://twitter.com/momo" },
        peleas: [
            { fecha: "25/06/2022", evento: "La Velada del Año II", oponente: "ByViruzz", resultado: "L (Derrota)", metodo: "TKO", video: "https://www.youtube.com" }
        ]
    }
];