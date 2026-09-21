export type Word = {
  word: string;
  translation: string;
  sentence: string;
  distractors: string[];
  hint_es: string;
  hint_en: string;
};

export type Category = {
  name: string;
  words: Word[];
};

export const categories: Category[] = [
  {
    name: 'Deportes',
    words: [
      {
        word: 'coach',
        translation: 'entrenador/a',
        sentence: 'The ___ called a timeout in the final minute.',
        distractors: ['árbitro', 'aficionado', 'campeón'],
        hint_es: 'Vas a practicar cómo se le dice a la persona que dirige y entrena a un equipo.',
        hint_en: "You'll practice the word for the person who trains and guides a team.",
      },
      {
        word: 'underdog',
        translation: 'el que no es favorito',
        sentence: 'Nobody expected the ___ to win the match.',
        distractors: ['capitán', 'titular', 'árbitro'],
        hint_es: 'Aprenderás a nombrar al competidor que empieza en desventaja frente a los demás.',
        hint_en: "You'll learn how to name the competitor who starts at a disadvantage.",
      },
      {
        word: 'warm up',
        translation: 'calentar (antes de jugar)',
        sentence: 'The team started to ___ before kickoff.',
        distractors: ['retirarse', 'empatar', 'anotar'],
        hint_es: 'Es lo que hace un equipo justo antes de empezar a competir.',
        hint_en: 'This is what a team does right before the match begins.',
      },
      {
        word: 'draw',
        translation: 'empate',
        sentence: 'The game ended in a 2-2 ___.',
        distractors: ['victoria', 'penal', 'descalificación'],
        hint_es: 'Practica cómo se dice cuando ningún equipo gana ni pierde.',
        hint_en: 'Practice the word for when neither team wins or loses.',
      },
      {
        word: 'stamina',
        translation: 'resistencia física',
        sentence: 'Marathon runners need a lot of ___.',
        distractors: ['velocidad', 'suerte', 'altura'],
        hint_es: 'Se refiere a la capacidad de aguantar esfuerzo físico por mucho tiempo.',
        hint_en: 'It refers to the ability to sustain physical effort for a long time.',
      },
      {
        word: 'sideline',
        translation: 'línea de banda',
        sentence: 'The injured player watched from the ___.',
        distractors: ['cancha central', 'vestuario', 'podio'],
        hint_es: 'Esta palabra describe el lugar desde donde se observa el juego sin participar.',
        hint_en: 'This word describes the area from which someone watches without playing.',
      },
    ],
  },
  {
    name: 'Comida',
    words: [
      {
        word: 'simmer',
        translation: 'cocinar a fuego lento',
        sentence: 'Let the sauce ___ for twenty minutes.',
        distractors: ['congelar', 'hornear', 'picar'],
        hint_es: 'Es una técnica de cocina para cocinar algo despacio y a baja temperatura.',
        hint_en: "It's a cooking technique for cooking something slowly at low heat.",
      },
      {
        word: 'craving',
        translation: 'antojo',
        sentence: 'I have a ___ for something sweet.',
        distractors: ['alergia', 'dieta', 'porción'],
        hint_es: 'Describe esas ganas repentinas de comer algo específico.',
        hint_en: 'It describes a sudden strong desire to eat something specific.',
      },
      {
        word: 'leftovers',
        translation: 'sobras',
        sentence: 'We had the ___ for lunch the next day.',
        distractors: ['postre', 'receta', 'ingredientes'],
        hint_es: 'Se refiere a la comida que sobra después de una comida.',
        hint_en: 'It refers to food that remains after a meal.',
      },
      {
        word: 'seasoning',
        translation: 'condimento / sazón',
        sentence: 'This soup needs a bit more ___.',
        distractors: ['textura', 'envase', 'cubierto'],
        hint_es: 'Se usa para hablar de lo que le da sabor a un platillo.',
        hint_en: "It's used to talk about what gives flavor to a dish.",
      },
      {
        word: 'stale',
        translation: 'pasado / duro (pan, etc.)',
        sentence: 'The bread went ___ after a few days.',
        distractors: ['fresco', 'picante', 'jugoso'],
        hint_es: 'Describe comida que ya perdió su frescura, como el pan duro.',
        hint_en: 'It describes food that lost its freshness, like hardened bread.',
      },
      {
        word: 'takeout',
        translation: 'comida para llevar',
        sentence: 'We ordered ___ instead of cooking tonight.',
        distractors: ['propina', 'reserva', 'menú'],
        hint_es: 'Es la comida que pides en un restaurante para llevar a casa.',
        hint_en: "It's food you order from a restaurant to eat elsewhere.",
      },
    ],
  },
  {
    name: 'Formal',
    words: [
      {
        word: 'regarding',
        translation: 'con respecto a',
        sentence: "I'm writing ___ your recent request.",
        distractors: ['a pesar de', 'en lugar de', 'a través de'],
        hint_es: 'Se usa en correos formales para introducir el tema del mensaje.',
        hint_en: 'Used in formal emails to introduce the subject of the message.',
      },
      {
        word: 'clarify',
        translation: 'aclarar',
        sentence: 'Could you ___ what you meant by that?',
        distractors: ['repetir', 'adivinar', 'resumir'],
        hint_es: 'Se usa cuando pides que algo se explique con más claridad.',
        hint_en: 'Used when you ask for something to be explained more clearly.',
      },
      {
        word: 'sincerely',
        translation: 'atentamente',
        sentence: '___, Maria Gonzalez.',
        distractors: ['saludos casuales', 'hasta luego', 'nos vemos'],
        hint_es: 'Es la forma común de cerrar una carta o correo formal en inglés.',
        hint_en: "It's the common way to close a formal letter or email.",
      },
      {
        word: 'regards',
        translation: 'saludos (formal)',
        sentence: 'Best ___, the HR team.',
        distractors: ['besos', 'abrazos', 'nada'],
        hint_es: 'Una despedida formal y breve, común al final de correos de trabajo.',
        hint_en: 'A brief, formal way to close a work email.',
      },
      {
        word: 'request',
        translation: 'solicitud',
        sentence: 'We received your ___ this morning.',
        distractors: ['queja', 'opinión', 'sorpresa'],
        hint_es: 'Se refiere a pedir algo de manera formal, como un documento o favor.',
        hint_en: 'It refers to formally asking for something, like a document or favor.',
      },
      {
        word: 'attached',
        translation: 'adjunto',
        sentence: 'Please find the file ___ to this email.',
        distractors: ['borrado', 'vencido', 'perdido'],
        hint_es: 'Se usa para decir que algo va incluido junto con el mensaje, como un archivo.',
        hint_en: 'Used to say something is included along with the message, like a file.',
      },
    ],
  },
  {
    name: 'Negocios',
    words: [
      {
        word: 'stakeholder',
        translation: 'parte interesada',
        sentence: 'Every ___ needs to approve the plan.',
        distractors: ['empleado nuevo', 'cliente furioso', 'competidor'],
        hint_es: 'Se refiere a cualquier persona o grupo afectado por las decisiones de una empresa.',
        hint_en: "It refers to any person or group affected by a company's decisions.",
      },
      {
        word: 'revenue',
        translation: 'ingresos',
        sentence: 'Our ___ grew by 15% this quarter.',
        distractors: ['gasto', 'deuda', 'impuesto'],
        hint_es: 'Es el dinero total que entra a una empresa por sus ventas.',
        hint_en: "It's the total money a company brings in from sales.",
      },
      {
        word: 'deadline',
        translation: 'fecha límite',
        sentence: 'We need to finish before the ___.',
        distractors: ['reunión', 'presupuesto', 'contrato'],
        hint_es: 'Es la fecha máxima para entregar algo.',
        hint_en: "It's the final date by which something must be delivered.",
      },
      {
        word: 'negotiate',
        translation: 'negociar',
        sentence: 'They will ___ the terms tomorrow.',
        distractors: ['cancelar', 'firmar sin ver', 'ignorar'],
        hint_es: 'Es el proceso de discutir para llegar a un acuerdo entre las partes.',
        hint_en: "It's the process of discussing to reach an agreement between parties.",
      },
      {
        word: 'outsource',
        translation: 'subcontratar',
        sentence: 'We decided to ___ our customer support.',
        distractors: ['despedir', 'promover', 'auditar'],
        hint_es: 'Se refiere a contratar a otra empresa externa para hacer una tarea.',
        hint_en: 'It refers to hiring an outside company to handle a task.',
      },
      {
        word: 'merger',
        translation: 'fusión (de empresas)',
        sentence: 'The two companies announced a ___.',
        distractors: ['quiebra', 'huelga', 'auditoría'],
        hint_es: 'Ocurre cuando dos empresas se unen para formar una sola.',
        hint_en: 'It happens when two companies join together to become one.',
      },
    ],
  },
  {
    name: 'Estudios',
    words: [
      {
        word: 'assignment',
        translation: 'tarea / trabajo asignado',
        sentence: 'The ___ is due next Monday.',
        distractors: ['recreo', 'calificación', 'asistencia'],
        hint_es: 'Es el trabajo que un profesor te pide entregar en cierta fecha.',
        hint_en: "It's the work a teacher asks you to turn in by a certain date.",
      },
      {
        word: 'outline',
        translation: 'esquema / bosquejo',
        sentence: 'Write an ___ before the full essay.',
        distractors: ['borrador final', 'resumen extenso', 'índice'],
        hint_es: 'Es la estructura básica que organizas antes de escribir algo completo.',
        hint_en: "It's the basic structure you organize before writing something in full.",
      },
      {
        word: 'GPA',
        translation: 'promedio académico',
        sentence: 'Her ___ improved this semester.',
        distractors: ['horario', 'beca', 'matrícula'],
        hint_es: 'Es el número que resume tu rendimiento académico general.',
        hint_en: "It's the number that summarizes your overall academic performance.",
      },
      {
        word: 'plagiarism',
        translation: 'plagio',
        sentence: '___ can get your paper rejected.',
        distractors: ['la puntualidad', 'la creatividad', 'la colaboración'],
        hint_es: 'Se refiere a copiar el trabajo de alguien más y presentarlo como propio.',
        hint_en: "It refers to copying someone else's work and presenting it as your own.",
      },
      {
        word: 'cram',
        translation: 'estudiar todo de último momento',
        sentence: 'I had to ___ for the exam last night.',
        distractors: ['repasar con calma', 'faltar a clase', 'aprobar'],
        hint_es: 'Describe estudiar muchísimo justo antes de un examen, sin planearlo antes.',
        hint_en: 'It describes studying intensely right before an exam, without planning ahead.',
      },
      {
        word: 'syllabus',
        translation: 'programa del curso',
        sentence: 'Check the ___ for the exam dates.',
        distractors: ['diploma', 'boletín', 'carnet'],
        hint_es: 'Es el documento que resume los temas y fechas importantes de un curso.',
        hint_en: "It's the document summarizing a course's topics and important dates.",
      },
    ],
  },
];
