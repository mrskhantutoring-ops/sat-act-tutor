// Seed script: inserts 25 ORIGINAL practice questions (no copyrighted content).
// Run with: npm run db:seed   (requires DATABASE_URL to be set)
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * @typedef {{subject:string, domain:string, difficulty:string, prompt:string,
 *   choices:string[]|null, correctIndex:number|null, correctText:string, explanation:string}} Q
 */
/** @type {Q[]} */
const QUESTIONS = [
  // ---------- SAT MATH · Algebra ----------
  {
    subject: "sat-math", domain: "Algebra", difficulty: "easy",
    prompt: "If 3(x − 4) + 7 = 2x + 5, what is the value of x?",
    choices: ["8", "10", "12", "14"], correctIndex: 1, correctText: "10",
    explanation: "Distribute: 3x − 12 + 7 = 2x + 5, so 3x − 5 = 2x + 5. Subtract 2x: x − 5 = 5, so x = 10.",
  },
  {
    subject: "sat-math", domain: "Algebra", difficulty: "easy",
    prompt: "A line passes through the points (2, 5) and (6, 13). What is the slope of the line?",
    choices: ["1", "2", "3", "4"], correctIndex: 1, correctText: "2",
    explanation: "Slope = (change in y) / (change in x) = (13 − 5) / (6 − 2) = 8 / 4 = 2.",
  },
  {
    subject: "sat-math", domain: "Algebra", difficulty: "medium",
    prompt: "If 2x + y = 11 and x − y = 1, what is the value of y?",
    choices: ["2", "3", "4", "5"], correctIndex: 1, correctText: "3",
    explanation: "Add the equations to eliminate y: 3x = 12, so x = 4. Then y = x − 1 = 3.",
  },
  {
    subject: "sat-math", domain: "Algebra", difficulty: "medium",
    prompt: "Which of the following values of x satisfies the inequality 5 − 2x < 13?",
    choices: ["−6", "−5", "−4", "−3"], correctIndex: 3, correctText: "−3",
    explanation: "Subtract 5: −2x < 8. Divide by −2 and flip the sign: x > −4. Of the choices, only −3 is greater than −4.",
  },
  // ---------- SAT MATH · Advanced Math ----------
  {
    subject: "sat-math", domain: "Advanced Math", difficulty: "medium",
    prompt: "If (x + 3)(x − 5) = x² + bx + c, what is the value of b + c? (Grid-in: type your answer.)",
    choices: null, correctIndex: null, correctText: "-17",
    explanation: "Expand: (x + 3)(x − 5) = x² − 5x + 3x − 15 = x² − 2x − 15. So b = −2 and c = −15, and b + c = −17.",
  },
  {
    subject: "sat-math", domain: "Advanced Math", difficulty: "easy",
    prompt: "If f(x) = x² − 4x + 7, what is the value of f(5)?",
    choices: ["10", "12", "14", "17"], correctIndex: 1, correctText: "12",
    explanation: "Substitute: f(5) = 25 − 20 + 7 = 12.",
  },
  {
    subject: "sat-math", domain: "Advanced Math", difficulty: "easy",
    prompt: "If x² = 49 and x < 0, what is the value of x? (Grid-in: type your answer.)",
    choices: null, correctIndex: null, correctText: "-7",
    explanation: "x² = 49 gives x = 7 or x = −7. Since x < 0, x = −7.",
  },
  {
    subject: "sat-math", domain: "Advanced Math", difficulty: "medium",
    prompt: "If 2^x = 32, what is the value of x?",
    choices: ["4", "5", "6", "8"], correctIndex: 1, correctText: "5",
    explanation: "Write 32 as a power of 2: 32 = 2^5, so x = 5.",
  },
  // ---------- SAT MATH · Problem-Solving and Data Analysis ----------
  {
    subject: "sat-math", domain: "Problem-Solving and Data Analysis", difficulty: "easy",
    prompt: "A jacket originally priced at $80 is on sale for 25% off. What is the sale price?",
    choices: ["$55", "$60", "$64", "$65"], correctIndex: 1, correctText: "$60",
    explanation: "25% off means you pay 75%: 0.75 × 80 = 60, so the sale price is $60.",
  },
  {
    subject: "sat-math", domain: "Problem-Solving and Data Analysis", difficulty: "easy",
    prompt: "What is the mean (average) of 4, 8, 12, and 16?",
    choices: ["8", "10", "12", "40"], correctIndex: 1, correctText: "10",
    explanation: "Mean = sum ÷ count = (4 + 8 + 12 + 16) ÷ 4 = 40 ÷ 4 = 10.",
  },
  {
    subject: "sat-math", domain: "Problem-Solving and Data Analysis", difficulty: "medium",
    prompt: "A bag contains 3 red marbles and 5 blue marbles. If one marble is drawn at random, what is the probability that it is red?",
    choices: ["3/8", "3/5", "5/8", "1/3"], correctIndex: 0, correctText: "3/8",
    explanation: "Probability = favorable ÷ total = 3 ÷ (3 + 5) = 3/8.",
  },
  // ---------- SAT MATH · Geometry and Trigonometry ----------
  {
    subject: "sat-math", domain: "Geometry and Trigonometry", difficulty: "easy",
    prompt: "A right triangle has legs of length 9 and 12. What is the length of the hypotenuse?",
    choices: ["13", "14", "15", "21"], correctIndex: 2, correctText: "15",
    explanation: "Pythagorean theorem: c² = 9² + 12² = 81 + 144 = 225, so c = 15.",
  },
  {
    subject: "sat-math", domain: "Geometry and Trigonometry", difficulty: "medium",
    prompt: "A circle has an area of 36π. What is the radius of the circle?",
    choices: ["4", "6", "9", "12"], correctIndex: 1, correctText: "6",
    explanation: "Area = πr², so πr² = 36π → r² = 36 → r = 6.",
  },
  {
    subject: "sat-math", domain: "Geometry and Trigonometry", difficulty: "easy",
    prompt: "What is the value of sin(30°)?",
    choices: ["0", "1/2", "√2/2", "1"], correctIndex: 1, correctText: "1/2",
    explanation: "In a 30°-60°-90° triangle the side opposite 30° is half the hypotenuse, so sin(30°) = 1/2. Worth memorizing!",
  },
  // ---------- ACT MATH (4 choices, Enhanced ACT style) ----------
  {
    subject: "act-math", domain: "Algebra", difficulty: "easy",
    prompt: "If 4x − 9 = 2x + 7, what is the value of x?",
    choices: ["6", "7", "8", "9"], correctIndex: 2, correctText: "8",
    explanation: "Subtract 2x: 2x − 9 = 7. Add 9: 2x = 16, so x = 8.",
  },
  {
    subject: "act-math", domain: "Number & Quantity", difficulty: "easy",
    prompt: "What is 30% of 240?",
    choices: ["60", "66", "72", "80"], correctIndex: 2, correctText: "72",
    explanation: "30% = 0.30, and 0.30 × 240 = 72.",
  },
  {
    subject: "act-math", domain: "Algebra", difficulty: "medium",
    prompt: "What is the slope of the line 3x + 4y = 12?",
    choices: ["−4/3", "−3/4", "3/4", "4/3"], correctIndex: 1, correctText: "−3/4",
    explanation: "Solve for y: 4y = −3x + 12 → y = −(3/4)x + 3. The slope is the coefficient of x: −3/4.",
  },
  {
    subject: "act-math", domain: "Geometry", difficulty: "easy",
    prompt: "A rectangle is 8 units long and 5 units wide. What is its area, in square units?",
    choices: ["13", "26", "40", "45"], correctIndex: 2, correctText: "40",
    explanation: "Area of a rectangle = length × width = 8 × 5 = 40.",
  },
  {
    subject: "act-math", domain: "Algebra", difficulty: "medium",
    prompt: "If x² − 9 = 0, what is the sum of all possible values of x?",
    choices: ["−6", "−3", "0", "3"], correctIndex: 2, correctText: "0",
    explanation: "x² = 9 gives x = 3 or x = −3. Their sum is 3 + (−3) = 0.",
  },
  // ---------- SAT READING & WRITING ----------
  {
    subject: "sat-reading-writing", domain: "Standard English Conventions", difficulty: "medium",
    prompt: "The team ___ practicing since early morning.\n\nWhich choice completes the sentence so that it conforms to the conventions of Standard English?",
    choices: ["has been", "have been", "are been", "is been"], correctIndex: 0, correctText: "has been",
    explanation: "'Team' is a singular collective noun, so it takes the singular verb 'has been.' 'Are been' and 'is been' are never correct forms.",
  },
  {
    subject: "sat-reading-writing", domain: "Expression of Ideas", difficulty: "easy",
    prompt: "The park is popular with visitors. ___, it closes early in winter.\n\nWhich choice provides the most logical transition?",
    choices: ["However,", "Moreover,", "Therefore,", "For example,"], correctIndex: 0, correctText: "However,",
    explanation: "The second sentence contrasts with the first (popular, but closes early), so the contrast transition 'However,' is correct.",
  },
  {
    subject: "sat-reading-writing", domain: "Information and Ideas", difficulty: "medium",
    prompt: "After months of testing, the engineers found that every one of their predictions was wrong — the bridge model failed under loads it was designed to handle easily.\n\nWhich choice best states the main idea of the text?",
    choices: [
      "The engineers' predictions were confirmed by the tests.",
      "The tests showed the engineers' model was less reliable than expected.",
      "The engineers decided to stop testing bridges entirely.",
      "The bridge model was the strongest ever built.",
    ], correctIndex: 1, correctText: "The tests showed the engineers' model was less reliable than expected.",
    explanation: "The key details — predictions wrong, model failed under easy loads — support only the idea that the model was less reliable than expected.",
  },
  // ---------- ACT ENGLISH ----------
  {
    subject: "act-english", domain: "Conventions of Standard English", difficulty: "medium",
    prompt: "Which choice best corrects the underlined portion?\n\nShe ran fast, she won the race.",
    choices: ["fast, she", "fast; she", "fast she", "fast: she"], correctIndex: 1, correctText: "fast; she",
    explanation: "Two independent clauses joined by only a comma is a comma splice. A semicolon correctly joins them; removing the comma entirely would create a run-on.",
  },
  {
    subject: "act-english", domain: "Conventions of Standard English", difficulty: "easy",
    prompt: "Neither of the players ___ ready for the final match.\n\nWhich choice completes the sentence correctly?",
    choices: ["is", "are", "were", "be"], correctIndex: 0, correctText: "is",
    explanation: "'Neither' is singular, so it takes the singular verb 'is' — even though 'players' is plural.",
  },
  {
    subject: "act-english", domain: "Knowledge of Language", difficulty: "medium",
    prompt: "Which choice expresses the idea most concisely?\n\n\"The reason why the committee delayed the vote was because members wanted more data.\"",
    choices: [
      "The reason why the committee delayed the vote was because members wanted more data.",
      "The committee delayed the vote because members wanted more data.",
      "The reason for the delay of the vote by the committee was on account of members wanting more data.",
      "Because of the fact that members wanted more data, the committee delayed the vote.",
    ], correctIndex: 1, correctText: "The committee delayed the vote because members wanted more data.",
    explanation: "ACT English rewards concision. 'The reason why... was because' is redundant — the shortest choice says the same thing with no extra words.",
  },
];

async function main() {
  console.log(`Seeding ${QUESTIONS.length} questions…`);
  await db.question.deleteMany();
  await db.question.createMany({ data: QUESTIONS });
  const count = await db.question.count();
  console.log(`Done. ${count} questions in the database.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
