const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

// Middlewares
function validUUID(request, response, next) {
  const { id } = request.params;
  if(!isUuid(id)) {
    return response.status(400).json({
      error: "Invalid repository ID"
    });
  };

  return next();
}
// Criar um middleware para validar o uuid

app.use("/repositories/:id", validUUID);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
}); //OK

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
}); //OK

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body; 

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository ID not Found" });
  }

  const repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
}); //OK

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository ID not Found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0){
    return response.status(400).json({ error: "Repository ID not Found" });
  }

  repositories[repositoryIndex].likes++;

  return response.status(201).json(repositories[repositoryIndex]);

});

module.exports = app;
