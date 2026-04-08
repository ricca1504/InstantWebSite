import { useState, useRef, useCallback, memo } from "react";

const ICON_GROUPS = {
  "Business": ["💼","📊","📈","📉","💹","💰","💵","💳","🏷️","📋","📌","📍","📎","✏️","📝","📄","📑","📜","📰","📁","📂","📅","🗓️","📆","📬","📢","📣","🔔","🔖","🏦","🏧"],
  "Tech": ["💻","🖥️","📱","📲","☎️","📞","⌨️","🖱️","💾","💿","📀","📡","🔌","🔋","🔭","🔬","⚗️","🧪","🤖","👾","🕹️","🎮","📺","📷","📸","🎥","🎬","⚡","💡","🔦"],
  "Design": ["🎨","🖼️","🖌️","✏️","📐","📏","🗺️","🧩","🎭","🌈","🔮","💎","🏺","🎀","🎁","🎊","🎉","🎈","🪄","✨","💫","🌟","⭐","🎆","🎇"],
  "Natura": ["🌿","🍀","🌱","🌲","🌳","🌴","🌵","🌾","🌺","🌸","🌼","🌻","🌹","🌷","💐","🍃","🍂","🍁","🍄","🌙","☀️","⛅","☁️","🌧️","❄️","🌊","🔥","💧","⭐","🌍"],
  "Persone": ["👤","👥","🧑","👨","👩","🧒","👶","🤝","👋","✋","👏","🙌","💪","👍","👎","❤️","🧡","💛","💚","💙","💜","🖤","💕","💞","💓","💗","💖"],
  "Simboli": ["⚡","💡","🔑","🗝️","🔒","🔓","🛡️","⚔️","🔱","⚜️","🎖️","🏆","🥇","🥈","🥉","✨","💫","⭐","🌟","🔥","💎","👑","🦋","🌸","🍀","🌈","🎯","🎲","🧲","🔮","☯️","☮️","⚕️","♾️","⚛️","🔬","🌐"],
  "Frecce": ["➤","➜","➡","⬅","⬆","⬇","↩","↪","🔄","🔃","↕","↔","⤴","⤵","⏩","⏪","▶️","◀️","↗️","↘️","↙️","↖️","➕","➖","💠","🔹","🔸","🔷","🔶","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪"],
};

const FONTS = ["Inter","Roboto","Poppins","Montserrat","Lato","Open Sans","Raleway","Nunito","DM Sans","Josefin Sans","Quicksand","Merriweather","Oswald","Ubuntu","Barlow","Space Grotesk","Syne","Outfit","Plus Jakarta Sans","Figtree","Cormorant Garamond","Libre Baskerville","Exo 2","Fira Sans","Rubik","Work Sans","Mulish","Manrope","Playfair Display","DM Serif Display"];

const SECTION_CATALOG = [
  // Intro
  {type:"hero",icon:"🏠",label:"Hero — Gradiente",cat:"Intro"},
  {type:"hero_minimal",icon:"🪟",label:"Hero — Minimal dark",cat:"Intro"},
  {type:"hero_split",icon:"◧",label:"Hero — Split testo/immagine",cat:"Intro"},
  {type:"hero_dark",icon:"🌑",label:"Hero — Dark premium",cat:"Intro"},
  {type:"hero_centered_image",icon:"🖼️",label:"Hero — Immagine centrata",cat:"Intro"},
  {type:"hero_announcement",icon:"📣",label:"Hero — Con banner annuncio",cat:"Intro"},
  {type:"hero_video",icon:"🎬",label:"Hero — Con video background",cat:"Intro"},
  {type:"hero_services",icon:"🚀",label:"Hero — Con servizi rapidi",cat:"Intro"},
  // Azienda
  {type:"about",icon:"👤",label:"Chi Siamo — Standard",cat:"Azienda"},
  {type:"about_cards",icon:"🃏",label:"Chi Siamo — Card valori",cat:"Azienda"},
  {type:"mission",icon:"🎯",label:"Mission & Vision & Valori",cat:"Azienda"},
  {type:"manifesto",icon:"📜",label:"Manifesto aziendale",cat:"Azienda"},
  {type:"history",icon:"📅",label:"La nostra storia",cat:"Azienda"},
  {type:"culture",icon:"🌱",label:"Cultura aziendale",cat:"Azienda"},
  {type:"about_image_full",icon:"🏞️",label:"Chi Siamo — Full image",cat:"Azienda"},
  {type:"founders",icon:"🤝",label:"I fondatori",cat:"Azienda"},
  {type:"company_numbers",icon:"📊",label:"Azienda in numeri",cat:"Azienda"},
  // Servizi
  {type:"services",icon:"✨",label:"Servizi — Card griglia",cat:"Servizi"},
  {type:"services_list",icon:"📋",label:"Servizi — Lista dettagliata",cat:"Servizi"},
  {type:"services_icons",icon:"🔲",label:"Servizi — Griglia icone",cat:"Servizi"},
  {type:"services_tabs",icon:"📑",label:"Servizi — Con tab",cat:"Servizi"},
  {type:"features",icon:"🔒",label:"Caratteristiche — Orizzontale",cat:"Servizi"},
  {type:"process",icon:"🔄",label:"Come funziona — Step",cat:"Servizi"},
  {type:"steps_numbered",icon:"①",label:"Step — Numerati grandi",cat:"Servizi"},
  {type:"checklist",icon:"✅",label:"Checklist incluso/escluso",cat:"Servizi"},
  {type:"services_with_image",icon:"🖼️",label:"Servizi — Con immagine laterale",cat:"Servizi"},
  {type:"offering",icon:"🎁",label:"Cosa offriamo — Tre colonne",cat:"Servizi"},
  {type:"why_us",icon:"💡",label:"Perché sceglierci",cat:"Servizi"},
  {type:"process_dark",icon:"⚫",label:"Come funziona — Dark",cat:"Servizi"},
  // Dati
  {type:"numbers",icon:"📊",label:"Numeri & Statistiche",cat:"Dati"},
  {type:"numbers_minimal",icon:"⬜",label:"Numeri — Minimal",cat:"Dati"},
  {type:"before_after",icon:"🔀",label:"Prima e Dopo",cat:"Dati"},
  {type:"comparison",icon:"⚖️",label:"Tabella comparativa",cat:"Dati"},
  {type:"results",icon:"📈",label:"Risultati chiave",cat:"Dati"},
  {type:"progress_bars",icon:"📊",label:"Competenze — Barre",cat:"Dati"},
  {type:"kpi_cards",icon:"💹",label:"KPI Cards",cat:"Dati"},
  {type:"stats_banner",icon:"📈",label:"Banner statistiche",cat:"Dati"},
  // Portfolio
  {type:"portfolio",icon:"🎨",label:"Portfolio — Griglia",cat:"Portfolio"},
  {type:"portfolio_list",icon:"📝",label:"Portfolio — Lista",cat:"Portfolio"},
  {type:"case_study",icon:"🔍",label:"Case Study dettagliato",cat:"Portfolio"},
  {type:"gallery_grid",icon:"📸",label:"Galleria immagini — Griglia",cat:"Portfolio"},
  {type:"project_showcase",icon:"🏅",label:"Progetto in evidenza",cat:"Portfolio"},
  {type:"image_gallery_masonry",icon:"🖼️",label:"Galleria masonry",cat:"Portfolio"},
  // Fiducia
  {type:"testimonials",icon:"💬",label:"Testimonianze — Card",cat:"Fiducia"},
  {type:"testimonials_big",icon:"🗣️",label:"Testimonianza — Grande",cat:"Fiducia"},
  {type:"testimonials_list",icon:"📃",label:"Testimonianze — Lista",cat:"Fiducia"},
  {type:"awards",icon:"🏆",label:"Premi & Certificazioni",cat:"Fiducia"},
  {type:"guarantee",icon:"🛡️",label:"Garanzie al cliente",cat:"Fiducia"},
  {type:"partners",icon:"🤝",label:"Partner & Clienti logo",cat:"Fiducia"},
  {type:"brands_ticker",icon:"🏷️",label:"Ticker brand",cat:"Fiducia"},
  {type:"trust_badges",icon:"🏅",label:"Badge di fiducia",cat:"Fiducia"},
  {type:"press",icon:"📰",label:"Presenti su — Press",cat:"Fiducia"},
  {type:"testimonials_numbers",icon:"📊",label:"Testimonianze + Numeri",cat:"Fiducia"},
  // Persone
  {type:"team",icon:"👥",label:"Team — Card foto",cat:"Persone"},
  {type:"team_minimal",icon:"👤",label:"Team — Minimal lista",cat:"Persone"},
  {type:"open_positions",icon:"💼",label:"Posizioni aperte",cat:"Persone"},
  {type:"team_large",icon:"🧑‍🤝‍🧑",label:"Team — Card grandi",cat:"Persone"},
  {type:"team_dark",icon:"⚫",label:"Team — Dark premium",cat:"Persone"},
  // Conversione
  {type:"pricing",icon:"💎",label:"Prezzi — Card piani",cat:"Conversione"},
  {type:"pricing_table",icon:"📊",label:"Prezzi — Tabella",cat:"Conversione"},
  {type:"pricing_comparison",icon:"⚖️",label:"Confronto piani prezzi",cat:"Conversione"},
  {type:"cta_banner",icon:"📣",label:"CTA — Banner centrato",cat:"Conversione"},
  {type:"cta_split",icon:"↔️",label:"CTA — Split testo/pulsanti",cat:"Conversione"},
  {type:"cta_minimal",icon:"⬜",label:"CTA — Minimal inline",cat:"Conversione"},
  {type:"cta_image_bg",icon:"🌅",label:"CTA — Con immagine sfondo",cat:"Conversione"},
  {type:"cta_dark",icon:"🌑",label:"CTA — Dark premium",cat:"Conversione"},
  {type:"newsletter",icon:"📧",label:"Newsletter iscrizione",cat:"Conversione"},
  {type:"lead_magnet",icon:"🧲",label:"Lead Magnet",cat:"Conversione"},
  {type:"waitlist",icon:"⏳",label:"Waitlist",cat:"Conversione"},
  // Contatti
  {type:"contact",icon:"📬",label:"Contatti — Form + Info",cat:"Contatti"},
  {type:"locations",icon:"📍",label:"Le nostre sedi",cat:"Contatti"},
  {type:"map_section",icon:"🗺️",label:"Dove siamo — Mappa",cat:"Contatti"},
  {type:"social_links",icon:"🔗",label:"Link social & contatti",cat:"Contatti"},
  // Info
  {type:"faq",icon:"❓",label:"FAQ — Accordion",cat:"Info"},
  {type:"faq_two_col",icon:"⊟",label:"FAQ — Due colonne",cat:"Info"},
  {type:"blog_preview",icon:"📰",label:"Blog — Anteprima articoli",cat:"Info"},
  {type:"events",icon:"🗓️",label:"Prossimi eventi",cat:"Info"},
  {type:"timeline",icon:"⏱️",label:"Timeline storica",cat:"Info"},
  {type:"integrations",icon:"🔌",label:"Integrazioni & Tool",cat:"Info"},
  {type:"download",icon:"⬇️",label:"Download risorse",cat:"Info"},
  {type:"video_section",icon:"🎥",label:"Video embed",cat:"Info"},
  {type:"podcast",icon:"🎙️",label:"Episodi podcast",cat:"Info"},
  {type:"pricing_faq",icon:"💡",label:"Prezzi + FAQ",cat:"Info"},
  // Layout
  {type:"media_left",icon:"◀️",label:"Media a sinistra",cat:"Layout"},
  {type:"media_right",icon:"▶️",label:"Media a destra",cat:"Layout"},
  {type:"two_columns",icon:"⬛",label:"Due colonne testo",cat:"Layout"},
  {type:"three_columns",icon:"⬛",label:"Tre colonne testo/icone",cat:"Layout"},
  {type:"highlight_band",icon:"🎨",label:"Banda colorata",cat:"Layout"},
  {type:"quote",icon:"💬",label:"Citazione ispirazionale",cat:"Layout"},
  {type:"divider_cta",icon:"—",label:"Divisore con CTA",cat:"Layout"},
  {type:"icon_grid",icon:"🔲",label:"Griglia icone con testo",cat:"Layout"},
  {type:"accordion_features",icon:"☰",label:"Features a fisarmonica",cat:"Layout"},
  {type:"text_image_alternating",icon:"⊞",label:"Testo/Immagine alternati",cat:"Layout"},
  {type:"full_image_section",icon:"🌄",label:"Sezione immagine full-width",cat:"Layout"},
  {type:"ribbon",icon:"🎀",label:"Ribbon / Fascia colorata",cat:"Layout"},
  {type:"split_feature",icon:"⊞",label:"Feature alternata sx/dx",cat:"Layout"},
  {type:"logo_wall",icon:"🏢",label:"Muro di loghi clienti",cat:"Layout"},
  {type:"image_text_cta",icon:"🖼️",label:"Immagine + Testo + CTA",cat:"Layout"},
  // Speciale
  {type:"counter",icon:"⏱️",label:"Countdown lancio",cat:"Speciale"},
  {type:"cookie_notice",icon:"🍪",label:"Cookie notice / GDPR",cat:"Speciale"},
  {type:"floating_cta",icon:"📌",label:"CTA fluttuante",cat:"Speciale"},
  {type:"comparison_cards",icon:"🃏",label:"Confronto card prodotti",cat:"Speciale"},
  {type:"clients_logos",icon:"🏢",label:"Loghi clienti premium",cat:"Speciale"},
  {type:"impact_section",icon:"💥",label:"Sezione impatto",cat:"Speciale"},
];

const makeId = t => `${t}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,5)}`;
const mediaDef = (emoji="🚀") => ({ useImage: false, image: null, emoji });

// Link target helper
const linkDef = (label="Scopri di più", href="") => ({ label, href, isAnchor: true });

