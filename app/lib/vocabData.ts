export type Word = {
  word: string;
  translation: string;
  sentence: string;
  distractors: string[];
};

export type Category = {
  name: string;
  words: Word[];
};

export const categories: Category[] = [
  {
    name: "Deportes",
    words: [
      { word: "coach", translation: "entrenador/a", sentence: "The ___ called a timeout in the final minute.", distractors: ["árbitro", "aficionado", "campeón"] },
      { word: "underdog", translation: "el que no es favorito", sentence: "Nobody expected the ___ to win the match.", distractors: ["capitán", "titular", "árbitro"] },
      { word: "warm up", translation: "calentar (antes de jugar)", sentence: "The team started to ___ before kickoff.", distractors: ["retirarse", "empatar", "anotar"] },
      { word: "draw", translation: "empate", sentence: "The game ended in a 2-2 ___.", distractors: ["victoria", "penal", "descalificación"] },
      { word: "stamina", translation: "resistencia física", sentence: "Marathon runners need a lot of ___.", distractors: ["velocidad", "suerte", "altura"] },
      { word: "sideline", translation: "línea de banda", sentence: "The injured player watched from the ___.", distractors: ["cancha central", "vestuario", "podio"] },
    ],
  },
  {
    name: "Comida",
    words: [
      { word: "simmer", translation: "cocinar a fuego lento", sentence: "Let the sauce ___ for twenty minutes.", distractors: ["congelar", "hornear", "picar"] },
      { word: "craving", translation: "antojo", sentence: "I have a ___ for something sweet.", distractors: ["alergia", "dieta", "porción"] },
      { word: "leftovers", translation: "sobras", sentence: "We had the ___ for lunch the next day.", distractors: ["postre", "receta", "ingredientes"] },
      { word: "seasoning", translation: "condimento / sazón", sentence: "This soup needs a bit more ___.", distractors: ["textura", "envase", "cubierto"] },
      { word: "stale", translation: "pasado / duro (pan, etc.)", sentence: "The bread went ___ after a few days.", distractors: ["fresco", "picante", "jugoso"] },
      { word: "takeout", translation: "comida para llevar", sentence: "We ordered ___ instead of cooking tonight.", distractors: ["propina", "reserva", "menú"] },
    ],
  },
  {
    name: "Formal",
    words: [
      { word: "regarding", translation: "con respecto a", sentence: "I'm writing ___ your recent request.", distractors: ["a pesar de", "en lugar de", "a través de"] },
      { word: "clarify", translation: "aclarar", sentence: "Could you ___ what you meant by that?", distractors: ["repetir", "adivinar", "resumir"] },
      { word: "sincerely", translation: "atentamente", sentence: "___, Maria Gonzalez.", distractors: ["saludos casuales", "hasta luego", "nos vemos"] },
      { word: "regards", translation: "saludos (formal)", sentence: "Best ___, the HR team.", distractors: ["besos", "abrazos", "nada"] },
      { word: "request", translation: "solicitud", sentence: "We received your ___ this morning.", distractors: ["queja", "opinión", "sorpresa"] },
      { word: "attached", translation: "adjunto", sentence: "Please find the file ___ to this email.", distractors: ["borrado", "vencido", "perdido"] },
    ],
  },
  {
    name: "Negocios",
    words: [
      { word: "stakeholder", translation: "parte interesada", sentence: "Every ___ needs to approve the plan.", distractors: ["empleado nuevo", "cliente furioso", "competidor"] },
      { word: "revenue", translation: "ingresos", sentence: "Our ___ grew by 15% this quarter.", distractors: ["gasto", "deuda", "impuesto"] },
      { word: "deadline", translation: "fecha límite", sentence: "We need to finish before the ___.", distractors: ["reunión", "presupuesto", "contrato"] },
      { word: "negotiate", translation: "negociar", sentence: "They will ___ the terms tomorrow.", distractors: ["cancelar", "firmar sin ver", "ignorar"] },
      { word: "outsource", translation: "subcontratar", sentence: "We decided to ___ our customer support.", distractors: ["despedir", "promover", "auditar"] },
      { word: "merger", translation: "fusión (de empresas)", sentence: "The two companies announced a ___.", distractors: ["quiebra", "huelga", "auditoría"] },
    ],
  },
  {
    name: "Estudios",
    words: [
      { word: "assignment", translation: "tarea / trabajo asignado", sentence: "The ___ is due next Monday.", distractors: ["recreo", "calificación", "asistencia"] },
      { word: "outline", translation: "esquema / bosquejo", sentence: "Write an ___ before the full essay.", distractors: ["borrador final", "resumen extenso", "índice"] },
      { word: "GPA", translation: "promedio académico", sentence: "Her ___ improved this semester.", distractors: ["horario", "beca", "matrícula"] },
      { word: "plagiarism", translation: "plagio", sentence: "___ can get your paper rejected.", distractors: ["la puntualidad", "la creatividad", "la colaboración"] },
      { word: "cram", translation: "estudiar todo de último momento", sentence: "I had to ___ for the exam last night.", distractors: ["repasar con calma", "faltar a clase", "aprobar"] },
      { word: "syllabus", translation: "programa del curso", sentence: "Check the ___ for the exam dates.", distractors: ["diploma", "boletín", "carnet"] },
    ],
  },
];
