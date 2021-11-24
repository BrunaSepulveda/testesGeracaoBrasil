const download = require('download');
const xlsx = require('node-xlsx');
const axios = require('axios').default
const cheerio = require('cheerio')

  async function informercado () {
  const api = await axios.get('https://www.ccee.org.br/web/guest/dados-e-analises/dados-mercado-mensal'),
  $ = cheerio.load(api.data),
  ano = new Date().getFullYear(),
  scripts = $(`.list-documentos script:contains("InfoMercado - Dados Individuais - ${ano}")`).html(),
  link = scripts.split(';').find((element) =>  element.includes("url")).replace('entryJSOBJ["url"] = ','').trim().replace(/ /g,'_').replace(/"/g,'');
  try {
    const planilha = await download(`${link}`);
    let planilhaObj = xlsx.parse(planilha).find((element) => element.name === '002 Usinas').data;
    planilhaObj.splice(0,14)
    const ultimaPosicao = planilhaObj.length - 11
    planilhaObj.splice(ultimaPosicao,10)
    let informercados = []
    planilhaObj.forEach((linha) => {
      if (linha && linha.length > 0) {
        const objLinhasTabela = {ceg: '', potencia:'', garatiaFisica: '',descontoTUST:'', participaDoMRE:''}
        objLinhasTabela.ceg = !linha[3] && linha[3] === '' ? null : linha[3]
        objLinhasTabela.potencia = !linha[16] && linha[16] ==='' ? null : linha[16]
        objLinhasTabela.garatiaFisica = !linha[17] && linha[17] ==='' ? null : linha[17]
        objLinhasTabela.descontoTUST = !linha[15] && linha[15] ==='' ? null : linha[15]
        objLinhasTabela.participaDoMRE = !linha[13] && linha[13] ==='' ? null : linha[13]
        informercados.push(objLinhasTabela)
      }
    })
    console.log({primeiro:informercados[0], ultimo: informercados[informercados.length - 1]})
  } catch (err) {
    console.error(err)
  }
}
(async() => informercado())()
