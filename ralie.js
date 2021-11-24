const download = require('download');

(async () => {
  return download('https://www.aneel.gov.br/documents/655816/23130930/RALIE_2021-11-16.zip/99fb65b1-d393-1b7a-59f3-47b84eb969d5','dist',{extract: true})
})()