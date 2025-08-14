// src/data/symptoms.ts

export const commonSymptoms = [
  'chestpain',
  'abdomnlpain',
  'fuo', // Fever of unknown origin
  'headachemig',
  'breathingDifficulty', // Placeholder, we map this to respdistres
];

// This is a partial list of other symptoms from your dataset for the dropdown.
// In a real project, you would generate this list directly from your features.json file.
export const allSymptoms = [
  "abdomhernia", "abortcompl", "acqfootdef", "acrenlfail", "acutecvd", "acutemi",
  "acutphanm", "adjustmentdisorders", "adltrespfl", "alcoholrelateddisorders", "allergy",
  "analrectal", "anemia", "aneurysm", "anxietydisorders", "appendicitis", "artembolism",
  "asppneumon", "asthma", "backproblem", "biliarydx", "blindness", "bph", "bronchitis",
  "burns", "cardiaarrst", "carditis", "cataract", "chfnonhp", "chrkidneydisease",
  "coaghemrdx", "copd", "crushinjury", "deliriumdementiaamnesticothercognitiv",
  "diabmelnoc", "diabmelwcm", "diverticulos", "dizziness", "dysrhythmia", "earlylabor",
  "ectopicpreg", "encephalitis", "epilepsycnv", "esophgealdx", "eyeinfectn", "fatigue",
  "fluidelcdx", "fxarm", "fxhip", "fxleg", "gangrene", "gastritis", "gastroent",
  "gihemorrhag", "glaucoma", "goutotcrys", "headachemig", "hemmorhoids", "hepatitis",
  "hivinfectn", "hrtvalvedx", "htn", "htncomplicn", "hyperlipidem", "influenza",
  "intobstruct", "intracrninj", "jointinjury", "leukemias", "meningitis", "mooddisorders",
  "ms", "nauseavomit", "nephritis", "opnwndhead", "osteoarthros", "osteoporosis",
  "otitismedia", "ovariancyst", "pancreasdx", "paralysis", "parkinsons", "peritonitis",
  "phlebitis", "pid", "pleurisy", "pneumonia", "pulmhartdx", "septicemia", "shock",
  "sicklecell", "skininfectn", "spincorinj", "sprain", "substancerelateddisorders",
  "suicideandintentionalselfinflictedin", "superficinj", "syncope", "tia", "tonsillitis",
  "tuberculosis", "ulcerskin", "urinstone", "uti", "viralinfect"
  // Add all other relevant symptom columns here
].sort(); // Sort alphabetically for easier searching