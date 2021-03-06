const axios = require("axios").default;
const cheerio = require("cheerio");

async function consultaCeg() {
  const apiPrimeiraPag = await axios.post(
    "https://www2.aneel.gov.br/scg/consulta_empreendimento.asp?acao=BUSCAR&pagina=1&IdTipoGeracao=&IdFaseUsina=&CodCIE=&NomeEmpreendimento="
  );

  const $ = cheerio.load(apiPrimeiraPag.data);
  let quantidade = $('td.linhaBranca:contains("Quantidade")').text();
  quantidade = Number(
    quantidade
      .replace(/(?<=\s+.*)\s+/g, "")
      .replace("Quantidade:", "")
      .replace(".", "")
      .trim()
  );
  const quantidadePaginas = Math.ceil(quantidade / 1000);
  let iteravel = [];
  for (let index = 1; index <= quantidadePaginas; index++) {
    iteravel.push(index);
  }

  function primeiraPagObjLinhasTabela(response) {
    return extrairDados(response);
  }
  async function objLinhasTabela(pag) {
    const api = await axios.post(
      `https://www2.aneel.gov.br/scg/consulta_empreendimento.asp?acao=BUSCAR&pagina=${pag}&IdTipoGeracao=&IdFaseUsina=&CodCIE=&NomeEmpreendimento=`
    );
    return extrairDados(api);
  }

  function formatter(string) {
    return string.replace(")", "").split("(");
  }

  function extrairDados(response) {
    const $ = cheerio.load(response.data);
    const table = $(".tabelaMaior")[2];
    let cabecalho = [];
    let corpo = [];
    $(table)
      .find("tr")
      .each((i, linha) => {
        let linhaObj = {};
        if (i === 0) {
          $(linha)
            .find("td")
            .each((_index, coluna) => {
              cabecalho.push($(coluna).text().trim());
            });
        }
        if (i !== 0) {
          $(linha)
            .find("td")
            .each((index, coluna) => {
              const colunaValue = $(coluna)
                .html()
                .replace(/<td align="center">/g, "")
                .replace(/\n/g, "")
                .replace(/<br>/g, "")
                .replace(/(?<=\s+.*)\s+/g, "")
                .trim();
              const colunaKey = cabecalho[index];
              if (colunaValue.length > 0) {
                linhaObj[`${colunaKey}`] = colunaValue;
              } else {
                linhaObj[`${colunaKey}`] = null;
              }
            });
        }
        if (Object.keys(linhaObj).length > 0) {
          const obj = {
            ceg: "",
            tipo: "",
            situacao: "",
            nome: "",
            razao: "",
            cnpj: "",
            municipio: "",
            uf: "",
            data: "",
            garatiaFisica: "",
          };
          obj.ceg = linhaObj["CEG"];
          obj.tipo = linhaObj["Tipo"];
          obj.nome = linhaObj["Nome Empreendimento"];
          obj.situacao = linhaObj["Situa????o Atual"];
          obj.data = linhaObj["Data Opera????o"];
          obj.garatiaFisica = linhaObj["Garantia F??sica(MW m??dios)"];
          const razaoCnpj = linhaObj["Propriet??rio"]
            ? formatter(linhaObj["Propriet??rio"])
            : null;
          const municipioUf = linhaObj["Munic??pio"]
            ? formatter(linhaObj["Munic??pio"])
            : null;
          obj.razao = razaoCnpj && razaoCnpj.length > 0 ? razaoCnpj[0] : null;
          obj.cnpj = razaoCnpj && razaoCnpj.length > 0 ? razaoCnpj[1] : null;
          obj.municipio =
            municipioUf && municipioUf.length > 0 ? municipioUf[0] : null;
          obj.uf =
            municipioUf && municipioUf.length > 0 ? municipioUf[1] : null;
          corpo.push(obj);
        }
      });
    return corpo;
  }
  const tabelaCompleta = [];
  for await (let pag of iteravel) {
    if (pag === 1) {
      const corpoPrimeiraPag = primeiraPagObjLinhasTabela(apiPrimeiraPag);
      tabelaCompleta.push(...corpoPrimeiraPag);
    } else {
      const corpoPorPag = await objLinhasTabela(pag);
      tabelaCompleta.push(...corpoPorPag);
    }
  }
  return tabelaCompleta;
}

module.exports = consultaCeg;
