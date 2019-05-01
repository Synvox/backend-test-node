import Router from "@synvox/router";
import Knex from "knex";
import axios from "axios";

const knex = Knex({
  client: "sqlite3",
  connection: {
    filename: "./db.sqlite3"
  }
});

const router = Router();

router.get("/", async (_req, res) => {
  await knex("visits").insert({});

  const { count } = await knex("visits")
    .count({ count: "id" })
    .first();

  const response = await axios({
    method: "post",
    url: "http://localhost:8088",
    data: createImagePayload(count),
    responseType: "stream"
  });

  response.data.pipe(res);
});

function createImagePayload(count) {
  const characters = count.toString(2);
  const scale = 60;
  const margin = 10;
  const width = (characters.length + 1) * scale + margin;

  const numberMap = {
    1: index => [
      { cmd: "SetRGBA", args: [0.1, 0.5, 1, 1] },
      {
        cmd: "DrawCircle",
        args: [index * (scale + margin) + scale / 2, scale / 2, scale / 3]
      },
      { cmd: "Fill" }
    ],
    0: index => [
      { cmd: "SetRGBA", args: [0.5, 0.5, 0.5, 1] },
      {
        cmd: "DrawCircle",
        args: [index * (scale + margin) + scale / 2, scale / 2, scale / 4]
      },
      { cmd: "Stroke" }
    ]
  };

  return {
    canvas_width: width,
    canvas_height: scale,
    img_commands: [
      { cmd: "SetLineWidth", args: [1] },
      ...characters
        .split("")
        .map((character, index) => numberMap[character](index))
        .reduce((a, b) => a.concat(b), [])
    ]
  };
}

export default router;
