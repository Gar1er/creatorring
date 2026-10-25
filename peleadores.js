// ==========================================
// BASE DE DATOS OFICIAL DE PELEADORES
// ==========================================

const listaPeleadoresOficial = [
  {
    id: "abby",
    nombreReal: "Abigail Frías",
    alias: "Abby",
    record: "1 - 0 - 0",
    pais: "España 🇪🇸",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/abbyimu",
      twitter: "https://twitter.com/abbyiimu",
    },
    peleas: [
      {
        fecha: "26/07/2025",
        evento: "La Velada del Año V",
        oponente: "Roro",
        resultado: "W",
        metodo: "SD",
        video:
          "https://www.youtube.com/watch?v=Pjulel7EH8w&pp=ygUMYWJieSB2cyByb3Jv",
      },
    ],
  },
  {
    id: "arigameplays",
    nombreReal: "Abril Abadamari",
    alias: "Ari Gameplays",
    record: "1 - 0 - 0",
    pais: "México 🇲🇽",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/arigameplays",
      twitter: "https://twitter.com/arigameplays",
    },
    peleas: [
      {
        fecha: "25/06/2022",
        evento: "La Velada del Año II",
        oponente: "Paracetamor",
        resultado: "W",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=Y9VeJI4Y-KQ&pp=ygUTYXJpZ2FtZXBsYXlzIHZlbGFkYQ%3D%3D",
      },
    ],
  },
  {
    id: "elabraham",
    nombreReal: "Abraham Flores",
    alias: "El Abraham",
    record: "1 - 0 - 0",
    pais: "México 🇲🇽",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/elabrahaham",
      twitter: "https://twitter.com/ElAbrahaham",
    },
    peleas: [
      {
        fecha: "26/04/2026",
        evento: "Supernova Génesis",
        oponente: "Nando",
        resultado: "W",
        metodo: "TKO",
        video:
          "https://www.youtube.com/watch?v=ezyQiUCO27E&pp=ygUTZWwgYWJyYWhhbSB2cyBuYW5kbw%3D%3D",
      },
    ],
  },
  {
    id: "abrahammateo",
    nombreReal: "Abraham Mateo",
    alias: "",
    record: "1 - 0 - 0",
    pais: "España 🇪🇸",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/abrahaammateo",
      twitter: "https://twitter.com/AbrahamMateo",
    },
    peleas: [
      {
        fecha: "01/07/2023",
        evento: "La Velada del Año III",
        oponente: "Ampeter",
        resultado: "W",
        metodo: "SD",
        video:
          "https://www.youtube.com/watch?v=iRRCuKYF4qo&pp=ygUYYW1wZXRlciB2cyBhYnJhaGFtIG1hdGVv",
      },
    ],
  },
  {
    id: "agustin51",
    nombreReal: "Agustín Moreno",
    alias: "Agustin51",
    record: "1 - 0 - 0",
    pais: "España 🇪🇸",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/imagus51",
      twitter: "https://twitter.com/ImAgus51",
    },
    peleas: [
      {
        fecha: "13/07/2024",
        evento: "La Velada del Año IV",
        oponente: "Carrera",
        resultado: "W",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=IPbkwObKdlU&pp=ygUUYWd1c3RpbjUxIHZzIGNhcnJlcmE%3D",
      },
    ],
  },
  {
    id: "yeyo",
    nombreReal: "Agustin de Gregorio",
    alias: "Yeyito",
    record: "1 - 0 - 0",
    pais: "Argentina 🇦🇷",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/yeyidegregorio",
      twitter: "https://twitter.com/yeyitodegrego",
    },
    peleas: [
      {
        fecha: "19/12/2024",
        evento: "Parense de manos",
        oponente: "Zeko",
        resultado: "W",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=fgTTvFOMmMY&pp=ygUOemVrbyB2cyB5ZXlpdGE%3D",
      },
    ],
  },
  {
    id: "aldodenigris",
    nombreReal: "Aldo Tamez de Nigris",
    alias: "Aldo de Nigris",
    record: "1 - 0 - 0",
    pais: "México 🇲🇽",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/aldotdenigris",
      twitter: "https://twitter.com/aldotdenigris",
    },
    peleas: [
      {
        fecha: "15/03/2026",
        evento: "Ring Royale",
        oponente: "Nicola Porcella",
        resultado: "W",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=3OmY9slAzDQ&pp=ygUgYWxkbyBkZSBuaWdyaXMgeSBuaWNvbGEgcG9yY2VsbGE%3D",
      },
    ],
  },
  {
    id: "alemizzle",
    nombreReal: "Alejandra Mizzle",
    alias: "Ale Mizzle",
    record: "0 - 1 - 0",
    pais: "Colombia 🇨🇴",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/alemizzle",
      twitter: "https://twitter.com",
    },
    peleas: [
      {
        fecha: "24/09/2023",
        evento: "Stream Fighters 2",
        oponente: "Manuela QM",
        resultado: "L",
        metodo: "TKO",
        video:
          "https://www.youtube.com/watch?v=NCPYHBy__Y4&pp=ygUUYWxlbWl6emxlIHZzIG1hbnVlbGE%3D",
      },
    ],
  },
  {
    id: "canita",
    nombreReal: "Alexis José Callañaupa",
    alias: "Cañita",
    record: "1 - 0 - 0",
    pais: "Perú 🇵🇪",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/elcanita7w7",
      twitter: "https://twitter.com",
    },
    peleas: [
      {
        fecha: "02/08/2025",
        evento: "La noche dorada",
        oponente: "Cristorata",
        resultado: "W",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=CZWAxOyjEgE&pp=ygUUY2HDsWl0YSB5IGNyaXN0b3JhdGE%3D",
      },
    ],
  },
  {
    id: "alexismvgler",
    nombreReal: "Alexis Mugler",
    alias: "Alexis Mvgler",
    record: "1 - 0 - 0",
    pais: "México 🇲🇽",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/alexismvgler",
      twitter: "https://twitter.com",
    },
    peleas: [
      {
        fecha: "15/03/2026",
        evento: "Ring Royale",
        oponente: "La Kyliezz & Georgina",
        resultado: "L",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=TL3ANfIsVq4&pp=ygUbYWxleGlzIG12Z2xlciB2cyBsYSBreWxpZXp6",
      },
    ],
  },
  {
    id: "alana",
    nombreReal: "Alana Flores",
    alias: "Alana",
    record: "4 - 1 - 0",
    pais: "México 🇲🇽",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/alanafloresf",
      twitter: "https://twitter.com/alanafloresf",
    },
    peleas: [
      {
        fecha: "13/07/2024",
        evento: "La velada del año IV",
        oponente: "Zeling & Nissaxter",
        resultado: "W",
        metodo: "TKO",
        video:
          "https://www.youtube.com/watch?v=yF-ahJkOYyI&pp=ygURYWxhbmEgbGEgdmVsYWRhIDQ%3D",
      },
      {
        fecha: "20/10/2024",
        evento: "Stream Fighters 3",
        oponente: "Mav",
        resultado: "W",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=9zSrZ-hDW7E&pp=ygUMYWxhbmEgcGVsZWFz",
      },
      {
        fecha: "17/08/2025",
        evento: "Supernova Strikers",
        oponente: "Gala Montes",
        resultado: "W",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=xLdmcKormx8&pp=ygUMYWxhbmEgcGVsZWFz",
      },
      {
        fecha: "26/07/2025",
        evento: "La velada del año V",
        oponente: "Ari Geli",
        resultado: "W",
        metodo: "SD",
        video:
          "https://www.youtube.com/watch?v=yliVNGtMZAw&pp=ygUMYWxhbmEgcGVsZWFz0gcJCSwMAYcqIYzv",
      },
      {
        fecha: "26/04/2026",
        evento: "Supernova Génesis",
        oponente: "Flor Vigna",
        resultado: "L",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=BNMtf5hJgq4&pp=ygUMYWxhbmEgcGVsZWFz",
      },
    ],
  },
  {
    id: "zeling",
    nombreReal: "Alicia Gónzalez",
    alias: "Zeling",
    record: "0 - 1 - 0",
    pais: "España 🇪🇸",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/zeiing",
      twitter: "https://twitter.com/Zeling",
    },
    peleas: [
      {
        fecha: "13/07/2024",
        evento: "La Velada del Año IV",
        oponente: "Alana & Amablitz",
        resultado: "L",
        metodo: "TKO",
        video:
          "https://www.youtube.com/watch?v=yF-ahJkOYyI&pp=ygUMYWxhbmEgcGVsZWFz",
      },
    ],
  },
  {
    id: "alondrissa",
    nombreReal: "Alondra Michelle",
    alias: "Alondrissa",
    record: "0 - 1 - 0",
    pais: "Puerto Rico 🇵🇷",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/alondrissa",
      twitter: "https://twitter.com/alondrissa",
    },
    peleas: [
      {
        fecha: "25/07/2026",
        evento: "La Velada del Año VI",
        oponente: "Angie Velasco",
        resultado: "L",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=zgxdAAOSXrg&pp=ygURYWxuZHJpc2EgdnMgYW5naWU%3D",
      },
    ],
  },
  {
    id: "amablitz",
    nombreReal: "Amairani Garza",
    alias: "Amablitz",
    record: "1 - 0 - 0",
    pais: "México 🇲🇽",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/amablitz",
      twitter: "https://twitter.com/amablitz",
    },
    peleas: [
      {
        fecha: "13/07/2024",
        evento: "La Velada del Año IV",
        oponente: "Zeling & Nissaxter",
        resultado: "W",
        metodo: "TKO",
        video:
          "https://www.youtube.com/watch?v=yF-ahJkOYyI&pp=ygUMYWxhbmEgcGVsZWFz",
      },
    ],
  },
  {
    id: "andreavaldiri",
    nombreReal: "Andrea Valdiri",
    alias: "",
    record: "1 - 0 - 0",
    pais: "Colombia 🇨🇴",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/andreavaldirisos",
      twitter: "https://twitter.com",
    },
    peleas: [
      {
        fecha: "18/10/2025",
        evento: "Stream Fighters 4",
        oponente: "Yina Calderón",
        resultado: "W",
        metodo: "TKO",
        video:
          "https://www.youtube.com/watch?v=_ESfHzweDII&pp=ygUeYW5kcmVhIHZhbGRpcmkgeSB5aW5hIGNhbGRlcm9u",
      },
    ],
  },
  {
    id: "andoni",
    nombreReal: "",
    alias: "Andoni",
    record: "1 - 0 - 0",
    pais: "España 🇪🇸",
    foto: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    redes: {
      instagram: "https://instagram.com/andonifitness",
      twitter: "https://twitter.com",
    },
    peleas: [
      {
        fecha: "26/07/2025",
        evento: "La velada del año V",
        oponente: "Carlos Belcast",
        resultado: "W",
        metodo: "UD",
        video:
          "https://www.youtube.com/watch?v=HOEC-eh_JZw&pp=ygURYW5kb25pIHZzIGJlbGNhc3Q%3D",
      },
    ],
  },
];
