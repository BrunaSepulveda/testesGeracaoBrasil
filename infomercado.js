const download = require('download');
const xlsx = require('node-xlsx');
const axios = require('axios').default
const cheerio = require('cheerio')
const luxon = require("luxon");

  async function informercado () {
  const api = await axios.get('https://www.ccee.org.br/web/guest/dados-e-analises/dados-mercado-mensal'),
  $ = cheerio.load(api.data),
  ano = new Date().getFullYear(),
  scripts = $(`.list-documentos script:contains("InfoMercado - Dados Individuais - ${ano}")`).html(),
  link = scripts.split(';').find((element) =>  element.includes("url")).replace('entryJSOBJ["url"] = ','').trim().replace(/ /g,'_').replace(/"/g,'');
  const planilhaD = await download(`${link}`);
  console.log(planilhaD);

  function dataToCompare(date){
    const utc_value = Math.floor(date- 25569) * 86400;
    const date_info = new Date(utc_value * 1000);
    const dateLuxon = luxon.DateTime.fromJSDate(date_info).startOf('day')
    return dateLuxon;
  }
  function valueOrNull(value) {
    return !value && value === '' ? null : value;
  }
  const infomercados = []
  const regex = /^\d{3}\sUsinas$/gi;
  let planilhaObj = xlsx.parse(planilhaD).find((abaPlanilha) => regex.test(abaPlanilha.name)).data;
    planilhaObj.splice(0,14)
    planilhaObj.forEach((linha) => {
      if (linha[3] && linha[3] !== '') {
        if (linha[12]) {
          
        }
        const itemFound = infomercados.find(
          (item) => item.ceg === linha[3]
        );
        if (itemFound) {
          if (!linha[24] && linha[24] ==='') {
            const newDate = dataToCompare(linha[24])
            if (itemFound.date < newDate) {
              itemFound.potencia = valueOrNull(linha[16])
              itemFound.garatiaFisica = valueOrNull(linha[17])
              itemFound.descontoTUST = valueOrNull(linha[15])
              itemFound.participaDoMRE = valueOrNull(linha[13])
              itemFound.date = newDate
            }
          }
        } else {
          const objLinhasTabela = {ceg: '', potencia:'', garatiaFisica: '',descontoTUST:'', participaDoMRE:'', date: ''}
          objLinhasTabela.ceg = linha[3]
          objLinhasTabela.potencia = valueOrNull(linha[16])
          objLinhasTabela.garatiaFisica = valueOrNull(linha[17])
          objLinhasTabela.descontoTUST = valueOrNull(linha[15])
          objLinhasTabela.participaDoMRE = valueOrNull(linha[13])
          objLinhasTabela.date = !linha[24] && linha[24] ==='' ? null : dataToCompare(linha[24])
          infomercados.push(objLinhasTabela)
        }
      }
    })
}
//CGH.PH.AL.030112-4.01
informercado ()

module.exports = informercado