const DEFAULTS = {
  hero:{label:"Hero",title:"Costruiamo il tuo successo digitale",subtitle:"Soluzioni su misura per aziende che vogliono crescere online con strategia, qualità e risultati misurabili.",overlayOpacity:55,cta1:linkDef("Inizia ora","contact"),cta2:linkDef("Scopri i servizi","services"),showCta2:true,height:"100vh",...mediaDef("🚀")},
  hero_minimal:{label:"Hero Minimal",title:"Design che converte.",subtitle:"Creiamo esperienze digitali che trasformano i visitatori in clienti.",cta1:linkDef("Scopri come","services"),showCta2:false,bgColor:"#0f0f1a",textColor:"#ffffff"},
  hero_split:{label:"Hero Split",title:"La tua visione, la nostra esecuzione.",subtitle:"Un team di esperti digitali dedicati al successo del tuo progetto.",cta1:linkDef("Parla con noi","contact"),cta2:linkDef("I nostri lavori","portfolio"),showCta2:true,...mediaDef("🚀")},
  hero_dark:{label:"Hero Dark",title:"Il futuro del digitale è adesso.",subtitle:"Innovazione, design e tecnologia per aziende che non si accontentano della media.",cta1:linkDef("Inizia il progetto","contact"),bgColor:"#0a0a14",...mediaDef("⚡")},
  hero_centered_image:{label:"Hero Con Immagine",title:"Trasformiamo il digitale in crescita",subtitle:"Dalla strategia al lancio, siamo con te in ogni fase.",cta1:linkDef("Scopri come","services"),cta2:linkDef("Contattaci","contact"),showCta2:true,...mediaDef("🖥️")},
  hero_announcement:{label:"Hero Con Annuncio",announcementText:"🎉 Nuovo servizio disponibile",announcementLink:"#services",title:"La piattaforma che fa crescere il tuo business",subtitle:"Unisci strategia, design e tecnologia in un unico partner affidabile.",cta1:linkDef("Inizia gratis","contact"),bgColor:"#0f0f1a"},
  hero_video:{label:"Hero Video",title:"Dove la tecnologia incontra il business",subtitle:"Soluzioni digitali che portano risultati concreti e misurabili.",cta1:linkDef("Scopri di più","services"),cta2:linkDef("Guarda il video","#"),showCta2:true,videoUrl:"https://www.youtube.com/embed/dQw4w9WgXcQ",overlayOpacity:60,bgColor:"#0a0a14"},
  hero_services:{label:"Hero + Servizi",title:"Il tuo partner digitale di fiducia",subtitle:"Dalla strategia al lancio, siamo con te in ogni fase.",cta1:linkDef("Inizia ora","contact"),services:[{icon:"💻",title:"Web Dev"},{icon:"🎨",title:"Design"},{icon:"📊",title:"Marketing"},{icon:"🔒",title:"Security"}]},
  about:{label:"Chi Siamo",sectionLabel:"La nostra storia",title:"Vent'anni di eccellenza digitale",text:"Nata nel 2004 come piccola agenzia creativa, oggi siamo un partner tecnologico di riferimento per oltre 500 aziende in tutta Italia.",stats:[{num:"500+",label:"Clienti attivi"},{num:"20",label:"Anni di storia"},{num:"98%",label:"Soddisfazione"},{num:"50+",label:"Premi vinti"}],showStats:true,showImage:true,...mediaDef("🏛️")},
  about_cards:{label:"Chi Siamo — Valori",sectionLabel:"I nostri valori",title:"Cosa ci rende unici",subtitle:"Quattro pilastri che guidano ogni decisione.",items:[{icon:"🎯",title:"Precisione",desc:"Ogni dettaglio è curato con la massima attenzione."},{icon:"🤝",title:"Partnership",desc:"Il tuo successo è il nostro successo."},{icon:"💡",title:"Innovazione",desc:"Restiamo costantemente all'avanguardia."},{icon:"📊",title:"Risultati",desc:"Misuriamo ogni cosa, ottimizziamo sempre."}]},
  mission:{label:"Mission & Vision",sectionLabel:"La nostra missione",title:"Perché esistiamo",items:[{icon:"🎯",title:"Missione",text:"Aiutare le aziende italiane a competere globalmente attraverso il digitale."},{icon:"👁️",title:"Visione",text:"Un futuro dove ogni impresa ha accesso a strumenti digitali d'eccellenza."},{icon:"💎",title:"Valori",text:"Trasparenza, qualità, innovazione e ascolto profondo del cliente."}]},
  manifesto:{label:"Manifesto",title:"Noi crediamo in un digitale migliore",text:"Crediamo che il design debba essere bello e funzionale. Sempre entrambe le cose.\n\nCrediamo che la tecnologia debba servire le persone, non il contrario.\n\nCrediamo che la trasparenza sia l'unica base su cui costruire una vera relazione professionale.",author:"Il Team Fondatore"},
  history:{label:"Storia",sectionLabel:"La nostra storia",title:"Un percorso di crescita",subtitle:"Da startup a leader di mercato in vent'anni di innovazione.",items:[{year:"2004",title:"La fondazione",desc:"Tre professionisti, una visione comune e la determinazione di cambiare il mercato."},{year:"2010",title:"Primo riconoscimento",desc:"Premio come Miglior Agenzia Digitale d'Italia, prima di molti."},{year:"2016",title:"Espansione nazionale",desc:"Apertura delle sedi di Roma e Torino. Il team raggiunge 30 persone."},{year:"2024",title:"Leader di mercato",desc:"500+ clienti attivi, presenza in 8 paesi, 50 professionisti al lavoro."}]},
  culture:{label:"Cultura",sectionLabel:"Come lavoriamo",title:"Un ambiente dove le persone prosperano",subtitle:"La nostra cultura è il motore che alimenta ogni risultato straordinario.",items:[{icon:"🌟",title:"Crescita continua",desc:"Budget formazione individuale e mentorship interna strutturata."},{icon:"⚖️",title:"Work-life balance",desc:"Smart working flessibile e piena autonomia nella gestione degli orari."},{icon:"🎯",title:"Autonomia e responsabilità",desc:"Ti fidiamo completamente e ti diamo gli strumenti per eccellere."},{icon:"🎉",title:"Team che si diverte",desc:"Ritiri annuali, aperitivi settimanali, eventi mensili di team building."}]},
  about_image_full:{label:"Chi Siamo Full",title:"La nostra storia in uno scatto",subtitle:"Persone, passione e professionalità: questi sono i valori che ci guidano ogni giorno nel lavoro con i nostri clienti.",cta:"Scopri il team",ctaLink:linkDef("Scopri il team","team"),...mediaDef("🏛️")},
  founders:{label:"I Fondatori",sectionLabel:"Chi siamo",title:"Fondati da chi conosce il settore",subtitle:"Tre ex-professionisti con un sogno comune: ridefinire il digitale italiano.",items:[{name:"Marco Vitali",role:"CEO & Visionary",bio:"Ex Google, 18 anni nel digitale. Guida la strategia dell'agenzia con visione globale.",...mediaDef("👨‍💼")},{name:"Alessia Romano",role:"Chief Design Officer",bio:"Designer premiata a livello europeo. Cura l'identità visiva di ogni singolo progetto.",...mediaDef("👩‍🎨")},{name:"Davide Chen",role:"CTO",bio:"Full-stack architect con expertise in sistemi scalabili ad altissime performance.",...mediaDef("👨‍💻")}]},
  company_numbers:{label:"Azienda in Numeri",sectionLabel:"La nostra dimensione",title:"Numeri che raccontano la nostra storia",subtitle:"Crescita costante, qualità invariata.",items:[{num:"500+",label:"Clienti attivi",icon:"🏆",desc:"Aziende che ci hanno scelto come partner digitale"},{num:"€42M+",label:"Revenue generata",icon:"💰",desc:"Per i nostri clienti nel solo 2024"},{num:"1.200+",label:"Progetti completati",icon:"📋",desc:"Dalla piccola PMI al grande gruppo internazionale"},{num:"98%",label:"Soddisfazione",icon:"❤️",desc:"Net Promoter Score medio clienti attivi"}]},
  services:{label:"Servizi",sectionLabel:"Cosa facciamo",title:"Servizi pensati per crescere",subtitle:"Un ecosistema completo di competenze digitali al servizio della tua azienda.",items:[{icon:"💻",title:"Sviluppo Web",desc:"Siti web e applicazioni ad alte prestazioni con le tecnologie più moderne."},{icon:"📱",title:"App Mobile",desc:"Applicazioni native e cross-platform per iOS e Android."},{icon:"🎨",title:"Brand Identity",desc:"Design system completo per una comunicazione visiva coerente e memorabile."},{icon:"📊",title:"Performance Marketing",desc:"Campagne digitali basate sui dati con ROI misurabile e ottimizzazione continua."},{icon:"🔒",title:"Cybersecurity",desc:"Audit di sicurezza completi e implementazione di sistemi di protezione avanzata."},{icon:"🤖",title:"AI & Automazione",desc:"Workflow automatizzati su misura per ottimizzare i processi aziendali."}]},
  services_list:{label:"Servizi Lista",sectionLabel:"I nostri servizi",title:"Tutto quello di cui hai bisogno",items:[{icon:"💻",title:"Sviluppo Web Avanzato",desc:"Architetture scalabili, performance elevata e codice di qualità superiore.",detail:"React, Next.js, Node.js, TypeScript"},{icon:"🎨",title:"UX/UI Design Premium",desc:"Ricerca utente approfondita, wireframe e prototipazione ad alta fedeltà.",detail:"Figma, Adobe Suite, Design System"},{icon:"📈",title:"Growth Marketing",desc:"Strategie multi-canale costruite sui dati per una crescita sostenibile.",detail:"Google Ads, Meta, LinkedIn, SEO"}]},
  services_icons:{label:"Servizi Icone",sectionLabel:"In sintesi",title:"Un ecosistema completo",subtitle:"Tutto ciò che serve per competere nel digitale.",items:[{icon:"💻",title:"Web Dev"},{icon:"📱",title:"Mobile"},{icon:"🎨",title:"Design"},{icon:"📊",title:"Analytics"},{icon:"🔍",title:"SEO"},{icon:"📧",title:"Email Mktg"},{icon:"💬",title:"Social"},{icon:"🔒",title:"Security"}]},
  services_tabs:{label:"Servizi a Tab",title:"I nostri servizi nel dettaglio",tabs:[{label:"Web",icon:"💻",title:"Sviluppo Web di eccellenza",text:"Costruiamo applicazioni web performanti, scalabili e sicure. Ogni riga di codice è pensata per durare nel tempo e scalare con il tuo business.",...mediaDef("🖥️")},{label:"Design",icon:"🎨",title:"Design che comunica e converte",text:"Il design non è solo estetica. Ogni scelta visiva è strategica e orientata alla conversione. Creiamo esperienze che guidano l'utente verso l'azione.",...mediaDef("✏️")},{label:"Marketing",icon:"📊",title:"Marketing data-driven",text:"Campagne misurate, ottimizzate in tempo reale e scalabili. Ogni euro investito deve tornare moltiplicato.",...mediaDef("📈")}]},
  features:{label:"Caratteristiche",sectionLabel:"Perché sceglierci",title:"I nostri punti di forza",subtitle:"Ciò che ci distingue da ogni altra agenzia sul mercato.",items:[{icon:"🛡️",title:"Garanzia soddisfatti o rimborsati",desc:"Se entro 30 giorni non sei pienamente soddisfatto, ti rimborsiamo integralmente."},{icon:"⚡",title:"Consegna nei tempi concordati",desc:"La data di consegna è scritta nel contratto. La rispettiamo sempre, senza eccezioni."},{icon:"📞",title:"Project manager dedicato",desc:"Un senior project manager dedicato esclusivamente al tuo progetto."},{icon:"📊",title:"Report e analytics inclusi",desc:"Dashboard real-time e report mensile dettagliato su tutti i KPI del progetto."}]},
  process:{label:"Come Funziona",sectionLabel:"Il nostro processo",title:"Un metodo rodato per risultati certi",subtitle:"Ogni progetto segue la nostra metodologia proprietaria in 4 fasi.",items:[{num:"01",title:"Discovery & Strategia",desc:"Ascoltiamo in profondità e definiamo obiettivi di business misurabili e concreti."},{num:"02",title:"Design & Prototipazione",desc:"Wireframe ad alta fedeltà e prototipi interattivi approvati prima dello sviluppo."},{num:"03",title:"Sviluppo & Integrazione",desc:"Sprint settimanali con metodologia agile, code review e testing automatizzato."},{num:"04",title:"Launch & Ottimizzazione",desc:"Deploy pianificato, monitoring intensivo e ottimizzazione continua post-lancio."}]},
  process_dark:{label:"Come Funziona — Dark",sectionLabel:"Il processo",title:"Dal brief al lancio in 4 fasi",subtitle:"Una metodologia testata su oltre 1.000 progetti.",items:[{num:"01",title:"Brief & Discovery",desc:"Analisi approfondita del mercato, del business e degli obiettivi da raggiungere."},{num:"02",title:"Strategia & Design",desc:"Architettura dell'informazione, wireframe e design system ad alta fedeltà."},{num:"03",title:"Sviluppo & Test",desc:"Sviluppo agile con sprint settimanali, test su 50+ device e performance audit."},{num:"04",title:"Launch & Scale",desc:"Go-live monitorato, ottimizzazione CRO e supporto dedicato nei primi 90 giorni."}]},
  steps_numbered:{label:"Step Numerati",sectionLabel:"Il processo",title:"Come lavoriamo insieme",items:[{num:"01",title:"Briefing",text:"Una call approfondita per capire la tua azienda, il mercato e gli obiettivi concreti."},{num:"02",title:"Proposta",text:"Documento dettagliato con scope completo, timeline precisa e prezzo fisso garantito."},{num:"03",title:"Esecuzione",text:"Sprint settimanali, comunicazione quotidiana e piena trasparenza su ogni avanzamento."},{num:"04",title:"Lancio",text:"Go-live pianificato, test approfonditi su tutti i device e monitoring post-lancio."},{num:"05",title:"Crescita",text:"Analisi continua dei dati, ottimizzazione CRO e report mensile dettagliato."}]},
  checklist:{label:"Checklist",sectionLabel:"Cosa include",title:"Tutto quello che ottieni",subtitle:"Nessun costo nascosto. Nessuna sorpresa. Solo eccellenza.",included:[{text:"Design custom responsivo per tutti i device"},{text:"CMS per gestione autonoma dei contenuti"},{text:"SEO on-page ottimizzata secondo best practice"},{text:"Google Analytics 4 setup e dashboard"},{text:"Supporto post-lancio incluso nei primi 60 giorni"},{text:"Hosting configurato, ottimizzato e monitorato"}],excluded:[{text:"Copywriting e produzione dei testi"},{text:"Fotografia e video professionale"},{text:"Campagne pubblicitarie a pagamento"}]},
  services_with_image:{label:"Servizi Con Immagine",sectionLabel:"I nostri servizi",title:"Cosa facciamo, nel dettaglio",subtitle:"Ogni servizio è progettato per portare risultati concreti e misurabili.",items:[{icon:"💻",title:"Sviluppo Web",desc:"Siti web e web app ad alte prestazioni, dalla progettazione UX allo sviluppo front-end e back-end.",...mediaDef("🖥️")},{icon:"🎨",title:"Brand Identity",desc:"Loghi, palette colori, tipografia e design system completo per costruire un'identità memorabile.",...mediaDef("✏️")},{icon:"📊",title:"Growth Marketing",desc:"Strategie multi-canale, campagne paid, SEO avanzata e analytics integrate in un unico sistema.",...mediaDef("📈")}]},
  offering:{label:"Cosa Offriamo",sectionLabel:"I nostri pilastri",title:"Strategia. Design. Tecnologia.",items:[{icon:"🎯",title:"Strategia",text:"Partiamo sempre dai dati e dagli obiettivi di business reali, non dalle opinioni.",...mediaDef("🎯")},{icon:"🎨",title:"Design",text:"Il design non è decorazione. È il sistema attraverso cui guidi l'utente all'azione.",...mediaDef("🎨")},{icon:"💻",title:"Tecnologia",text:"Le tecnologie migliori per il problema specifico. Pragmatismo e ricerca dell'eccellenza.",...mediaDef("💻")}]},
  why_us:{label:"Perché Sceglierci",sectionLabel:"Il nostro vantaggio",title:"Perché le aziende leader scelgono noi",subtitle:"Non siamo una agenzia tradizionale. Siamo un partner strategico.",items:[{icon:"🏆",title:"Track record verificabile",desc:"Ogni nostro progetto è documentato con dati reali. Nessuna promessa non mantenuta."},{icon:"⚡",title:"Time-to-market record",desc:"Dalla firma del contratto al lancio in tempi garantiti contrattualmente."},{icon:"💎",title:"Qualità senza compromessi",desc:"Senior team su ogni progetto. Nessun junior lasciato solo su un deliverable critico."},{icon:"🔄",title:"Partnership a lungo termine",desc:"Il nostro tasso di rinnovo supera il 94%. I clienti non ci lasciano perché ottengono risultati."}]},
  numbers:{label:"Numeri",sectionLabel:"I nostri numeri",title:"Risultati che parlano da soli",items:[{num:"500+",label:"Clienti soddisfatti",icon:"🏆"},{num:"20",label:"Anni di esperienza",icon:"📅"},{num:"98%",label:"Soddisfazione clienti",icon:"❤️"},{num:"340%",label:"ROI medio clienti",icon:"📈"}]},
  numbers_minimal:{label:"Numeri Minimal",title:"In numeri",items:[{num:"€42M+",label:"Fatturato generato per i clienti"},{num:"1.200+",label:"Progetti completati con successo"},{num:"15",label:"Paesi in cui siamo presenti"},{num:"4.9★",label:"Valutazione media certificata"}]},
  before_after:{label:"Prima / Dopo",sectionLabel:"I nostri risultati",title:"Risultati concreti, non promesse",subtitle:"Dati reali tratti direttamente dai nostri clienti.",items:[{title:"E-commerce Fashion",before:"€ 18k/mese",after:"€ 124k/mese (+588%)",metric:"Fatturato mensile"},{title:"Lead Generation B2B",before:"22 lead/mese",after:"340 lead/mese",metric:"Lead qualificati mensili"}]},
  comparison:{label:"Confronto",sectionLabel:"Perché noi",title:"Noi vs le alternative",optionA:"La nostra agenzia",optionB:"Agenzie tradizionali",rows:[{feature:"Preventivo fisso garantito",a:true,b:false},{feature:"Project manager dedicato senior",a:true,b:false},{feature:"Dashboard analytics real-time",a:true,b:false},{feature:"Garanzia soddisfatti o rimborsati",a:true,b:false},{feature:"Proprietà completa del codice",a:true,b:false},{feature:"SLA contrattuale",a:true,b:false}]},
  results:{label:"Risultati Chiave",sectionLabel:"Risultati misurabili",title:"Impatto misurabile sul tuo business",items:[{icon:"📈",metric:"+340%",label:"ROI medio clienti",period:"nel primo anno di collaborazione"},{icon:"⚡",metric:"2x",label:"Velocità di crescita",period:"rispetto alla media del settore"},{icon:"💰",metric:"€42M+",label:"Revenue generata",period:"per i nostri clienti nel solo 2024"},{icon:"🕐",metric:"-40%",label:"Time to market",period:"rispetto alla media delle agenzie tradizionali"}]},
  progress_bars:{label:"Barre Progresso",sectionLabel:"Le nostre competenze",title:"Expertise tecnica al top",subtitle:"Anni di esperienza e centinaia di progetti in ogni ambito.",items:[{skill:"UX/UI Design",value:95},{skill:"Sviluppo Web & Mobile",value:92},{skill:"Performance Marketing",value:88},{skill:"SEO & Content Strategy",value:85},{skill:"Cloud Architecture & DevOps",value:80}]},
  kpi_cards:{label:"KPI Cards",sectionLabel:"Performance Q4",title:"I numeri che contano",items:[{icon:"💰",value:"€ 2.4M",label:"Revenue totale Q4",trend:"+18%",up:true},{icon:"👥",value:"12.400",label:"Nuovi clienti acquisiti",trend:"+32%",up:true},{icon:"📉",value:"1.8%",label:"Churn rate",trend:"-0.4%",up:true},{icon:"⭐",value:"4.9/5",label:"NPS Score medio",trend:"+0.2",up:true}]},
  stats_banner:{label:"Banner Statistiche",items:[{num:"500+",label:"Clienti"},{num:"€42M",label:"Revenue generata"},{num:"98%",label:"Soddisfazione"},{num:"20 anni",label:"Di esperienza"}]},
  portfolio:{label:"Portfolio",sectionLabel:"I nostri lavori",title:"Progetti che fanno la differenza",subtitle:"Una selezione accurata dei lavori di cui siamo più orgogliosi.",items:[{icon:"💻",title:"Luxe Milano — E-commerce Fashion",desc:"Redesign completo dell'esperienza di acquisto. +588% revenue in 8 mesi.",tag:"E-commerce",...mediaDef("🖥️")},{icon:"📱",title:"FinApp — Super App Bancaria",desc:"App mobile per gestione finanziaria personale. 200k+ utenti attivi.",tag:"Fintech",...mediaDef("📱")},{icon:"🎯",title:"GrowthLab — SaaS B2B",desc:"Piattaforma web app con AI integrata per team marketing enterprise.",tag:"SaaS",...mediaDef("🎯")}]},
  portfolio_list:{label:"Portfolio Lista",sectionLabel:"Case history",title:"Storie di successo",items:[{emoji:"🏆",title:"Luxe Milano",category:"E-commerce / Fashion",result:"+588% revenue",period:"8 mesi",desc:"Redesign completo su Shopify Plus, UX research e campagne paid.",...mediaDef("👑")},{emoji:"📱",title:"FinApp",category:"Mobile / Fintech",result:"200k+ utenti",period:"12 mesi",desc:"App iOS/Android con open banking API e biometria avanzata.",...mediaDef("💳")}]},
  case_study:{label:"Case Study",sectionLabel:"Case Study",title:"Come abbiamo trasformato Luxe Milano",subtitle:"Un progetto end-to-end che ha ridefinito il lusso digitale italiano.",challenge:"Luxe Milano aveva un e-commerce obsoleto con tasso di conversione dello 0.8% e un'esperienza mobile frustrante per il target premium.",solution:"Abbiamo riprogettato completamente l'esperienza utente con UX research intensiva, migrato su Shopify Plus e lanciato campagne meta ads ottimizzate per LTV.",result1:{num:"+588%",label:"Revenue in 8 mesi"},result2:{num:"4.2%",label:"Conversion rate"},result3:{num:"€124k",label:"Fatturato mensile"},...mediaDef("🏆")},
  gallery_grid:{label:"Galleria Grid",sectionLabel:"Gallery",title:"Il nostro portfolio in immagini",subtitle:"Una selezione di immagini dai progetti più significativi.",items:[{caption:"Luxe Milano — Homepage",...mediaDef("🖼️")},{caption:"FinApp — Onboarding",...mediaDef("📱")},{caption:"EcoStore — Branding",...mediaDef("🌿")},{caption:"GrowthLab — Dashboard",...mediaDef("💻")},{caption:"PA Digitale — Portal",...mediaDef("🏛️")},{caption:"Award Night 2024",...mediaDef("🏆")}]},
  project_showcase:{label:"Progetto Evidenza",sectionLabel:"Featured project",title:"Il nostro progetto più ambizioso",subtitle:"Un caso di studio che dimostra cosa siamo capaci di fare quando diamo il massimo.",metric1:{num:"+588%",label:"Revenue"},metric2:{num:"4.2%",label:"Conversione"},metric3:{num:"8",label:"Mesi"},...mediaDef("🖥️")},
  image_gallery_masonry:{label:"Galleria Masonry",sectionLabel:"Gallery",title:"Il nostro portfolio in immagini",items:[{caption:"Luxe Milano",...mediaDef("🖥️")},{caption:"FinApp",...mediaDef("📱")},{caption:"EcoStore",...mediaDef("🌿")},{caption:"GrowthLab",...mediaDef("📊")},{caption:"PA Digitale",...mediaDef("🏛️")},{caption:"Team 2024",...mediaDef("👥")}]},
  testimonials:{label:"Testimonianze",sectionLabel:"Cosa dicono di noi",title:"Le voci dei nostri clienti",subtitle:"Non le nostre parole, le loro. Testimonianze verificate e autentiche.",items:[{name:"Alessandro Ferretti",role:"CEO, Luxe Milano SpA",text:"In 8 mesi hanno triplicato il nostro fatturato online. Un risultato che sembrava impossibile. Semplicemente straordinari.",avatar:"AF",rating:5,...mediaDef("😊")},{name:"Martina Rossetti",role:"CMO, FinApp",text:"Professionisti veri. Hanno capito il nostro prodotto meglio di qualsiasi altra agenzia con cui abbiamo lavorato in precedenza.",avatar:"MR",rating:5,...mediaDef("😊")}]},
  testimonials_big:{label:"Testimonianza Grande",quote:"\"Pensavamo di aver bisogno di un nuovo sito. Ci hanno aiutato a capire che avevamo bisogno di una nuova strategia digitale. Il risultato ha superato ogni aspettativa di crescita che avevamo.\"",author:"Elena Marchetti",role:"CEO, Gruppo Marchetti SpA",avatar:"EM",...mediaDef("💬")},
  testimonials_list:{label:"Testimonianze Lista",sectionLabel:"Recensioni verificate",title:"Cosa dicono di noi",items:[{name:"Marco Bianchi",role:"CTO, TechCorp",text:"Eccezionali sotto ogni punto di vista. Fortemente consigliati.",rating:5,...mediaDef("😊")},{name:"Sara Conti",role:"Founder, StartupX",text:"Team altamente professionale e risultati concreti e misurabili.",rating:5,...mediaDef("😊")},{name:"Luca Ferrari",role:"CEO, RetailPlus",text:"La migliore agenzia digitale con cui abbia mai avuto il piacere di lavorare.",rating:5,...mediaDef("😊")}]},
  testimonials_numbers:{label:"Testimonianze + Numeri",sectionLabel:"Risultati & Testimonianze",title:"Numeri reali, persone reali",numbers:[{num:"340%",label:"ROI medio"},{num:"500+",label:"Clienti"},{num:"4.9★",label:"Rating"}],testimonial:{name:"Alessandro Ferretti",role:"CEO, Luxe Milano",text:"Il miglior investimento strategico che abbia mai fatto per la mia azienda. I numeri parlano da soli.",avatar:"AF"}},
  awards:{label:"Premi",sectionLabel:"Riconoscimenti",title:"Eccellenza riconosciuta",subtitle:"Premi e certificazioni che attestano la nostra qualità ineguagliabile.",items:[{icon:"🥇",title:"Best Digital Agency 2024",org:"Web Awards Italia"},{icon:"🏆",title:"Innovation Prize 2023",org:"StartupItalia Summit"},{icon:"⭐",title:"Top Rated — Score 9.8",org:"Clutch.co"},{icon:"🎖️",title:"Google Premier Partner",org:"Google"}]},
  guarantee:{label:"Garanzie",sectionLabel:"Le nostre garanzie",title:"Lavori con noi senza rischi",subtitle:"Ogni nostra promessa è scritta nero su bianco nel contratto.",items:[{icon:"🛡️",title:"Soddisfatti o rimborsati",desc:"30 giorni di garanzia totale su ogni progetto completato."},{icon:"⏱️",title:"Consegna garantita",desc:"La data di consegna è nel contratto. La rispettiamo sempre."},{icon:"🔒",title:"Prezzi fissi",desc:"Nessun costo aggiuntivo senza tua previa approvazione scritta."},{icon:"📞",title:"Risposta in 2 ore",desc:"SLA garantito contrattualmente su tutti i canali di comunicazione."}]},
  partners:{label:"Partner",sectionLabel:"I nostri partner",title:"Ecosystem di eccellenza",subtitle:"Partner tecnologici selezionati con cura dopo un processo di valutazione rigoroso.",items:[{name:"Google Partner",icon:"🔵",...mediaDef("🔵")},{name:"Meta Business",icon:"🟣",...mediaDef("🟣")},{name:"AWS Advanced",icon:"🟠",...mediaDef("🟠")},{name:"Shopify Plus",icon:"🟢",...mediaDef("🟢")},{name:"HubSpot Diamond",icon:"🔴",...mediaDef("🔴")},{name:"Stripe Certified",icon:"⚫",...mediaDef("⚫")}]},
  brands_ticker:{label:"Ticker Brand",sectionLabel:"",title:"Scelti da aziende leader in ogni settore",items:[{name:"Luxe Milano",icon:"👑"},{name:"FinApp",icon:"💳"},{name:"GrowthLab",icon:"📈"},{name:"EcoStore",icon:"🌿"},{name:"PA Digitale",icon:"🏛️"},{name:"DataSense",icon:"📊"},{name:"Melodia",icon:"🎵"},{name:"TechCorp",icon:"💻"}]},
  trust_badges:{label:"Badge Fiducia",title:"Certificati, verificati e riconosciuti",items:[{icon:"🔒",text:"SSL & GDPR Compliant"},{icon:"⭐",text:"4.9/5 Google Reviews"},{icon:"🏆",text:"Top Agency Clutch 2024"},{icon:"🔷",text:"Google Premier Partner"},{icon:"💎",text:"Shopify Plus Partner"},{icon:"✅",text:"ISO 27001 Certified"}]},
  press:{label:"Press",sectionLabel:"Parlano di noi",title:"Presenti su",items:[{name:"Il Sole 24 Ore",logo:"📰",quote:"Leader indiscusso nel digital marketing italiano."},{name:"StartupItalia",logo:"🚀",quote:"L'agenzia che ha rivoluzionato il modo di fare digitale."},{name:"Corriere della Sera",logo:"📰",quote:"Tra le 100 aziende più innovative d'Italia."},{name:"Forbes Italia",logo:"💼",quote:"Il futuro del marketing è già qui."}]},
  clients_logos:{label:"Loghi Clienti Premium",sectionLabel:"Clienti che ci hanno scelto",title:"Aziende che si fidano di noi",subtitle:"Da startup ambiziose a grandi gruppi internazionali.",items:[{name:"Luxe Milano",icon:"👑"},{name:"FinApp",icon:"💳"},{name:"GrowthLab",icon:"📈"},{name:"EcoStore",icon:"🌿"},{name:"PA Digitale",icon:"🏛️"},{name:"DataSense",icon:"📊"},{name:"Melodia",icon:"🎵"},{name:"TechCorp",icon:"💻"},{name:"RetailPlus",icon:"🛍️"},{name:"StartupX",icon:"🚀"},{name:"BioLab",icon:"🧬"},{name:"CloudNet",icon:"☁️"}]},
  team:{label:"Team",sectionLabel:"Il nostro team",title:"Le menti dietro ai risultati",subtitle:"Un team di 50+ professionisti selezionati per competenza e passione.",items:[{name:"Marco Vitali",role:"CEO & Co-Founder",desc:"Ex Google, 18 anni nel digitale. Leader visionario.",avatar:"MV",...mediaDef("👨‍💼")},{name:"Alessia Romano",role:"Chief Design Officer",desc:"Designer premiata. Cura ogni dettaglio visivo.",avatar:"AR",...mediaDef("👩‍🎨")},{name:"Davide Chen",role:"CTO",desc:"Full-stack architect. Maestro della scalabilità.",avatar:"DC",...mediaDef("👨‍💻")},{name:"Francesca Galli",role:"Head of Growth",desc:"Specialista growth. Transforma i dati in azioni.",avatar:"FG",...mediaDef("👩‍📊")}]},
  team_minimal:{label:"Team Minimal",sectionLabel:"Il team",title:"Chi siamo",items:[{icon:"👨‍💼",name:"Marco Vitali",role:"CEO"},{icon:"👩‍🎨",name:"Alessia Romano",role:"CDO"},{icon:"👨‍💻",name:"Davide Chen",role:"CTO"},{icon:"👩‍📊",name:"Francesca Galli",role:"CMO"}]},
  team_large:{label:"Team Card Grandi",sectionLabel:"Il nostro team",title:"Conosci le persone",subtitle:"Ogni membro porta un contributo unico e insostituibile.",items:[{name:"Marco Vitali",role:"CEO & Co-Founder",bio:"Ex-Google, ha fondato l'agenzia con la visione di creare il miglior studio digitale italiano. 18 anni di esperienza.",linkedin:"#",...mediaDef("👨‍💼")},{name:"Alessia Romano",role:"Chief Design Officer",bio:"Designer premiata a livello europeo. Ha curato l'identità visiva di oltre 200 brand internazionali.",linkedin:"#",...mediaDef("👩‍🎨")}]},
  team_dark:{label:"Team Dark",sectionLabel:"Il nostro team",title:"I migliori professionisti digitali d'Italia",subtitle:"Selezionati tra migliaia di candidati. Formati continuamente.",items:[{name:"Marco Vitali",role:"CEO & Co-Founder",desc:"18 anni di esperienza digitale. Ex Google.",avatar:"MV",...mediaDef("👨‍💼")},{name:"Alessia Romano",role:"Chief Design Officer",desc:"Designer premiata a livello europeo.",avatar:"AR",...mediaDef("👩‍🎨")},{name:"Davide Chen",role:"CTO",desc:"Full-stack architect con focus su scalabilità.",avatar:"DC",...mediaDef("👨‍💻")},{name:"Francesca Galli",role:"Head of Growth",desc:"Esperta di growth hacking e performance.",avatar:"FG",...mediaDef("👩‍📊")}]},
  open_positions:{label:"Posizioni Aperte",sectionLabel:"Lavora con noi",title:"Unisciti a noi",subtitle:"Cerchiamo persone brillanti che vogliano fare la differenza nel digitale.",items:[{role:"Senior Frontend Developer",type:"Full-time",location:"Milano / Remote",desc:"React, TypeScript, 5+ anni di esperienza. Portfolio richiesto."},{role:"UX/UI Designer Senior",type:"Full-time",location:"Milano",desc:"Figma, design system, user research. Portfolio con case study richiesto."}]},
  pricing:{label:"Prezzi",sectionLabel:"Investimenti",title:"Soluzioni per ogni ambizione",subtitle:"Piani progettati per massimizzare il valore del tuo investimento.",items:[{name:"Starter",price:"€ 2.900",period:"progetto",desc:"Ideale per PMI e startup",features:["Sito web fino a 10 pagine","Design custom responsivo","CMS incluso","SEO on-page","2 mesi di supporto"],highlight:false,cta:linkDef("Inizia ora","contact")},{name:"Professional",price:"€ 7.900",period:"progetto",desc:"Per aziende in crescita",features:["Fino a 30 pagine","UX Research & Testing","Design system completo","SEO avanzata","6 mesi supporto premium"],highlight:true,cta:linkDef("Il più scelto","contact")},{name:"Enterprise",price:"Su misura",period:"",desc:"Per grandi organizzazioni",features:["Architettura custom","Team dedicato","SLA contrattuale","Supporto 24/7"],highlight:false,cta:linkDef("Parliamone","contact")}]},
  pricing_table:{label:"Prezzi Tabella",title:"Confronto piani nel dettaglio",features:["Numero di pagine","Design custom","CMS incluso","SEO","Report mensile","Supporto","SLA garantito"],plans:[{name:"Starter",price:"€ 2.900",values:["Fino a 10","✓","✓","Base","—","2 mesi","—"]},{name:"Professional",price:"€ 7.900",values:["Fino a 30","✓","✓","Avanzata","✓","6 mesi","—"],highlight:true},{name:"Enterprise",price:"Custom",values:["Illimitate","✓","✓","Enterprise","✓","12 mesi","✓"]}]},
  pricing_comparison:{label:"Confronto Piani",sectionLabel:"Confronto",title:"Scegli il piano giusto per te",subtitle:"Tutti i piani includono supporto e aggiornamenti di sicurezza.",items:[{name:"Starter",price:"€ 2.900",highlight:false,rows:[{label:"Pagine",value:"10"},{label:"CMS",value:"✓"},{label:"SEO",value:"Base"},{label:"Supporto",value:"2 mesi"},{label:"Report",value:"—"}]},{name:"Professional",price:"€ 7.900",highlight:true,rows:[{label:"Pagine",value:"30"},{label:"CMS",value:"✓"},{label:"SEO",value:"Avanzata"},{label:"Supporto",value:"6 mesi"},{label:"Report",value:"Mensile"}]},{name:"Enterprise",price:"Custom",highlight:false,rows:[{label:"Pagine",value:"∞"},{label:"CMS",value:"✓"},{label:"SEO",value:"Enterprise"},{label:"Supporto",value:"12 mesi"},{label:"Report",value:"Settimanale"}]}]},
  cta_banner:{label:"CTA Banner",title:"Pronto a trasformare il tuo business?",subtitle:"Prenota una consulenza strategica gratuita di 30 minuti con un nostro senior advisor.",cta1:linkDef("Prenota la call gratuita","contact"),cta2:linkDef("Vedi i nostri lavori","portfolio"),showCta2:true,bgStyle:"gradient"},
  cta_split:{label:"CTA Split",title:"Ogni giorno senza strategia digitale è un'opportunità persa.",subtitle:"Le aziende che investono nel digitale crescono 2.5x più veloce. Inizia oggi, non domani.",cta1:linkDef("Parla con noi ora","contact"),cta2:linkDef("Scopri come","services"),showCta2:true},
  cta_minimal:{label:"CTA Minimal",title:"Interessato? Parliamone.",subtitle:"Una call di 30 minuti con il nostro team può cambiare il tuo business.",cta1:linkDef("Prenota ora","contact")},
  cta_image_bg:{label:"CTA Con Immagine",title:"Pronti a scrivere insieme il prossimo capitolo?",subtitle:"Dalle startup ai brand globali, aiutiamo le aziende a crescere nel digitale con metodo e misurabilità.",cta1:linkDef("Inizia il progetto","contact"),overlayOpacity:60,...mediaDef("🚀")},
  cta_dark:{label:"CTA Dark",title:"Il momento migliore per iniziare era ieri. Il secondo migliore è adesso.",subtitle:"Ogni settimana senza una strategia digitale solida è una settimana regalata ai tuoi competitor.",cta1:linkDef("Inizia oggi","contact"),cta2:linkDef("Guarda i risultati","portfolio"),showCta2:true,bgColor:"#0a0a14"},
  newsletter:{label:"Newsletter",title:"Insights digitali ogni settimana",subtitle:"Unisciti a 12.000+ professionisti che leggono la nostra newsletter del venerdì.",placeholder:"La tua email professionale",btnLabel:"Iscriviti gratis",note:"Zero spam. Cancellazione con un click. Sempre."},
  lead_magnet:{label:"Lead Magnet",sectionLabel:"Risorsa gratuita",title:"Scarica la nostra guida gratuita",subtitle:"\"Digital Growth Playbook 2025\" — 80 pagine di strategie avanzate per far crescere il tuo business online.",cta:linkDef("Scarica gratis","contact"),items:[{icon:"✓",text:"Strategie SEO avanzate per il 2025"},{icon:"✓",text:"Framework per campagne con ROI elevato"},{icon:"✓",text:"Template per audit UX completo"},{icon:"✓",text:"Checklist per il lancio di prodotti digitali"}],...mediaDef("📖")},
  waitlist:{label:"Waitlist",title:"Stiamo arrivando.",subtitle:"Il nostro nuovo prodotto è quasi pronto. Iscriviti per ottenere accesso anticipato e condizioni esclusive.",placeholder:"La tua email",btnLabel:"Entra in lista",note:"Accesso anticipato garantito + sconto del 30% per i primi 100 iscritti."},
  contact:{label:"Contatti",sectionLabel:"Parliamo",title:"Inizia la conversazione",subtitle:"Siamo pronti ad ascoltarti. Il nostro team risponderà entro 24 ore lavorative.",contactMode:"both",email:"hello@tuaagenzia.it",phone:"+39 02 1234567",mobile:"",address:"Via Montenapoleone 8, 20121 Milano",showMap:false,mapEmbed:"",whatsapp:"",linkedin:"",instagram:"",formFields:["Nome e cognome","Email aziendale","Azienda","Budget indicativo","Messaggio"],submitLabel:"Invia richiesta",submitMessage:"Grazie! Ti contatteremo entro 24 ore."},
  locations:{label:"Le Nostre Sedi",sectionLabel:"Le nostre sedi",title:"Presenti in tutta Italia",items:[{city:"Milano",address:"Via Montenapoleone 8, 20121",phone:"+39 02 1234567",email:"milano@agenzia.it",...mediaDef("🏙️")},{city:"Roma",address:"Via Veneto 50, 00187",phone:"+39 06 1234567",email:"roma@agenzia.it",...mediaDef("🏛️")},{city:"Torino",address:"Corso Vittorio 22, 10123",phone:"+39 011 1234567",email:"torino@agenzia.it",...mediaDef("⛰️")}]},
  map_section:{label:"Dove Siamo",sectionLabel:"Dove siamo",title:"Siamo a Milano, serviamo il mondo",subtitle:"Il nostro quartier generale è nel cuore di Milano. Il team è distribuito in tutta Europa.",address:"Via Montenapoleone 8, 20121 Milano MI",email:"hello@agenzia.it",phone:"+39 02 1234567",mapEmbed:""},
  social_links:{label:"Social & Contatti",sectionLabel:"Seguici",title:"Restiamo in contatto",subtitle:"Seguici sui social per insights quotidiani, case study e aggiornamenti dal settore.",items:[{platform:"LinkedIn",url:"https://linkedin.com",icon:"🔗",desc:"Insights e case study B2B ogni giorno"},{platform:"Instagram",url:"https://instagram.com",icon:"📸",desc:"Behind the scenes e portfolio progetti"},{platform:"YouTube",url:"https://youtube.com",icon:"▶️",desc:"Tutorial gratuiti e webinar mensili"}]},
  faq:{label:"FAQ",sectionLabel:"Domande frequenti",title:"Risposte alle domande più comuni",subtitle:"Tutto quello che vuoi sapere prima di iniziare a lavorare con noi.",items:[{q:"Quanto costa realizzare un sito web?",a:"I nostri progetti partono da € 2.900 per un sito vetrina. Forniamo sempre un preventivo fisso e vincolante prima di iniziare."},{q:"Quanto tempo ci vuole?",a:"Un sito vetrina richiede 3-6 settimane. Un e-commerce 6-10 settimane. Le tempistiche esatte sono scritte nel contratto."},{q:"Offrite supporto dopo il lancio?",a:"Sì, tutti i piani includono supporto post-lancio. Il piano Professional include 6 mesi, l'Enterprise 12 mesi con SLA garantito."},{q:"Posso vedere esempi di lavori precedenti?",a:"Assolutamente sì. Il nostro portfolio completo è disponibile sul sito e durante la call di scoperta condividiamo case study dettagliati."}]},
  faq_two_col:{label:"FAQ Due Colonne",sectionLabel:"FAQ",title:"Hai delle domande?",items:[{q:"Quanto costa?",a:"Dipende dal progetto. Preventivo fisso gratuito entro 48h."},{q:"Quanto tempo?",a:"Da 3 settimane a 6 mesi, in base alla complessità."},{q:"Avete garanzie?",a:"Sì, 30 giorni soddisfatti o rimborsati su ogni progetto."},{q:"Chi sarà il mio referente?",a:"Un project manager senior dedicato esclusivamente a te."},{q:"Posso gestire i contenuti?",a:"Sì, CMS intuitivo con formazione inclusa nel progetto."},{q:"Supportate l'internazionalizzazione?",a:"Sì, multilingue e multi-valuta disponibili su tutti i piani."}]},
  blog_preview:{label:"Blog",sectionLabel:"Insights & Risorse",title:"Conoscenza che genera valore",subtitle:"Articoli, guide e ricerche originali dal nostro team di esperti.",items:[{tag:"SEO",title:"Le 15 strategie SEO che domineranno il 2025",date:"18 Aprile 2025",readTime:"12 min",...mediaDef("🔍")},{tag:"Design",title:"Perché il design system è l'investimento più intelligente",date:"10 Aprile 2025",readTime:"8 min",...mediaDef("🎨")},{tag:"Analytics",title:"Come interpretare i dati GA4 per il tuo business",date:"3 Aprile 2025",readTime:"10 min",...mediaDef("📊")}]},
  events:{label:"Eventi",sectionLabel:"Prossimi eventi",title:"Dove ci trovi",subtitle:"Webinar gratuiti, masterclass esclusive e conferenze di settore.",items:[{date:"15 Maggio 2025",title:"Webinar: Growth Hacking B2B 2025",type:"Online gratuito",cta:"Registrati",...mediaDef("💻")},{date:"22 Giugno 2025",title:"Masterclass UX Design — Milano",type:"In presenza",cta:"Prenota posto",...mediaDef("🎨")}]},
  timeline:{label:"Timeline",sectionLabel:"La nostra storia",title:"Vent'anni di evoluzione",subtitle:"Come siamo diventati quello che siamo, un passo alla volta.",items:[{year:"2004",title:"La nascita",desc:"Fondati da tre ex-professionisti Google con la missione di ridefinire il digitale italiano.",...mediaDef("🏠")},{year:"2014",title:"Espansione",desc:"Prima espansione geografica, 20 professionisti al lavoro, primo riconoscimento internazionale.",...mediaDef("🏢")},{year:"2024",title:"Leadership",desc:"500+ clienti attivi in 8 paesi. Il team supera i 50 professionisti. Leader di mercato in Italia.",...mediaDef("🏆")}]},
  integrations:{label:"Integrazioni",sectionLabel:"Integrazioni",title:"Si connette con tutto il tuo stack",subtitle:"Integrazione nativa con oltre 200 piattaforme enterprise.",items:[{icon:"📧",name:"Mailchimp"},{icon:"🟢",name:"WhatsApp Business"},{icon:"📊",name:"Google Analytics"},{icon:"🟠",name:"HubSpot"},{icon:"🛒",name:"Shopify"},{icon:"💳",name:"Stripe"},{icon:"📋",name:"Notion"},{icon:"💼",name:"Salesforce"}]},
  download:{label:"Download Risorse",sectionLabel:"Risorse gratuite",title:"Risorse che fanno la differenza",subtitle:"Guide, template e strumenti pratici creati dal nostro team.",items:[{icon:"📄",title:"Digital Growth Playbook 2025",desc:"80 pagine di strategie avanzate per la crescita digitale.",size:"4.2 MB",format:"PDF"},{icon:"📊",title:"Template Piano Marketing Annuale",desc:"Excel con KPI, budget, timeline e benchmark di settore.",size:"1.8 MB",format:"XLSX"},{icon:"🎨",title:"Brand Identity Starter Kit",desc:"Template Figma completo per costruire l'identità del tuo brand.",size:"12.4 MB",format:"FIG"}]},
  video_section:{label:"Video",sectionLabel:"",title:"Scopri chi siamo in 90 secondi",subtitle:"Un video che racconta il nostro approccio, i nostri valori e i risultati che otteniamo per i clienti.",videoUrl:"https://www.youtube.com/embed/dQw4w9WgXcQ"},
  podcast:{label:"Podcast",sectionLabel:"Il nostro podcast",title:"Digital Growth Podcast",subtitle:"Ogni settimana intervistiamo i migliori esperti mondiali di digital marketing, design e tecnologia.",items:[{num:"EP 42",title:"Come scalare un e-commerce da 0 a €1M in 12 mesi",guest:"Alessandro Ferretti",duration:"52 min",...mediaDef("🎙️")},{num:"EP 41",title:"SEO nel 2025: le strategie che funzionano davvero",guest:"Martina Conti",duration:"45 min",...mediaDef("🎙️")},{num:"EP 40",title:"Design system: perché ne hai bisogno adesso",guest:"Giorgio Bianchi",duration:"38 min",...mediaDef("🎙️")}]},
  pricing_faq:{label:"Prezzi + FAQ",title:"Tutto quello che devi sapere sui costi",faqs:[{q:"Il preventivo è fisso o può variare?",a:"Il nostro preventivo è sempre fisso e vincolante. Nessun costo aggiuntivo senza tua approvazione."},{q:"Come funziona il pagamento?",a:"30% all'avvio del progetto, 40% a metà progetto, 30% al lancio finale."},{q:"Cosa succede se non sono soddisfatto?",a:"Hai 30 giorni di garanzia totale. Se non sei soddisfatto, rimborso integrale senza domande."}]},
  media_left:{label:"Media a Sinistra",sectionLabel:"",title:"Un approccio che cambia le regole del gioco",text:"Non crediamo nel semplice lavoro a progetto. Crediamo nella partnership strategica duratura.",cta:linkDef("Scopri il nostro approccio","about"),bullets:["Team senior dedicato per ogni cliente","Project manager disponibile ogni giorno","Garanzie contrattuali su ogni deliverable"],...mediaDef("🤝")},
  media_right:{label:"Media a Destra",sectionLabel:"",title:"I dati parlano più delle promesse vuote",text:"Ogni progetto è costantemente monitorato, misurato e ottimizzato sulla base di dati reali.",cta:linkDef("Vedi i nostri risultati","portfolio"),bullets:["Dashboard analytics in tempo reale","Report mensile dettagliato e approfondito","Call strategica trimestrale con il management"],...mediaDef("📊")},
  two_columns:{label:"Due Colonne",sectionLabel:"",leftTitle:"Il problema che risolviamo",leftText:"La maggior parte delle aziende spende risorse significative sul digitale senza una strategia chiara e misurabile.",rightTitle:"La nostra soluzione concreta",rightText:"Un partner strategico che combina visione di business, design di qualità superiore e tecnologia all'avanguardia."},
  three_columns:{label:"Tre Colonne",sectionLabel:"Il nostro approccio",title:"Strategia. Design. Tecnologia.",items:[{icon:"🎯",title:"Strategia",text:"Partiamo sempre dai dati e dagli obiettivi di business concreti e misurabili."},{icon:"🎨",title:"Design",text:"Il design non è decorazione. È il sistema attraverso cui l'utente viene guidato all'azione."},{icon:"💻",title:"Tecnologia",text:"Le tecnologie migliori per il problema specifico. Pragmatismo unito all'eccellenza tecnica."}]},
  highlight_band:{label:"Banda Colorata",text:"🚀 Consulenza strategica gratuita per le prime 5 aziende che si prenotano questo mese",cta:"Prenota ora",ctaAnchor:"contact",bgStyle:"gradient"},
  quote:{label:"Citazione",quote:"\"Il digitale non è un canale. È l'ambiente in cui i tuoi clienti vivono, decidono e acquistano.\"",author:"Marco Vitali, CEO",showAuthor:true,...mediaDef("💬")},
  divider_cta:{label:"Divisore CTA",title:"Pronto per portare il tuo business al livello successivo?",cta:"Inizia oggi",ctaLink:linkDef("Inizia oggi","contact")},
  icon_grid:{label:"Griglia Icone",sectionLabel:"In sintesi",title:"Tutto quello che offriamo",subtitle:"Un ecosistema completo di competenze digitali premium.",items:[{icon:"💻",title:"Web"},{icon:"📱",title:"Mobile"},{icon:"🎨",title:"Design"},{icon:"📊",title:"Analytics"},{icon:"🔍",title:"SEO"},{icon:"📧",title:"Email"},{icon:"💬",title:"Social"},{icon:"🔒",title:"Security"}]},
  accordion_features:{label:"Features Fisarmonica",sectionLabel:"Caratteristiche",title:"Tutto quello che include il nostro servizio",items:[{icon:"📋",title:"Discovery approfondita",content:"2 settimane di discovery con interviste agli stakeholder, analisi competitor, definizione delle personas e dei KPI di business."},{icon:"🎨",title:"Design system completo",content:"Componenti riutilizzabili, tipografia, spaziatura, colori e regole di utilizzo. Asset che valorizzano il tuo brand per anni."},{icon:"💻",title:"Sviluppo con best practice",content:"Codice testato, documentato e manutenibile. Pipeline CI/CD, code review sistematico e performance testing automatizzato."},{icon:"🚀",title:"Launch & monitoring",content:"Piano di lancio dettagliato, test su 50+ device reali, monitoring h24 per i primi 30 giorni post-lancio."}]},
  text_image_alternating:{label:"Testo/Immagine Alternati",sectionLabel:"Come lavoriamo",title:"Il nostro processo, passo dopo passo",items:[{title:"Ascoltiamo e analizziamo in profondità",text:"Prima di ogni cosa, vogliamo capire la tua azienda, il mercato in cui operi e gli obiettivi che vuoi raggiungere concretamente.",...mediaDef("🎯")},{title:"Progettiamo e prototipizziamo",text:"Creiamo wireframe dettagliati e prototipi interattivi ad alta fedeltà. Iteriamo finché ogni dettaglio dell'esperienza non è perfetto.",...mediaDef("🎨")},{title:"Costruiamo e consegniamo puntualmente",text:"Sviluppo con metodologia agile, sprint settimanali e aggiornamenti quotidiani. Delivery puntuale, sempre garantita contrattualmente.",...mediaDef("💻")}]},
  full_image_section:{label:"Immagine Full-Width",title:"Dove le idee prendono vita",subtitle:"Il nostro studio di Milano: quartier generale di 50 creativi, sviluppatori e strategist di eccellenza.",cta:"Vieni a trovarci",ctaLink:linkDef("Vieni a trovarci","contact"),...mediaDef("🏢")},
  ribbon:{label:"Ribbon / Fascia",items:[{icon:"✅",text:"Preventivo fisso"},{icon:"⚡",text:"Consegna garantita"},{icon:"🛡️",text:"Soddisfatti o rimborsati"},{icon:"📞",text:"Risposta in 2 ore"},{icon:"🏆",text:"Top Agency 2024"},{icon:"💎",text:"Qualità certificata"}]},
  split_feature:{label:"Feature Alternata",sectionLabel:"I nostri servizi",title:"Ogni servizio, nel dettaglio",items:[{title:"Sviluppo Web Avanzato",text:"Costruiamo applicazioni web che scalano in modo affidabile, anche sotto carichi di traffico estremi.",icon:"💻",...mediaDef("🖥️")},{title:"Performance Marketing",text:"Campagne progettate per portare risultati misurabili e un ROI che supera costantemente le aspettative.",icon:"📊",...mediaDef("📈")},{title:"Brand Design System",text:"Un'identità visiva coerente e distintiva vale più di mille campagne pubblicitarie messe insieme.",icon:"🎨",...mediaDef("✏️")}]},
  logo_wall:{label:"Muro Loghi",sectionLabel:"",title:"Scelti da oltre 500 aziende leader",items:[{name:"Luxe Milano",icon:"👑"},{name:"FinApp",icon:"💳"},{name:"GrowthLab",icon:"📈"},{name:"EcoStore",icon:"🌿"},{name:"PA Digitale",icon:"🏛️"},{name:"DataSense",icon:"📊"},{name:"Melodia",icon:"🎵"},{name:"TechCorp",icon:"💻"}]},
  image_text_cta:{label:"Immagine + Testo + CTA",sectionLabel:"",title:"Un partner strategico, non un semplice fornitore",text:"La differenza fondamentale tra noi e un'agenzia tradizionale? Trattiamo il tuo business esattamente come se fosse il nostro.",cta:linkDef("Inizia la conversazione","contact"),...mediaDef("🤝")},
  counter:{label:"Countdown",title:"Il lancio si avvicina",subtitle:"Stiamo preparando qualcosa di straordinario che cambierà il modo di fare digitale.",targetDate:"2025-12-31",cta:linkDef("Avvisami al lancio","contact")},
  cookie_notice:{label:"Cookie Notice",text:"Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico in modo anonimo.",acceptAll:"Accetta tutti",acceptNecessary:"Solo necessari",linkText:"Informativa Cookie",linkUrl:"#privacy"},
  floating_cta:{label:"CTA Fluttuante",title:"Hai bisogno di aiuto?",subtitle:"I nostri esperti sono pronti.",ctaLink:linkDef("Parla con noi","contact"),position:"right"},
  comparison_cards:{label:"Confronto Card Prodotti",sectionLabel:"Confronta le opzioni",title:"Quale soluzione fa per te?",subtitle:"Confronta le caratteristiche e scegli il piano più adatto alle tue esigenze.",items:[{name:"Do it yourself",highlight:false,icon:"🔧",pros:["Costo iniziale zero","Controllo totale"],cons:["Richiede competenze tecniche","Tempo sottratto al business","Risultati spesso mediocri"]},{name:"Agenzia tradizionale",highlight:false,icon:"🏢",pros:["Team strutturato","Esperienza settoriale"],cons:["Costi elevati e fissi","Lentezza esecutiva","Poca trasparenza sui costi"]},{name:"Partner strategico",highlight:true,icon:"🚀",pros:["Preventivo fisso garantito","Risultati misurabili","Team senior dedicato","Garanzia soddisfatti o rimborsati"],cons:[]}]},
  impact_section:{label:"Sezione Impatto",sectionLabel:"Il nostro impatto",title:"Cambiamo il digitale, un'azienda alla volta",subtitle:"Ogni progetto è un'opportunità per creare qualcosa di straordinario.",text:"Non siamo un'agenzia che produce siti web. Siamo un partner che trasforma il modo in cui le aziende si presentano, comunicano e crescono nel mondo digitale.",cta:linkDef("Scopri come lo facciamo","about"),stats:[{num:"500+",label:"Aziende trasformate"},{num:"€42M",label:"Revenue generate"},{num:"20 anni",label:"Di expertise"}],...mediaDef("🌍")},
};

