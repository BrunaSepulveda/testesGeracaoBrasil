const axios = require("axios").default;
const cheerio = require("cheerio");
const { data } = require('./dadosCeg');
const { isNull } = require('lodash')

async function consultaCeg() {

  function getAmountPag(apiPrimeiraPag) {
    const $ = cheerio.load(apiPrimeiraPag.data);
    const quantidadeInString = $(
      'td.linhaBranca:contains("Quantidade")'
    ).text();
    const quantidadeInNumber = Number(
      quantidadeInString
        .replace(/(?<=\s+.*)\s+/g, '')
        .replace('Quantidade:', '')
        .replace('.', '')
        .trim()
    );
    const quantidadePaginas = Math.ceil(quantidadeInNumber / 1000);
    const iteravel = [];
    for (let index = 1; index <= quantidadePaginas; index++) {
      iteravel.push(index);
    }
    return iteravel;
  }

  function extrairDados(response) {
    const $ = cheerio.load(response.data);
    const table = $(".tabelaMaior")[2];
    const linhas = [];

    $(table)
      .find('tr')
      .each((_i, linha) => {
        const linhaPag = []
        $(linha)
          .find('td')
          .each((_index, colunaPorLinha) => {
        linhaPag.push($(colunaPorLinha).text().trim())
      })
      linhas.push(linhaPag)
    })

    return linhas
  }

  async function restPags(pag){
    const api = await axios.get(
      `https://www2.aneel.gov.br/scg/consulta_empreendimento.asp?acao=BUSCAR&pagina=${pag}&IdTipoGeracao=&IdFaseUsina=&CodCIE=&NomeEmpreendimento=`
    );
    return extrairDados(api);
  }
  function stringKwToNumberMw(potencia){
    const potenciaInNumberKw = Number(potencia.replace('.', '').replace(',','.'));
    return potenciaInNumberKw/1000;
  }

  function fieldSeparator(string) {
    if (string) {
      return string.replace(")", "").split("(");
    }
    return null
  }

  function emptyValueToNull(value) {
    return !value || value === ' - ' ? null : value;
  }
  function regexCegResumido(ceg) {
    return ceg.match(/\d{6}-\d{1}/g) ? ceg.match(/\d{6}-\d{1}/g)[0] : null;
  }

  function formatterDataOperacao(data){
    if (!isNull(data)) {
      const regexDateFormater = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
     if (regexDateFormater.test(data)) {
       return new Date(data)
     }
    } else { return null}
  }

  function setValuesOrSetNull(stingValue, prop1, prop2) {
    const valuesList = fieldSeparator(stingValue);
    if (valuesList && valuesList.length > 0) {
      return { [`${prop1}`]:valuesList[0].trim() , [`${prop2}`]: valuesList[1].trim()}
    } else {
      return { [`${prop1}`]:null , [`${prop2}`]: null}
    }
  }

  function formatterLinhas(linesAllPages) {
    /*
    posição esperada dos elementos em cada linha
    [
      ceg,
      tipo,
      nomeEmprendimento,
      potenciaKw,
      garantiaFisicaMw,
      fonte,
      rio,
      dataOperação,
      situação atual,
      proprietário,
      município
    ]
    */
    const allLinesInObj = [];
    linesAllPages.forEach((linha) => {
      if (emptyValueToNull(linha[0])) {  
        const ceg = linha[0],
        cegResumido = regexCegResumido(linha[0]),
        potenciaMw = stringKwToNumberMw(linha[3]),
        { razaoSocial, cnpj } = setValuesOrSetNull(linha[9], 'razaoSocial', 'cnpj'),
        { municipio, uf } = setValuesOrSetNull(linha[10], 'municipio', 'uf'),
        dataOperacao = formatterDataOperacao(linha[7]);

        allLinesInObj.push({
          ceg,
          cegResumido,
          tipo: linha[1],
          potenciaMw,
          garantiaFisicaMw: Number(linha[4].replace(',','.')),
          nomeEmprendimento: linha[2],
          razaoSocial,
          cnpj,
          municipio,
          uf,
          dataOperacao,
        })
      }
    });

    return allLinesInObj
  }

  async function mergeDataFromAllPages(){
    const apiPrimeiraPag = await axios.get(
      "https://www2.aneel.gov.br/scg/consulta_empreendimento.asp?acao=BUSCAR&pagina=1&IdTipoGeracao=&IdFaseUsina=&CodCIE=&NomeEmpreendimento="
    ),
    amountPag = getAmountPag(apiPrimeiraPag),
    allPages = [];
     for(const numberPage of amountPag) {
       if (numberPage === 1) {
         let contentFirstPage = extrairDados(apiPrimeiraPag);
         contentFirstPage.splice(0,1)
        allPages.push(...contentFirstPage);
       } else {
         const contentcurrentPage = await restPags(numberPage);
         allPages.push(...contentcurrentPage);
       }
     }
    return allPages
  }
  let dados = [...data];
  dados.splice(0,1)
  const paginas = formatterLinhas(dados);
  console.log(paginas)
  // function addByCrawler() {
  //   const allLinesPages = await mergeDataFromAllPages();
  //   const allLinesInObj = formatterLinhas(allLinesPages)
  // }
}

consultaCeg()
module.exports = consultaCeg;
