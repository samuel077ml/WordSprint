export type Turn = {
  partner: string; // lo que dice la otra persona
  options: string[]; // posibles respuestas del usuario
  answer: string; // la respuesta correcta (debe estar dentro de options)
  explain_es: string;
  explain_en: string;
};

export type Scenario = {
  id: string;
  name: string;
  emoji: string;
  level: string;
  gradient: string;
  accent: string;
  partnerRole: string;
  intro_es: string;
  intro_en: string;
  turns: Turn[];
};

export const scenarios: Scenario[] = [
  {
    id: 'airport',
    name: 'En el aeropuerto',
    emoji: '✈️',
    level: 'PRINCIPIANTE',
    gradient: 'from-sky-500/20 to-indigo-900/40',
    accent: 'text-sky-300',
    partnerRole: 'Check-in agent',
    intro_es: 'Estás en el mostrador de check-in. Elige la respuesta más natural a cada frase.',
    intro_en: "You're at the check-in desk. Choose the most natural reply to each line.",
    turns: [
      {
        partner: 'Good morning! May I see your passport, please?',
        options: ['Sure, here you go.', 'I like your jacket.', 'It was a long flight yesterday.'],
        answer: 'Sure, here you go.',
        explain_es: 'Cuando te piden un documento, lo entregas diciendo "Here you go" (aquí tiene).',
        explain_en: 'When someone asks for a document, you hand it over and say "Here you go".',
      },
      {
        partner: 'Are you checking any bags today?',
        options: ['Yes, just one suitcase.', "I'd like a window seat, please.", 'My flight leaves at six.'],
        answer: 'Yes, just one suitcase.',
        explain_es: '"Checking a bag" es documentar equipaje. La pregunta es sí o no, y cuántas maletas.',
        explain_en: '"Checking a bag" means handing in luggage. The question is yes or no, and how many.',
      },
      {
        partner: 'Would you prefer a window or an aisle seat?',
        options: ['A window seat, please.', 'Yes, I would.', 'I have one bag.'],
        answer: 'A window seat, please.',
        explain_es:
          'Es una pregunta de elección ("window or aisle"): respondes con una de las dos opciones, no con sí o no.',
        explain_en:
          'It is a choice question ("window or aisle"): you answer with one of the two options, not yes or no.',
      },
      {
        partner: 'Your flight boards at gate 12 at 10:30.',
        options: ['Thank you. Where can I find gate 12?', "That's a nice airport.", "I don't have a ticket."],
        answer: 'Thank you. Where can I find gate 12?',
        explain_es: '"Boards" significa que empieza el embarque. Agradeces y preguntas lo que necesitas saber.',
        explain_en: '"Boards" means boarding starts. You say thanks and ask what you need to know.',
      },
      {
        partner: 'Here is your boarding pass. Enjoy your flight!',
        options: ['Thank you! Have a nice day.', 'Yes, I enjoyed it.', "Sorry, I'm late."],
        answer: 'Thank you! Have a nice day.',
        explain_es: '"Enjoy your flight" es un deseo, no una pregunta. Respondes con gracias y otro deseo.',
        explain_en: '"Enjoy your flight" is a wish, not a question. You answer with thanks and a wish of your own.',
      },
    ],
  },
  {
    id: 'restaurant',
    name: 'En un restaurante',
    emoji: '🍽️',
    level: 'PRINCIPIANTE',
    gradient: 'from-amber-500/20 to-red-900/40',
    accent: 'text-amber-300',
    partnerRole: 'Waiter',
    intro_es: 'Llegas a un restaurante. Elige la respuesta más natural a cada frase.',
    intro_en: "You've arrived at a restaurant. Choose the most natural reply to each line.",
    turns: [
      {
        partner: 'Hi, welcome! Do you have a reservation?',
        options: ['Yes, under the name Garcia.', "I'd like the soup, please.", 'Yes, it was delicious.'],
        answer: 'Yes, under the name Garcia.',
        explain_es: 'Para decir a nombre de quién está la reserva se usa "under the name...".',
        explain_en: 'To say whose name the booking is in, use "under the name...".',
      },
      {
        partner: 'Can I get you something to drink?',
        options: ['Just water, please.', 'The bill, please.', 'I have a reservation.'],
        answer: 'Just water, please.',
        explain_es: '"Just..." significa "solamente". Es la forma corta y amable de pedir una bebida.',
        explain_en: '"Just..." means "only". It is the short, polite way to order a drink.',
      },
      {
        partner: 'Are you ready to order?',
        options: ["Yes, I'll have the grilled chicken.", 'No, I already paid.', 'Yes, the restaurant is nice.'],
        answer: "Yes, I'll have the grilled chicken.",
        explain_es: '"I\'ll have..." es la frase más común para pedir comida en un restaurante.',
        explain_en: '"I\'ll have..." is the most common phrase for ordering food in a restaurant.',
      },
      {
        partner: 'How is everything? Is the food okay?',
        options: ['Everything is delicious, thank you.', "I'll have the chicken.", 'Can I have a reservation?'],
        answer: 'Everything is delicious, thank you.',
        explain_es: 'El mesero pregunta qué tal está la comida. Respondes con tu opinión.',
        explain_en: 'The waiter is asking how the food is. You answer with your opinion.',
      },
      {
        partner: 'Would you like dessert or coffee?',
        options: [
          'No, thank you. Could we have the bill, please?',
          'Yes, I have a reservation.',
          'The chicken was my favorite.',
        ],
        answer: 'No, thank you. Could we have the bill, please?',
        explain_es: 'Para pedir la cuenta se dice "the bill, please" (en EE. UU. también "the check").',
        explain_en: 'To ask for the bill you say "the bill, please" (in the US also "the check").',
      },
    ],
  },
  {
    id: 'interview',
    name: 'Entrevista de trabajo',
    emoji: '💼',
    level: 'INTERMEDIO',
    gradient: 'from-emerald-500/20 to-teal-900/40',
    accent: 'text-emerald-300',
    partnerRole: 'Interviewer',
    intro_es: 'Estás en una entrevista. Elige la respuesta más profesional a cada frase.',
    intro_en: "You're in a job interview. Choose the most professional reply to each line.",
    turns: [
      {
        partner: 'Thanks for coming in. Tell me a little about yourself.',
        options: [
          "I'm a graphic designer with five years of experience.",
          "I'm fine, thanks. How are you?",
          'Yes, I can start today.',
        ],
        answer: "I'm a graphic designer with five years of experience.",
        explain_es: '"Tell me about yourself" pide un resumen profesional corto: quién eres y tu experiencia.',
        explain_en: '"Tell me about yourself" asks for a short professional summary: who you are and your experience.',
      },
      {
        partner: 'Why do you want to work here?',
        options: [
          'I admire your company and I want to grow my skills.',
          "Because it's close to my house.",
          "I don't know, honestly.",
        ],
        answer: 'I admire your company and I want to grow my skills.',
        explain_es: 'Se espera una razón profesional. Decir que te queda cerca no suena motivado.',
        explain_en: 'A professional reason is expected. Saying it is close to home does not sound motivated.',
      },
      {
        partner: 'What would you say is your biggest strength?',
        options: ["I'm very organized and I meet deadlines.", 'I usually arrive late.', "I'm strong, I go to the gym."],
        answer: "I'm very organized and I meet deadlines.",
        explain_es:
          '"Strength" aquí es una cualidad profesional (fortaleza), no fuerza física. "Meet deadlines" es cumplir fechas límite.',
        explain_en:
          '"Strength" here is a professional quality, not physical strength. "Meet deadlines" means finish on time.',
      },
      {
        partner: 'Do you have any questions for us?',
        options: [
          'Yes, what does a typical day look like in this role?',
          'Yes, can I leave early on Fridays?',
          "No, I don't understand English.",
        ],
        answer: 'Yes, what does a typical day look like in this role?',
        explain_es:
          'Hacer una pregunta sobre el trabajo muestra interés. Pedir salir temprano en la entrevista da mala impresión.',
        explain_en:
          'Asking about the job shows interest. Asking to leave early in an interview makes a bad impression.',
      },
      {
        partner: "We'll contact you by the end of the week.",
        options: [
          'Thank you for your time. I look forward to hearing from you.',
          'Okay, bye.',
          "Please call me tonight, it's urgent.",
        ],
        answer: 'Thank you for your time. I look forward to hearing from you.',
        explain_es: '"I look forward to hearing from you" es el cierre formal clásico: espero tener noticias suyas.',
        explain_en: '"I look forward to hearing from you" is the classic formal closing.',
      },
    ],
  },
  {
    id: 'hotel',
    name: 'En un hotel',
    emoji: '🏨',
    level: 'PRINCIPIANTE',
    gradient: 'from-violet-500/20 to-fuchsia-900/40',
    accent: 'text-violet-300',
    partnerRole: 'Receptionist',
    intro_es: 'Llegas a la recepción de un hotel. Elige la respuesta más natural a cada frase.',
    intro_en: "You've arrived at a hotel reception. Choose the most natural reply to each line.",
    turns: [
      {
        partner: 'Welcome to the Grand Hotel. How can I help you?',
        options: ['Hello, I have a reservation for tonight.', "I'd like the chicken, please.", 'Where is the airport?'],
        answer: 'Hello, I have a reservation for tonight.',
        explain_es: 'Al llegar a un hotel con reserva, lo primero es decirlo: "I have a reservation".',
        explain_en: 'When you arrive at a hotel with a booking, the first thing to say is "I have a reservation".',
      },
      {
        partner: 'May I have your name, please?',
        options: ["It's Laura Martinez.", "I'm staying for three nights.", "Yes, I'm very tired."],
        answer: "It's Laura Martinez.",
        explain_es: 'Te piden tu nombre: respondes con "It\'s..." y tu nombre completo.',
        explain_en: 'They ask for your name: answer with "It\'s..." and your full name.',
      },
      {
        partner: 'How many nights will you be staying?',
        options: ['Three nights, until Sunday.', 'On the third floor, please.', 'Just one bag.'],
        answer: 'Three nights, until Sunday.',
        explain_es: '"How many nights" pide una cantidad de noches. Puedes añadir hasta qué día.',
        explain_en: '"How many nights" asks for a number of nights. You can add until which day.',
      },
      {
        partner: 'Breakfast is served from 7 to 10 in the restaurant.',
        options: ['Great, thank you. Is breakfast included?', "Yes, I'd like to check out.", "No, I don't eat."],
        answer: 'Great, thank you. Is breakfast included?',
        explain_es: '"Included" significa incluido en el precio. Es una pregunta típica en un hotel.',
        explain_en: '"Included" means it is part of the price. It is a typical question at a hotel.',
      },
      {
        partner: 'Here is your key. Your room is 304, on the third floor.',
        options: [
          'Thank you. Is there an elevator?',
          "Yes, I'll pay with cash tomorrow.",
          "Sorry, I don't have a reservation.",
        ],
        answer: 'Thank you. Is there an elevator?',
        explain_es: 'Agradeces y preguntas lo que necesitas: "elevator" es el ascensor.',
        explain_en: 'You say thanks and ask what you need: "elevator" is the lift.',
      },
    ],
  },
];
