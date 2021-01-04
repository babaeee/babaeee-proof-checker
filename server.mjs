import express from "express";
import { projectRoot } from "./paths.mjs";
import bodyParser from "body-parser";
import { createSession, getSession } from "./sessionStore.mjs";

const app = express();
app.use(bodyParser.json());
app.use(express.static(projectRoot + '/static'));
app.post('/api', async (req, res) => {
  const { type } = req.body;
  console.log(req.body);
  if (type === 'create') {
    res.json({
      ok: true,
      ...await createSession(req.body.problem),
    });
    return;
  }
  const { token } = req.body;
  const session = getSession(token);
  if (type === 'sendTactic') {
    res.json({
      ok: true,
      ...await session.sendTactic(req.body.tac),
    });
    return;
  }
  res.json({ ok: false });
});

app.listen(8080);
