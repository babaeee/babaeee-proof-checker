import express from "express";
import { projectRoot } from "./paths.mjs";
import bodyParser from "body-parser";
import { createSession, getSession } from "./sessionStore.mjs";

const app = express();
app.use(bodyParser.json());
app.use(express.static(projectRoot + '/static'));
app.post('/api', async (req, res) => {
  try {
    const { type } = req.body;
    if (type === 'create') {
      res.json(await createSession(req.body.course, req.body.problem));
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
  } catch(e) {
    console.log(e);
    res.json({
      ok: false,
      type: 'server fault',
      error: e.stack,
    });
  }
});

app.listen(32210);
