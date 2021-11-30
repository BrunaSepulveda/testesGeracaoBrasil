const download = require("download");
const xlsx = require("node-xlsx");
const axios = require("axios").default;
const cheerio = require("cheerio");

async function leilao() {
  const api = await axios.get(
    "https://www.ccee.org.br/acervo-ccee?especie=38753&assunto=39056&keyword=consolidado&periodo=365"
  );
  const $ = cheerio.load(api.data);
  const tagsA = $(".col .card.shadow-sm .card-footer a").first();
  const link = $(tagsA).attr("href");
  const planilha = await download(link);
  let planilhaObj = xlsx
    .parse(planilha)
    .find((element) => element.name === "Resultado Consolidado").data;
  planilhaObj.splice(0, 10);
  const leiloes = planilhaObj.map((linha) => {
    return { leilao: linha[3], ceg: linha[12] };
  });
  return leiloes.filter((element) => element.ceg !== " -");
}

module.exports = leilao