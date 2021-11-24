const xlsx = require('node-xlsx');

async function nodal(){
 const planilha = xlsx.parse("./nodal/Nodal.xlsm").find((planilha)=> planilha.name === "TUSTg");
 planilha.data.splice(0,7)
 console.log(planilha.data[0]);
}

nodal();