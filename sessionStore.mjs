import { randomBytes } from "crypto";
import { problems } from "./problems.mjs";
import { Session } from "./serverSession.mjs";

const store = new Map();

export const createSession = async (pn) => {
  const token = randomBytes(18).toString('base64');
  const x = new Session();
  const goal = await x.setGoal(problems[pn]);
  store.set(token, x);
  console.log(`Session ${token} started`);
  return { token, goal, pallete: x.pallete, statement: x.statement };
};

/**
 * 
 * @param token 
 * @returns {Session}
 */
export const getSession = (token) => {
  return store.get(token);
};