function createSection(type){
  const def=DEFAULTS[type]||{label:type.replace(/_/g," "),title:"Nuova sezione"};
  return {...JSON.parse(JSON.stringify(def)),id:makeId(type),type,visible:true};
}

const INITIAL_TYPES=["hero","about","services","features","numbers","testimonials","pricing","team","faq","contact"];
const defaultSite={
  generale:{siteName:"La Mia Azienda",tagline:"L'eccellenza digitale al tuo servizio",primaryColor:"#1a56db",secondaryColor:"#0e9f6e",fontFamily:"Inter",language:"it",borderRadius:"10"},
  navbar:{logoText:"",logoImage:null,links:[],sticky:true,ctaLabel:"Contattaci",ctaAnchor:"contact",bgOpacity:97,height:68,autoLinks:true},
  footer:{text:"Tutti i diritti riservati.",showScrollTop:true,bgColor:"#111827",textColor:"#9ca3af"},
  sections:INITIAL_TYPES.map(createSection),
};

// ═══════════════════════════════════════════
// BUILD HTML — link helper
// ═══════════════════════════════════════════
function resolveLink(linkObj, fallbackAnchor="contact"){
  if(!linkObj) return {href:`#${fallbackAnchor}`,target:""};
  if(typeof linkObj === "string") return {href:`#${fallbackAnchor}`,target:""};
  const {href="",isAnchor=true}=linkObj;
  if(!href) return {href:`#${fallbackAnchor}`,target:""};
  if(isAnchor) return {href:`#${href}`,target:""};
  return {href,target:'target="_blank" rel="noopener"'};
}

