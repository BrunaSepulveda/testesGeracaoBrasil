const axios = require("axios").default;
const cheerio = require("cheerio");

async function consultaCeg() {
  const apiPrimeiraPag = await axios.get(
    "https://www2.aneel.gov.br/scg/consulta_empreendimento.asp?acao=BUSCAR&pagina=1&IdTipoGeracao=&IdFaseUsina=&CodCIE=&NomeEmpreendimento="
  );

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

  function primeiraPagObjLinhasTabela(response) {
    return extrairDados(response);
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

 const linhasPrimeiraPag = primeiraPagObjLinhasTabela(apiPrimeiraPag);
 console.log(linhasPrimeiraPag[1], linhasPrimeiraPag[2], linhasPrimeiraPag[3])
  // const tabelaCompleta = [];
  // for await (let pag of iteravel) {
  //   if (pag === 1) {
  //     tabelaCompleta.push(...corpoPrimeiraPag);
  //   } else {
  //     const corpoPorPag = await objLinhasTabela(pag);
  //     tabelaCompleta.push(...corpoPorPag);
  //   }
  // }
  // return tabelaCompleta;
}

consultaCeg()
module.exports = consultaCeg;
