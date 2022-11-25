import "dotenv/config";
import fs from "fs";
import express from "express";
import handlebars from "handlebars";
import format from "../../utils/console";

const { EMAIL_DEV_SERVER_PORT } = process.env;

const TEMPLATE_DIR = "src/email/views/";

handlebars.registerPartial("base", handlebars.compile(fs.readFileSync(`${TEMPLATE_DIR}base.hbs`, "utf8")));

const templateFolders = fs.readdirSync(TEMPLATE_DIR, { withFileTypes: true }).filter((path) => path.isDirectory());

const templates: Record<string, HandlebarsTemplateDelegate> = {};

for (const templateDir of templateFolders) {
  const content = fs.readFileSync(`${TEMPLATE_DIR}${templateDir.name}/template.hbs`, "utf8");
  templates[templateDir.name] = handlebars.compile(content);
}

const app = express();

app.get("/", (req, res) =>
  res.send(
    Object.keys(templates)
      .map((templateName) => `<a href="/${templateName}">${templateName}</a>`)
      .join("<br>")
  )
);

app.get("/:template", (req, res) => {
  const { template }: { template: string } = req.params;

  if (!(template in templates)) return res.status(404).send("Invalid template");

  return res.send(templates[template]({ name: "Username", request: { ip: "127.0.0.1", flag: "🌍" } }));
});

app.listen(EMAIL_DEV_SERVER_PORT, () => {
  const url = `http://localhost:${EMAIL_DEV_SERVER_PORT}/`;
  console.log(`Listening on ${EMAIL_DEV_SERVER_PORT}`);
  console.log(`Access via ${format.link(url)}`);
});