function buildHTML(site){
  const g=site.generale,nav=site.navbar,ftr=site.footer;
  const p=g.primaryColor,sc=g.secondaryColor;
  const br=g.borderRadius||"10";
  const vis=site.sections.filter(s=>s.visible);
  const grad=`linear-gradient(135deg,${p},${sc})`;

  const CL=t=>t?`<div style="font-size:.75rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${p};margin-bottom:12px;">${t}</div>`:"";
  const CT=t=>t?`<h2 style="font-size:clamp(1.8rem,4vw,2.9rem);font-weight:800;color:#111827;line-height:1.15;margin-bottom:18px;letter-spacing:-.02em;">${t}</h2>`:"";
  const CS=t=>t?`<p style="color:#6b7280;font-size:1.05rem;max-width:620px;line-height:1.8;margin-bottom:0;">${t}</p>`:"";
  const WRAP=(id,bg,inner)=>`<section id="${id}" style="padding:100px 24px;background:${bg||"#fff"};"><div style="max-width:1200px;margin:0 auto;">${inner}</div></section>`;

  const BTN=(linkObj,label,style="primary",fallback="contact")=>{
    const {href,target}=resolveLink(linkObj,fallback);
    const tAttr=target?` ${target}`:"";
    if(style==="primary")
      return`<a href="${href}"${tAttr} style="display:inline-block;padding:14px 36px;border-radius:${br==="0"?"4px":"50px"};font-weight:700;font-size:.95rem;background:${grad};color:#fff;text-decoration:none;letter-spacing:.01em;">${label||"Scopri di più"}</a>`;
    if(style==="outline")
      return`<a href="${href}"${tAttr} style="display:inline-block;padding:14px 36px;border-radius:50px;font-weight:700;font-size:.95rem;background:transparent;color:${p};border:2px solid ${p};text-decoration:none;margin-left:12px;">${label||"Scopri"}</a>`;
    if(style==="ghost")
      return`<a href="${href}"${tAttr} style="display:inline-block;padding:14px 36px;border-radius:50px;font-weight:700;font-size:.95rem;background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.5);text-decoration:none;margin-left:12px;">${label||"Scopri"}</a>`;
    return`<a href="${href}"${tAttr} style="display:inline-block;padding:14px 36px;border-radius:50px;font-weight:700;font-size:.95rem;background:#fff;color:${p};text-decoration:none;margin-left:12px;">${label||"Scopri"}</a>`;
  };

  const STARS=n=>Array(n||5).fill("★").join("");
  const ICB=icon=>`<div style="width:52px;height:52px;border-radius:12px;background:${grad};display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">${icon}</div>`;
  const MEDIA=(sec,h="420px",radius=br,extra="")=>{
    if(sec.useImage&&sec.image)return`<div style="border-radius:${radius}px;overflow:hidden;height:${h};${extra}"><img src="${sec.image}" style="width:100%;height:100%;object-fit:cover;"></div>`;
    return`<div style="border-radius:${radius}px;background:${grad};height:${h};display:flex;align-items:center;justify-content:center;font-size:clamp(3rem,8vw,6rem);${extra}">${sec.emoji||"🚀"}</div>`;
  };
  const MEDIA_ITEM=(it,h="220px")=>{
    if(it.useImage&&it.image)return`<div style="height:${h};border-radius:${br}px;overflow:hidden;"><img src="${it.image}" style="width:100%;height:100%;object-fit:cover;"></div>`;
    return`<div style="height:${h};background:${grad};border-radius:${br}px;display:flex;align-items:center;justify-content:center;font-size:clamp(2rem,5vw,4rem);">${it.emoji||"🔷"}</div>`;
  };

  const renderSection=sec=>{
    try{
      // HERO VARIANTS
      if(sec.type==="hero"){
        const bg=sec.useImage&&sec.image
          ?`background:linear-gradient(rgba(0,0,0,${(sec.overlayOpacity||55)/100}),rgba(0,0,0,${(sec.overlayOpacity||55)/100})),url('${sec.image}')center/cover no-repeat;`
          :`background:${grad};`;
        return`<section id="${sec.id}" style="${bg}min-height:${sec.height||"100vh"};display:flex;align-items:center;justify-content:center;text-align:center;padding:120px 24px 80px;"><div style="max-width:860px;margin:0 auto;"><h1 style="font-size:clamp(2.6rem,7vw,4.8rem);font-weight:800;color:#fff;line-height:1.08;margin-bottom:28px;letter-spacing:-.03em;">${sec.title||""}</h1><p style="font-size:clamp(1rem,2.5vw,1.3rem);color:rgba(255,255,255,.88);margin-bottom:48px;line-height:1.8;max-width:640px;margin-left:auto;margin-right:auto;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}${sec.showCta2&&sec.cta2?BTN(sec.cta2,sec.cta2.label,"ghost"):""}</div></section>`;
      }
      if(sec.type==="hero_minimal")
        return`<section id="${sec.id}" style="min-height:100vh;display:flex;align-items:center;background:${sec.bgColor||"#0a0a14"};padding:120px 24px 80px;"><div style="max-width:1100px;margin:0 auto;"><div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:50px;padding:6px 16px;font-size:.82rem;color:rgba(255,255,255,.7);margin-bottom:32px;letter-spacing:.05em;">EXCELLENCE IN DIGITAL</div><h1 style="font-size:clamp(3.5rem,9vw,7rem);font-weight:800;color:${sec.textColor||"#fff"};line-height:1.0;margin-bottom:32px;letter-spacing:-.04em;">${sec.title||""}</h1><p style="font-size:1.25rem;color:rgba(255,255,255,.6);margin-bottom:52px;max-width:560px;line-height:1.75;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}</div></section>`;
      if(sec.type==="hero_split")
        return`<section id="${sec.id}" style="min-height:100vh;display:grid;grid-template-columns:1fr 1fr;background:#fff;padding-top:${nav.sticky?nav.height||68:0}px;"><div style="padding:80px 64px;display:flex;flex-direction:column;justify-content:center;"><div style="font-size:.75rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${p};margin-bottom:20px;">Partner digitale di eccellenza</div><h1 style="font-size:clamp(2rem,4.5vw,3.4rem);font-weight:800;line-height:1.1;margin-bottom:24px;letter-spacing:-.02em;">${sec.title||""}</h1><p style="color:#6b7280;font-size:1.1rem;line-height:1.8;margin-bottom:44px;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}${sec.showCta2&&sec.cta2?BTN(sec.cta2,sec.cta2.label,"outline"):""}</div><div style="overflow:hidden;">${MEDIA(sec,"100%","0")}</div></section>`;
      if(sec.type==="hero_dark")
        return`<section id="${sec.id}" style="min-height:100vh;display:flex;align-items:center;background:${sec.bgColor||"#070710"};padding:120px 24px 80px;position:relative;overflow:hidden;"><div style="position:absolute;top:-300px;right:-200px;width:700px;height:700px;border-radius:50%;background:${p};opacity:.07;pointer-events:none;filter:blur(60px);"></div><div style="position:absolute;bottom:-200px;left:-100px;width:500px;height:500px;border-radius:50%;background:${sc};opacity:.06;pointer-events:none;filter:blur(60px);"></div><div style="max-width:920px;margin:0 auto;text-align:center;position:relative;z-index:1;"><div style="display:inline-block;padding:6px 20px;border-radius:50px;border:1px solid rgba(255,255,255,.12);font-size:.8rem;color:rgba(255,255,255,.65);margin-bottom:32px;letter-spacing:.08em;background:rgba(255,255,255,.04);">INNOVAZIONE PRIMA DI TUTTO</div><h1 style="font-size:clamp(3rem,8vw,5.5rem);font-weight:800;color:#fff;line-height:1.05;margin-bottom:28px;letter-spacing:-.03em;">${sec.title||""}</h1><p style="font-size:1.2rem;color:rgba(255,255,255,.6);margin-bottom:52px;max-width:600px;margin-left:auto;margin-right:auto;line-height:1.8;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}<div style="margin-top:72px;">${MEDIA(sec,"380px",br,"max-width:780px;margin:0 auto;opacity:.9;")}</div></div></section>`;
      if(sec.type==="hero_centered_image")
        return`<section id="${sec.id}" style="min-height:100vh;background:#fafafa;text-align:center;padding:${(nav.sticky?nav.height+60:140)}px 24px 60px;"><div style="max-width:860px;margin:0 auto;"><h1 style="font-size:clamp(2.6rem,6.5vw,4.4rem);font-weight:800;line-height:1.08;margin-bottom:22px;letter-spacing:-.03em;">${sec.title||""}</h1><p style="font-size:1.15rem;color:#6b7280;margin-bottom:44px;line-height:1.8;max-width:600px;margin-left:auto;margin-right:auto;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}${sec.showCta2&&sec.cta2?BTN(sec.cta2,sec.cta2.label,"outline"):""}<div style="margin-top:64px;border-radius:${br}px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.12);">${MEDIA(sec,"480px",br)}</div></div></section>`;
      if(sec.type==="hero_announcement")
        return`<section id="${sec.id}" style="min-height:100vh;display:flex;align-items:center;background:${sec.bgColor||"#0a0a14"};padding:120px 24px 80px;text-align:center;"><div style="max-width:860px;margin:0 auto;"><a href="${sec.announcementLink||"#"}" style="display:inline-flex;align-items:center;gap:8px;padding:6px 18px 6px 8px;border-radius:50px;border:1px solid rgba(255,255,255,.15);font-size:.82rem;color:rgba(255,255,255,.8);margin-bottom:36px;text-decoration:none;background:rgba(255,255,255,.05);"><span style="background:${p};color:#fff;border-radius:50px;padding:2px 10px;font-size:.75rem;font-weight:700;">Novità</span>${sec.announcementText||"Annuncio"} →</a><h1 style="font-size:clamp(2.6rem,7vw,4.8rem);font-weight:800;color:#fff;line-height:1.08;margin-bottom:28px;letter-spacing:-.03em;">${sec.title||""}</h1><p style="font-size:1.15rem;color:rgba(255,255,255,.62);margin-bottom:52px;line-height:1.8;max-width:600px;margin-left:auto;margin-right:auto;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}</div></section>`;
      if(sec.type==="hero_video")
        return`<section id="${sec.id}" style="min-height:100vh;display:flex;align-items:center;background:${sec.bgColor||"#0a0a14"};padding:120px 24px 80px;position:relative;overflow:hidden;text-align:center;"><div style="position:absolute;inset:0;background:rgba(0,0,0,${(sec.overlayOpacity||60)/100});z-index:1;"></div><div style="position:absolute;inset:0;overflow:hidden;"><div style="background:${grad};width:100%;height:100%;opacity:.4;"></div></div><div style="max-width:860px;margin:0 auto;position:relative;z-index:2;"><h1 style="font-size:clamp(2.6rem,7vw,4.8rem);font-weight:800;color:#fff;line-height:1.08;margin-bottom:28px;letter-spacing:-.03em;">${sec.title||""}</h1><p style="font-size:1.15rem;color:rgba(255,255,255,.8);margin-bottom:48px;line-height:1.8;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}${sec.showCta2&&sec.cta2?BTN(sec.cta2,sec.cta2.label,"ghost"):""}</div></section>`;
      if(sec.type==="hero_services"){
        const svcs=(sec.services||[]).map(s=>`<div style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:${br}px;padding:12px 20px;backdrop-filter:blur(10px);"><span style="font-size:1.3rem;">${s.icon||""}</span><span style="color:#fff;font-weight:600;font-size:.9rem;">${s.title||""}</span></div>`).join("");
        return`<section id="${sec.id}" style="background:${grad};min-height:100vh;display:flex;align-items:center;text-align:center;padding:120px 24px 80px;"><div style="max-width:960px;margin:0 auto;"><h1 style="font-size:clamp(2.6rem,6.5vw,4.6rem);font-weight:800;color:#fff;margin-bottom:24px;letter-spacing:-.03em;">${sec.title||""}</h1><p style="color:rgba(255,255,255,.85);font-size:1.15rem;margin-bottom:52px;line-height:1.8;max-width:600px;margin-left:auto;margin-right:auto;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"white")}<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:60px;">${svcs}</div></div></section>`;
      }
      // AZIENDA
      if(sec.type==="about"){
        const imgEl=sec.showImage?MEDIA(sec,"440px"):"";
        const statsEl=sec.showStats?`<div style="display:flex;flex-wrap:wrap;gap:32px;margin-top:36px;padding-top:32px;border-top:1px solid #f0f0f0;">${(sec.stats||[]).map(st=>`<div><div style="font-size:2.4rem;font-weight:800;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;">${st.num}</div><div style="font-size:.82rem;color:#9ca3af;font-weight:600;margin-top:4px;text-transform:uppercase;letter-spacing:.05em;">${st.label}</div></div>`).join("")}</div>`:"";
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:${sec.showImage?"1fr 1fr":"1fr"};gap:80px;align-items:center;margin-top:60px;">${imgEl}<div><p style="color:#4b5563;line-height:1.95;font-size:1.05rem;margin-bottom:0;">${sec.text||""}</p>${statsEl}</div></div>`);
      }
      if(sec.type==="about_cards"){
        const items=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.06),0 4px 20px rgba(0,0,0,.04);border-top:3px solid ${p};"><div style="font-size:2.2rem;margin-bottom:16px;">${it.icon||""}</div><h3 style="font-weight:700;margin-bottom:12px;font-size:1.05rem;">${it.title||""}</h3><p style="color:#6b7280;font-size:.93rem;line-height:1.7;">${it.desc||""}</p></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="mission"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;padding:44px 32px;background:#fff;border-radius:${br}px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="width:72px;height:72px;border-radius:50%;background:${grad};display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 24px;"></div><div style="font-size:2rem;margin-top:-72px;margin-bottom:24px;">${it.icon||""}</div><h3 style="font-weight:700;margin-bottom:14px;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.75;">${it.text||""}</p></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="manifesto"){
        const paras=(sec.text||"").split("\n\n").map(t=>`<p style="font-size:clamp(1rem,2vw,1.25rem);line-height:1.95;color:#374151;margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid #f3f4f6;">${t}</p>`).join("");
        return`<section id="${sec.id}" style="padding:100px 24px;background:#fff;"><div style="max-width:840px;margin:0 auto;"><h2 style="font-size:clamp(2rem,5vw,3.8rem);font-weight:800;margin-bottom:60px;letter-spacing:-.03em;">${sec.title||""}</h2>${paras}<div style="margin-top:48px;font-style:italic;color:${p};font-weight:600;font-size:1.05rem;">— ${sec.author||""}</div></div></section>`;
      }
      if(sec.type==="history"||sec.type==="timeline"){
        const items=(sec.items||[]).map((it,i)=>`<div style="display:grid;grid-template-columns:auto 1fr;gap:32px;margin-bottom:48px;"><div style="display:flex;flex-direction:column;align-items:center;"><div style="width:56px;height:56px;border-radius:50%;background:${grad};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:.8rem;flex-shrink:0;box-shadow:0 4px 20px ${p}44;">${it.year||""}</div>${i<(sec.items||[]).length-1?`<div style="width:2px;flex:1;background:${grad};margin:8px 0;min-height:40px;opacity:.2;"></div>`:""}</div><div style="padding-top:12px;"><h3 style="font-weight:700;margin-bottom:10px;font-size:1.1rem;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.8;">${it.desc||""}</p></div></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="max-width:700px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="culture"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;gap:20px;align-items:flex-start;padding:28px;background:#fff;border-radius:${br}px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);">${ICB(it.icon||"⭐")}<div><h3 style="font-weight:700;margin-bottom:8px;">${it.title||""}</h3><p style="color:#6b7280;font-size:.93rem;line-height:1.7;">${it.desc||""}</p></div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="about_image_full")
        return`<section id="${sec.id}" style="position:relative;overflow:hidden;min-height:600px;"><div style="position:absolute;inset:0;">${sec.useImage&&sec.image?`<img src="${sec.image}" style="width:100%;height:100%;object-fit:cover;">`:`<div style="width:100%;height:100%;background:${grad};display:flex;align-items:center;justify-content:center;font-size:9rem;">${sec.emoji||"🏢"}</div>`}</div><div style="position:relative;z-index:1;background:rgba(0,0,0,.58);min-height:600px;display:flex;align-items:center;padding:100px 24px;"><div style="max-width:1200px;margin:0 auto;"><h2 style="font-size:clamp(2rem,5vw,3.8rem);font-weight:800;color:#fff;margin-bottom:22px;max-width:700px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.82);font-size:1.1rem;line-height:1.8;max-width:640px;margin-bottom:36px;">${sec.subtitle||""}</p>${sec.ctaLink?BTN(sec.ctaLink,sec.ctaLink.label,"primary"):""}</div></div></section>`;
      if(sec.type==="founders"){
        const cards=(sec.items||[]).map(it=>`<div style="text-align:center;"><div style="border-radius:${br}px;overflow:hidden;margin-bottom:24px;box-shadow:0 4px 30px rgba(0,0,0,.1);">${MEDIA_ITEM(it,"300px")}</div><h3 style="font-weight:700;margin-bottom:6px;">${it.name||""}</h3><div style="font-size:.88rem;color:${p};font-weight:600;margin-bottom:14px;">${it.role||""}</div><p style="color:#6b7280;font-size:.93rem;line-height:1.7;">${it.bio||""}</p></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:48px;margin-top:56px;">${cards}</div>`);
      }
      if(sec.type==="company_numbers"){
        const items=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;padding:36px 28px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="font-size:2rem;margin-bottom:12px;">${it.icon||""}</div><div style="font-size:2.8rem;font-weight:800;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;margin-bottom:8px;">${it.num||""}</div><div style="font-weight:700;font-size:1rem;margin-bottom:6px;">${it.label||""}</div><div style="font-size:.85rem;color:#9ca3af;line-height:1.6;">${it.desc||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      // SERVIZI
      if(sec.type==="services"){
        const cards=(sec.items||[]).map((it,i)=>`<div class="oc" style="background:#fff;border-radius:${br}px;padding:36px 32px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);border-bottom:3px solid transparent;transition:border-color .2s;opacity:0;transform:translateY(24px);transition:opacity .6s ${i*.08}s,transform .6s ${i*.08}s;"><div style="width:56px;height:56px;border-radius:14px;background:${grad};display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin-bottom:22px;">${it.icon||"✨"}</div><h3 style="font-weight:700;margin-bottom:12px;font-size:1.1rem;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.75;font-size:.95rem;">${it.desc||""}</p></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-top:56px;">${cards}</div>`);
      }
      if(sec.type==="services_list"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;gap:28px;align-items:flex-start;padding:32px 0;border-bottom:1px solid #f3f4f6;">${ICB(it.icon||"✨")}<div><h3 style="font-weight:700;margin-bottom:10px;font-size:1.05rem;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.75;margin-bottom:8px;">${it.desc||""}</p>${it.detail?`<span style="font-size:.82rem;color:${p};font-weight:600;background:${p}10;padding:3px 12px;border-radius:20px;">${it.detail}</span>`:""}</div></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="max-width:820px;margin-top:48px;">${items}</div>`);
      }
      if(sec.type==="services_icons"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;padding:24px 16px;background:#fff;border-radius:${br}px;border:1px solid #f0f0f0;"><div style="width:56px;height:56px;border-radius:14px;background:${grad};display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 12px;">${it.icon||""}</div><div style="font-size:.9rem;font-weight:600;">${it.title||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px;margin-top:52px;">${items}</div>`);
      }
      if(sec.type==="services_tabs"){
        const tabs=sec.tabs||[];
        const btns=tabs.map((t,i)=>`<button onclick="sTab(this,${i},'t${sec.id}')" style="padding:13px 26px;border:none;border-bottom:2px solid ${i===0?p:"#e5e7eb"};background:transparent;font-weight:${i===0?700:500};color:${i===0?p:"#6b7280"};cursor:pointer;font-family:inherit;font-size:.95rem;transition:all .2s;">${t.icon||""} ${t.label||""}</button>`).join("");
        const panels=tabs.map((t,i)=>`<div id="t${sec.id}_${i}" style="display:${i===0?"grid":"none"};grid-template-columns:1fr 1fr;gap:56px;align-items:center;padding-top:44px;"><div><h3 style="font-weight:700;font-size:1.35rem;margin-bottom:18px;">${t.title||""}</h3><p style="color:#6b7280;line-height:1.85;font-size:1rem;">${t.text||""}</p></div><div style="border-radius:${br}px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,.1);">${MEDIA_ITEM(t,"300px")}</div></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="border-bottom:2px solid #e5e7eb;display:flex;gap:0;margin-top:44px;flex-wrap:wrap;">${btns}</div>${panels}`);
      }
      if(sec.type==="features"){
        const items=(sec.items||[]).map((it,i)=>`<div class="oc" style="display:flex;gap:22px;align-items:flex-start;padding:32px;background:#fff;border-radius:${br}px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);opacity:0;transform:translateY(20px);transition:opacity .6s ${i*.08}s,transform .6s ${i*.08}s;">${ICB(it.icon||"✅")}<div><h3 style="font-weight:700;margin-bottom:10px;font-size:1.05rem;">${it.title||""}</h3><p style="color:#6b7280;font-size:.93rem;line-height:1.7;">${it.desc||""}</p></div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="process"){
        const items=(sec.items||[]).map((it,i)=>`<div style="text-align:center;padding:20px 16px;position:relative;"><div style="width:68px;height:68px;border-radius:50%;background:${grad};display:flex;align-items:center;justify-content:center;margin:0 auto 24px;color:#fff;font-weight:800;font-size:1.1rem;box-shadow:0 4px 20px ${p}44;">${it.num||i+1}</div><h3 style="font-weight:700;margin-bottom:12px;font-size:1.05rem;">${it.title||""}</h3><p style="color:#6b7280;font-size:.93rem;line-height:1.7;">${it.desc||""}</p></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="process_dark"){
        const items=(sec.items||[]).map((it,i)=>`<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:${br}px;padding:36px 28px;"><div style="font-size:3rem;font-weight:800;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:16px;line-height:1;">${it.num||"0"+(i+1)}</div><h3 style="font-weight:700;margin-bottom:12px;color:#fff;font-size:1.1rem;">${it.title||""}</h3><p style="color:rgba(255,255,255,.55);font-size:.92rem;line-height:1.75;">${it.desc||""}</p></div>`).join("");
        return`<section id="${sec.id}" style="padding:100px 24px;background:#0a0a14;"><div style="max-width:1200px;margin:0 auto;"><div style="text-align:center;margin-bottom:56px;">${CL(sec.sectionLabel||"")}${`<h2 style="font-size:clamp(1.8rem,4vw,3rem);font-weight:800;color:#fff;line-height:1.15;margin-bottom:18px;letter-spacing:-.02em;">${sec.title||""}</h2>`}${sec.subtitle?`<p style="color:rgba(255,255,255,.55);font-size:1.05rem;max-width:560px;line-height:1.8;margin:0 auto;">${sec.subtitle}</p>`:""}</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;">${items}</div></div></section>`;
      }
      if(sec.type==="steps_numbered"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;gap:36px;margin-bottom:52px;align-items:flex-start;"><div style="font-size:4.5rem;font-weight:800;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;flex-shrink:0;min-width:84px;">${it.num||""}</div><div style="padding-top:10px;border-top:2px solid ${p}20;"><h3 style="font-weight:700;margin-bottom:10px;font-size:1.1rem;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.8;">${it.text||""}</p></div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`<div style="display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;"><div>${CL(sec.sectionLabel||"")}${CT(sec.title||"")}</div><div>${items}</div></div>`);
      }
      if(sec.type==="checklist"){
        const inc=(sec.included||[]).map(it=>`<li style="display:flex;gap:14px;align-items:center;padding:12px 0;border-bottom:1px solid #f3f4f6;"><span style="width:22px;height:22px;border-radius:50%;background:#ecfdf5;display:flex;align-items:center;justify-content:center;color:#059669;font-size:.85rem;flex-shrink:0;">✓</span><span style="color:#374151;">${it.text||""}</span></li>`).join("");
        const exc=(sec.excluded||[]).map(it=>`<li style="display:flex;gap:14px;align-items:center;padding:12px 0;border-bottom:1px solid #f3f4f6;"><span style="width:22px;height:22px;border-radius:50%;background:#fef2f2;display:flex;align-items:center;justify-content:center;color:#dc2626;font-size:.85rem;flex-shrink:0;">✗</span><span style="color:#9ca3af;">${it.text||""}</span></li>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:56px;"><div><h3 style="font-weight:700;margin-bottom:16px;color:#059669;font-size:1rem;">✓ Incluso nel progetto</h3><ul style="list-style:none;">${inc}</ul></div><div><h3 style="font-weight:700;margin-bottom:16px;color:#dc2626;font-size:1rem;">✗ Non incluso</h3><ul style="list-style:none;">${exc}</ul></div></div>`);
      }
      if(sec.type==="services_with_image"){
        const items=(sec.items||[]).map((it,i)=>`<div style="display:grid;grid-template-columns:${i%2===0?"auto 1fr":"1fr auto"};gap:48px;align-items:center;margin-bottom:56px;padding-bottom:56px;border-bottom:1px solid #f3f4f6;">${i%2===0?`<div style="width:220px;flex-shrink:0;">${MEDIA_ITEM(it,"180px")}</div><div>${ICB(it.icon||"✨")}<h3 style="font-weight:700;margin:18px 0 12px;font-size:1.1rem;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.8;">${it.desc||""}</p></div>`:`<div>${ICB(it.icon||"✨")}<h3 style="font-weight:700;margin:18px 0 12px;font-size:1.1rem;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.8;">${it.desc||""}</p></div><div style="width:220px;flex-shrink:0;">${MEDIA_ITEM(it,"180px")}</div>`}</div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="offering"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;padding:36px 28px;"><div style="margin-bottom:28px;border-radius:${br}px;overflow:hidden;">${MEDIA_ITEM(it,"200px")}</div><h3 style="font-weight:700;margin-bottom:14px;font-size:1.1rem;">${it.title||""}</h3><p style="color:#6b7280;font-size:.95rem;line-height:1.8;">${it.text||""}</p></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="why_us"){
        const items=(sec.items||[]).map(it=>`<div style="padding:32px;background:#fff;border-radius:${br}px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="font-size:2.2rem;margin-bottom:16px;">${it.icon||""}</div><h3 style="font-weight:700;margin-bottom:12px;font-size:1.05rem;">${it.title||""}</h3><p style="color:#6b7280;font-size:.93rem;line-height:1.75;">${it.desc||""}</p></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      // DATI
      if(sec.type==="numbers")
        return`<section id="${sec.id}" style="padding:96px 24px;background:${grad};"><div style="max-width:1200px;margin:0 auto;text-align:center;margin-bottom:52px;"><h2 style="font-size:clamp(1.8rem,4vw,3rem);font-weight:800;color:#fff;letter-spacing:-.02em;">${sec.title||""}</h2></div><div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));background:rgba(255,255,255,.1);border-radius:${br}px;overflow:hidden;backdrop-filter:blur(10px);">${(sec.items||[]).map(it=>`<div style="text-align:center;padding:44px 24px;border-right:1px solid rgba(255,255,255,.12);"><div style="font-size:2rem;margin-bottom:12px;">${it.icon||""}</div><div style="font-size:3rem;font-weight:800;color:#fff;line-height:1;letter-spacing:-.03em;">${it.num||""}</div><div style="font-size:.82rem;color:rgba(255,255,255,.72);margin-top:8px;text-transform:uppercase;letter-spacing:.06em;">${it.label||""}</div></div>`).join("")}</div></section>`;
      if(sec.type==="numbers_minimal"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;padding:36px 24px;"><div style="font-size:2.8rem;font-weight:800;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-.03em;">${it.num||""}</div><div style="font-size:.85rem;color:#9ca3af;margin-top:6px;">${it.label||""}</div></div>`).join("");
        return`<section id="${sec.id}" style="padding:72px 24px;background:#fff;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;"><div style="max-width:1200px;margin:0 auto;text-align:center;margin-bottom:32px;"><h2 style="font-weight:800;font-size:1.9rem;letter-spacing:-.02em;">${sec.title||""}</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));max-width:1200px;margin:0 auto;">${items}</div></section>`;
      }
      if(sec.type==="before_after"){
        const items=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;padding:36px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="font-size:.75rem;font-weight:700;color:${p};margin-bottom:8px;text-transform:uppercase;letter-spacing:.1em;">${it.metric||""}</div><h3 style="font-weight:700;margin-bottom:24px;font-size:1.1rem;">${it.title||""}</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;"><div style="background:#f9fafb;border-radius:10px;padding:20px;text-align:center;"><div style="font-size:.7rem;color:#9ca3af;font-weight:700;margin-bottom:10px;text-transform:uppercase;letter-spacing:.08em;">Prima</div><div style="font-weight:600;color:#6b7280;font-size:1.1rem;">${it.before||""}</div></div><div style="background:${p}08;border-radius:10px;padding:20px;text-align:center;border:2px solid ${p}20;"><div style="font-size:.7rem;color:${p};font-weight:700;margin-bottom:10px;text-transform:uppercase;letter-spacing:.08em;">Dopo</div><div style="font-weight:800;color:${p};font-size:1.1rem;">${it.after||""}</div></div></div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="comparison"){
        const rows=(sec.rows||[]).map(r=>`<tr><td style="padding:15px 18px;border-bottom:1px solid #f3f4f6;font-weight:500;color:#374151;">${r.feature||""}</td><td style="text-align:center;padding:15px;border-bottom:1px solid #f3f4f6;font-size:1.1rem;">${r.a?`<span style="color:#059669;font-weight:700;">✓</span>`:`<span style="color:#dc2626;">✗</span>`}</td><td style="text-align:center;padding:15px;border-bottom:1px solid #f3f4f6;font-size:1.1rem;">${r.b?`<span style="color:#059669;font-weight:700;">✓</span>`:`<span style="color:#dc2626;">✗</span>`}</td></tr>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="overflow-x:auto;margin-top:56px;border-radius:${br}px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05),0 8px 40px rgba(0,0,0,.08);"><table style="width:100%;border-collapse:collapse;"><thead><tr><th style="padding:20px 18px;background:${grad};color:#fff;text-align:left;font-size:.9rem;">Caratteristica</th><th style="padding:20px;background:${grad};color:#fff;text-align:center;">${sec.optionA||"Noi"}</th><th style="padding:20px;background:#1f2937;color:#9ca3af;text-align:center;">${sec.optionB||"Altri"}</th></tr></thead><tbody>${rows}</tbody></table></div>`);
      }
      if(sec.type==="results"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;background:#fff;border-radius:${br}px;padding:40px 28px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="font-size:2.2rem;margin-bottom:14px;">${it.icon||""}</div><div style="font-size:3rem;font-weight:800;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;margin-bottom:10px;letter-spacing:-.03em;">${it.metric||""}</div><div style="font-weight:700;font-size:1rem;margin-bottom:6px;">${it.label||""}</div><div style="font-size:.82rem;color:#9ca3af;line-height:1.5;">${it.period||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="progress_bars"){
        const items=(sec.items||[]).map(it=>`<div style="margin-bottom:24px;"><div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span style="font-weight:600;font-size:.95rem;">${it.skill||""}</span><span style="font-weight:800;color:${p};">${it.value||0}%</span></div><div style="height:6px;background:#f0f0f0;border-radius:3px;overflow:hidden;"><div style="height:100%;background:${grad};border-radius:3px;width:${it.value||0}%;"></div></div></div>`).join("");
        return WRAP(sec.id,"#fff",`<div style="display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;"><div>${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}</div><div>${items}</div></div>`);
      }
      if(sec.type==="kpi_cards"){
        const items=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;">${ICB(it.icon||"📊")}<span style="font-size:.8rem;font-weight:700;padding:5px 14px;border-radius:50px;background:${it.up?"#ecfdf5":"#fef2f2"};color:${it.up?"#059669":"#dc2626"};">${it.trend||""}</span></div><div style="font-size:2.2rem;font-weight:800;margin-bottom:8px;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-.02em;">${it.value||""}</div><div style="font-size:.88rem;color:#6b7280;">${it.label||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="stats_banner"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;padding:44px 28px;"><div style="font-size:3.2rem;font-weight:800;color:#fff;margin-bottom:10px;letter-spacing:-.03em;">${it.num||""}</div><div style="font-size:.85rem;color:rgba(255,255,255,.72);text-transform:uppercase;letter-spacing:.08em;">${it.label||""}</div></div>`).join("");
        return`<section id="${sec.id}" style="background:${grad};"><div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));">${items}</div></section>`;
      }
      // PORTFOLIO
      if(sec.type==="portfolio"){
        const cards=(sec.items||[]).map((it,i)=>`<div class="oc" style="border-radius:${br}px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06),0 8px 32px rgba(0,0,0,.08);background:#fff;opacity:0;transform:translateY(24px);transition:opacity .6s ${i*.08}s,transform .6s ${i*.08}s;"><div style="position:relative;">${MEDIA_ITEM(it)}${it.tag?`<span style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,.96);font-size:.72rem;font-weight:700;padding:4px 14px;border-radius:50px;letter-spacing:.05em;">${it.tag}</span>`:""}</div><div style="padding:24px 28px;"><h3 style="font-weight:700;margin-bottom:10px;font-size:1rem;">${it.title||""}</h3><p style="color:#6b7280;font-size:.92rem;line-height:1.65;">${it.desc||""}</p></div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-top:56px;">${cards}</div>`);
      }
      if(sec.type==="portfolio_list"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;gap:24px;align-items:center;padding:24px 28px;background:#fff;border-radius:${br}px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="width:88px;height:88px;flex-shrink:0;">${MEDIA_ITEM(it,"88px")}</div><div style="flex:1;min-width:0;"><div style="font-size:.72rem;font-weight:700;color:${p};margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em;">${it.category||""}</div><h3 style="font-weight:700;margin-bottom:6px;font-size:1rem;">${it.title||""}</h3><p style="color:#6b7280;font-size:.88rem;">${it.desc||""}</p></div><div style="text-align:right;flex-shrink:0;"><div style="font-size:1.5rem;font-weight:800;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${it.result||""}</div><div style="font-size:.78rem;color:#9ca3af;">${it.period||""}</div></div></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:flex;flex-direction:column;gap:16px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="case_study"){
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="margin-top:36px;border-radius:${br}px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,.1);margin-bottom:52px;">${MEDIA(sec,"380px")}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;"><div><h3 style="font-weight:700;margin-bottom:16px;color:${p};font-size:1rem;text-transform:uppercase;letter-spacing:.08em;">La sfida</h3><p style="color:#6b7280;line-height:1.85;">${sec.challenge||""}</p></div><div><h3 style="font-weight:700;margin-bottom:16px;color:${p};font-size:1rem;text-transform:uppercase;letter-spacing:.08em;">La soluzione</h3><p style="color:#6b7280;line-height:1.85;">${sec.solution||""}</p></div></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:44px;background:${grad};border-radius:${br}px;padding:44px 32px;">${[sec.result1,sec.result2,sec.result3].map(r=>`<div style="text-align:center;"><div style="font-size:2.8rem;font-weight:800;color:#fff;letter-spacing:-.03em;">${(r||{}).num||""}</div><div style="font-size:.88rem;color:rgba(255,255,255,.78);margin-top:8px;">${(r||{}).label||""}</div></div>`).join("")}</div>`);
      }
      if(sec.type==="gallery_grid"){
        const items=(sec.items||[]).map(it=>`<div style="border-radius:${br}px;overflow:hidden;position:relative;">${MEDIA_ITEM(it,"240px")}${it.caption?`<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.65));padding:20px 16px;color:#fff;font-size:.88rem;font-weight:600;">${it.caption}</div>`:""}</div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="project_showcase")
        return`<section id="${sec.id}" style="padding:100px 24px;background:#0a0a14;"><div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;"><div><div style="font-size:.75rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${p};margin-bottom:18px;">${sec.sectionLabel||""}</div><h2 style="font-size:clamp(1.8rem,4vw,3.2rem);font-weight:800;color:#fff;margin-bottom:18px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.6);line-height:1.85;margin-bottom:40px;">${sec.subtitle||""}</p><div style="display:flex;gap:32px;">${[sec.metric1,sec.metric2,sec.metric3].map(m=>`<div><div style="font-size:2rem;font-weight:800;color:#fff;letter-spacing:-.02em;">${(m||{}).num||""}</div><div style="font-size:.8rem;color:rgba(255,255,255,.45);margin-top:4px;">${(m||{}).label||""}</div></div>`).join("")}</div></div><div style="border-radius:${br}px;overflow:hidden;box-shadow:0 8px 60px rgba(0,0,0,.4);">${MEDIA(sec,"420px")}</div></div></section>`;
      if(sec.type==="image_gallery_masonry"){
        const items=(sec.items||[]).map(it=>`<div style="break-inside:avoid;margin-bottom:16px;border-radius:${br}px;overflow:hidden;position:relative;">${MEDIA_ITEM(it,"220px")}${it.caption?`<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.65));padding:20px 16px;color:#fff;font-size:.85rem;font-weight:600;">${it.caption}</div>`:""}</div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="columns:3;gap:16px;margin-top:56px;">${items}</div>`);
      }
      // FIDUCIA
      if(sec.type==="testimonials"){
        const cards=(sec.items||[]).map((it,i)=>`<div class="oc" style="background:#fff;border-radius:${br}px;padding:36px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);opacity:0;transform:translateY(20px);transition:opacity .6s ${i*.1}s,transform .6s ${i*.1}s;"><div style="color:#f59e0b;font-size:.95rem;letter-spacing:.15em;margin-bottom:18px;">${STARS(it.rating)}</div><p style="color:#374151;line-height:1.85;font-style:italic;margin-bottom:28px;font-size:1rem;">"${it.text||""}"</p><div style="display:flex;align-items:center;gap:14px;padding-top:20px;border-top:1px solid #f3f4f6;"><div style="width:48px;height:48px;border-radius:50%;overflow:hidden;flex-shrink:0;">${(it.useImage&&it.image)?`<img src="${it.image}" style="width:100%;height:100%;object-fit:cover;">`:`<div style="width:48px;height:48px;border-radius:50%;background:${grad};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.9rem;">${it.emoji||it.avatar||"??"}</div>`}</div><div><div style="font-weight:700;font-size:.95rem;">${it.name||""}</div><div style="font-size:.82rem;color:#9ca3af;">${it.role||""}</div></div></div></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-top:56px;">${cards}</div>`);
      }
      if(sec.type==="testimonials_big")
        return`<section id="${sec.id}" style="padding:100px 24px;background:${grad};text-align:center;"><div style="max-width:860px;margin:0 auto;"><div style="font-size:6rem;color:rgba(255,255,255,.2);font-family:Georgia,serif;line-height:.5;margin-bottom:28px;">"</div><blockquote style="font-size:clamp(1.3rem,3vw,2rem);font-style:italic;color:#fff;line-height:1.7;margin-bottom:44px;font-weight:500;">${sec.quote||""}</blockquote><div style="display:flex;align-items:center;justify-content:center;gap:20px;"><div style="width:64px;height:64px;border-radius:50%;overflow:hidden;">${(sec.useImage&&sec.image)?`<img src="${sec.image}" style="width:100%;height:100%;object-fit:cover;">`:`<div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.1rem;">${sec.emoji||sec.avatar||""}</div>`}</div><div style="text-align:left;"><div style="font-weight:700;color:#fff;font-size:1rem;">${sec.author||""}</div><div style="font-size:.88rem;color:rgba(255,255,255,.72);">${sec.role||""}</div></div></div></div></section>`;
      if(sec.type==="testimonials_list"){
        const items=(sec.items||[]).map(it=>`<div style="padding:24px 28px;background:#fff;border-radius:${br}px;box-shadow:0 1px 3px rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.04);display:flex;gap:18px;align-items:flex-start;"><div style="width:48px;height:48px;border-radius:50%;overflow:hidden;flex-shrink:0;">${(it.useImage&&it.image)?`<img src="${it.image}" style="width:100%;height:100%;object-fit:cover;">`:`<div style="width:48px;height:48px;border-radius:50%;background:${grad};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">${it.emoji||"??"}</div>`}</div><div><div style="font-weight:700;font-size:.95rem;">${it.name||""}</div><div style="font-size:.8rem;color:#9ca3af;margin-bottom:10px;">${it.role||""}</div><div style="color:#f59e0b;font-size:.85rem;margin-bottom:8px;letter-spacing:.12em;">${STARS(it.rating)}</div><p style="color:#6b7280;font-size:.92rem;line-height:1.7;">"${it.text||""}"</p></div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:flex;flex-direction:column;gap:16px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="testimonials_numbers"){
        const nums=(sec.numbers||[]).map(n=>`<div style="text-align:center;"><div style="font-size:2.8rem;font-weight:800;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-.03em;">${n.num||""}</div><div style="font-size:.82rem;color:rgba(255,255,255,.7);margin-top:6px;">${n.label||""}</div></div>`).join("");
        const t=sec.testimonial||{};
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:40px;margin-top:56px;padding:40px;background:${grad};border-radius:${br}px;">${nums}</div><div style="background:#f9fafb;border-radius:${br}px;padding:36px;margin-top:20px;"><div style="color:#f59e0b;margin-bottom:16px;letter-spacing:.12em;">★★★★★</div><p style="font-size:1.1rem;font-style:italic;color:#374151;margin-bottom:24px;line-height:1.8;">"${t.text||""}"</p><div style="display:flex;gap:14px;align-items:center;"><div style="width:48px;height:48px;border-radius:50%;background:${grad};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">${t.avatar||""}</div><div><div style="font-weight:700;">${t.name||""}</div><div style="font-size:.85rem;color:#9ca3af;">${t.role||""}</div></div></div></div>`);
      }
      if(sec.type==="awards"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;padding:36px 28px;background:#fff;border-radius:${br}px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="font-size:2.8rem;margin-bottom:16px;">${it.icon||""}</div><h3 style="font-weight:700;margin-bottom:8px;font-size:.98rem;">${it.title||""}</h3><div style="font-size:.82rem;color:${p};font-weight:700;text-transform:uppercase;letter-spacing:.05em;">${it.org||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="guarantee"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;padding:40px 28px;"><div style="font-size:3rem;margin-bottom:18px;">${it.icon||""}</div><h3 style="font-weight:700;margin-bottom:14px;font-size:1.05rem;">${it.title||""}</h3><p style="color:#6b7280;font-size:.93rem;line-height:1.75;">${it.desc||""}</p></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="partners"||sec.type==="logo_wall"||sec.type==="clients_logos"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 16px;background:#fff;border-radius:${br}px;border:1px solid #f0f0f0;">${(it.useImage&&it.image)?`<img src="${it.image}" style="width:60px;height:60px;object-fit:contain;">`:`<div style="font-size:2.2rem;">${it.icon||""}</div>`}<div style="font-weight:600;font-size:.82rem;color:#6b7280;">${it.name||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;margin-top:52px;">${items}</div>`);
      }
      if(sec.type==="brands_ticker"){
        const items=(sec.items||[]).map(it=>`<span style="display:inline-flex;align-items:center;gap:12px;padding:14px 28px;background:#fff;border-radius:${br}px;border:1px solid #f0f0f0;font-weight:600;white-space:nowrap;margin-right:16px;box-shadow:0 1px 4px rgba(0,0,0,.04);"><span style="font-size:1.4rem;">${it.icon||""}</span><span style="font-size:.9rem;color:#374151;">${it.name||""}</span></span>`).join("");
        return`<section id="${sec.id}" style="padding:72px 24px;background:#f9fafb;"><div style="max-width:1200px;margin:0 auto;text-align:center;margin-bottom:32px;">${CL(sec.sectionLabel||"")}<h2 style="font-weight:800;font-size:1.5rem;letter-spacing:-.01em;">${sec.title||""}</h2></div><div style="overflow-x:auto;padding:20px 0;white-space:nowrap;">${items}${items}</div></section>`;
      }
      if(sec.type==="trust_badges"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #f0f0f0;border-radius:50px;padding:12px 24px;font-weight:600;font-size:.88rem;box-shadow:0 1px 4px rgba(0,0,0,.04);"><span style="font-size:1.2rem;">${it.icon||""}</span><span style="color:#374151;">${it.text||""}</span></div>`).join("");
        return`<section id="${sec.id}" style="padding:72px 24px;background:#fff;text-align:center;border-top:1px solid #f3f4f6;"><div style="max-width:1200px;margin:0 auto;"><h3 style="font-size:.88rem;font-weight:700;color:#9ca3af;margin-bottom:28px;text-transform:uppercase;letter-spacing:.1em;">${sec.title||""}</h3><div style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;">${items}</div></div></section>`;
      }
      if(sec.type==="press"){
        const items=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="font-size:2rem;margin-bottom:14px;">${it.logo||"📰"}</div><div style="font-weight:800;margin-bottom:12px;font-size:1rem;">${it.name||""}</div><p style="color:#6b7280;font-size:.9rem;line-height:1.75;font-style:italic;">"${it.quote||""}"</p></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:56px;">${items}</div>`);
      }
      // PERSONE
      if(sec.type==="team"){
        const cards=(sec.items||[]).map((it,i)=>`<div class="oc" style="text-align:center;background:#fff;border-radius:${br}px;padding:40px 28px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);opacity:0;transform:translateY(20px);transition:opacity .6s ${i*.1}s,transform .6s ${i*.1}s;"><div style="width:100px;height:100px;border-radius:50%;overflow:hidden;margin:0 auto 20px;">${(it.useImage&&it.image)?`<img src="${it.image}" style="width:100%;height:100%;object-fit:cover;">`:`<div style="width:100px;height:100px;border-radius:50%;background:${grad};display:flex;align-items:center;justify-content:center;font-size:2.2rem;">${it.emoji||"👤"}</div>`}</div><h3 style="font-weight:700;margin-bottom:6px;font-size:1rem;">${it.name||""}</h3><div style="font-size:.82rem;color:${p};font-weight:700;margin-bottom:14px;text-transform:uppercase;letter-spacing:.05em;">${it.role||""}</div><p style="color:#6b7280;font-size:.9rem;line-height:1.7;">${it.desc||""}</p></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:24px;margin-top:56px;">${cards}</div>`);
      }
      if(sec.type==="team_dark"){
        const cards=(sec.items||[]).map((it,i)=>`<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:${br}px;padding:40px 28px;text-align:center;"><div style="width:100px;height:100px;border-radius:50%;overflow:hidden;margin:0 auto 20px;">${(it.useImage&&it.image)?`<img src="${it.image}" style="width:100%;height:100%;object-fit:cover;">`:`<div style="width:100px;height:100px;border-radius:50%;background:${grad};display:flex;align-items:center;justify-content:center;font-size:2.2rem;">${it.emoji||"👤"}</div>`}</div><h3 style="font-weight:700;margin-bottom:6px;color:#fff;font-size:1rem;">${it.name||""}</h3><div style="font-size:.8rem;color:${p};font-weight:700;margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em;">${it.role||""}</div><p style="color:rgba(255,255,255,.5);font-size:.88rem;line-height:1.7;">${it.desc||""}</p></div>`).join("");
        return`<section id="${sec.id}" style="padding:100px 24px;background:#0a0a14;"><div style="max-width:1200px;margin:0 auto;"><div style="text-align:center;margin-bottom:56px;">${CL(sec.sectionLabel||"")}${`<h2 style="font-size:clamp(1.8rem,4vw,3rem);font-weight:800;color:#fff;letter-spacing:-.02em;">${sec.title||""}</h2>`}${sec.subtitle?`<p style="color:rgba(255,255,255,.52);font-size:1.05rem;max-width:560px;line-height:1.8;margin:16px auto 0;">${sec.subtitle}</p>`:""}</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px;">${cards}</div></div></section>`;
      }
      if(sec.type==="team_minimal"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;align-items:center;gap:18px;padding:18px 22px;background:#fff;border-radius:${br}px;border:1px solid #f0f0f0;"><span style="font-size:1.6rem;">${it.icon||"👤"}</span><div><div style="font-weight:700;font-size:.98rem;">${it.name||""}</div><div style="font-size:.82rem;color:${p};font-weight:600;">${it.role||""}</div></div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:52px;">${items}</div>`);
      }
      if(sec.type==="team_large"){
        const cards=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06),0 8px 40px rgba(0,0,0,.08);"><div style="height:300px;">${MEDIA_ITEM(it,"300px")}</div><div style="padding:32px;"><h3 style="font-weight:700;margin-bottom:6px;">${it.name||""}</h3><div style="font-size:.82rem;color:${p};font-weight:700;margin-bottom:16px;text-transform:uppercase;letter-spacing:.05em;">${it.role||""}</div><p style="color:#6b7280;font-size:.93rem;line-height:1.7;margin-bottom:18px;">${it.bio||""}</p>${it.linkedin?`<a href="${it.linkedin}" style="font-size:.85rem;color:${p};font-weight:700;text-decoration:none;">LinkedIn →</a>`:""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px;margin-top:56px;">${cards}</div>`);
      }
      if(sec.type==="open_positions"){
        const items=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;padding:28px 32px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;"><div><h3 style="font-weight:700;margin-bottom:10px;font-size:1.05rem;">${it.role||""}</h3><div style="display:flex;gap:10px;margin-bottom:8px;"><span style="font-size:.78rem;background:${p}12;color:${p};padding:4px 14px;border-radius:50px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;">${it.type||""}</span><span style="font-size:.78rem;background:#f3f4f6;color:#6b7280;padding:4px 14px;border-radius:50px;">📍 ${it.location||""}</span></div><p style="color:#6b7280;font-size:.9rem;">${it.desc||""}</p></div><a href="#contact" style="white-space:nowrap;padding:12px 28px;border-radius:${br}px;background:${grad};color:#fff;text-decoration:none;font-weight:700;font-size:.9rem;">Candidati →</a></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:flex;flex-direction:column;gap:16px;margin-top:56px;">${items}</div>`);
      }
      // PRICING
      if(sec.type==="pricing"){
        const cards=(sec.items||[]).map(it=>{
          const {href}=resolveLink(it.cta,"contact");
          return`<div style="border-radius:${br}px;padding:40px 32px;border:${it.highlight?`2px solid ${p}`:"1px solid #f0f0f0"};background:#fff;position:relative;${it.highlight?`box-shadow:0 8px 60px ${p}22;`:""}"><h3 style="font-weight:700;margin-bottom:6px;font-size:1.05rem;">${it.name||""}</h3><p style="color:#9ca3af;margin-bottom:24px;font-size:.9rem;">${it.desc||""}</p><div style="font-size:2.8rem;font-weight:800;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;letter-spacing:-.03em;">${it.price||""}</div><div style="margin-bottom:32px;font-size:.82rem;color:#9ca3af;">${it.period||""}</div><ul style="list-style:none;margin-bottom:36px;">${(it.features||[]).map(f=>`<li style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:.9rem;display:flex;gap:12px;align-items:center;"><span style="width:20px;height:20px;border-radius:50%;background:#ecfdf5;display:flex;align-items:center;justify-content:center;color:#059669;font-size:.75rem;flex-shrink:0;">✓</span>${f}</li>`).join("")}</ul><a href="${href}" style="display:block;text-align:center;padding:14px;border-radius:${br}px;font-weight:700;text-decoration:none;font-size:.95rem;background:${it.highlight?grad:"transparent"};color:${it.highlight?"#fff":p};border:2px solid ${it.highlight?p:p};">${it.cta?.label||"Inizia ora"} →</a></div>`;
        }).join("");
        return WRAP(sec.id,"#f9fafb",`<div style="text-align:center;">${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-top:56px;">${cards}</div>`);
      }
      if(sec.type==="pricing_table"){
        const hdr=`<tr style="background:${grad};"><th style="padding:18px;text-align:left;color:#fff;font-size:.9rem;">Caratteristica</th>${(sec.plans||[]).map(pl=>`<th style="padding:18px;text-align:center;color:#fff;font-size:.88rem;">${pl.name||""}<br><span style="font-size:.82rem;font-weight:400;opacity:.85;">${pl.price||""}</span></th>`).join("")}</tr>`;
        const body=(sec.features||[]).map((f,i)=>`<tr style="background:${i%2?"#f9fafb":"#fff"};"><td style="padding:15px 18px;font-weight:500;font-size:.9rem;color:#374151;">${f}</td>${(sec.plans||[]).map(pl=>`<td style="text-align:center;padding:15px;font-size:.9rem;color:#6b7280;">${(pl.values||[])[i]||"—"}</td>`).join("")}</tr>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="overflow-x:auto;margin-top:56px;border-radius:${br}px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05),0 8px 40px rgba(0,0,0,.08);"><table style="width:100%;border-collapse:collapse;"><thead>${hdr}</thead><tbody>${body}</tbody></table></div>`);
      }
      if(sec.type==="pricing_comparison"){
        const rows=(sec.items&&sec.items[0]&&sec.items[0].rows||[]).map(r=>r.label);
        const hdr=`<tr><th style="padding:18px;background:${grad};color:#fff;text-align:left;">Piano</th>${(sec.items||[]).map(pl=>`<th style="padding:18px;background:${pl.highlight?p:"#1f2937"};color:#fff;text-align:center;font-size:.88rem;">${pl.name||""}<br><span style="font-size:1.1rem;font-weight:800;">${pl.price||""}</span></th>`).join("")}</tr>`;
        const body=rows.map((r,i)=>`<tr style="background:${i%2?"#f9fafb":"#fff"};"><td style="padding:15px 18px;font-weight:500;font-size:.9rem;color:#374151;">${r}</td>${(sec.items||[]).map(pl=>`<td style="text-align:center;padding:15px;font-size:.9rem;">${(pl.rows||[])[i]?(pl.rows[i].value||"—"):"—"}</td>`).join("")}</tr>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="overflow-x:auto;margin-top:56px;border-radius:${br}px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05),0 8px 40px rgba(0,0,0,.08);"><table style="width:100%;border-collapse:collapse;"><thead>${hdr}</thead><tbody>${body}</tbody></table></div>`);
      }
      if(sec.type==="cta_banner"){
        const bg=sec.bgStyle==="gradient"?grad:p;
        return`<section id="${sec.id}" style="padding:96px 24px;background:${bg};text-align:center;"><div style="max-width:800px;margin:0 auto;"><h2 style="font-size:clamp(2rem,5vw,3.4rem);font-weight:800;color:#fff;margin-bottom:18px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.85);font-size:1.1rem;margin-bottom:48px;line-height:1.8;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}${sec.showCta2&&sec.cta2?BTN(sec.cta2,sec.cta2.label,"ghost"):""}</div></section>`;
      }
      if(sec.type==="cta_split")
        return WRAP(sec.id,"#fff",`<div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;"><div><h2 style="font-size:clamp(1.7rem,3.5vw,2.6rem);font-weight:800;margin-bottom:18px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:#6b7280;line-height:1.85;font-size:1rem;">${sec.subtitle||""}</p></div><div style="display:flex;flex-direction:column;gap:14px;">${BTN(sec.cta1,sec.cta1?.label,"primary")}${sec.showCta2&&sec.cta2?`<a href="${resolveLink(sec.cta2).href}" style="display:block;text-align:center;padding:14px 32px;border-radius:50px;font-weight:700;color:${p};border:2px solid ${p};text-decoration:none;">${sec.cta2.label}</a>`:""}</div></div>`);
      if(sec.type==="cta_minimal")
        return`<section id="${sec.id}" style="padding:72px 24px;background:#f9fafb;text-align:center;"><div style="max-width:600px;margin:0 auto;"><h3 style="font-size:1.6rem;font-weight:700;margin-bottom:10px;letter-spacing:-.01em;">${sec.title||""}</h3><p style="color:#6b7280;margin-bottom:32px;line-height:1.75;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}</div></section>`;
      if(sec.type==="cta_image_bg"){
        const bg=sec.useImage&&sec.image
          ?`background:linear-gradient(rgba(0,0,0,${(sec.overlayOpacity||60)/100}),rgba(0,0,0,${(sec.overlayOpacity||60)/100})),url('${sec.image}')center/cover no-repeat;`
          :`background:${grad};`;
        return`<section id="${sec.id}" style="${bg}padding:120px 24px;text-align:center;"><div style="max-width:800px;margin:0 auto;"><h2 style="font-size:clamp(2rem,5vw,3.4rem);font-weight:800;color:#fff;margin-bottom:18px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.85);font-size:1.1rem;margin-bottom:48px;line-height:1.8;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}</div></section>`;
      }
      if(sec.type==="cta_dark")
        return`<section id="${sec.id}" style="padding:100px 24px;background:${sec.bgColor||"#070710"};text-align:center;position:relative;overflow:hidden;"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;border-radius:50%;background:${p};opacity:.06;filter:blur(80px);pointer-events:none;"></div><div style="max-width:800px;margin:0 auto;position:relative;z-index:1;"><h2 style="font-size:clamp(2rem,5vw,3.4rem);font-weight:800;color:#fff;margin-bottom:20px;letter-spacing:-.03em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.58);font-size:1.1rem;margin-bottom:52px;line-height:1.8;max-width:600px;margin-left:auto;margin-right:auto;">${sec.subtitle||""}</p>${BTN(sec.cta1,sec.cta1?.label,"primary")}${sec.showCta2&&sec.cta2?BTN(sec.cta2,sec.cta2.label,"ghost"):""}</div></section>`;
      if(sec.type==="newsletter")
        return`<section id="${sec.id}" style="padding:96px 24px;background:${grad};text-align:center;"><div style="max-width:600px;margin:0 auto;"><h2 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.82);margin-bottom:40px;line-height:1.8;">${sec.subtitle||""}</p><div style="display:flex;gap:10px;max-width:480px;margin:0 auto;"><input type="email" placeholder="${sec.placeholder||"La tua email"}" style="flex:1;padding:14px 20px;border:none;border-radius:50px;font-size:.95rem;outline:none;"><button style="background:#fff;color:${p};padding:14px 26px;border-radius:50px;border:none;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;">${sec.btnLabel||"Iscriviti"}</button></div><p style="color:rgba(255,255,255,.58);font-size:.8rem;margin-top:16px;">${sec.note||""}</p></div></section>`;
      if(sec.type==="lead_magnet"){
        const items=(sec.items||[]).map(it=>`<li style="display:flex;align-items:center;gap:12px;margin-bottom:12px;"><span style="width:22px;height:22px;border-radius:50%;background:${p}15;display:flex;align-items:center;justify-content:center;color:${p};font-weight:700;font-size:.8rem;flex-shrink:0;">✓</span><span style="color:#4b5563;">${it.text||""}</span></li>`).join("");
        return WRAP(sec.id,"#f9fafb",`<div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;"><div style="border-radius:${br}px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,.12);">${MEDIA(sec,"340px")}</div><div>${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<ul style="list-style:none;margin:28px 0;">${items}</ul>${BTN(sec.cta,sec.cta?.label,"primary")}</div></div>`);
      }
      if(sec.type==="waitlist")
        return`<section id="${sec.id}" style="padding:100px 24px;background:#070710;text-align:center;"><div style="max-width:600px;margin:0 auto;"><div style="display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${p};margin-bottom:20px;border:1px solid ${p}40;padding:5px 16px;border-radius:50px;">Coming Soon</div><h2 style="font-size:clamp(2rem,5vw,3.4rem);font-weight:800;color:#fff;margin-bottom:18px;letter-spacing:-.03em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.58);margin-bottom:44px;line-height:1.8;">${sec.subtitle||""}</p><div style="display:flex;gap:10px;max-width:440px;margin:0 auto 18px;"><input type="email" placeholder="${sec.placeholder||"La tua email"}" style="flex:1;padding:14px 20px;border:1px solid rgba(255,255,255,.12);border-radius:50px;font-size:.95rem;outline:none;background:rgba(255,255,255,.07);color:#fff;"><button style="background:${grad};color:#fff;padding:14px 26px;border-radius:50px;border:none;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;">${sec.btnLabel||"Entra"}</button></div>${sec.note?`<p style="color:rgba(255,255,255,.38);font-size:.8rem;">${sec.note}</p>`:""}</div></section>`;
      // CONTATTI
      if(sec.type==="contact"){
        const mode=sec.contactMode||"both";
        const showForm=mode==="form"||mode==="both";
        const showInfo=mode==="info"||mode==="both";
        const ICB2=icon=>`<div style="width:52px;height:52px;border-radius:12px;background:${grad};display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">${icon}</div>`;
        const infoItems=[
          sec.email&&`<div style="display:flex;gap:18px;margin-bottom:24px;align-items:flex-start;">${ICB2("📧")}<div><strong style="display:block;margin-bottom:4px;font-size:.72rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;">Email</strong><span style="color:#374151;font-weight:600;">${sec.email}</span></div></div>`,
          sec.phone&&`<div style="display:flex;gap:18px;margin-bottom:24px;">${ICB2("📞")}<div><strong style="display:block;margin-bottom:4px;font-size:.72rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;">Telefono</strong><span style="color:#374151;font-weight:600;">${sec.phone}</span></div></div>`,
          sec.mobile&&`<div style="display:flex;gap:18px;margin-bottom:24px;">${ICB2("📱")}<div><strong style="display:block;margin-bottom:4px;font-size:.72rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;">Cellulare</strong><span style="color:#374151;font-weight:600;">${sec.mobile}</span></div></div>`,
          sec.address&&`<div style="display:flex;gap:18px;margin-bottom:24px;">${ICB2("📍")}<div><strong style="display:block;margin-bottom:4px;font-size:.72rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;">Indirizzo</strong><span style="color:#374151;font-weight:600;">${sec.address}</span></div></div>`,
          sec.whatsapp&&`<div style="display:flex;gap:18px;margin-bottom:24px;">${ICB2("💬")}<div><strong style="display:block;margin-bottom:4px;font-size:.72rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;">WhatsApp</strong><span style="color:#374151;">${sec.whatsapp}</span></div></div>`,
          sec.linkedin&&`<div style="display:flex;gap:18px;margin-bottom:24px;">${ICB2("🔗")}<div><strong style="display:block;margin-bottom:4px;font-size:.72rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;">LinkedIn</strong><a href="${sec.linkedin}" style="color:${p};font-weight:600;">${sec.linkedin}</a></div></div>`,
        ].filter(Boolean).join("");
        const mapHTML=sec.showMap&&sec.mapEmbed?`<div style="margin-top:32px;border-radius:${br}px;overflow:hidden;"><iframe src="${sec.mapEmbed}" width="100%" height="280" style="border:none;display:block;" allowfullscreen loading="lazy"></iframe></div>`:"";
        const formHTML=showForm?`<div>${(sec.formFields||["Nome","Email","Messaggio"]).map(f=>f.toLowerCase().includes("mess")?`<div style="margin-bottom:20px;"><label style="display:block;font-size:.82rem;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em;color:#374151;">${f}</label><textarea placeholder="${f}..." rows="5" style="width:100%;padding:14px 16px;border:1.5px solid #e5e7eb;border-radius:10px;font-family:inherit;font-size:.95rem;outline:none;resize:vertical;box-sizing:border-box;"></textarea></div>`:`<div style="margin-bottom:20px;"><label style="display:block;font-size:.82rem;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em;color:#374151;">${f}</label><input type="${f.toLowerCase().includes("email")?"email":"text"}" placeholder="${f}" style="width:100%;padding:14px 16px;border:1.5px solid #e5e7eb;border-radius:10px;font-family:inherit;font-size:.95rem;outline:none;box-sizing:border-box;"></div>`).join("")}<button onclick="alert('${(sec.submitMessage||"Grazie!").replace(/'/g,"\\'")}');return false;" style="background:${grad};color:#fff;padding:15px 40px;border-radius:${br}px;border:none;font-weight:700;font-size:1rem;cursor:pointer;font-family:inherit;">${sec.submitLabel||"Invia"}</button></div>`:"";
        const infoHTML=showInfo?`<div>${infoItems}${mapHTML}</div>`:"";
        const grid=showForm&&showInfo?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:72px;margin-top:56px;">${formHTML}${infoHTML}</div>`:showForm?`<div style="max-width:680px;margin-top:56px;">${formHTML}</div>`:`<div style="margin-top:56px;">${infoHTML}</div>`;
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}${grid}`);
      }
      if(sec.type==="locations"){
        const items=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="height:180px;">${MEDIA_ITEM(it,"180px")}</div><div style="padding:28px;"><h3 style="font-weight:700;margin-bottom:18px;font-size:1.05rem;">${it.city||""}</h3><p style="color:#6b7280;margin-bottom:8px;font-size:.9rem;">📍 ${it.address||""}</p><p style="color:#6b7280;margin-bottom:8px;font-size:.9rem;">📞 ${it.phone||""}</p><a href="mailto:${it.email||""}" style="color:${p};font-size:.9rem;font-weight:600;">📧 ${it.email||""}</a></div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="map_section")
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;margin-top:56px;align-items:start;">${sec.mapEmbed?`<iframe src="${sec.mapEmbed}" style="width:100%;height:400px;border:none;border-radius:${br}px;box-shadow:0 4px 30px rgba(0,0,0,.1);" loading="lazy"></iframe>`:`<div style="height:400px;border-radius:${br}px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:.88rem;border:1px dashed #d1d5db;">Incolla URL iframe mappa nelle impostazioni</div>`}<div>${sec.address?`<p style="margin-bottom:18px;color:#374151;font-size:.95rem;">📍 ${sec.address}</p>`:""} ${sec.phone?`<p style="margin-bottom:18px;font-size:.95rem;">📞 ${sec.phone}</p>`:""} ${sec.email?`<p><a href="mailto:${sec.email}" style="color:${p};font-weight:600;font-size:.95rem;">📧 ${sec.email}</a></p>`:""}</div></div>`);
      if(sec.type==="social_links"){
        const items=(sec.items||[]).map(it=>`<a href="${it.url||"#"}" target="_blank" rel="noopener" style="display:flex;gap:18px;align-items:center;background:#fff;border-radius:${br}px;padding:24px 28px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);text-decoration:none;"><div style="width:52px;height:52px;border-radius:14px;background:${grad};display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">${it.icon||""}</div><div><div style="font-weight:700;color:#111827;font-size:1rem;">${it.platform||""}</div><div style="font-size:.85rem;color:#9ca3af;">${it.desc||""}</div></div></a>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:56px;">${items}</div>`);
      }
      // INFO
      if(sec.type==="faq"||sec.type==="faq_two_col"){
        const cols=sec.type==="faq_two_col"?"1fr 1fr":"1fr";
        const items=(sec.items||[]).map(it=>`<div style="border-bottom:1px solid #f3f4f6;"><button onclick="tFaq(this)" style="width:100%;text-align:left;background:none;border:none;padding:22px 0;font-size:1rem;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-family:inherit;color:#111827;gap:12px;">${it.q||""}<span style="width:24px;height:24px;border-radius:50%;background:${p}12;display:flex;align-items:center;justify-content:center;color:${p};font-size:1rem;flex-shrink:0;font-weight:700;">+</span></button><div style="display:none;padding-bottom:22px;color:#6b7280;line-height:1.85;font-size:.95rem;">${it.a||""}</div></div>`).join("");
        return WRAP(sec.id,"#fff",`<div style="max-width:880px;">${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:${cols};gap:0 48px;margin-top:52px;">${items}</div></div>`);
      }
      if(sec.type==="blog_preview"){
        const items=(sec.items||[]).map((it,i)=>`<div class="oc" style="background:#fff;border-radius:${br}px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);opacity:0;transform:translateY(20px);transition:opacity .6s ${i*.08}s,transform .6s ${i*.08}s;"><div style="height:190px;">${MEDIA_ITEM(it,"190px")}</div><div style="padding:24px 28px;"><span style="font-size:.72rem;background:${p}12;color:${p};padding:4px 14px;border-radius:50px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">${it.tag||""}</span><h3 style="font-weight:700;margin:14px 0 10px;font-size:1rem;line-height:1.45;">${it.title||""}</h3><div style="font-size:.8rem;color:#9ca3af;">${it.date||""} · ${it.readTime||""} lettura</div></div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="events"){
        const items=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);display:flex;gap:22px;align-items:center;flex-wrap:wrap;"><div style="width:88px;height:88px;flex-shrink:0;">${MEDIA_ITEM(it,"88px")}</div><div style="flex:1;min-width:160px;"><div style="font-size:.8rem;font-weight:700;color:${p};margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em;">${it.date||""}</div><h3 style="font-weight:700;margin-bottom:8px;font-size:1rem;">${it.title||""}</h3><span style="font-size:.78rem;background:#f3f4f6;color:#6b7280;padding:4px 14px;border-radius:50px;">${it.type||""}</span></div><a href="#contact" style="padding:12px 26px;border-radius:${br}px;background:${grad};color:#fff;text-decoration:none;font-weight:700;font-size:.88rem;white-space:nowrap;">${it.cta||"Iscriviti"}</a></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:flex;flex-direction:column;gap:16px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="integrations"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 16px;background:#fff;border-radius:${br}px;border:1px solid #f0f0f0;"><div style="font-size:2.2rem;">${it.icon||""}</div><div style="font-weight:600;font-size:.85rem;color:#374151;">${it.name||""}</div></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:14px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="download"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;gap:24px;align-items:center;background:#fff;border-radius:${br}px;padding:24px 28px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);"><div style="font-size:2.8rem;flex-shrink:0;">${it.icon||"📄"}</div><div style="flex:1;"><h3 style="font-weight:700;margin-bottom:5px;font-size:1rem;">${it.title||""}</h3><p style="color:#6b7280;font-size:.88rem;margin-bottom:5px;">${it.desc||""}</p><span style="font-size:.75rem;color:#9ca3af;">${it.size||""} · ${it.format||""}</span></div><button onclick="alert('Download demo')" style="background:${grad};color:#fff;border:none;border-radius:${br}px;padding:11px 22px;cursor:pointer;font-weight:700;font-size:.88rem;font-family:inherit;flex-shrink:0;white-space:nowrap;">↓ Scarica</button></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:flex;flex-direction:column;gap:16px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="video_section")
        return`<section id="${sec.id}" style="padding:96px 24px;background:#0a0a14;"><div style="max-width:1200px;margin:0 auto;text-align:center;"><h2 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;color:#fff;margin-bottom:18px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.58);margin-bottom:44px;line-height:1.8;">${sec.subtitle||""}</p><div style="position:relative;padding-bottom:56.25%;border-radius:${br}px;overflow:hidden;box-shadow:0 8px 60px rgba(0,0,0,.5);"><iframe src="${sec.videoUrl||""}" style="position:absolute;inset:0;width:100%;height:100%;border:none;" allowfullscreen></iframe></div></div></section>`;
      if(sec.type==="podcast"){
        const items=(sec.items||[]).map(it=>`<div style="background:#fff;border-radius:${br}px;padding:24px 28px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04);display:flex;gap:20px;align-items:center;"><div style="width:88px;height:88px;flex-shrink:0;">${MEDIA_ITEM(it,"88px")}</div><div style="flex:1;min-width:0;"><div style="font-size:.72rem;font-weight:700;color:${p};margin-bottom:6px;text-transform:uppercase;letter-spacing:.08em;">${it.num||""}</div><h3 style="font-weight:700;margin-bottom:6px;font-size:.98rem;">${it.title||""}</h3><div style="font-size:.82rem;color:#9ca3af;">${it.guest||""} · ${it.duration||""}</div></div><button style="background:${grad};color:#fff;border:none;border-radius:50%;width:48px;height:48px;cursor:pointer;font-size:1.1rem;flex-shrink:0;box-shadow:0 4px 16px ${p}44;">▶</button></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:flex;flex-direction:column;gap:16px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="pricing_faq"){
        const faqs=(sec.faqs||[]).map(it=>`<div style="border-bottom:1px solid #f3f4f6;"><button onclick="tFaq(this)" style="width:100%;text-align:left;background:none;border:none;padding:20px 0;font-size:.95rem;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-family:inherit;color:#111827;gap:12px;">${it.q||""}<span style="color:${p};font-weight:700;">+</span></button><div style="display:none;padding-bottom:20px;color:#6b7280;line-height:1.85;">${it.a||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CT(sec.title||"")}<div style="max-width:720px;margin-top:44px;">${faqs}</div>`);
      }
      // LAYOUT
      if(sec.type==="media_left"||sec.type==="media_right"){
        const isL=sec.type==="media_left";
        const bullets=(sec.bullets||[]).length?`<ul style="list-style:none;margin:28px 0;">${sec.bullets.map(b=>`<li style="display:flex;gap:14px;margin-bottom:14px;"><span style="width:22px;height:22px;border-radius:50%;background:${p}12;display:flex;align-items:center;justify-content:center;color:${p};font-size:.8rem;flex-shrink:0;margin-top:2px;">✓</span><span style="color:#4b5563;line-height:1.7;">${b}</span></li>`).join("")}</ul>`:"";
        const textEl=`<div style="display:flex;flex-direction:column;justify-content:center;">${CL(sec.sectionLabel||"")}<h2 style="font-size:clamp(1.7rem,3.5vw,2.5rem);font-weight:800;margin-bottom:20px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:#6b7280;line-height:1.85;font-size:1rem;">${sec.text||""}</p>${bullets}${sec.cta?`<div>${BTN(sec.cta,sec.cta.label,"primary")}</div>`:""}</div>`;
        const imgEl=`<div style="border-radius:${br}px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,.1);">${MEDIA(sec,"440px")}</div>`;
        return WRAP(sec.id,"#fff",`<div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;">${isL?`${imgEl}${textEl}`:`${textEl}${imgEl}`}</div>`);
      }
      if(sec.type==="two_columns")
        return WRAP(sec.id,"#f9fafb",`<div style="display:grid;grid-template-columns:1fr 1fr;gap:72px;"><div><h3 style="font-weight:800;font-size:1.5rem;margin-bottom:18px;letter-spacing:-.01em;">${sec.leftTitle||""}</h3><p style="color:#6b7280;line-height:1.9;font-size:1rem;">${sec.leftText||""}</p></div><div><h3 style="font-weight:800;font-size:1.5rem;margin-bottom:18px;letter-spacing:-.01em;">${sec.rightTitle||""}</h3><p style="color:#6b7280;line-height:1.9;font-size:1rem;">${sec.rightText||""}</p></div></div>`);
      if(sec.type==="three_columns"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;padding:32px 24px;"><div style="font-size:2.8rem;margin-bottom:18px;">${it.icon||""}</div><h3 style="font-weight:700;margin-bottom:14px;font-size:1.05rem;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.8;font-size:.95rem;">${it.text||""}</p></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:52px;">${items}</div>`);
      }
      if(sec.type==="highlight_band"){
        const bg=sec.bgStyle==="gradient"?grad:p;
        const {href}=resolveLink({href:sec.ctaAnchor||"contact",isAnchor:true});
        return`<section id="${sec.id}" style="padding:52px 24px;background:${bg};"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap;"><p style="color:#fff;font-size:clamp(.95rem,2.5vw,1.2rem);font-weight:700;margin:0;">${sec.text||""}</p><a href="${href}" style="flex-shrink:0;padding:13px 30px;border-radius:${br}px;background:rgba(255,255,255,.15);backdrop-filter:blur(10px);color:#fff;border:1px solid rgba(255,255,255,.35);text-decoration:none;font-weight:700;white-space:nowrap;">${sec.cta||"Scopri di più"}</a></div></section>`;
      }
      if(sec.type==="quote")
        return`<section id="${sec.id}" style="padding:100px 24px;background:#fff;text-align:center;"><div style="max-width:860px;margin:0 auto;"><div style="font-size:7rem;color:${p};font-family:Georgia,serif;line-height:.4;margin-bottom:40px;opacity:.15;">"</div><blockquote style="font-size:clamp(1.3rem,3vw,2.1rem);font-style:italic;color:#111827;line-height:1.7;margin-bottom:36px;font-weight:500;">${sec.quote||""}</blockquote>${sec.showAuthor?`<div style="font-size:.95rem;color:#9ca3af;font-weight:600;">— ${sec.author||""}</div>`:""}</div></section>`;
      if(sec.type==="divider_cta"){
        const {href}=resolveLink(sec.ctaLink||{href:"contact",isAnchor:true});
        return`<section id="${sec.id}" style="padding:60px 24px;background:${grad};"><div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:28px;flex-wrap:wrap;"><h3 style="color:#fff;font-size:clamp(1.2rem,3vw,1.9rem);font-weight:700;margin:0;letter-spacing:-.01em;">${sec.title||""}</h3><a href="${href}" style="padding:14px 36px;border-radius:50px;background:rgba(255,255,255,.18);backdrop-filter:blur(10px);color:#fff;text-decoration:none;font-weight:700;white-space:nowrap;border:1px solid rgba(255,255,255,.3);">${sec.cta||"Inizia ora"} →</a></div></section>`;
      }
      if(sec.type==="icon_grid"){
        const items=(sec.items||[]).map(it=>`<div style="text-align:center;padding:28px 16px;background:#fff;border-radius:${br}px;border:1px solid #f0f0f0;"><div style="width:56px;height:56px;border-radius:14px;background:${grad};display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 14px;">${it.icon||""}</div><div style="font-size:.88rem;font-weight:700;color:#374151;">${it.title||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:14px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="accordion_features"){
        const items=(sec.items||[]).map(it=>`<div style="border:1px solid #f0f0f0;border-radius:${br}px;margin-bottom:12px;overflow:hidden;"><button onclick="tFaq(this)" style="width:100%;text-align:left;background:#fff;border:none;padding:22px 28px;font-size:1rem;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-family:inherit;color:#111827;gap:12px;"><span style="display:flex;gap:16px;align-items:center;">${ICB(it.icon||"✅")}<span>${it.title||""}</span></span><span style="width:24px;height:24px;border-radius:50%;background:${p}12;display:flex;align-items:center;justify-content:center;color:${p};font-weight:700;font-size:1rem;flex-shrink:0;">+</span></button><div style="display:none;padding:0 28px 28px;color:#6b7280;line-height:1.85;font-size:.95rem;">${it.content||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="text_image_alternating"){
        const items=(sec.items||[]).map((it,i)=>`<div style="display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;margin-bottom:72px;">${i%2===0?`<div><h3 style="font-size:1.7rem;font-weight:800;margin-bottom:18px;letter-spacing:-.02em;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.85;font-size:1rem;">${it.text||""}</p></div><div style="border-radius:${br}px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,.1);">${MEDIA(it,"360px")}</div>`:`<div style="border-radius:${br}px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,.1);">${MEDIA(it,"360px")}</div><div><h3 style="font-size:1.7rem;font-weight:800;margin-bottom:18px;letter-spacing:-.02em;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.85;font-size:1rem;">${it.text||""}</p></div>`}</div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="margin-top:60px;">${items}</div>`);
      }
      if(sec.type==="full_image_section"){
        const {href}=resolveLink(sec.ctaLink||{href:"contact",isAnchor:true});
        return`<section id="${sec.id}" style="position:relative;overflow:hidden;min-height:580px;"><div style="position:absolute;inset:0;">${MEDIA(sec,"100%","0")}</div><div style="position:relative;z-index:1;background:rgba(0,0,0,.58);min-height:580px;display:flex;align-items:center;padding:100px 24px;text-align:center;"><div style="max-width:800px;margin:0 auto;"><h2 style="font-size:clamp(2rem,5vw,3.8rem);font-weight:800;color:#fff;margin-bottom:22px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.82);font-size:1.1rem;line-height:1.8;margin-bottom:36px;">${sec.subtitle||""}</p>${sec.cta?`<a href="${href}" style="display:inline-block;padding:14px 36px;border-radius:50px;font-weight:700;background:${grad};color:#fff;text-decoration:none;">${sec.cta}</a>`:""}</div></div></section>`;
      }
      if(sec.type==="ribbon"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;align-items:center;gap:10px;padding:0 36px;border-right:1px solid rgba(255,255,255,.18);"><span style="font-size:1.1rem;">${it.icon||""}</span><span style="font-weight:600;color:#fff;white-space:nowrap;font-size:.9rem;">${it.text||""}</span></div>`).join("");
        return`<section id="${sec.id}" style="background:${grad};padding:22px 24px;overflow:hidden;"><div style="display:flex;flex-wrap:wrap;justify-content:center;">${items}</div></section>`;
      }
      if(sec.type==="split_feature"){
        const items=(sec.items||[]).map((it,i)=>`<div style="display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;margin-bottom:72px;">${i%2===0?`<div>${ICB(it.icon||"💡")}<h3 style="font-size:1.7rem;font-weight:800;margin:22px 0 18px;letter-spacing:-.02em;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.85;">${it.text||""}</p></div><div style="border-radius:${br}px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,.1);">${MEDIA(it,"340px")}</div>`:`<div style="border-radius:${br}px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,.1);">${MEDIA(it,"340px")}</div><div>${ICB(it.icon||"💡")}<h3 style="font-size:1.7rem;font-weight:800;margin:22px 0 18px;letter-spacing:-.02em;">${it.title||""}</h3><p style="color:#6b7280;line-height:1.85;">${it.text||""}</p></div>`}</div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="margin-top:60px;">${items}</div>`);
      }
      if(sec.type==="logo_wall"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 16px;background:#fff;border-radius:${br}px;border:1px solid #f0f0f0;"><div style="font-size:2rem;">${it.icon||""}</div><div style="font-weight:600;font-size:.82rem;color:#6b7280;">${it.name||""}</div></div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;margin-top:52px;">${items}</div>`);
      }
      if(sec.type==="image_text_cta")
        return WRAP(sec.id,"#fff",`<div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;"><div style="border-radius:${br}px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,.1);">${MEDIA(sec,"380px")}</div><div>${CL(sec.sectionLabel||"")}<h2 style="font-size:clamp(1.7rem,3.5vw,2.5rem);font-weight:800;margin-bottom:22px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:#6b7280;line-height:1.85;margin-bottom:36px;font-size:1rem;">${sec.text||""}</p>${BTN(sec.cta,sec.cta?.label,"primary")}</div></div>`);
      // SPECIALE
      if(sec.type==="counter"){
        const {href}=resolveLink(sec.cta||{href:"contact",isAnchor:true});
        return`<section id="${sec.id}" style="padding:100px 24px;background:${grad};text-align:center;"><div style="max-width:700px;margin:0 auto;"><h2 style="font-size:clamp(2rem,5vw,3.2rem);font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.82);margin-bottom:52px;font-size:1.05rem;">${sec.subtitle||""}</p><div id="cd_${sec.id}" style="display:flex;justify-content:center;gap:16px;margin-bottom:52px;"></div><a href="${href}" style="display:inline-block;padding:14px 36px;border-radius:50px;font-weight:700;background:rgba(255,255,255,.18);backdrop-filter:blur(10px);color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.3);">${sec.cta?.label||"Avvisami"}</a></div></section>`;
      }
      if(sec.type==="cookie_notice")
        return`<div id="ck_${sec.id}" style="position:fixed;bottom:0;left:0;right:0;background:#1f2937;color:#fff;padding:18px 28px;z-index:9999;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.08);backdrop-filter:blur(10px);"><p style="margin:0;font-size:.88rem;color:#d1d5db;">${sec.text||""} <a href="${sec.linkUrl||"#"}" style="color:${p};font-weight:600;">${sec.linkText||"Privacy"}</a></p><div style="display:flex;gap:10px;"><button onclick="document.getElementById('ck_${sec.id}').style.display='none'" style="background:transparent;color:#9ca3af;border:1px solid #374151;border-radius:50px;padding:8px 18px;cursor:pointer;font-size:.82rem;font-family:inherit;">${sec.acceptNecessary||"Solo necessari"}</button><button onclick="document.getElementById('ck_${sec.id}').style.display='none'" style="background:${grad};color:#fff;border:none;border-radius:50px;padding:8px 18px;cursor:pointer;font-size:.82rem;font-weight:700;font-family:inherit;">${sec.acceptAll||"Accetta tutti"}</button></div></div>`;
      if(sec.type==="floating_cta"){
        const {href}=resolveLink(sec.ctaLink||{href:"contact",isAnchor:true});
        return`<div style="position:fixed;${sec.position==="left"?"left:24px":"right:24px"};bottom:88px;z-index:990;max-width:230px;background:#fff;border-radius:${br}px;padding:22px;box-shadow:0 8px 48px rgba(0,0,0,.16);border:1px solid #f0f0f0;"><p style="font-size:.9rem;font-weight:700;margin-bottom:8px;color:#111827;">${sec.title||""}</p><p style="font-size:.8rem;color:#9ca3af;margin-bottom:16px;">${sec.subtitle||""}</p><a href="${href}" style="display:block;text-align:center;padding:11px;border-radius:${br}px;background:${grad};color:#fff;text-decoration:none;font-weight:700;font-size:.88rem;">${sec.ctaLink?.label||"Contattaci"}</a></div>`;
      }
      if(sec.type==="comparison_cards"){
        const cards=(sec.items||[]).map(it=>`<div style="border-radius:${br}px;padding:36px 28px;background:#fff;border:${it.highlight?`2px solid ${p}`:"1px solid #f0f0f0"};${it.highlight?`box-shadow:0 8px 60px ${p}22;`:""};position:relative;"><div style="font-size:2.5rem;margin-bottom:16px;">${it.icon||""}</div><h3 style="font-weight:800;margin-bottom:20px;font-size:1.1rem;">${it.name||""}</h3>${it.highlight?`<div style="position:absolute;top:-14px;right:24px;background:${grad};color:#fff;padding:4px 16px;border-radius:50px;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Consigliato</div>`:""}<div style="margin-bottom:16px;"><div style="font-size:.78rem;font-weight:700;color:#059669;margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">✓ Pro</div>${(it.pros||[]).map(p=>`<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start;"><span style="color:#059669;font-size:.9rem;flex-shrink:0;">✓</span><span style="font-size:.9rem;color:#374151;">${p}</span></div>`).join("")}</div>${(it.cons||[]).length?`<div><div style="font-size:.78rem;font-weight:700;color:#dc2626;margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">✗ Contro</div>${it.cons.map(c=>`<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start;"><span style="color:#dc2626;font-size:.9rem;flex-shrink:0;">✗</span><span style="font-size:.9rem;color:#9ca3af;">${c}</span></div>`).join("")}</div>`:""}</div>`).join("");
        return WRAP(sec.id,"#f9fafb",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-top:56px;">${cards}</div>`);
      }
      if(sec.type==="clients_logos"){
        const items=(sec.items||[]).map(it=>`<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 16px;background:#fff;border-radius:${br}px;border:1px solid #f0f0f0;"><div style="font-size:2rem;">${it.icon||""}</div><div style="font-weight:600;font-size:.82rem;color:#6b7280;">${it.name||""}</div></div>`).join("");
        return WRAP(sec.id,"#fff",`${CL(sec.sectionLabel||"")}${CT(sec.title||"")}${CS(sec.subtitle||"")}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;margin-top:56px;">${items}</div>`);
      }
      if(sec.type==="impact_section"){
        const stats=(sec.stats||[]).map(s=>`<div style="text-align:center;"><div style="font-size:2.4rem;font-weight:800;color:#fff;letter-spacing:-.03em;">${s.num||""}</div><div style="font-size:.82rem;color:rgba(255,255,255,.65);margin-top:6px;">${s.label||""}</div></div>`).join("");
        const {href}=resolveLink(sec.cta||{href:"about",isAnchor:true});
        return`<section id="${sec.id}" style="padding:100px 24px;background:${grad};"><div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;"><div><div style="font-size:.75rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:18px;">${sec.sectionLabel||""}</div><h2 style="font-size:clamp(2rem,4vw,3rem);font-weight:800;color:#fff;margin-bottom:22px;letter-spacing:-.02em;">${sec.title||""}</h2><p style="color:rgba(255,255,255,.82);font-size:1rem;margin-bottom:16px;line-height:1.8;">${sec.subtitle||""}</p><p style="color:rgba(255,255,255,.7);line-height:1.85;margin-bottom:36px;">${sec.text||""}</p><a href="${href}" style="display:inline-block;padding:14px 36px;border-radius:50px;font-weight:700;background:rgba(255,255,255,.2);backdrop-filter:blur(10px);color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.35);">${sec.cta?.label||"Scopri di più"}</a></div><div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:36px;">${stats}</div><div style="border-radius:${br}px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,.2);">${MEDIA(sec,"280px")}</div></div></div></section>`;
      }
    }catch(e){
      return`<section id="${sec.id}" style="padding:60px 24px;background:#fff;"><div style="max-width:1200px;margin:0 auto;padding:24px;background:#fef2f2;border-radius:10px;border-left:4px solid #ef4444;"><h2 style="color:#dc2626;font-size:1rem;">Errore: ${sec.label||sec.type}</h2><p style="color:#6b7280;font-size:.88rem;">${e.message}</p></div></section>`;
    }
    return`<section id="${sec.id}" style="padding:80px 24px;background:#fff;"><div style="max-width:1200px;margin:0 auto;text-align:center;"><h2 style="color:#9ca3af;">${sec.label||sec.type}</h2></div></section>`;
  };

  // AUTO NAVBAR LINKS from visible sections — tutti, nessun limite
  const SKIP_TYPES=new Set(["cookie_notice","floating_cta","ribbon","brands_ticker","trust_badges","stats_banner","counter","newsletter","waitlist"]);
  const navSections=vis.filter(s=>!SKIP_TYPES.has(s.type));
  const autoNavLinks=nav.autoLinks
    ? navSections.map(s=>`<li><a href="#${s.id}" onclick="closeMob()">${s.label||s.type}</a></li>`).join("")
    : (nav.links||[]).map(l=>{
        const{href}=resolveLink({href:l.anchor||l.href||"",isAnchor:!!l.anchor});
        return`<li><a href="${href}" onclick="closeMob()">${l.label||""}</a></li>`;
      }).join("");
  const mobLinks=nav.autoLinks
    ? navSections.map(s=>`<a href="#${s.id}" onclick="closeMob()">${s.label||s.type}</a>`).join("")
    : (nav.links||[]).map(l=>{
        const{href}=resolveLink({href:l.anchor||l.href||"",isAnchor:!!l.anchor});
        return`<a href="${href}" onclick="closeMob()">${l.label||""}</a>`;
      }).join("");

  const ctaHref=nav.ctaAnchor
    ? `#${vis.find(s=>s.type===nav.ctaAnchor||s.id===nav.ctaAnchor)?.id||nav.ctaAnchor}`
    : "#contact";

  const logoEl=nav.logoImage?`<img src="${nav.logoImage}" alt="logo" style="height:46px;object-fit:contain;">`:`<span style="font-weight:800;font-size:1.25rem;letter-spacing:-.02em;background:${grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${nav.logoText||g.siteName}</span>`;

  const countdownJS=vis.filter(s=>s.type==="counter").map(sec=>`(function(){var el=document.getElementById('cd_${sec.id}');if(!el)return;var target=new Date("${sec.targetDate||"2025-12-31"}");function upd(){var now=new Date(),diff=target-now;if(diff<=0){el.innerHTML='<span style="color:#fff;font-size:1.5rem;font-weight:700;">Siamo live!</span>';return;}var d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);el.innerHTML=[['Giorni',d],['Ore',h],['Minuti',m],['Secondi',s]].map(function(x){return '<div style="background:rgba(255,255,255,.18);border-radius:12px;padding:18px 22px;min-width:88px;text-align:center;"><div style="font-size:2.4rem;font-weight:800;color:#fff;letter-spacing:-.03em;">'+x[1]+'</div><div style="font-size:.72rem;color:rgba(255,255,255,.7);margin-top:6px;text-transform:uppercase;letter-spacing:.1em;">'+x[0]+'</div></div>';}).join('');}upd();setInterval(upd,1000);})();`).join("\n");

  return`<!DOCTYPE html>
<html lang="${g.language||"it"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${g.siteName||"Sito Web"}</title>
<meta name="description" content="${g.tagline||""}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${(g.fontFamily||"Inter").replace(/ /g,"+")}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:'${g.fontFamily||"Inter"}',system-ui,sans-serif;color:#111827;background:#fff;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
nav{position:${nav.sticky?"fixed":"relative"};top:0;left:0;right:0;z-index:998;background:rgba(255,255,255,${(nav.bgOpacity||97)/100});backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(0,0,0,.06);transition:box-shadow .3s,background .3s;}
nav.sc{box-shadow:0 1px 3px rgba(0,0,0,.05),0 8px 40px rgba(0,0,0,.08);}
.ni{max-width:1200px;margin:0 auto;padding:0 32px;height:${nav.height||68}px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.nl{display:flex;gap:32px;list-style:none;align-items:center;}
.nl a{text-decoration:none;color:#374151;font-weight:500;font-size:.9rem;transition:color .2s;letter-spacing:.01em;}
.nl a:hover{color:${p};}
.nc{background:${grad};color:#fff!important;padding:9px 24px;border-radius:50px;font-weight:700!important;font-size:.88rem!important;letter-spacing:.01em!important;transition:opacity .2s!important;}
.nc:hover{opacity:.88!important;}
.hb{display:none;flex-direction:column;justify-content:center;gap:5px;cursor:pointer;background:none;border:none;padding:6px;width:38px;height:38px;flex-shrink:0;}
.hb span{display:block;width:22px;height:2px;background:#374151;border-radius:2px;transition:all .3s;}
.hb.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.hb.open span:nth-child(2){opacity:0;transform:scaleX(0);}
.hb.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
.mob{display:none;position:fixed;top:${nav.height||68}px;left:0;right:0;background:rgba(255,255,255,.98);backdrop-filter:blur(16px);border-bottom:1px solid #f3f4f6;box-shadow:0 8px 40px rgba(0,0,0,.1);z-index:997;flex-direction:column;padding:8px 0;max-height:calc(100vh - ${nav.height||68}px);overflow-y:auto;}
.mob.open{display:flex;}
.mob a{padding:14px 32px;text-decoration:none;color:#374151;font-weight:500;font-size:.95rem;border-bottom:1px solid #f9fafb;transition:background .15s,color .15s;}
.mob a:hover{background:#f9fafb;color:${p};}
.mob-cta{margin:12px 24px 8px;display:block;text-align:center;padding:13px;border-radius:50px;background:${grad};color:#fff!important;font-weight:700!important;text-decoration:none;border:none!important;font-size:.9rem!important;}
.oc.visible{opacity:1!important;transform:translateY(0)!important;}
footer{background:${ftr.bgColor||"#111827"};color:${ftr.textColor||"#9ca3af"};text-align:center;padding:44px 24px;font-size:.88rem;}
footer a{color:${p};text-decoration:none;font-weight:600;}
@media(max-width:900px){.nl{display:none;}.hb{display:flex;}}
@media(max-width:768px){[style*="grid-template-columns:1fr 1fr"]{grid-template-columns:1fr!important;}[style*="grid-template-columns:repeat(3"]{grid-template-columns:1fr!important;}[style*="columns:3"]{columns:1!important;}}
</style>
</head>
<body>
<nav id="nav"><div class="ni">${logoEl}<ul class="nl">${autoNavLinks}${nav.ctaLabel?`<li><a href="${ctaHref}" class="nc">${nav.ctaLabel}</a></li>`:""}</ul><button class="hb" id="hb" aria-label="Apri menu" aria-expanded="false"><span></span><span></span><span></span></button></div></nav>
<div class="mob" id="mob">${mobLinks}${nav.ctaLabel?`<a href="${ctaHref}" class="mob-cta" onclick="closeMob()">${nav.ctaLabel}</a>`:""}</div>
${vis.map(renderSection).join("\n")}
<footer><p>© ${new Date().getFullYear()} <strong>${g.siteName||""}</strong> · ${ftr.text||"Tutti i diritti riservati."}${ftr.showScrollTop?` · <a href="#">↑ Torna su</a>`:""}</p></footer>
<script>
var hb=document.getElementById('hb'),mob=document.getElementById('mob');
function closeMob(){hb.classList.remove('open');mob.classList.remove('open');hb.setAttribute('aria-expanded','false');}
hb.addEventListener('click',function(){var op=mob.classList.toggle('open');hb.classList.toggle('open',op);hb.setAttribute('aria-expanded',String(op));});
document.addEventListener('click',function(e){if(!hb.contains(e.target)&&!mob.contains(e.target))closeMob();});
window.addEventListener('scroll',function(){document.getElementById('nav').classList.toggle('sc',window.scrollY>10);if(mob.classList.contains('open'))closeMob();},{passive:true});
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.06});
document.querySelectorAll('.oc').forEach(function(el){obs.observe(el);});
function tFaq(b){var a=b.nextElementSibling,ic=b.querySelector('span:last-child'),op=a.style.display!=='none'&&a.style.display!=='';a.style.display=op?'none':'block';if(ic)ic.textContent=op?'+':'−';}
function sTab(btn,idx,prefix){var tabs=btn.parentElement.querySelectorAll('button');tabs.forEach(function(t,i){t.style.borderBottomColor=i===idx?'${p}':"#e5e7eb";t.style.color=i===idx?'${p}':"#6b7280";t.style.fontWeight=i===idx?'700':'500';var panel=document.getElementById(prefix+'_'+i);if(panel)panel.style.display=i===idx?'grid':'none';});}
${countdownJS}
</script>
</body>
</html>`;
}

// ═══════════════════════════════════════════
// UI ATOMS
// ═══════════════════════════════════════════
const LS={fontSize:11,fontWeight:600,color:"#6b7280",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.07em",display:"block"};
const IS={width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",background:"#fff",color:"#111",fontFamily:"inherit",boxSizing:"border-box"};
const CS2s={background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px",marginBottom:12};

const F=memo(({label,value,onChange,placeholder,type="text"})=><div style={{marginBottom:14}}>{label&&<label style={LS}>{label}</label>}<input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} style={IS}/></div>);
const TA=memo(({label,value,onChange,rows=3})=><div style={{marginBottom:14}}>{label&&<label style={LS}>{label}</label>}<textarea value={value||""} onChange={e=>onChange(e.target.value)} rows={rows} style={{...IS,resize:"vertical"}}/></div>);

function Toggle({label,value,onChange}){
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,padding:"4px 0"}}>
    <span style={{fontSize:13,color:"#374151"}}>{label}</span>
    <div onClick={()=>onChange(!value)} style={{width:40,height:22,borderRadius:11,background:value?"#4f46e5":"#d1d5db",cursor:"pointer",position:"relative",flexShrink:0,transition:"background .2s"}}>
      <div style={{position:"absolute",top:3,left:value?20:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
    </div>
  </div>;
}
function AddBtn({onClick,label}){return <button onClick={onClick} style={{width:"100%",background:"transparent",border:"1px dashed #d1d5db",borderRadius:8,padding:"9px",cursor:"pointer",fontSize:12,color:"#9ca3af",marginTop:8,fontFamily:"inherit"}}>+ {label}</button>;}
function RemBtn({onClick}){return <button onClick={onClick} style={{background:"#fef2f2",color:"#ef4444",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>✕</button>;}

function ImgUp({label,value,onChange}){
  const ref=useRef();
  const load=()=>{const f=ref.current?.files?.[0];if(!f)return;const r=new FileReader();r.onload=e=>onChange(e.target.result);r.readAsDataURL(f);};
  return <div style={{marginBottom:14}}>
    {label&&<label style={LS}>{label}</label>}
    <input ref={ref} type="file" accept="image/*" onChange={load} style={{display:"none"}}/>
    <button onClick={()=>ref.current?.click()} style={{...IS,cursor:"pointer",textAlign:"left",background:"#f9fafb",display:"block",color:"#6b7280"}}>
      {value?"✓ Immagine caricata — clicca per cambiare":"↑ Carica immagine"}
    </button>
    {value&&<img src={value} alt="" style={{marginTop:6,borderRadius:8,border:"1px solid #e5e7eb",maxHeight:80,maxWidth:"100%",objectFit:"cover"}}/>}
  </div>;
}

function EmojiPicker({value,onChange}){
  const [grp,setGrp]=useState(Object.keys(ICON_GROUPS)[0]);
  return <div>
    <select value={grp} onChange={e=>setGrp(e.target.value)} style={{...IS,marginBottom:8}}>
      {Object.keys(ICON_GROUPS).map(g=><option key={g}>{g}</option>)}
    </select>
    <div style={{display:"flex",flexWrap:"wrap",gap:3,maxHeight:110,overflowY:"auto",padding:6,border:"1px solid #e5e7eb",borderRadius:8,marginBottom:8}}>
      {(ICON_GROUPS[grp]||[]).map(ic=><button key={ic} onClick={()=>onChange(ic)} title={ic} style={{fontSize:15,background:value===ic?"#eef2ff":"transparent",border:value===ic?"1.5px solid #4f46e5":"1px solid transparent",borderRadius:6,width:32,height:32,cursor:"pointer"}}>{ic}</button>)}
    </div>
    <input value={value||""} onChange={e=>onChange(e.target.value)} placeholder="O digita emoji/simbolo" style={{...IS,fontSize:13}}/>
  </div>;
}

function MediaBlockEditor({label="Immagine / Emoji",obj,onChange}){
  const s=(k,v)=>onChange({...obj,[k]:v});
  return <div style={{marginBottom:16,padding:"12px",background:"#f8f9ff",borderRadius:10,border:"1px solid #e0e7ff"}}>
    {label&&<label style={{...LS,marginBottom:8}}>{label}</label>}
    <div style={{display:"flex",gap:6,marginBottom:10}}>
      <button onClick={()=>s("useImage",false)} style={{flex:1,padding:"7px",borderRadius:7,border:"1px solid #e5e7eb",background:!obj?.useImage?"#eef2ff":"#fff",color:!obj?.useImage?"#4f46e5":"#6b7280",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:!obj?.useImage?700:400}}>🎭 Emoji</button>
      <button onClick={()=>s("useImage",true)} style={{flex:1,padding:"7px",borderRadius:7,border:"1px solid #e5e7eb",background:obj?.useImage?"#eef2ff":"#fff",color:obj?.useImage?"#4f46e5":"#6b7280",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:obj?.useImage?700:400}}>🖼️ Immagine</button>
    </div>
    {!obj?.useImage
      ? <EmojiPicker value={obj?.emoji||""} onChange={v=>s("emoji",v)}/>
      : <><ImgUp value={obj?.image} onChange={v=>s("image",v)}/>{!obj?.image&&<p style={{fontSize:11,color:"#9ca3af"}}>Carica un'immagine sopra</p>}</>
    }
  </div>;
}

// Link editor component
function LinkEditor({label,value,onChange}){
  const v=value||{label:"",href:"",isAnchor:true};
  const s=(k,val)=>onChange({...v,[k]:val});
  return <div style={{marginBottom:14}}>
    {label&&<label style={LS}>{label}</label>}
    <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:10,padding:"10px 12px"}}>
      <F label="Testo pulsante" value={v.label||""} onChange={val=>s("label",val)}/>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        <button onClick={()=>s("isAnchor",true)} style={{flex:1,padding:"6px",borderRadius:6,border:`1px solid ${v.isAnchor?"#4f46e5":"#e5e7eb"}`,background:v.isAnchor?"#eef2ff":"#fff",color:v.isAnchor?"#4f46e5":"#6b7280",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:v.isAnchor?700:400}}>⚓ Sezione</button>
        <button onClick={()=>s("isAnchor",false)} style={{flex:1,padding:"6px",borderRadius:6,border:`1px solid ${!v.isAnchor?"#4f46e5":"#e5e7eb"}`,background:!v.isAnchor?"#eef2ff":"#fff",color:!v.isAnchor?"#4f46e5":"#6b7280",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:!v.isAnchor?700:400}}>🔗 URL esterno</button>
      </div>
      <input value={v.href||""} onChange={e=>s("href",e.target.value)} placeholder={v.isAnchor?"ID sezione (es. contact, services)":"https://..."}  style={IS}/>
    </div>
  </div>;
}

function ItemsList({k,fields,addTpl,addLabel,showMedia,sec,onChange}){
  if(!sec||!onChange)return null;
  const s=v=>onChange({...sec,[k]:v});
  return <>
    {(sec[k]||[]).map((it,i)=><div key={i} style={CS2s}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:11,fontWeight:600,color:"#6b7280"}}>#{i+1}</span>
        <RemBtn onClick={()=>s((sec[k]||[]).filter((_,j)=>j!==i))}/>
      </div>
      {(fields||[]).map(f=>{
        if(f.type==="toggle")return <Toggle key={f.key} label={f.label} value={!!it[f.key]} onChange={v=>{const a=[...(sec[k]||[])];a[i]={...a[i],[f.key]:v};s(a);}}/>;
        if(f.type==="textarea")return <TA key={f.key} label={f.label} rows={f.rows||2} value={it[f.key]||""} onChange={v=>{const a=[...(sec[k]||[])];a[i]={...a[i],[f.key]:v};s(a);}}/>;
        if(f.type==="link")return <LinkEditor key={f.key} label={f.label} value={it[f.key]} onChange={v=>{const a=[...(sec[k]||[])];a[i]={...a[i],[f.key]:v};s(a);}}/>;
        return <F key={f.key} label={f.label} value={it[f.key]||""} onChange={v=>{const a=[...(sec[k]||[])];a[i]={...a[i],[f.key]:v};s(a);}}/>;
      })}
      {showMedia&&<MediaBlockEditor label="Immagine / Emoji" obj={it} onChange={obj=>{const a=[...(sec[k]||[])];a[i]={...a[i],...obj};s(a);}}/>}
    </div>)}
    <AddBtn onClick={()=>s([...(sec[k]||[]),{...addTpl}])} label={addLabel||"Aggiungi"}/>
  </>;
}

function ContactEditor({sec,onChange}){
  const s=(k,v)=>onChange({...sec,[k]:v});
  const MODES=[["both","Form + Contatti"],["form","Solo form"],["info","Solo contatti"]];
  return <>
    <F label="Etichetta sezione" value={sec.sectionLabel||""} onChange={v=>s("sectionLabel",v)}/>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)} rows={2}/>
    <div style={{marginBottom:16}}>
      <label style={LS}>Modalità</label>
      <div style={{display:"flex",gap:6}}>{MODES.map(([val,lbl])=><button key={val} onClick={()=>s("contactMode",val)} style={{flex:1,padding:"8px 4px",borderRadius:8,border:`1.5px solid ${sec.contactMode===val?"#4f46e5":"#e5e7eb"}`,background:sec.contactMode===val?"#eef2ff":"#fff",color:sec.contactMode===val?"#4f46e5":"#6b7280",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:sec.contactMode===val?700:400}}>{lbl}</button>)}</div>
    </div>
    {(sec.contactMode==="info"||sec.contactMode==="both"||!sec.contactMode)&&<>
      <div style={{marginBottom:8,paddingBottom:6,borderBottom:"1px solid #f0f0f0"}}><span style={{fontSize:12,fontWeight:700,color:"#374151"}}>📍 Recapiti</span></div>
      {[["email","Email"],["phone","Telefono"],["mobile","Cellulare"],["address","Indirizzo"],["whatsapp","WhatsApp"],["linkedin","LinkedIn URL"],["instagram","Instagram URL"]].map(([k,l])=><F key={k} label={l} value={sec[k]||""} onChange={v=>s(k,v)}/>)}
      <div style={{marginTop:4,padding:"12px 14px",background:"#f8f9ff",borderRadius:10,marginBottom:14}}>
        <Toggle label="Includi mappa Google Maps" value={!!sec.showMap} onChange={v=>s("showMap",v)}/>
        {sec.showMap&&<><TA label="URL iframe mappa (src='...')" value={sec.mapEmbed||""} onChange={v=>s("mapEmbed",v)} rows={3}/>{sec.mapEmbed&&<iframe src={sec.mapEmbed} width="100%" height="140" style={{border:"none",borderRadius:8,marginTop:4}} title="Anteprima mappa"/>}</>}
      </div>
    </>}
    {(sec.contactMode==="form"||sec.contactMode==="both"||!sec.contactMode)&&<>
      <div style={{marginBottom:8,paddingBottom:6,borderBottom:"1px solid #f0f0f0",marginTop:8}}><span style={{fontSize:12,fontWeight:700,color:"#374151"}}>📝 Form</span></div>
      <F label="Testo pulsante" value={sec.submitLabel||""} onChange={v=>s("submitLabel",v)}/>
      <F label="Messaggio conferma" value={sec.submitMessage||""} onChange={v=>s("submitMessage",v)}/>
      <label style={{...LS,marginBottom:8}}>Campi del form</label>
      {(sec.formFields||[]).map((f,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:8}}><input value={f} onChange={e=>{const a=[...(sec.formFields||[])];a[i]=e.target.value;s("formFields",a);}} style={IS}/><RemBtn onClick={()=>s("formFields",(sec.formFields||[]).filter((_,j)=>j!==i))}/></div>)}
      <AddBtn onClick={()=>s("formFields",[...(sec.formFields||[]),"Campo"])} label="Aggiungi campo"/>
    </>}
  </>;
}

// ═══════════════════════════════════════════
// SECTION EDITOR
// ═══════════════════════════════════════════
function SectionEditor({sec,onChange}){
  const s=useCallback((k,v)=>onChange({...sec,[k]:v}),[sec,onChange]);
  const IL=(k,fields,addTpl,addLabel,showMedia)=><ItemsList k={k} fields={fields} addTpl={addTpl} addLabel={addLabel} showMedia={showMedia} sec={sec} onChange={onChange}/>;
  const CH=()=><><F label="Etichetta sezione" value={sec.sectionLabel||""} onChange={v=>s("sectionLabel",v)}/><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/><F label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)}/></>;

  if(sec.type==="contact")return <ContactEditor sec={sec} onChange={onChange}/>;

  const heroTypes=["hero","hero_minimal","hero_split","hero_dark","hero_centered_image","hero_announcement","hero_video","hero_services"];
  if(heroTypes.includes(sec.type))return <>
    <F label="Titolo principale" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)} rows={3}/>
    {sec.type==="hero_announcement"&&<><F label="Testo badge annuncio" value={sec.announcementText||""} onChange={v=>s("announcementText",v)}/><F label="Link annuncio" value={sec.announcementLink||""} onChange={v=>s("announcementLink",v)}/></>}
    {["hero","hero_split","hero_dark","hero_centered_image"].includes(sec.type)&&<MediaBlockEditor label="Sfondo / Immagine principale" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>}
    {sec.type==="hero"&&sec.useImage&&sec.image&&<div style={{marginBottom:14}}><label style={LS}>Opacità overlay: {sec.overlayOpacity||55}%</label><input type="range" min="0" max="90" value={sec.overlayOpacity||55} onChange={e=>s("overlayOpacity",+e.target.value)} style={{width:"100%"}}/></div>}
    {["hero_minimal","hero_announcement","hero_dark","hero_video"].includes(sec.type)&&<F label="Colore sfondo" value={sec.bgColor||"#0a0a14"} onChange={v=>s("bgColor",v)}/>}
    <LinkEditor label="Pulsante CTA principale" value={sec.cta1} onChange={v=>s("cta1",v)}/>
    {sec.showCta2!==undefined&&<><Toggle label="Secondo pulsante" value={!!sec.showCta2} onChange={v=>s("showCta2",v)}/>{sec.showCta2&&<LinkEditor label="Secondo pulsante" value={sec.cta2} onChange={v=>s("cta2",v)}/>}</>}
    {sec.type==="hero_services"&&IL("services",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"}],{icon:"⭐",title:"Servizio"},"Aggiungi servizio")}
  </>;

  if(sec.type==="about")return <>
    <F label="Etichetta" value={sec.sectionLabel||""} onChange={v=>s("sectionLabel",v)}/>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Testo" value={sec.text||""} onChange={v=>s("text",v)} rows={5}/>
    <Toggle label="Mostra immagine" value={!!sec.showImage} onChange={v=>s("showImage",v)}/>
    {sec.showImage&&<MediaBlockEditor label="Immagine laterale" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>}
    <Toggle label="Statistiche" value={!!sec.showStats} onChange={v=>s("showStats",v)}/>
    {sec.showStats&&IL("stats",[{key:"num",label:"Numero"},{key:"label",label:"Etichetta"}],{num:"0",label:"Stat"},"Aggiungi stat")}
  </>;

  if(["about_cards","mission","culture","guarantee","features","services_icons","integrations","three_columns","icon_grid","why_us"].includes(sec.type))return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"},{key:"text",label:"Testo",type:"textarea"}].filter(f=>sec.items&&sec.items[0]&&(f.key in sec.items[0]||f.key==="icon")),sec.items?.[0]||{icon:"⭐",title:"Titolo"},"Aggiungi elemento")}</>;

  if(["about_image_full","full_image_section"].includes(sec.type))return <>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)} rows={2}/>
    <LinkEditor label="Pulsante CTA" value={sec.ctaLink} onChange={v=>s("ctaLink",v)}/>
    <MediaBlockEditor label="Immagine di sfondo" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>
  </>;

  if(sec.type==="founders")return <><CH/>{IL("items",[{key:"name",label:"Nome"},{key:"role",label:"Ruolo"},{key:"bio",label:"Bio",type:"textarea"}],{name:"Nome",role:"Ruolo",bio:"",...mediaDef("👤")},"Aggiungi fondatore",true)}</>;
  if(sec.type==="company_numbers")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"num",label:"Valore"},{key:"label",label:"Etichetta"},{key:"desc",label:"Descrizione",type:"textarea"}],{icon:"📊",num:"0",label:"Label",desc:""},"Aggiungi numero")}</>;
  if(sec.type==="history"||sec.type==="timeline")return <><CH/>{IL("items",[{key:"year",label:"Anno"},{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"}],{year:"2024",title:"Evento",desc:"",...mediaDef("⭐")},"Aggiungi tappa",true)}</>;
  if(sec.type==="manifesto")return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/><TA label="Testo (separa paragrafi con riga vuota)" value={sec.text||""} onChange={v=>s("text",v)} rows={8}/><F label="Firma" value={sec.author||""} onChange={v=>s("author",v)}/></>;
  if(sec.type==="culture")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"}],{icon:"⭐",title:"Valore",desc:""},"Aggiungi valore")}</>;
  if(sec.type==="services")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"}],{icon:"✨",title:"Servizio",desc:""},"Aggiungi servizio")}</>;
  if(sec.type==="services_list")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"},{key:"detail",label:"Dettaglio tecnico"}],{icon:"💻",title:"Servizio",desc:"",detail:""},"Aggiungi servizio")}</>;
  if(sec.type==="services_with_image")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"}],{icon:"✨",title:"Servizio",desc:"",...mediaDef("🔷")},"Aggiungi servizio",true)}</>;
  if(sec.type==="offering")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"text",label:"Testo",type:"textarea"}],{icon:"⭐",title:"Pilastro",text:"",...mediaDef("⭐")},"Aggiungi pilastro",true)}</>;
  if(sec.type==="services_tabs")return <>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    {(sec.tabs||[]).map((t,i)=><div key={i} style={CS2s}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:11,fontWeight:600,color:"#6b7280"}}>Tab {i+1}</span><RemBtn onClick={()=>s("tabs",(sec.tabs||[]).filter((_,j)=>j!==i))}/></div>
      <div style={{display:"grid",gridTemplateColumns:"48px 1fr",gap:8,marginBottom:8}}><input value={t.icon||""} onChange={e=>{const a=[...(sec.tabs||[])];a[i]={...a[i],icon:e.target.value};s("tabs",a);}} style={IS}/><input value={t.label||""} onChange={e=>{const a=[...(sec.tabs||[])];a[i]={...a[i],label:e.target.value};s("tabs",a);}} placeholder="Etichetta" style={IS}/></div>
      <F value={t.title||""} onChange={v=>{const a=[...(sec.tabs||[])];a[i]={...a[i],title:v};s("tabs",a);}} placeholder="Titolo contenuto"/>
      <TA value={t.text||""} onChange={v=>{const a=[...(sec.tabs||[])];a[i]={...a[i],text:v};s("tabs",a);}} rows={2}/>
      <MediaBlockEditor label="Immagine / Emoji tab" obj={t} onChange={obj=>{const a=[...(sec.tabs||[])];a[i]={...a[i],...obj};s("tabs",a);}}/>
    </div>)}
    <AddBtn onClick={()=>s("tabs",[...(sec.tabs||[]),{label:"Tab",icon:"📌",title:"Titolo",text:"Testo.",...mediaDef("🔷")}])} label="Aggiungi tab"/>
  </>;
  if(sec.type==="process"||sec.type==="process_dark")return <><CH/>{IL("items",[{key:"num",label:"Numero"},{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"}],{num:"01",title:"Step",desc:""},"Aggiungi step")}</>;
  if(sec.type==="steps_numbered")return <><CH/>{IL("items",[{key:"num",label:"Numero"},{key:"title",label:"Titolo"},{key:"text",label:"Testo",type:"textarea"}],{num:"01",title:"Step",text:""},"Aggiungi step")}</>;
  if(sec.type==="checklist")return <>
    <CH/>
    <label style={{...LS,marginBottom:8}}>✓ Incluso</label>
    {IL("included",[{key:"text",label:"Voce"}],{text:""},"Aggiungi voce inclusa")}
    <label style={{...LS,marginBottom:8,marginTop:8}}>✗ Non incluso</label>
    {IL("excluded",[{key:"text",label:"Voce"}],{text:""},"Aggiungi voce esclusa")}
  </>;
  if(["numbers","numbers_minimal","stats_banner"].includes(sec.type))return <>
    {sec.title!==undefined&&<F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>}
    {IL("items",[{key:"icon",label:"Icona"},{key:"num",label:"Valore"},{key:"label",label:"Etichetta"}].filter(f=>!sec.items||!sec.items[0]||(f.key in sec.items[0])),sec.items?.[0]||{num:"0",label:"Label"},"Aggiungi numero")}
  </>;
  if(sec.type==="results")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"metric",label:"Valore"},{key:"label",label:"Etichetta"},{key:"period",label:"Periodo"}],{icon:"📈",metric:"+0%",label:"Label",period:""},"Aggiungi risultato")}</>;
  if(sec.type==="before_after")return <><CH/>{IL("items",[{key:"title",label:"Titolo"},{key:"metric",label:"Metrica"},{key:"before",label:"Prima"},{key:"after",label:"Dopo"}],{title:"Progetto",metric:"Metrica",before:"0",after:"0"},"Aggiungi confronto")}</>;
  if(sec.type==="comparison")return <>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}><F label="Opzione A (noi)" value={sec.optionA||""} onChange={v=>s("optionA",v)}/><F label="Opzione B" value={sec.optionB||""} onChange={v=>s("optionB",v)}/></div>
    {IL("rows",[{key:"feature",label:"Feature"},{type:"toggle",key:"a",label:"A ✓"},{type:"toggle",key:"b",label:"B ✓"}],{feature:"Feature",a:true,b:false},"Aggiungi riga")}
  </>;
  if(sec.type==="progress_bars")return <><CH/>{IL("items",[{key:"skill",label:"Competenza"},{key:"value",label:"Valore % (0-100)"}],{skill:"Skill",value:80},"Aggiungi competenza")}</>;
  if(sec.type==="kpi_cards")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"value",label:"Valore"},{key:"label",label:"Etichetta"},{key:"trend",label:"Trend"},{type:"toggle",key:"up",label:"Trend positivo"}],{icon:"📊",value:"0",label:"KPI",trend:"+0%",up:true},"Aggiungi KPI")}</>;
  if(sec.type==="company_numbers")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"num",label:"Numero"},{key:"label",label:"Etichetta"},{key:"desc",label:"Descrizione",type:"textarea"}],{icon:"📊",num:"0",label:"Label",desc:""},"Aggiungi numero")}</>;
  if(sec.type==="portfolio")return <><CH/>{IL("items",[{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"},{key:"tag",label:"Tag"}],{title:"Progetto",desc:"",tag:"",...mediaDef("🔷")},"Aggiungi progetto",true)}</>;
  if(sec.type==="portfolio_list")return <><CH/>{IL("items",[{key:"title",label:"Titolo"},{key:"category",label:"Categoria"},{key:"result",label:"Risultato"},{key:"period",label:"Periodo"},{key:"desc",label:"Descrizione",type:"textarea"}],{title:"Progetto",category:"",result:"",period:"",desc:"",...mediaDef("📌")},"Aggiungi progetto",true)}</>;
  if(sec.type==="case_study")return <>
    <CH/>
    <MediaBlockEditor label="Cover" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>
    <TA label="La sfida" value={sec.challenge||""} onChange={v=>s("challenge",v)} rows={3}/>
    <TA label="La soluzione" value={sec.solution||""} onChange={v=>s("solution",v)} rows={3}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{[1,2,3].map(n=><div key={n} style={CS2s}><F label={`Risultato ${n}`} value={sec[`result${n}`]?.num||""} onChange={v=>s(`result${n}`,{...sec[`result${n}`],num:v})}/><F label="Label" value={sec[`result${n}`]?.label||""} onChange={v=>s(`result${n}`,{...sec[`result${n}`],label:v})}/></div>)}</div>
  </>;
  if(["gallery_grid","image_gallery_masonry"].includes(sec.type))return <><CH/>{IL("items",[{key:"caption",label:"Didascalia"}],{...mediaDef("🖼️"),caption:""},"Aggiungi immagine",true)}</>;
  if(sec.type==="project_showcase")return <>
    <CH/><MediaBlockEditor label="Immagine" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{[1,2,3].map(n=><div key={n} style={CS2s}><F label={`Metrica ${n}`} value={sec[`metric${n}`]?.num||""} onChange={v=>s(`metric${n}`,{...sec[`metric${n}`],num:v})}/><F label="Label" value={sec[`metric${n}`]?.label||""} onChange={v=>s(`metric${n}`,{...sec[`metric${n}`],label:v})}/></div>)}</div>
  </>;
  if(sec.type==="testimonials")return <><CH/>{IL("items",[{key:"text",label:"Testimonianza",type:"textarea"},{key:"name",label:"Nome"},{key:"role",label:"Ruolo"},{key:"avatar",label:"Iniziali fallback"},{key:"rating",label:"Valutazione (1-5)"}],{text:"Ottimo!",name:"Nome",role:"Ruolo",avatar:"XX",rating:5,...mediaDef("😊")},"Aggiungi testimonianza",true)}</>;
  if(sec.type==="testimonials_big")return <>
    <TA label="Citazione" value={sec.quote||""} onChange={v=>s("quote",v)} rows={4}/>
    <F label="Autore" value={sec.author||""} onChange={v=>s("author",v)}/>
    <F label="Ruolo" value={sec.role||""} onChange={v=>s("role",v)}/>
    <F label="Iniziali avatar" value={sec.avatar||""} onChange={v=>s("avatar",v)}/>
    <MediaBlockEditor label="Foto avatar" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>
  </>;
  if(sec.type==="testimonials_list")return <><CH/>{IL("items",[{key:"text",label:"Testo",type:"textarea"},{key:"name",label:"Nome"},{key:"role",label:"Ruolo"},{key:"rating",label:"Valutazione"}],{text:"",name:"Nome",role:"Ruolo",rating:5,...mediaDef("😊")},"Aggiungi recensione",true)}</>;
  if(sec.type==="testimonials_numbers")return <>
    <CH/>
    {IL("numbers",[{key:"num",label:"Valore"},{key:"label",label:"Etichetta"}],{num:"0",label:"Label"},"Aggiungi numero")}
    <div style={{marginTop:16,paddingTop:12,borderTop:"1px solid #f0f0f0"}}>
      <label style={{...LS,marginBottom:8}}>Testimonianza</label>
      <TA value={sec.testimonial?.text||""} onChange={v=>s("testimonial",{...sec.testimonial,text:v})} rows={3}/>
      <F value={sec.testimonial?.name||""} onChange={v=>s("testimonial",{...sec.testimonial,name:v})} placeholder="Nome"/>
      <F value={sec.testimonial?.role||""} onChange={v=>s("testimonial",{...sec.testimonial,role:v})} placeholder="Ruolo"/>
      <F value={sec.testimonial?.avatar||""} onChange={v=>s("testimonial",{...sec.testimonial,avatar:v})} placeholder="Iniziali"/>
    </div>
  </>;
  if(sec.type==="awards")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"org",label:"Organizzazione"}],{icon:"🏆",title:"Premio",org:"Org"},"Aggiungi premio")}</>;
  if(sec.type==="guarantee")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"}],{icon:"🛡️",title:"Garanzia",desc:""},"Aggiungi garanzia")}</>;
  if(["partners","logo_wall","clients_logos"].includes(sec.type))return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"name",label:"Nome"}],{icon:"🔵",name:"Partner",...mediaDef("🔵")},"Aggiungi partner",true)}</>;
  if(sec.type==="brands_ticker")return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>{IL("items",[{key:"icon",label:"Icona"},{key:"name",label:"Nome"}],{icon:"⭐",name:"Brand"},"Aggiungi brand")}</>;
  if(sec.type==="trust_badges")return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>{IL("items",[{key:"icon",label:"Icona"},{key:"text",label:"Testo badge"}],{icon:"✅",text:"Badge"},"Aggiungi badge")}</>;
  if(sec.type==="press")return <><CH/>{IL("items",[{key:"logo",label:"Emoji logo"},{key:"name",label:"Testata"},{key:"quote",label:"Citazione",type:"textarea"}],{logo:"📰",name:"Testata",quote:""},"Aggiungi testata")}</>;
  if(["team","team_dark"].includes(sec.type))return <><CH/>{IL("items",[{key:"name",label:"Nome"},{key:"role",label:"Ruolo"},{key:"avatar",label:"Iniziali fallback"},{key:"desc",label:"Bio",type:"textarea"}],{name:"Nome",role:"Ruolo",avatar:"XX",desc:"",...mediaDef("👤")},"Aggiungi membro",true)}</>;
  if(sec.type==="team_minimal")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"name",label:"Nome"},{key:"role",label:"Ruolo"}],{icon:"👤",name:"Nome",role:"Ruolo"},"Aggiungi membro")}</>;
  if(sec.type==="team_large")return <><CH/>{IL("items",[{key:"name",label:"Nome"},{key:"role",label:"Ruolo"},{key:"bio",label:"Bio",type:"textarea"},{key:"linkedin",label:"LinkedIn URL"}],{name:"Nome",role:"Ruolo",bio:"",linkedin:"",...mediaDef("👤")},"Aggiungi membro",true)}</>;
  if(sec.type==="open_positions")return <><CH/>{IL("items",[{key:"role",label:"Ruolo"},{key:"type",label:"Tipo"},{key:"location",label:"Sede"},{key:"desc",label:"Descrizione",type:"textarea"}],{role:"Ruolo",type:"Full-time",location:"Remote",desc:""},"Aggiungi posizione")}</>;
  if(sec.type==="pricing")return <>
    <F label="Etichetta" value={sec.sectionLabel||""} onChange={v=>s("sectionLabel",v)}/>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <F label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)}/>
    {(sec.items||[]).map((it,i)=><div key={i} style={CS2s}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:11,fontWeight:600,color:"#6b7280"}}>Piano {i+1}</span><RemBtn onClick={()=>s("items",(sec.items||[]).filter((_,j)=>j!==i))}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}><F value={it.name||""} onChange={v=>{const a=[...(sec.items||[])];a[i]={...a[i],name:v};s("items",a);}} placeholder="Nome"/><F value={it.price||""} onChange={v=>{const a=[...(sec.items||[])];a[i]={...a[i],price:v};s("items",a);}} placeholder="€ 999"/></div>
      <F value={it.desc||""} onChange={v=>{const a=[...(sec.items||[])];a[i]={...a[i],desc:v};s("items",a);}} placeholder="Descrizione"/>
      <Toggle label="Piano in evidenza" value={!!it.highlight} onChange={v=>{const a=[...(sec.items||[])];a[i]={...a[i],highlight:v};s("items",a);}}/>
      <LinkEditor label="Pulsante CTA piano" value={it.cta} onChange={v=>{const a=[...(sec.items||[])];a[i]={...a[i],cta:v};s("items",a);}}/>
      <label style={{...LS,marginTop:4,marginBottom:8}}>Features</label>
      {(it.features||[]).map((f,fi)=><div key={fi} style={{display:"flex",gap:8,marginBottom:8}}><input value={f} onChange={e=>{const a=[...(sec.items||[])];a[i]={...a[i],features:a[i].features.map((x,j)=>j===fi?e.target.value:x)};s("items",a);}} style={IS}/><RemBtn onClick={()=>{const a=[...(sec.items||[])];a[i]={...a[i],features:a[i].features.filter((_,j)=>j!==fi)};s("items",a);}}/></div>)}
      <AddBtn onClick={()=>{const a=[...(sec.items||[])];a[i]={...a[i],features:[...(a[i].features||[]),"Feature"]};s("items",a);}} label="Feature"/>
    </div>)}
    <AddBtn onClick={()=>s("items",[...(sec.items||[]),{name:"Piano",price:"€ 0",period:"",desc:"",features:["Feature 1"],highlight:false,cta:linkDef("Inizia ora","contact")}])} label="Aggiungi piano"/>
  </>;
  if(sec.type==="pricing_table")return <>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <label style={{...LS,marginBottom:8}}>Caratteristiche (righe)</label>
    {(sec.features||[]).map((f,fi)=><div key={fi} style={{display:"flex",gap:8,marginBottom:8}}><input value={f} onChange={e=>{const a=[...(sec.features||[])];a[fi]=e.target.value;s("features",a);}} style={IS}/><RemBtn onClick={()=>s("features",(sec.features||[]).filter((_,j)=>j!==fi))}/></div>)}
    <AddBtn onClick={()=>s("features",[...(sec.features||[]),"Caratteristica"])} label="Aggiungi riga"/>
  </>;
  if(sec.type==="pricing_comparison")return <>
    <CH/>
    {(sec.items||[]).map((pl,pi)=><div key={pi} style={CS2s}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,fontWeight:600,color:"#6b7280"}}>Piano {pi+1}</span><RemBtn onClick={()=>s("items",(sec.items||[]).filter((_,j)=>j!==pi))}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}><F value={pl.name||""} onChange={v=>{const a=[...(sec.items||[])];a[pi]={...a[pi],name:v};s("items",a);}} placeholder="Nome"/><F value={pl.price||""} onChange={v=>{const a=[...(sec.items||[])];a[pi]={...a[pi],price:v};s("items",a);}} placeholder="Prezzo"/></div>
      <Toggle label="Piano in evidenza" value={!!pl.highlight} onChange={v=>{const a=[...(sec.items||[])];a[pi]={...a[pi],highlight:v};s("items",a);}}/>
      {(pl.rows||[]).map((r,ri)=><div key={ri} style={{display:"flex",gap:8,marginBottom:8}}><input value={r.label||""} onChange={e=>{const a=[...(sec.items||[])];a[pi].rows=a[pi].rows.map((x,j)=>j===ri?{...x,label:e.target.value}:x);s("items",a);}} placeholder="Label" style={{...IS,flex:1}}/><input value={r.value||""} onChange={e=>{const a=[...(sec.items||[])];a[pi].rows=a[pi].rows.map((x,j)=>j===ri?{...x,value:e.target.value}:x);s("items",a);}} placeholder="Valore" style={{...IS,flex:1}}/><RemBtn onClick={()=>{const a=[...(sec.items||[])];a[pi].rows=a[pi].rows.filter((_,j)=>j!==ri);s("items",a);}}/></div>)}
      <AddBtn onClick={()=>{const a=[...(sec.items||[])];a[pi].rows=[...(a[pi].rows||[]),{label:"Feature",value:"✓"}];s("items",a);}} label="Aggiungi riga"/>
    </div>)}
    <AddBtn onClick={()=>s("items",[...(sec.items||[]),{name:"Piano",price:"€ 0",highlight:false,rows:[{label:"Feature",value:"✓"}]}])} label="Aggiungi piano"/>
  </>;
  if(["cta_banner","cta_split","cta_dark"].includes(sec.type))return <>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)} rows={2}/>
    {["cta_dark"].includes(sec.type)&&<F label="Colore sfondo" value={sec.bgColor||"#070710"} onChange={v=>s("bgColor",v)}/>}
    <LinkEditor label="Pulsante CTA principale" value={sec.cta1} onChange={v=>s("cta1",v)}/>
    <Toggle label="Secondo pulsante" value={!!sec.showCta2} onChange={v=>s("showCta2",v)}/>
    {sec.showCta2&&<LinkEditor label="Secondo pulsante" value={sec.cta2} onChange={v=>s("cta2",v)}/>}
  </>;
  if(sec.type==="cta_minimal")return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/><F label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)}/><LinkEditor label="Pulsante CTA" value={sec.cta1} onChange={v=>s("cta1",v)}/></>;
  if(sec.type==="cta_image_bg")return <>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)} rows={2}/>
    <LinkEditor label="Pulsante CTA" value={sec.cta1} onChange={v=>s("cta1",v)}/>
    <MediaBlockEditor label="Immagine di sfondo" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>
    {sec.useImage&&sec.image&&<div style={{marginBottom:14}}><label style={LS}>Opacità overlay: {sec.overlayOpacity||60}%</label><input type="range" min="0" max="90" value={sec.overlayOpacity||60} onChange={e=>s("overlayOpacity",+e.target.value)} style={{width:"100%"}}/></div>}
  </>;
  if(["newsletter","waitlist"].includes(sec.type))return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/><TA label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)} rows={2}/><F label="Placeholder email" value={sec.placeholder||""} onChange={v=>s("placeholder",v)}/><F label="Testo pulsante" value={sec.btnLabel||""} onChange={v=>s("btnLabel",v)}/><F label="Nota sotto" value={sec.note||""} onChange={v=>s("note",v)}/></>;
  if(sec.type==="lead_magnet")return <>
    <F label="Etichetta" value={sec.sectionLabel||""} onChange={v=>s("sectionLabel",v)}/>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)} rows={2}/>
    <LinkEditor label="Pulsante CTA" value={sec.cta} onChange={v=>s("cta",v)}/>
    <MediaBlockEditor label="Cover" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>
    {IL("items",[{key:"icon",label:"Icona"},{key:"text",label:"Testo"}],{icon:"✓",text:"Punto"},"Aggiungi punto")}
  </>;
  if(sec.type==="locations")return <><CH/>{IL("items",[{key:"city",label:"Città"},{key:"address",label:"Indirizzo"},{key:"phone",label:"Telefono"},{key:"email",label:"Email"}],{city:"Città",address:"Via...",phone:"+39 0",email:"info@",...mediaDef("🏙️")},"Aggiungi sede",true)}</>;
  if(sec.type==="map_section")return <><CH/><F label="Indirizzo" value={sec.address||""} onChange={v=>s("address",v)}/><F label="Email" value={sec.email||""} onChange={v=>s("email",v)}/><F label="Telefono" value={sec.phone||""} onChange={v=>s("phone",v)}/><TA label="URL iframe mappa" value={sec.mapEmbed||""} onChange={v=>s("mapEmbed",v)} rows={3}/>{sec.mapEmbed&&<iframe src={sec.mapEmbed} width="100%" height="140" style={{border:"none",borderRadius:8,marginBottom:8}} title="Anteprima"/>}</>;
  if(sec.type==="social_links")return <><CH/>{IL("items",[{key:"platform",label:"Piattaforma"},{key:"icon",label:"Icona"},{key:"url",label:"URL"},{key:"desc",label:"Descrizione"}],{platform:"Social",icon:"🔗",url:"https://",desc:""},"Aggiungi social")}</>;
  if(["faq","faq_two_col"].includes(sec.type))return <><CH/>{IL("items",[{key:"q",label:"Domanda"},{key:"a",label:"Risposta",type:"textarea",rows:3}],{q:"Domanda?",a:"Risposta."},"Aggiungi FAQ")}</>;
  if(sec.type==="blog_preview")return <><CH/>{IL("items",[{key:"tag",label:"Tag"},{key:"title",label:"Titolo"},{key:"date",label:"Data"},{key:"readTime",label:"Lettura"}],{tag:"Blog",title:"Articolo",date:"1 Gen 2025",readTime:"5 min",...mediaDef("📝")},"Aggiungi articolo",true)}</>;
  if(sec.type==="events")return <><CH/>{IL("items",[{key:"date",label:"Data"},{key:"title",label:"Titolo"},{key:"type",label:"Tipo"},{key:"cta",label:"Testo pulsante"}],{date:"1 Gen 2025",title:"Evento",type:"Online",cta:"Registrati",...mediaDef("📅")},"Aggiungi evento",true)}</>;
  if(sec.type==="integrations")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"name",label:"Nome"}],{icon:"🔌",name:"Tool"},"Aggiungi integrazione")}</>;
  if(sec.type==="download")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"desc",label:"Descrizione",type:"textarea"},{key:"size",label:"Dimensione"},{key:"format",label:"Formato"}],{icon:"📄",title:"Risorsa",desc:"",size:"1 MB",format:"PDF"},"Aggiungi risorsa")}</>;
  if(sec.type==="video_section")return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/><F label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)}/><F label="URL video embed (YouTube/Vimeo)" value={sec.videoUrl||""} onChange={v=>s("videoUrl",v)} placeholder="https://www.youtube.com/embed/..."/></>;
  if(sec.type==="podcast")return <><CH/>{IL("items",[{key:"num",label:"Episodio"},{key:"title",label:"Titolo"},{key:"guest",label:"Ospite"},{key:"duration",label:"Durata"}],{num:"EP 1",title:"Titolo",guest:"Ospite",duration:"30 min",...mediaDef("🎙️")},"Aggiungi episodio",true)}</>;
  if(sec.type==="pricing_faq")return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>{IL("faqs",[{key:"q",label:"Domanda"},{key:"a",label:"Risposta",type:"textarea",rows:2}],{q:"Domanda?",a:"Risposta."},"Aggiungi FAQ")}</>;
  if(["media_left","media_right"].includes(sec.type))return <>
    <F label="Etichetta" value={sec.sectionLabel||""} onChange={v=>s("sectionLabel",v)}/>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Testo" value={sec.text||""} onChange={v=>s("text",v)} rows={4}/>
    <MediaBlockEditor label="Immagine / Emoji" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>
    <LinkEditor label="Pulsante CTA (lascia vuoto per nasconderlo)" value={sec.cta} onChange={v=>s("cta",v)}/>
    <label style={{...LS,marginBottom:8}}>Bullet points</label>
    {(sec.bullets||[]).map((b,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:8}}><input value={b} onChange={e=>{const a=[...(sec.bullets||[])];a[i]=e.target.value;s("bullets",a);}} style={IS}/><RemBtn onClick={()=>s("bullets",(sec.bullets||[]).filter((_,j)=>j!==i))}/></div>)}
    <AddBtn onClick={()=>s("bullets",[...(sec.bullets||[]),"Punto elenco"])} label="Aggiungi bullet"/>
  </>;
  if(sec.type==="two_columns")return <><F label="Titolo sinistra" value={sec.leftTitle||""} onChange={v=>s("leftTitle",v)}/><TA label="Testo sinistra" value={sec.leftText||""} onChange={v=>s("leftText",v)}/><F label="Titolo destra" value={sec.rightTitle||""} onChange={v=>s("rightTitle",v)}/><TA label="Testo destra" value={sec.rightText||""} onChange={v=>s("rightText",v)}/></>;
  if(sec.type==="highlight_band")return <><TA label="Testo" value={sec.text||""} onChange={v=>s("text",v)} rows={2}/><F label="Testo CTA" value={sec.cta||""} onChange={v=>s("cta",v)}/><F label="Ancora CTA" value={sec.ctaAnchor||""} onChange={v=>s("ctaAnchor",v)}/></>;
  if(sec.type==="quote")return <><TA label="Citazione" value={sec.quote||""} onChange={v=>s("quote",v)} rows={3}/><F label="Autore" value={sec.author||""} onChange={v=>s("author",v)}/><Toggle label="Mostra autore" value={!!sec.showAuthor} onChange={v=>s("showAuthor",v)}/></>;
  if(sec.type==="divider_cta")return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/><LinkEditor label="Pulsante CTA" value={sec.ctaLink} onChange={v=>s("ctaLink",v)}/></>;
  if(sec.type==="accordion_features")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"content",label:"Contenuto",type:"textarea",rows:3}],{icon:"✅",title:"Feature",content:""},"Aggiungi feature")}</>;
  if(sec.type==="text_image_alternating")return <><CH/>{IL("items",[{key:"title",label:"Titolo"},{key:"text",label:"Testo",type:"textarea"}],{title:"Titolo",text:"",...mediaDef("🎯")},"Aggiungi sezione",true)}</>;
  if(sec.type==="ribbon")return IL("items",[{key:"icon",label:"Icona"},{key:"text",label:"Testo"}],{icon:"✅",text:"Punto"},"Aggiungi punto");
  if(sec.type==="split_feature")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"title",label:"Titolo"},{key:"text",label:"Testo",type:"textarea"}],{icon:"💡",title:"Feature",text:"",...mediaDef("🔷")},"Aggiungi feature",true)}</>;
  if(sec.type==="logo_wall")return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>{IL("items",[{key:"icon",label:"Icona"},{key:"name",label:"Nome"}],{icon:"⭐",name:"Azienda"},"Aggiungi logo")}</>;
  if(sec.type==="image_text_cta")return <>
    <F label="Etichetta" value={sec.sectionLabel||""} onChange={v=>s("sectionLabel",v)}/>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Testo" value={sec.text||""} onChange={v=>s("text",v)} rows={3}/>
    <LinkEditor label="Pulsante CTA" value={sec.cta} onChange={v=>s("cta",v)}/>
    <MediaBlockEditor label="Immagine / Emoji" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>
  </>;
  if(sec.type==="counter")return <>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <F label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)}/>
    <F label="Data obiettivo (YYYY-MM-DD)" value={sec.targetDate||""} onChange={v=>s("targetDate",v)} placeholder="2025-12-31"/>
    <LinkEditor label="Pulsante CTA" value={sec.cta} onChange={v=>s("cta",v)}/>
  </>;
  if(sec.type==="cookie_notice")return <><TA label="Testo banner" value={sec.text||""} onChange={v=>s("text",v)} rows={2}/><F label="Testo link privacy" value={sec.linkText||""} onChange={v=>s("linkText",v)}/><F label="URL privacy" value={sec.linkUrl||""} onChange={v=>s("linkUrl",v)}/><F label="Accetta tutti" value={sec.acceptAll||""} onChange={v=>s("acceptAll",v)}/><F label="Solo necessari" value={sec.acceptNecessary||""} onChange={v=>s("acceptNecessary",v)}/></>;
  if(sec.type==="floating_cta")return <><F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/><F label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)}/><LinkEditor label="Pulsante CTA" value={sec.ctaLink} onChange={v=>s("ctaLink",v)}/><div style={{marginBottom:14}}><label style={LS}>Posizione</label><select value={sec.position||"right"} onChange={e=>s("position",e.target.value)} style={IS}><option value="right">Destra</option><option value="left">Sinistra</option></select></div></>;
  if(sec.type==="comparison_cards")return <><CH/>{IL("items",[{key:"icon",label:"Icona"},{key:"name",label:"Nome piano"},{type:"toggle",key:"highlight",label:"Consigliato"}],{icon:"🔧",name:"Piano",highlight:false,pros:["Pro 1"],cons:["Contro 1"]},"Aggiungi opzione")}</>;
  if(sec.type==="impact_section")return <>
    <F label="Etichetta" value={sec.sectionLabel||""} onChange={v=>s("sectionLabel",v)}/>
    <F label="Titolo" value={sec.title||""} onChange={v=>s("title",v)}/>
    <TA label="Sottotitolo" value={sec.subtitle||""} onChange={v=>s("subtitle",v)} rows={2}/>
    <TA label="Testo" value={sec.text||""} onChange={v=>s("text",v)} rows={3}/>
    <LinkEditor label="Pulsante CTA" value={sec.cta} onChange={v=>s("cta",v)}/>
    <MediaBlockEditor label="Immagine / Emoji" obj={sec} onChange={obj=>onChange({...sec,...obj})}/>
    {IL("stats",[{key:"num",label:"Numero"},{key:"label",label:"Etichetta"}],{num:"0",label:"Label"},"Aggiungi stat")}
  </>;
  return <div style={{padding:"20px",color:"#9ca3af",fontSize:13}}>Editor per questa sezione non disponibile.</div>;
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function App(){
  const [site,setSite]=useState(()=>JSON.parse(JSON.stringify(defaultSite)));
  const [selId,setSelId]=useState(null);
  const [tab,setTab]=useState("sezioni");
  const [addCat,setAddCat]=useState("Intro");
  const [previewOpen,setPreviewOpen]=useState(false);
  const [search,setSearch]=useState("");

  const upd=useCallback((path,val)=>{
    setSite(prev=>{
      const n=JSON.parse(JSON.stringify(prev));
      const parts=path.split(".");
      let obj=n;
      for(let i=0;i<parts.length-1;i++)obj=obj[parts[i]];
      obj[parts[parts.length-1]]=val;
      return n;
    });
  },[]);

  const updSec=useCallback((id,ns)=>{
    setSite(prev=>({...prev,sections:prev.sections.map(s=>s.id===id?ns:s)}));
  },[]);

  const moveSec=(id,dir)=>{
    setSite(prev=>{
      const secs=[...prev.sections];
      const i=secs.findIndex(s=>s.id===id);
      if(i<0||(dir===-1&&i===0)||(dir===1&&i===secs.length-1))return prev;
      [secs[i],secs[i+dir]]=[secs[i+dir],secs[i]];
      return {...prev,sections:secs};
    });
  };

  const delSec=id=>{setSite(prev=>({...prev,sections:prev.sections.filter(s=>s.id!==id)}));if(selId===id)setSelId(null);};
  const dupSec=id=>{
    setSite(prev=>{
      const i=prev.sections.findIndex(s=>s.id===id);
      if(i<0)return prev;
      const copy={...JSON.parse(JSON.stringify(prev.sections[i])),id:makeId(prev.sections[i].type)};
      const secs=[...prev.sections];
      secs.splice(i+1,0,copy);
      return {...prev,sections:secs};
    });
  };
  const addSec=type=>{
    const ns=createSection(type);
    setSite(prev=>({...prev,sections:[...prev.sections,ns]}));
    setSelId(ns.id);
    setTab("sezioni");
  };

  const selSec=site.sections.find(s=>s.id===selId);
  const cats=[...new Set(SECTION_CATALOG.map(s=>s.cat))];
  const htmlOut=buildHTML(site);
  const TB=({id,lbl})=><button onClick={()=>setTab(id)} style={{padding:"8px 14px",borderRadius:8,border:"none",background:tab===id?"#4f46e5":"transparent",color:tab===id?"#fff":"#6b7280",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:tab===id?700:500,flexShrink:0}}>{lbl}</button>;

  return <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:"Inter,sans-serif",background:"#f3f4f6"}}>
    {/* SIDEBAR */}
    <div style={{width:380,background:"#fff",borderRight:"1px solid #e5e7eb",display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
      {/* Header */}
      <div style={{padding:"16px 20px",borderBottom:"1px solid #f0f0f0",flexShrink:0}}>
        <div style={{fontWeight:800,fontSize:15,marginBottom:12,background:"linear-gradient(135deg,#4f46e5,#0e9f6e)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🚀 Landing Builder Pro</div>
        <div style={{display:"flex",gap:3,background:"#f9fafb",borderRadius:10,padding:3}}>
          <TB id="sezioni" lbl="Sezioni"/><TB id="aggiungi" lbl="+ Aggiungi"/><TB id="globale" lbl="⚙️ Globale"/>
        </div>
      </div>

      {/* Sezioni */}
      {tab==="sezioni"&&<div style={{flex:1,overflowY:"auto",padding:"12px"}}>
        {site.sections.length===0&&<div style={{textAlign:"center",color:"#9ca3af",padding:"40px 16px",fontSize:13}}>Nessuna sezione. Vai su "+ Aggiungi".</div>}
        {site.sections.map((sec,i)=>{
          const isSel=sec.id===selId;
          const cat=SECTION_CATALOG.find(c=>c.type===sec.type);
          return <div key={sec.id}>
            <div onClick={()=>setSelId(isSel?null:sec.id)} style={{background:isSel?"#eef2ff":"#f9fafb",border:`1.5px solid ${isSel?"#4f46e5":"#e5e7eb"}`,borderRadius:10,padding:"10px 12px",marginBottom:isSel?0:6,cursor:"pointer",borderBottomLeftRadius:isSel?0:10,borderBottomRightRadius:isSel?0:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                  <span style={{fontSize:14,flexShrink:0}}>{cat?.icon||"📄"}</span>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:12,color:isSel?"#4f46e5":"#374151",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{sec.label||sec.type}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>{sec.type}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:2,flexShrink:0}} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>updSec(sec.id,{...sec,visible:!sec.visible})} title={sec.visible?"Nascondi":"Mostra"} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:sec.visible?"#10b981":"#d1d5db",padding:"3px 5px",borderRadius:4}}>{sec.visible?"👁":"🚫"}</button>
                  <button onClick={()=>moveSec(sec.id,-1)} disabled={i===0} style={{background:"none",border:"none",cursor:i===0?"default":"pointer",fontSize:11,color:i===0?"#e5e7eb":"#9ca3af",padding:"3px 5px",borderRadius:4}}>↑</button>
                  <button onClick={()=>moveSec(sec.id,1)} disabled={i===site.sections.length-1} style={{background:"none",border:"none",cursor:i===site.sections.length-1?"default":"pointer",fontSize:11,color:i===site.sections.length-1?"#e5e7eb":"#9ca3af",padding:"3px 5px",borderRadius:4}}>↓</button>
                  <button onClick={()=>dupSec(sec.id)} title="Duplica" style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#9ca3af",padding:"3px 5px",borderRadius:4}}>⧉</button>
                  <button onClick={()=>delSec(sec.id)} title="Elimina" style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#ef4444",padding:"3px 5px",borderRadius:4}}>✕</button>
                </div>
              </div>
            </div>
            {isSel&&<div style={{background:"#f8f9ff",border:"1.5px solid #4f46e5",borderTop:"none",borderBottomLeftRadius:10,borderBottomRightRadius:10,padding:"16px 14px",marginBottom:6}} onClick={e=>e.stopPropagation()}>
              <SectionEditor sec={sec} onChange={ns=>updSec(sec.id,ns)}/>
            </div>}
          </div>;
        })}
      </div>}

      {/* Aggiungi */}
      {tab==="aggiungi"&&<div style={{flex:1,overflowY:"auto",padding:"12px"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cerca sezione..." style={{...IS,marginBottom:10}}/>
        {search===""&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
          {cats.map(c=><button key={c} onClick={()=>setAddCat(c)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${addCat===c?"#4f46e5":"#e5e7eb"}`,background:addCat===c?"#eef2ff":"#fff",color:addCat===c?"#4f46e5":"#6b7280",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:addCat===c?700:400}}>{c}</button>)}
        </div>}
        {(search!==""?SECTION_CATALOG.filter(s=>s.label.toLowerCase().includes(search.toLowerCase())):SECTION_CATALOG.filter(s=>s.cat===addCat)).map(s=><button key={s.type} onClick={()=>addSec(s.type)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",background:"#f9fafb",border:"1px solid #f0f0f0",borderRadius:8,padding:"10px 14px",cursor:"pointer",marginBottom:6,textAlign:"left",fontFamily:"inherit",transition:"background .12s"}}>
          <span style={{fontSize:15,flexShrink:0}}>{s.icon}</span>
          <span style={{fontSize:12,color:"#374151",fontWeight:500,lineHeight:1.3}}>{s.label}</span>
        </button>)}
      </div>}

      {/* Globale */}
      {tab==="globale"&&<div style={{flex:1,overflowY:"auto",padding:"12px"}}>
        <div style={{fontWeight:700,fontSize:12,color:"#374151",marginBottom:12,textTransform:"uppercase",letterSpacing:".06em"}}>🌐 Sito</div>
        <F label="Nome sito" value={site.generale.siteName} onChange={v=>upd("generale.siteName",v)}/>
        <F label="Tagline / Meta description" value={site.generale.tagline} onChange={v=>upd("generale.tagline",v)}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          <div><label style={LS}>Colore primario</label><input type="color" value={site.generale.primaryColor} onChange={e=>upd("generale.primaryColor",e.target.value)} style={{width:"100%",height:36,border:"1px solid #e5e7eb",borderRadius:8,cursor:"pointer",padding:2}}/></div>
          <div><label style={LS}>Colore secondario</label><input type="color" value={site.generale.secondaryColor} onChange={e=>upd("generale.secondaryColor",e.target.value)} style={{width:"100%",height:36,border:"1px solid #e5e7eb",borderRadius:8,cursor:"pointer",padding:2}}/></div>
        </div>
        <div style={{marginBottom:14}}><label style={LS}>Font</label><select value={site.generale.fontFamily} onChange={e=>upd("generale.fontFamily",e.target.value)} style={IS}>{FONTS.map(f=><option key={f}>{f}</option>)}</select></div>
        <div style={{marginBottom:16}}><label style={LS}>Border radius: {site.generale.borderRadius}px</label><input type="range" min="0" max="24" value={site.generale.borderRadius} onChange={e=>upd("generale.borderRadius",e.target.value)} style={{width:"100%"}}/></div>

        <div style={{fontWeight:700,fontSize:12,color:"#374151",margin:"16px 0 10px",textTransform:"uppercase",letterSpacing:".06em"}}>🧭 Navbar</div>
        <F label="Testo logo" value={site.navbar.logoText} onChange={v=>upd("navbar.logoText",v)}/>
        <ImgUp label="Logo immagine" value={site.navbar.logoImage} onChange={v=>upd("navbar.logoImage",v)}/>
        <Toggle label="Navbar fissa (sticky)" value={!!site.navbar.sticky} onChange={v=>upd("navbar.sticky",v)}/>
        <Toggle label="Link automatici dalle sezioni" value={!!site.navbar.autoLinks} onChange={v=>upd("navbar.autoLinks",v)}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <F label="Testo CTA navbar" value={site.navbar.ctaLabel} onChange={v=>upd("navbar.ctaLabel",v)}/>
          <F label="Ancora CTA" value={site.navbar.ctaAnchor} onChange={v=>upd("navbar.ctaAnchor",v)}/>
        </div>
        <div style={{marginBottom:14}}><label style={LS}>Opacità: {site.navbar.bgOpacity}%</label><input type="range" min="60" max="100" value={site.navbar.bgOpacity} onChange={e=>upd("navbar.bgOpacity",+e.target.value)} style={{width:"100%"}}/></div>
        {!site.navbar.autoLinks&&<>
          <label style={{...LS,marginBottom:8}}>Link manuali navbar</label>
          {(site.navbar.links||[]).map((l,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:8}}>
            <input value={l.label||""} onChange={e=>{const a=[...site.navbar.links];a[i]={...a[i],label:e.target.value};upd("navbar.links",a);}} placeholder="Label" style={{...IS,flex:1}}/>
            <input value={l.anchor||""} onChange={e=>{const a=[...site.navbar.links];a[i]={...a[i],anchor:e.target.value};upd("navbar.links",a);}} placeholder="ancora" style={{...IS,flex:1}}/>
            <RemBtn onClick={()=>upd("navbar.links",site.navbar.links.filter((_,j)=>j!==i))}/>
          </div>)}
          <AddBtn onClick={()=>upd("navbar.links",[...(site.navbar.links||[]),{label:"Link",anchor:""}])} label="Aggiungi link"/>
        </>}

        <div style={{fontWeight:700,fontSize:12,color:"#374151",margin:"20px 0 10px",textTransform:"uppercase",letterSpacing:".06em"}}>🦶 Footer</div>
        <F label="Testo footer" value={site.footer.text} onChange={v=>upd("footer.text",v)}/>
        <Toggle label="Mostra 'Torna su'" value={site.footer.showScrollTop} onChange={v=>upd("footer.showScrollTop",v)}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div><label style={LS}>Bg footer</label><input type="color" value={site.footer.bgColor} onChange={e=>upd("footer.bgColor",e.target.value)} style={{width:"100%",height:36,border:"1px solid #e5e7eb",borderRadius:8,cursor:"pointer",padding:2}}/></div>
          <div><label style={LS}>Testo footer</label><input type="color" value={site.footer.textColor} onChange={e=>upd("footer.textColor",e.target.value)} style={{width:"100%",height:36,border:"1px solid #e5e7eb",borderRadius:8,cursor:"pointer",padding:2}}/></div>
        </div>
      </div>}
    </div>

    {/* PREVIEW */}
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"10px 20px",background:"#fff",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexShrink:0}}>
        <div style={{fontSize:12,color:"#9ca3af"}}>{site.sections.filter(s=>s.visible).length} visibili · {site.sections.length} totali</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setPreviewOpen(true)} style={{padding:"7px 18px",borderRadius:8,border:"1px solid #4f46e5",background:"#eef2ff",color:"#4f46e5",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>👁 Anteprima</button>
          <button onClick={()=>{
            if(navigator.clipboard&&navigator.clipboard.writeText){
              navigator.clipboard.writeText(htmlOut).then(()=>alert("✅ HTML copiato negli appunti!\n\nOra:\n1. Apri un editor di testo (Notepad, VS Code, ecc.)\n2. Incolla il contenuto (Ctrl+V)\n3. Salva come file .html")).catch(()=>{
                const ta=document.createElement("textarea");ta.value=htmlOut;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);alert("✅ HTML copiato negli appunti!\n\nOra incollalo in un editor di testo e salvalo come .html");
              });
            } else {
              const ta=document.createElement("textarea");ta.value=htmlOut;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);alert("✅ HTML copiato negli appunti!\n\nOra incollalo in un editor di testo e salvalo come .html");
            }
          }} style={{padding:"7px 18px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4f46e5,#0e9f6e)",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>📋 Copia HTML</button>
        </div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"20px",background:"#f3f4f6"}}>
        <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 4px 48px rgba(0,0,0,.12)",maxWidth:1280,margin:"0 auto"}}>
          <iframe srcDoc={htmlOut} style={{width:"100%",height:"calc(100vh - 110px)",border:"none",display:"block"}} title="Preview"/>
        </div>
      </div>
    </div>

    {previewOpen&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:1000,display:"flex",flexDirection:"column"}}>
      <div style={{background:"#111827",padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <span style={{color:"#fff",fontWeight:700,fontSize:14}}>{site.generale.siteName}</span>
        <button onClick={()=>setPreviewOpen(false)} style={{background:"#374151",color:"#fff",border:"none",borderRadius:8,padding:"7px 18px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:13}}>✕ Chiudi</button>
      </div>
      <iframe srcDoc={htmlOut} style={{flex:1,border:"none",background:"#fff"}} title="Full Preview"/>
    </div>}
  </div>;
}