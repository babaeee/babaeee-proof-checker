import { randomBytes } from "crypto";
import { problems } from "./problems/index.mjs";
import { Session } from "./serverSession.mjs";

const store = new Map();

export const createSession = async (course, pn) => {
  const token = randomBytes(18).toString('base64');
  const x = new Session();
  if (problems[course][pn] === undefined) {
    return {
      ok: false,
      reason: 'bad level',
    };
  }
  const goal = await x.setGoal(problems[course][pn]);
  store.set(token, x);
  console.log(`Session ${token} started`);
  return {
    ok: true, tools: x.tools,
    token, goal, pallete: x.pallete, statement: x.statement,
  };
};

/**
 * 
 * @param token 
 * @returns {Session}
 */
export const getSession = (token) => {
  return store.get(token);
};
