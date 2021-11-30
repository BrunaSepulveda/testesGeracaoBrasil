const express = require("express");

const consultaCeg = require("./consultaCeg");
// const consultaCegJson = require("./consultaCegJson")
const infomercado = require("./infomercado");
const leilao = require("./leilao");
const nodal = require("./nodal");
const ralie = require("./ralie");
const siga = require("./siga");

const app = express();

app.use(express.json());

app.get("/", async (_request, response) => {
  response.send("Aplicação base geração brasil");
});

app.get("/resultados", async (_request, response) => {
  try {
    const resSiga = await siga();
    const resRalie = await ralie();
    const resNodal = await nodal();
    const resLeilao = await leilao();
    const resInfomercado = await infomercado();
    const resConsultaCeg = await consultaCeg()
    response.json({
      siga: resSiga,
      ralie: resRalie,
      nodal: resNodal,
      leilao: resLeilao,
      infomercado: resInfomercado,
      consultaCeg: resConsultaCeg
    });
  } catch (error) {
    response.json(error.message);
  }
});

app.get("/siga", async (_request, response) => {
  try {
    const resSiga = await siga();
    response.json(resSiga)
  } catch (error) {
    response.json(error.message);
  }
});

app.get("/ralie", async (_request, response) => {
  try {
    const resRalie = await ralie();
    response.json(resRalie)
  } catch (error) {
    response.json(error.message);
  }
});

app.get("/nodal", async (_request, response) => {
  try {
    const resNodal = await nodal();
    response.json(resNodal)
  } catch (error) {
    response.json(error.message);
  }
});

app.get("/leilao", async (_request, response) => {
  try {
    const resLeilao = await leilao();
    response.json(resLeilao)
  } catch (error) {
    response.json(error.message);
  }
});

app.get("/infomercado", async (_request, response) => {
  try {
    const resInfomercado = await infomercado();
    response.json(resInfomercado)
  } catch (error) {
    response.json(error.message);
  }
});

app.get("/ceg", async (_request, response) => {
  try {
    const resCeg = await consultaCeg();
    response.json(resCeg)
  } catch (error) {
    response.json(error.message);
  }
});


app.listen("3000", () => {
  console.log("App is running at port 3000");
});
