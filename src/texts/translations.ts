export interface Translations {
  hero: {
    welcome: string;
    title: string;
    description: string;
    button: string;
  };
  about: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
  };
  about2: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
  };
  howTo: {
    title: string;
    description: string;
    cards: {
      signup: {
        title: string;
        description: string;
      };
      friends: {
        title: string;
        description: string;
      };
      traffic: {
        title: string;
        description: string;
      };
    };
  };
  stats: {
    title: string;
    description: string;
    users: string;
    visits: string;
    contribution: string;
    income: string;
  };
  cta: {
    title: string;
    description: string;
    signup: string;
    about: string;
  };
  footer: {
    copyright: string;
  };
}

export const translations: Record<string, Translations> = {
  en: {
    hero: {
      welcome: "Welcome to the",
      title: "Ubuntu-Project",
      description:
        "Ever wanted to own a company? Our idea is simple. We founded an online company and for now we provide this platform. By signing up, you become an equal shareholder — meaning every bit of revenue our little business generates is split equally among all of us. Simple as that. No fine print, no tricks.",
      button: "Got curious?",
    },
    about: {
      title: "Here's the plan...",
      paragraph1:
        "We believe sustainable wealth isn't about fast profits — it's about <strong>ownership</strong> . Online, that means owning our data and the spaces we build together.",
      paragraph2:
        'The trade of data for "free" access to services might seem fair, but we imagine a space used by everyone, where we actually own the data we create — and have the freedom to decide what happens to it.',
      paragraph3:
        "We've started by creating a Forum, a Discord Server, and a GitHub Repository — open spaces that allow us to exchange ideas and collaborate. Join if you wish. Every voice helps build what comes next.",
    },
    about2: {
      title: "Something important to us:",
      paragraph1:
        "Our aim is <strong>not</strong> to design a system that ties contribution to personal financial reward. We believe that true prosperity exists only at the <strong>collective level</strong> — and we are committed to preserving that principle.",
      paragraph2:
        "Also, this doesn't mean there's no hierarchy at all. For now, we — the founders — act as administrators of the platform, servers, and repositories, serving as the company's functional leadership. In the long run, we aim to establish a more distributed model — electing spokespersons by area of expertise and making key decisions collectively.",
      paragraph3:
        "Working with us is not mandatory and will never be. But we want you to see this as your company as well.",
    },
    howTo: {
      title: "What can you do?",
      description:
        "If you are looking to help get our business running, we have a few ideas we would like to discuss with you. But for starters, we have thought of a simple <strong>3-Step-Plan</strong>, on how to proceed from here:",
      cards: {
        signup: {
          title: "Sign up",
          description:
            "Our first goal is to achieve a certain amount of registrated users. Our strength will come from numbers. And our resource will be ourselves.",
        },
        friends: {
          title: "Tell your Friends",
          description:
            "Tell people about us. There is literally no downside to signing up, there is no mandatory tasks anyone must do. But this is your company now too.",
        },
        traffic: {
          title: "Generate traffic",
          description:
            "One daily visit would already help. You could save us as your browser's homepage. If we have traffic, we have attention and if we have attention we will be able to decide what to do with it.",
        },
      },
    },
    stats: {
      title: "How it's going so far?",
      description:
        "We have launched in October 2025 and these are our current numbers.",
      users: "Registered Users",
      visits: "Daily Visits",
      contribution: "User contribution",
      income: "Income generated",
    },
    cta: {
      title: "Care to join us?",
      description:
        "Worst case this will have zero impact on your life. Best case, we will build something unprecedented. Our choice.",
      signup: "Sign up",
      about: "About Us",
    },
    footer: {
      copyright: "© 2025 siefke1. All rights reserved. Built with ❤️",
    },
  },
  de: {
    hero: {
      welcome: "Willkommen beim",
      title: "Ubuntu-Projekt",
      description:
        "Hast Du mal davon geträumt, dein eigenes Unternehmen zu haben? Unsere Idee ist simpel. Wir haben ein Online-Unternehmen gegründet und stellen momentan diese Plattform zur Verfügung. Durch die Anmeldung bei uns, wirst du zum gleichberechtigten Aktionär — das bedeutet, jeder Cent Umsatz, den unser kleines Unternehmen generiert, wird gleichmäßig unter uns allen aufgeteilt. Keine versteckten Kosten, keine Tricks.",
      button: "Neugierig geworden?",
    },
    about: {
      title: "Hier ist der Plan...",
      paragraph1:
        "Wir glauben, dass nachhaltiger Wohlstand nicht in schnellen Gewinnen liegt — sondern in <strong>Beteiligung</strong>. Online bedeutet das, ein Besitzrecht geltend machen zu können, für unsere Daten und die Räume die wir gemeinsam aufbauen.",
      paragraph2:
        'Der Deal persönliche Daten gegen "kostenlosen" Zugang zu Webservices mag fair erscheinen, aber wir stellen uns einen Raum vor, in dem wir nicht nur entscheiden können wem wir unsere Daten geben, sondern auch am damit generierten Umsatz beteiligt sind.',
      paragraph3:
        "Wir haben mit der Erstellung eines Forums, eines Discord-Servers und eines GitHub-Repositories begonnen — offene Räume, die es uns ermöglichen, Ideen auszutauschen und zusammenzuarbeiten. Mach mit, wenn du möchtest. Jede Stimme hilft dabei, das nächste zu bauen.",
    },
    about2: {
      title: "Etwas das uns wichtig ist:",
      paragraph1:
        "Unser Ziel ist es nicht, ein System zu entwerfen, das Leistung mit persönlicher finanzieller Belohnung verknüpft. Wir glauben, dass wahrer Wohlstand nur auf kollektiver Ebene existiert — und wir sind entschlossen, dieses Prinzip zu bewahren.",
      paragraph2:
        "Das bedeutet allerdings nicht, dass es keinerlei Hierarchien gibt. Vorerst fungieren wir — die Gründer — als Administratoren der Plattform, Server und Code-Base und dienen als funktionale Führung des Unternehmens. Langfristig streben wir ein verteilteres Modell an — die Wahl von Sprecherinnen und Sprechern nach Fachgebiet und kollektive Entscheidungsfindung.",
      paragraph3:
        "Die Arbeit mit uns ist nicht verpflichtend und wird es nie sein. Aber wir möchten, dass du das auch als dein Unternehmen betrachtest.",
    },
    howTo: {
      title: "Was kannst du tun?",
      description:
        "Falls du helfen möchtest, unser Unternehmen zum Laufen zu bringen, haben wir einige Ideen, die wir mit dir besprechen möchten. Aber für den Anfang haben wir uns einen einfachen <strong>3-Schritte-Plan</strong> überlegt, wie wir vorgehen können:",
      cards: {
        signup: {
          title: "Melde Dich an",
          description:
            "Unser erstes Ziel ist es, eine bestimmte Anzahl registrierter Benutzer zu erreichen. Je mehr wir sind, desto besser, denn unsere Ressource werden wir selbst sein.",
        },
        friends: {
          title: "Erzähle es weiter",
          description:
            "Erzähl den Leuten von uns. Schlage Freunden vor sich anzumelden. Schließlich ist es jetzt auch dein Unternehmen.",
        },
        traffic: {
          title: "Traffic generieren",
          description:
            "Ein täglicher Besuch würde bereits helfen. Du könntest uns als deine Browser-Startseite speichern. Wenn wir Traffic haben, haben wir Aufmerksamkeit und wenn wir Aufmerksamkeit haben, können wir entscheiden, was wir damit machen.",
        },
      },
    },
    stats: {
      title: "Wie läuft es bisher?",
      description:
        "Wir haben im Oktober 2025 gestartet und das sind unsere aktuellen Zahlen.",
      users: "Registrierte Benutzer",
      visits: "Besuche Heute",
      contribution: "Benutzerbeitrag",
      income: "Generiertes Einkommen",
    },
    cta: {
      title: "Lust mitzumachen?",
      description:
        "Im schlimmsten Fall wird es keinerlei Auswirkungen auf dein Leben haben. Im besten Fall werden wir etwas Beispielloses aufbauen. Unsere Wahl.",
      signup: "Anmelden",
      about: "Über uns",
    },
    footer: {
      copyright: "© 2025 siefke1. Alle Rechte vorbehalten. Gebaut mit ❤️",
    },
  },
};

export const getTranslations = (language: string = "en"): Translations => {
  return translations[language] || translations.en;
};
