const axios = require("axios").default;
const cheerio = require("cheerio");
const { data } = require('./dadosCeg');

async function consultaCeg() {
  // const apiPrimeiraPag = await axios.get(
  //   "https://www2.aneel.gov.br/scg/consulta_empreendimento.asp?acao=BUSCAR&pagina=1&IdTipoGeracao=&IdFaseUsina=&CodCIE=&NomeEmpreendimento="
  // );

  // const $ = cheerio.load(apiPrimeiraPag.data);
  // let quantidade = $('td.linhaBranca:contains("Quantidade")').text();
  // quantidade = Number(
  //   quantidade
  //     .replace(/(?<=\s+.*)\s+/g, "")
  //     .replace("Quantidade:", "")
  //     .replace(".", "")
  //     .trim()
  // );
  // const quantidadePaginas = Math.ceil(quantidade / 1000);
  // let iteravel = [];
  // for (let index = 1; index <= quantidadePaginas; index++) {
  //   iteravel.push(index);
  // }

  // function primeiraPagObjLinhasTabela(response) {
  //   return extrairDados(response);
  // }

  // function extrairDados(response) {
  //   const $ = cheerio.load(response.data);
  //   const table = $(".tabelaMaior")[2];
  //   const linhas = [];

  //   $(table)
  //     .find('tr')
  //     .each((_i, linha) => {
  //       const linhaPag = []
  //       $(linha)
  //         .find('td')
  //         .each((_index, colunaPorLinha) => {
  //       linhaPag.push($(colunaPorLinha).text().trim())
  //     })
  //     linhas.push(linhaPag)
  //   })

  //   return linhas
  // }
  function emptyValueToNull(value) {
    return !value || value === ' - ' ? null : value;
  }
  function regexCegResumido(ceg) {
    return ceg.match(/\d{6}-\d{1}/g) ? ceg.match(/\d{6}-\d{1}/g)[0] : null;
  }

  function formatterLinhas(linhasPorPagina) {
    const corpoPorPag = [];
    linhasPorPagina.forEach((linha) => {
      const cegResumido = regexCegResumido(linha[0])
      // tipo linha[1] nomeEmprendimento linha[2]
    });
  }
}

consultaCeg()
module.exports = consultaCeg;

ceg
tipo
nomeEmprendimento
potenciaMw
garantiaFisicaMw
razaoSocial
cnpj
municipio
uf
dataOperacao