const xlsx = require("node-xlsx");
const fs = require('fs');

async function nodal() {
    const filePathNodalXLSX = process.argv[2];
    const palavrasChavePlanilha = xlsx.parse(filePathNodalXLSX).find(
      (planilha) => planilha.name === "TUSTg"
    ).data;
    palavrasChavePlanilha.splice(0, 7);
    const planilhaObj = []
    for (const linha of palavrasChavePlanilha) {
      if (linha[8]) {
        planilhaObj.push({ceg: linha[8], must: linha[10], tust: linha[95]})
      }
    }
    console.log(planilhaObj[0], planilhaObj[planilhaObj.length - 1])
}

nodal()
module.exports = nodal;
