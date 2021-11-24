const download = require("download");
const axios = require("axios").default;
const cheerio = require("cheerio");
const fs = require("fs");
const csvParser = require("csv-parser");

async function ralie() {
  function streamToPromise(filePath) {
    const result = [];
    return new Promise(function (resolve, reject) {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (data) => result.push(data))
        .on("end", () => {
          resolve(result);
        })
        .on("error", () => {
          reject;
        });
    });
  }

  const api = await axios(
    "https://www.aneel.gov.br/acompanhamento-da-expansao-da-oferta-de-geracao-de-energia-eletrica"
  );
  const $ = cheerio.load(api.data);
  const tagLink = $(".journal-content-article ul li a").last();
  const link = $(tagLink).attr("href");

  download(`https://www.aneel.gov.br${link}`, "ralie", { extract: true });
  const planilha = await streamToPromise("./ralie/1_Usinas_Implanta.csv");
  const ralie = planilha.map((element) => {
    // pegando so ceg e cronograma enquanto confirmamos quais sao os outros dois campos
    return { ceg: element.CEG, cronograma: element.Cronograma };
  });
  return ralie
}

(async () => ralie())();
